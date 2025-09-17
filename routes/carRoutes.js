const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Car = require('../models/Car');

// Configure storage for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// File filter for image uploads
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage, fileFilter });

// Routes
router.get('/', async (req, res) => {
    try {
      const cars = await Car.find().sort({ createdAt: -1 });

      console.log('Fetched cars:', cars);
      res.json(cars);
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
  })


  router.post('/', async (req, res) => {
    try {
      const { make, model, year, price, description, images } = req.body;
      
      console.log('Received car data:', req.body);
  
      // Use the first image as the main image for backward compatibility
      const mainImage = images && images.length > 0 ? images[0] : '';
  
      const newCar = new Car({
        make,
        model,
        year,
        price,
        description,
        image: mainImage, // For backward compatibility
        images: images || [mainImage] // Store all images
      });
  
      await newCar.save();
      res.status(201).json(newCar);
    } catch (error) {
      console.error('Error creating car:', error);
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  });

module.exports = router;