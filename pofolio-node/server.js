// server.js
const express = require('express');
const cors = require('cors');
// Bỏ require('path'); nếu không dùng ở đây
const { initializeDatabase } = require('./database/db'); // Chỉ import hàm khởi tạo DB

// Import các routers đã tạo
const portfolioRoutes = require('./routes/portfolio');
const contactRoutes = require('./routes/contact');

const app = express();
const PORT = process.env.PORT || 3000; // Vẫn có thể dùng biến môi trường cho PORT

async function startServer() {
    try {
        // Khởi tạo database TRƯỚC KHI cấu hình app và lắng nghe
        await initializeDatabase(); // Đợi DB sẵn sàng

        console.log("Database initialized. Configuring Express app...");

        // --- Middleware ---
        app.use(cors()); // Cho phép request từ frontend (Angular)
        app.use(express.json()); // Parse JSON request body
        app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request body

        // --- Mount Routers ---
        // Gắn các router vào đường dẫn /api
        app.use('/api', portfolioRoutes);
        app.use('/api', contactRoutes);

        // --- Basic Root Route ---
        app.get('/', (req, res) => {
            res.send('Portfolio Backend API is running (Structured)!');
        });

        // --- Not Found Handler (Optional) ---
        // Middleware bắt các route không khớp
        app.use((req, res, next) => {
            res.status(404).json({ error: 'API endpoint not found' });
        });

        // --- Global Error Handler (Optional) ---
        // Middleware bắt lỗi từ các middleware/route khác
        app.use((err, req, res, next) => {
            console.error("Unhandled error:", err.stack || err);
            res.status(500).json({ error: 'Internal Server Error' });
        });


        // --- Start Server ---
        app.listen(PORT, () => {
            console.log(`Backend server listening on http://localhost:${PORT}`);
        });

    } catch (error) {
        // Lỗi từ initializeDatabase đã được log, server không khởi động
        console.error("Server failed to start due to database initialization error.");
    }
}

// Bắt đầu quá trình khởi tạo server
startServer();

// Graceful shutdown đã được xử lý trong database/db.js
