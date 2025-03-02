const express = require("express");
const Product = require("../models/Product");
const formidable = require("formidable");
const cloudinary = require("cloudinary").v2;
const { firstValues } = require("../utils/formidable/firstValues");

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// ✅ GET All Products with Optional Category Filtering
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    let filter = {};

    if (category) {
      filter.category = category;
    }

    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Get a single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ DELETE a Product
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ EDIT (UPDATE) a Product (Includes Image Upload & Description)
router.put("/:id", async (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ message: "Error Parsing the form" });
    }

    try {
      const fieldsWithFirstValue = firstValues(form, fields);
      const filesWithFirstValue = firstValues(form, files);

      const { name, description, price, category } = fieldsWithFirstValue;
      let image_url = "";

      // ✅ Check if a new image was uploaded
      if (filesWithFirstValue.image) {
        const { filepath } = filesWithFirstValue.image;
        if (filepath) {
          const result = await cloudinary.uploader.upload(filepath, {
            folder: "Jewellery_Images",
          });
          image_url = result.secure_url;
        }
      }

      // ✅ Find and update the product
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
          name: name?.trim(),
          description: description?.trim(),
          price,
          category: category?.trim(),
          ...(image_url && { image: image_url }), // Update image only if new one was uploaded
        },
        { new: true }
      );

      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json({ message: "Product updated successfully", updatedProduct });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
});

// ✅ ADD New Product (Admin only)
router.post("/", async (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ message: "Error Parsing the form" });
    }

    try {
      const fieldsWithFirstValue = firstValues(form, fields);
      const filesWithFirstValue = firstValues(form, files);

      const { name, description, price, category } = fieldsWithFirstValue;
      const { filepath } = filesWithFirstValue.image;

      if (!name || !description || !price || !category) {
        return res.status(400).json({ message: "All fields are required" });
      }

      let image_url = "";
      if (filepath) {
        const result = await cloudinary.uploader.upload(filepath, {
          folder: "Jewellery_Images",
        });
        image_url = result.secure_url;
      }

      const newProduct = new Product({
        name: name.trim(),
        description,
        price,
        image: image_url,
        category: category.trim(), // ✅ Added Category Field
      });

      const savedProduct = await newProduct.save();
      res
        .status(201)
        .json({ message: "Jewelry Added Successfully", savedProduct });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
});

module.exports = router;
