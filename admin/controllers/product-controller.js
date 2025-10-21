import { v2 as cloudinary } from 'cloudinary';
import productModel from '../models/product-model.js';


// add product
const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, subCategory, weight, bestseller } = req.body;

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
      price: Number(price),
      image: imagesUrl,
      category,
      subCategory,
      weight: JSON.parse(weight),
      bestseller: bestseller === 'true' ? true : false, // because bestseller comes as a string, we want to convert to bool
      image: imagesUrl
    }

    console.log(productData);

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: 'Product added successfully' });
  } catch (error) {
    console.error('Error adding product:', error);
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

const removeProduct = async (req, res) => {
  try { } catch (error) {
    console.error('Error removing product:', error);
    res.status(500).json({ message: error.message });
  }
};

const getOneProduct = async (req, res) => {
  try { } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try { } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: error.message });
  }
};

export { addProduct, getProducts, removeProduct, getOneProduct, updateProduct };