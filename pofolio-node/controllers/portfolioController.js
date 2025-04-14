// controllers/portfolioController.js
const { getDb } = require('../database/db'); // Import hàm getDb

// Hàm tiện ích để chạy db.all dưới dạng Promise
function dbAllAsync(sql, params = []) {
    const db = getDb();
    if (!db) return Promise.reject(new Error('Database not available'));
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows || []); // Luôn trả về mảng
            }
        });
    });
}

// Hàm tiện ích để chạy db.get dưới dạng Promise
function dbGetAsync(sql, params = []) {
    const db = getDb();
    if (!db) return Promise.reject(new Error('Database not available'));
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row); // Trả về row hoặc undefined
            }
        });
    });
}


/**
 * Lấy toàn bộ dữ liệu portfolio.
 */
const getPortfolioData = async (req, res) => {
    console.log("Controller: Handling GET /api/portfolio-data");
    try {
        // Sử dụng Promise.all với các hàm tiện ích async
        const [
            profile,
            socialLinks,
            services,
            testimonials,
            clients,
            education,
            experience,
            skills,
            projectCategories,
            projects,
            certificates
        ] = await Promise.all([
            dbGetAsync("SELECT * FROM profile LIMIT 1").then(row => row || {}), // Profile chỉ 1 hoặc rỗng
            dbAllAsync("SELECT * FROM social_links ORDER BY display_order ASC"),
            dbAllAsync("SELECT * FROM services ORDER BY display_order ASC"),
            dbAllAsync("SELECT * FROM testimonials ORDER BY display_order ASC"),
            dbAllAsync("SELECT * FROM clients ORDER BY display_order ASC"),
            dbAllAsync("SELECT * FROM education ORDER BY display_order ASC"),
            dbAllAsync("SELECT * FROM experience ORDER BY display_order ASC"),
            dbAllAsync("SELECT * FROM skills ORDER BY display_order ASC, percentage DESC"),
            dbAllAsync("SELECT * FROM project_categories ORDER BY name ASC"),
            dbAllAsync(`SELECT p.*, c.name as category_name, c.slug as category_slug
                        FROM projects p LEFT JOIN project_categories c ON p.category_id = c.id
                        ORDER BY p.display_order ASC`),
            dbAllAsync("SELECT * FROM certificates ORDER BY display_order ASC, issue_date DESC")
        ]);

        // Trả về kết quả tổng hợp
        res.json({
            profile, socialLinks, services, testimonials, clients,
            education, experience, skills, projectCategories, projects, certificates
        });

    } catch (err) {
        console.error('Controller Error fetching portfolio data:', err.message);
        res.status(500).json({ error: 'Failed to fetch portfolio data' }); // Giấu chi tiết lỗi khỏi client
    }
};

/**
 * Lấy chi tiết một dự án theo slug.
 */
const getProjectBySlug = async (req, res) => {
    const slug = req.params.slug;
    console.log(`Controller: Handling GET /api/projects/${slug}`);
    const sql = `SELECT p.*, c.name as category_name, c.slug as category_slug
                 FROM projects p LEFT JOIN project_categories c ON p.category_id = c.id
                 WHERE p.slug = ?`;
    try {
        const project = await dbGetAsync(sql, [slug]);
        if (project) {
            res.json(project);
        } else {
            res.status(404).json({ error: 'Project not found' });
        }
    } catch (err) {
        console.error(`Controller Error fetching project by slug ${slug}:`, err.message);
        res.status(500).json({ error: 'Database error while fetching project' });
    }
};

/**
 * Lấy chi tiết một chứng chỉ theo ID.
 */
const getCertificateById = async (req, res) => {
    const id = req.params.id;
    console.log(`Controller: Handling GET /api/certificates/${id}`);
    const sql = "SELECT * FROM certificates WHERE id = ?";
    try {
        const certificate = await dbGetAsync(sql, [id]);
        if (certificate) {
            res.json(certificate);
        } else {
            res.status(404).json({ error: 'Certificate not found' });
        }
    } catch (err) {
        console.error(`Controller Error fetching certificate by ID ${id}:`, err.message);
        res.status(500).json({ error: 'Database error while fetching certificate' });
    }
};

module.exports = {
    getPortfolioData,
    getProjectBySlug,
    getCertificateById
};
