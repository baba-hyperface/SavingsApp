import express from 'express';
import Category from '../models/categorymodel.js';
const categoriesrouter = express.Router();
// const Category = require("../models/Category");

// CREATE a new category
categoriesrouter.post("/categoriescreating", async (req, res) => {
  const { name, icon, backgroundColor, shape,iconType } = req.body;

  if (!name || !icon ) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const newCategory = new Category({ name, icon, backgroundColor, shape ,iconType});
    await newCategory.save();
    console.log("category created");
    res.status(201).json(newCategory);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Category name must be unique." });
    }
    res.status(500).json({ message: "Error creating category.", error });
  }
});

categoriesrouter.get("/categoriesget", async (req, res) => {
  try {
    const categories = await Category.find();
    
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories.", error });
  }
});

// DELETE a category
categoriesrouter.delete("/categories/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found." });
    }
    res.json({ message: "Category deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category.", error });
  }
});

export default categoriesrouter
