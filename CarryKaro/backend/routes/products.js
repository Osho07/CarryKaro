const express = require('express');
const Product = require('../models/Product');

module.exports = (upload) => {
  const router = express.Router();

  // Get all products
  router.get('/', async (req, res) => {
    try {
      const products = await Product.find({});
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Admin add product with image upload
  router.post('/add', upload.single('image'), async (req, res) => {
    const { name, description, price } = req.body;
    if (!name || !price) {
      return res.status(400).json({ message: 'Name and price are required' });
    }
    try {
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';
      const product = new Product({ name, description, price, imageUrl });
      await product.save();
      res.status(201).json({ message: 'Product added successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Delete product by id
  router.delete('/:id', async (req, res) => {
    const productId = req.params.id;
    try {
      const deleted = await Product.findByIdAndDelete(productId);
      if (!deleted) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json({ message: 'Product deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  return router;
};
