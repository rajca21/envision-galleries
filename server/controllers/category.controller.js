import { Category } from '../models/Category.model.js';

// @desc        Create new Category
// @route       POST /api/categories
// @access      Private/Admin
export const createCategory = async (req, res) => {
  const { name } = req.body;

  try {
    if (!name) {
      throw new Error('All fields are required');
    }

    const newCategory = new Category({
      name,
    });
    await newCategory.save();

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category: newCategory,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc        Get All Categories
// @route       GET /api/categories
// @access      Public
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({
      name: 1,
    });

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc        Get Single Category
// @route       GET /api/categories/:id
// @access      Public
export const getCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id);
    if (!category) {
      res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    return res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc        Update Category
// @route       PUT /api/categories/:id
// @access      Private/Admin
export const updateCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedCategory = await Category.findByIdAndUpdate(id, req.body);
    if (!updatedCategory) {
      res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Category updated',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc        Delete Category
// @route       DELETE /api/categories/:id
// @access      Private/Admin
export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    await Category.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Category deleted',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
