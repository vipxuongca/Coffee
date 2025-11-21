import { v2 as cloudinary } from 'cloudinary';
import productModel from '../models/product-model.js';
import categoryModel from '../models/category-model.js';
import { updateCategoryCount } from "./category-controller.js";

const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      longDescription,
      price,
      category,
      subCategory,
      variants,
      bestseller,
      stock,
      brand,
      discount,
      packageType,
      packageDetail,
      warranty
    } = req.body;

    // Handle images
    const files = [req.files.image1?.[0], req.files.image2?.[0], req.files.image3?.[0], req.files.image4?.[0]]
      .filter(Boolean);

    const imagesUrl = await Promise.all(
      files.map((file) =>
        cloudinary.uploader.upload(file.path, { resource_type: "image" })
      )
    ).then((res) => res.map((item) => item.secure_url));

    const productData = {
      name,
      description,
      longDescription,
      price: Number(price),
      discount: Number(discount) || 0,
      stock: Number(stock),
      brand,
      image: imagesUrl,
      category,
      subCategory,
      packageType,
      packageDetail,
      warranty,
      variants: variants ? JSON.parse(variants) : [],
      bestseller: bestseller === "true"
    };

    const product = new productModel(productData);
    await product.save();

    // **UPDATE CATEGORY COUNT HERE**
    await updateCategoryCount(null, category);

    res.json({ success: true, message: "Thêm sản phẩm thành công" });

  } catch (error) {
    console.error("Thêm sản phẩm thất bại:", error);
    res.status(500).json({ message: error.message });
  }
};


const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Count total
    const totalProducts = await productModel.countDocuments();

    // Paginated query
    const products = await productModel
      .find({})
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      page,
      limit,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      products
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getOneStockProduct = async (req, res) => {
  try {
    const { id } = req.params; // get id from URL path
    const { quantity } = req.body;
    const product = await productModel.findById(id);

    if (!product) {
      return res.status(409).json({ success: false, message: 'Product not found' });
    } else if (product.stock < quantity) {
      return res.status(409).json({ success: false, message: 'Not enough stock', stock: product.stock });
    } else {
      return res.status(200).json({ success: true, message: 'Stock check successful', stock: product.stock });
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const removeProduct = async (req, res) => {
  try {
    const deleted = await productModel.findByIdAndDelete(req.body.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Xóa sản phẩm thất bại' });
    }
    res.json({ success: true, message: 'Xóa sản phẩm thành công' });
  } catch (error) {
    console.error('Xảy ra lỗi xóa sản phẩm:', error);
    res.status(500).json({ message: error.message });
  }
};

const getOneProduct = async (req, res) => {
  try {
    const { id } = req.params; // get id from URL path
    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, product });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const existingProduct = await productModel.findById(id);
    if (!existingProduct)
      return res.status(404).json({ success: false, message: "Product not found" });

    const {
      name,
      description,
      longDescription,
      price,
      category,
      subCategory,
      variants,
      bestseller,
      stock,
      brand,
      discount,
      packageDetail,
      packageType,
      warranty
    } = req.body;

    const imageFiles = [
      req.files?.image1?.[0],
      req.files?.image2?.[0],
      req.files?.image3?.[0],
      req.files?.image4?.[0]
    ];

    const newImages = [];

    // Replace uploaded images; keep old ones if no new upload
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      if (file) {
        // delete old cloudinary file if exists
        if (existingProduct.image[i]) {
          const publicId = existingProduct.image[i].split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(publicId);
        }
        const upload = await cloudinary.uploader.upload(file.path, { resource_type: "image" });
        newImages.push(upload.secure_url);
      } else if (existingProduct.image[i]) {
        newImages.push(existingProduct.image[i]);
      }
    }

    const updatedData = {
      name,
      description,
      longDescription,
      price: Number(price),
      discount: Number(discount) || 0,
      stock: Number(stock),
      brand,
      image: newImages,
      category,
      subCategory,
      packageType,
      packageDetail,
      warranty,
      variants: variants ? JSON.parse(variants) : [],
      bestseller: bestseller === "true" || bestseller === true
    };

    // CATEGORY COUNT UPDATE
    const oldCategory = existingProduct.category;
    const newCategory = category;

    await productModel.findByIdAndUpdate(id, updatedData, { new: true });

    await updateCategoryCount(oldCategory, newCategory);

    res.json({ success: true, message: "Chỉnh sửa sản phẩm thành công" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const deduceStockForOrder = async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0)
      return res.status(400).json({ success: false, message: "Invalid items" });

    // Fetch all products in one query
    const ids = items.map(x => x.productId);
    const products = await productModel.find({ _id: { $in: ids } });

    // Ensure all exist and have enough stock
    for (const { productId, quantity } of items) {
      const p = products.find(x => x._id.toString() === productId);
      if (!p) return res.status(404).json({ success: false, message: `Product not found: ${productId}` });
      if (p.stock < quantity)
        return res.status(400).json({ success: false, message: `Insufficient stock for ${p.name}` });
    }

    // Apply deductions
    for (const { productId, quantity } of items) {
      const p = products.find(x => x._id.toString() === productId);
      p.stock -= quantity;
    }

    // Save all
    await Promise.all(products.map(p => p.save()));

    return res.json({ success: true, message: "Stock deducted successfully" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export {
  addProduct,
  getProducts,
  removeProduct,
  getOneProduct,
  updateProduct,
  getOneStockProduct,
  deduceStockForOrder
};