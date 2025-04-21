// routes/portfolio.js
const express = require('express');
const portfolioController = require('../controllers/portfolioController'); // Import controller

const router = express.Router();

// Định nghĩa các route và gọi hàm xử lý tương ứng từ controller
router.get('/portfolio-data', portfolioController.getPortfolioData);
router.get('/projects/:slug', portfolioController.getProjectBySlug);
router.get('/certificates/:id', portfolioController.getCertificateById);

module.exports = router; // Xuất router
