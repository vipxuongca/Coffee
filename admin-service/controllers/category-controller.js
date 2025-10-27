import { v2 as cloudinary } from 'cloudinary';
import categoryModel from '../models/category-model.js';

const addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const image1 = req.files.image1 && req.files.image1[0];

    // cloudinary logic
    const images = [image1].filter((item) => item !== undefined);

    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
        return result.secure_url;
      })
    );

    const categoryData = {
      name,
      description,
      image: imagesUrl
    }

    console.log(categoryData);

    const category = new categoryModel(categoryData);
    await category.save();

    res.json({ success: true, message: 'Category added successfully' });
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ message: error.message });
  }
};

const getCategory = async (req, res) => {
  try {
    const category = await categoryModel.find({});
    res.json({ success: true, category });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const removeCategory = async (req, res) => {
  try {
    const deleted = await categoryModel.findByIdAndDelete(req.body.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Delete failed' });
    }
    res.json({ success: true, message: 'Category removed successfully' });
  } catch (error) {
    console.error('Error removing category:', error);
    res.status(500).json({ message: error.message });
  }
};

const getOneCategory = async (req, res) => {
  try {
    const { id } = req.params; // get id from URL path
    const category = await categoryModel.findById(id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.json({ success: true, category });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const existingCategory = await categoryModel.findById(id);
    if (!existingCategory) return res.status(404).json({ success: false, message: "Category not found" });

    const { name, description } = req.body;

    const imageFiles = [req.files?.image1?.[0]];
    const newImage = []; // set up a blank array for new image

    // Upload new image if binary, otherwise keep the existing URL
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      if (file) {
        // delete old image if exists
        if (existingCategory.image[i]) {
          const publicId = existingCategory.image[i].split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(publicId);
        }
        const upload = await cloudinary.uploader.upload(file.path, { resource_type: "image" });
        newImage.push(upload.secure_url);
      } else if (existingCategory.image[i]) {
        newImage.push(existingCategory.image[i]);
      }
    }

    const updatedData = {
      name,
      description,
      image: newImage
    };

    await categoryModel.findByIdAndUpdate(id, updatedData, { new: true });

    res.json({ success: true, message: "Category updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { addCategory, getCategory, removeCategory, getOneCategory, updateCategory };