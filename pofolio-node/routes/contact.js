// routes/contact.js
const express = require('express');
const contactController = require('../controllers/contactController'); // Import controller

const router = express.Router();

// Định nghĩa route và gọi hàm xử lý từ controller
router.post('/contact', contactController.handleContactSubmission);

module.exports = router; // Xuất router
