import { v2 as cloudinary } from 'cloudinary';
import productModel from '../models/product-model.js';

const addProduct = async (req, res) => {
  try {
    const { name, description, longDescription, price, category, subCategory, variants, bestseller, stock, brand, discount } = req.body;

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    // cloudinary logic
    const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
        return result.secure_url;
      })
    );

    // debug logs
    // console.log(name, description, price, category, subCategory, weight, bestseller);
    // console.log(image1, image2, image3, image4);
    // console.log(imagesUrl);

    const productData = {
      name,
      description,
      longDescription,
      price: Number(price),
      discount: Number(discount),
      stock: Number(stock),
      brand,
      image: imagesUrl,
      discount: Number(discount) || 0,
      category,
      subCategory,
      variants: variants ? JSON.parse(variants) : [],
      bestseller: bestseller === 'true' ? true : false, // because bestseller comes as a string, we want to convert to bool
      image: imagesUrl
    }

    console.log(productData);

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: 'Thêm sản phẩm thành công' });
  } catch (error) {
    console.error('Thêm sản phẩm thất bại:', error);
    res.status(500).json({ message: error.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.error('Error fetching products:', error);
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
    if (!existingProduct) return res.status(404).json({ success: false, message: "Product not found" });

    const { name, description, longDescription, price, category, subCategory, variants, bestseller, stock, brand, discount } = req.body;

    const imageFiles = [req.files?.image1?.[0], req.files?.image2?.[0], req.files?.image3?.[0], req.files?.image4?.[0]];
    const newImages = [];

    // Upload new images if binary, otherwise keep the existing URL
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      if (file) {
        // delete old image if exists
        if (existingProduct.image[i]) {
          const publicId = existingProduct.image[i].split('/').pop().split('.')[0];
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
      variants: variants ? JSON.parse(variants) : [],
      bestseller: bestseller === "true" || bestseller === true,
    };

    await productModel.findByIdAndUpdate(id, updatedData, { new: true });

    res.json({ success: true, message: "Chỉnh sửa sản phẩm thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  addProduct,
  getProducts,
  removeProduct,
  getOneProduct,
  updateProduct,
  getOneStockProduct
};