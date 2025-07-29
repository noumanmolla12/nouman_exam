const express = require('express');
const router = express.Router();
const multer = require('multer');
const Admin = require('../models/admin.model');
const path = require('path');
const bcrypt = require('bcrypt');

// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Add admin with image upload
router.post('/add-admin', upload.array('admin_image', 5), async (req, res) => {
  try {
    const { admin_name, email, phone, admin_address, password, confirm_password, admin_dob } = req.body;
    const imageNames = req.files ? req.files.map(file => file.filename) : [];

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      admin_name,
      email,
      phone,
      password: hashedPassword,
      confirm_password,
      admin_dob,
      admin_address,
      admin_images: imageNames
    });

    const savedAdmin = await newAdmin.save();
    res.status(201).json(savedAdmin);
  } catch (error) {
    console.error('Error adding admin:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get all admins
router.get('/all', async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get admin by ID
router.get('/:id', async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update admin
router.put('/update/:id', upload.array('admin_images', 5), async (req, res) => {
  try {
    const { admin_name, email, phone, admin_address, password, confirm_password, admin_dob } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const imageNames = req.files ? req.files.map(file => file.filename) : [];

    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.params.id,
      {
        admin_name,
        email,
        phone,
        password: hashedPassword,
        confirm_password,
        admin_dob,
        admin_address,
        admin_images: imageNames
      },
      { new: true }
    );

    if (!updatedAdmin) return res.status(404).json({ message: 'Admin not found' });

    res.status(200).json(updatedAdmin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete admin
router.delete('/delete/:id', async (req, res) => {
  try {
    const deletedAdmin = await Admin.findByIdAndDelete(req.params.id);
    if (!deletedAdmin) return res.status(404).json({ message: 'Admin not found' });
    res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get admins by category
router.get('/category/:categoryId', async (req, res) => {
  try {
    const admins = await Admin.find({ category: req.params.categoryId });
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
