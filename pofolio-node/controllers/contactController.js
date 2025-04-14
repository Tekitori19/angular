// controllers/contactController.js
const { getDb } = require('../database/db'); // Import hàm getDb

// Hàm tiện ích để chạy db.run dưới dạng Promise
function dbRunAsync(sql, params = []) {
    const db = getDb();
    if (!db) return Promise.reject(new Error('Database not available'));
    return new Promise((resolve, reject) => {
        // Dùng function() để truy cập this.lastID
        db.run(sql, params, function (err) {
            if (err) {
                reject(err);
            } else {
                // Resolve với ID của bản ghi vừa chèn
                resolve({ lastID: this.lastID, changes: this.changes });
            }
        });
    });
}


/**
 * Xử lý việc nhận và lưu contact submission.
 */
const handleContactSubmission = async (req, res) => { // Thêm async
    console.log("Controller: Handling POST /api/contact");
    const { fullname, email, subject, message } = req.body;

    // Server-side validation
    if (!fullname || !email || !message) {
        return res.status(400).json({ error: 'Full name, email, and message are required.' });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ error: 'Invalid email format.' });
    }

    const sql = `INSERT INTO contact_submissions (full_name, email, subject, message) VALUES (?, ?, ?, ?)`;
    const params = [fullname, email, subject || null, message];

    try {
        // Thực thi INSERT và đợi kết quả
        const result = await dbRunAsync(sql, params);

        console.log(`New contact submission saved with ID: ${result.lastID}`);

        // Phản hồi thành công cho client
        res.status(201).json({ success: true, message: 'Message received successfully!', id: result.lastID });

        // KHÔNG CÓ GỬI EMAIL NỮA

    } catch (err) {
        console.error('Controller Error saving contact submission:', err.message);
        res.status(500).json({ error: 'Failed to save message.' }); // Giấu lỗi chi tiết
    }
};

module.exports = {
    handleContactSubmission
};
