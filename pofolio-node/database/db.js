// database/db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'portfolio.db'); // Đường dẫn tới file DB từ thư mục database

let db = null; // Biến lưu trữ đối tượng kết nối DB

/**
 * Kết nối đến database SQLite.
 * Tạo file nếu chưa có.
 * @returns {Promise<sqlite3.Database>} Promise trả về đối tượng DB hoặc lỗi.
 */
function connectDb() {
    return new Promise((resolve, reject) => {
        if (db) { // Nếu đã có kết nối, trả về ngay
            return resolve(db);
        }
        // Tạo kết nối mới
        // OPEN_READWRITE | OPEN_CREATE: Mở để đọc/ghi, tạo file nếu chưa có
        const newDb = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
            if (err) {
                console.error('Error opening/creating database:', err.message);
                reject(err);
            } else {
                console.log(`Connected to the SQLite database at ${DB_PATH}`);
                db = newDb; // Lưu lại kết nối
                resolve(db);
            }
        });
    });
}

/**
 * Lấy đối tượng kết nối database hiện tại.
 * Cần gọi initializeDatabase() trước.
 * @returns {sqlite3.Database | null} Đối tượng DB hoặc null nếu chưa kết nối.
 */
function getDb() {
    if (!db) {
        console.error("FATAL: getDb() called before database was initialized.");
        // Hoặc có thể throw Error
    }
    return db;
}

/**
 * Helper xử lý lỗi tạo bảng.
 * @param {string} tableName Tên bảng.
 * @returns {Function} Callback xử lý lỗi.
 */
function handleTableCreationError(tableName) {
    return function (err) {
        if (err) {
            console.error(`Error creating/checking ${tableName} table:`, err.message);
        }
        // Không cần log thành công cho từng bảng nữa
    };
}

/**
 * Tạo tất cả các bảng database nếu chúng chưa tồn tại.
 * @param {sqlite3.Database} databaseInstance Đối tượng kết nối DB.
 * @returns {Promise<void>}
 */
function createTables(databaseInstance) {
    return new Promise((resolve, reject) => {
        if (!databaseInstance) {
            console.error("Database instance is required for createTables.");
            return reject(new Error("Database instance not provided to createTables"));
        }
        // Dùng serialize để đảm bảo các lệnh chạy tuần tự
        databaseInstance.serialize(() => {
            console.log('Checking/Creating database tables...');

            // <<< COPY & PASTE TẤT CẢ CÁC LỆNH CREATE TABLE TỪ FILE server.js CŨ VÀO ĐÂY >>>
            // <<< Thay 'db.run' bằng 'databaseInstance.run' >>>

            databaseInstance.run(`CREATE TABLE IF NOT EXISTS profile (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    full_name TEXT NOT NULL,
                    job_title TEXT,
                    avatar_image_url TEXT,
                    email TEXT NOT NULL UNIQUE,
                    phone TEXT,
                    birthday DATE,
                    address TEXT,
                    about_text TEXT
                )`, handleTableCreationError("profile"));

            databaseInstance.run(`CREATE TABLE IF NOT EXISTS social_links (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    platform TEXT NOT NULL,
                    url TEXT NOT NULL,
                    icon_name TEXT,
                    display_order INTEGER DEFAULT 0
                )`, handleTableCreationError("social_links"));

            databaseInstance.run(`CREATE TABLE IF NOT EXISTS services (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    description TEXT NOT NULL,
                    icon_image_url TEXT,
                    display_order INTEGER DEFAULT 0
                )`, handleTableCreationError("services"));

            databaseInstance.run(`CREATE TABLE IF NOT EXISTS testimonials (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    client_name TEXT NOT NULL,
                    client_avatar_url TEXT,
                    quote TEXT NOT NULL,
                    date DATE,
                    display_order INTEGER DEFAULT 0
                )`, handleTableCreationError("testimonials"));

            databaseInstance.run(`CREATE TABLE IF NOT EXISTS clients (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    logo_image_url TEXT NOT NULL,
                    website_url TEXT,
                    display_order INTEGER DEFAULT 0
                )`, handleTableCreationError("clients"));

            databaseInstance.run(`CREATE TABLE IF NOT EXISTS education (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    institution_name TEXT NOT NULL,
                    degree_or_focus TEXT,
                    period TEXT,
                    description TEXT,
                    display_order INTEGER DEFAULT 0
                )`, handleTableCreationError("education"));

            databaseInstance.run(`CREATE TABLE IF NOT EXISTS experience (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    job_title TEXT NOT NULL,
                    company_name TEXT,
                    period TEXT,
                    description TEXT,
                    display_order INTEGER DEFAULT 0
                )`, handleTableCreationError("experience"));

            databaseInstance.run(`CREATE TABLE IF NOT EXISTS skills (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    percentage INTEGER NOT NULL,
                    category TEXT,
                    display_order INTEGER DEFAULT 0
                )`, handleTableCreationError("skills"));

            databaseInstance.run(`CREATE TABLE IF NOT EXISTS project_categories (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL UNIQUE,
                    slug TEXT NOT NULL UNIQUE
                )`, handleTableCreationError("project_categories"));

            databaseInstance.run(`CREATE TABLE IF NOT EXISTS projects (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    slug TEXT NOT NULL UNIQUE,
                    category_id INTEGER,
                    thumbnail_image_url TEXT NOT NULL,
                    description TEXT,
                    technologies_used TEXT,
                    project_url TEXT,
                    source_code_url TEXT,
                    date_completed DATE,
                    is_featured INTEGER DEFAULT 0,
                    display_order INTEGER DEFAULT 0,
                    FOREIGN KEY (category_id) REFERENCES project_categories(id) ON DELETE SET NULL
                )`, handleTableCreationError("projects"));

            databaseInstance.run(`CREATE TABLE IF NOT EXISTS certificates (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    issuing_organization TEXT NOT NULL,
                    issue_date DATE NOT NULL,
                    expiration_date DATE,
                    credential_id TEXT,
                    credential_url TEXT,
                    description TEXT,
                    image_url TEXT,
                    display_order INTEGER DEFAULT 0
                )`, handleTableCreationError("certificates"));

            // Bảng cuối cùng cần gọi resolve/reject trong callback của nó
            databaseInstance.run(`CREATE TABLE IF NOT EXISTS contact_submissions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    full_name TEXT NOT NULL,
                    email TEXT NOT NULL,
                    subject TEXT,
                    message TEXT NOT NULL,
                    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    is_read INTEGER DEFAULT 0
                )`, handleTableCreationError("contact_submissions"), (err) => { // Callback cho lệnh run cuối cùng
                if (err) {
                    console.error('Final table creation callback error:', err.message);
                    reject(err); // Có lỗi ở bảng cuối -> reject Promise
                } else {
                    console.log('Database table creation/checking process finished.');
                    resolve(); // Tất cả bảng đã xong -> resolve Promise
                }
            });
        });
    });
}

/**
 * Helper xử lý lỗi seeding.
 * @param {string} tableName Tên bảng.
 */
function handleSeedError(tableName) {
    return function (err) {
        if (err) {
            if (!err.message.includes('UNIQUE constraint failed')) {
                console.error(`Error seeding ${tableName}:`, err.message);
            }
            // Bỏ qua lỗi UNIQUE nếu có
        }
    };
}

/**
 * Seed dữ liệu mẫu vào database nếu rỗng.
 * @param {sqlite3.Database} databaseInstance Đối tượng kết nối DB.
 * @returns {Promise<void>}
 */
function seedDatabase(databaseInstance) {
    return new Promise((resolve, reject) => {
        if (!databaseInstance) {
            console.error("Database instance is required for seedDatabase.");
            return reject(new Error("Database instance not provided to seedDatabase"));
        }

        console.log("Checking if database needs seeding...");
        databaseInstance.get("SELECT COUNT(*) as count FROM profile", (err, row) => {
            if (err) {
                console.error("Error checking profile table for seeding:", err.message);
                return reject(err);
            }

            if (row.count === 0) {
                console.log("Database is empty. Seeding initial data...");
                databaseInstance.serialize(() => {

                    // <<< COPY & PASTE TOÀN BỘ CÁC LỆNH INSERT TỪ HÀM seedDatabase CŨ VÀO ĐÂY >>>
                    // <<< Thay 'db.run' thành 'databaseInstance.run' >>>

                    // --- Seed Profile ---
                    const profileSql = `INSERT INTO profile (full_name, job_title, avatar_image_url, email, phone, birthday, address, about_text) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
                    const profileParams = ["Phan Duong Dinh", "Web Developer", "./assets/images/my-avatar.png", "your.email@example.com", "0989999999", "2003-12-19", "Hanoi, Vietnam", `I'm a passionate...`];
                    databaseInstance.run(profileSql, profileParams, handleSeedError("profile"));

                    // --- Seed Social Links ---
                    const socialSql = `INSERT INTO social_links (platform, url, icon_name, display_order) VALUES (?, ?, ?, ?)`;
                    databaseInstance.run(socialSql, ["Facebook", "#", "logo-facebook", 1], handleSeedError("social_links"));
                    databaseInstance.run(socialSql, ["GitHub", "https://github.com/yourusername", "logo-github", 2], handleSeedError("social_links"));
                    databaseInstance.run(socialSql, ["LinkedIn", "#", "logo-linkedin", 3], handleSeedError("social_links"));

                    // --- Seed Services ---
                    const serviceSql = `INSERT INTO services (title, description, icon_image_url, display_order) VALUES (?, ?, ?, ?)`;
                    databaseInstance.run(serviceSql, ["Web design", "Modern...", "./assets/images/icon-design.svg", 1], handleSeedError("services"));
                    databaseInstance.run(serviceSql, ["Web development", "High-quality...", "./assets/images/icon-dev.svg", 2], handleSeedError("services"));
                    databaseInstance.run(serviceSql, ["Mobile apps", "Development...", "./assets/images/icon-app.svg", 3], handleSeedError("services"));

                    // --- Seed Testimonials ---
                    const testimonialSql = `INSERT INTO testimonials (client_name, client_avatar_url, quote, date, display_order) VALUES (?, ?, ?, ?, ?)`;
                    databaseInstance.run(testimonialSql, ["Daniel Lewis", "./assets/images/avatar-1.png", "Duong Dinh was great...", "2023-10-15", 1], handleSeedError("testimonials"));
                    databaseInstance.run(testimonialSql, ["Jessica Miller", "./assets/images/avatar-2.png", "Highly recommend!...", "2023-11-01", 2], handleSeedError("testimonials"));

                    // --- Seed Clients ---
                    const clientSql = `INSERT INTO clients (name, logo_image_url, website_url, display_order) VALUES (?, ?, ?, ?)`;
                    databaseInstance.run(clientSql, ["Client Logo 1", "./assets/images/logo-1-color.png", "#", 1], handleSeedError("clients"));
                    databaseInstance.run(clientSql, ["Client Logo 2", "./assets/images/logo-2-color.png", "#", 2], handleSeedError("clients"));
                    databaseInstance.run(clientSql, ["Client Logo 3", "./assets/images/logo-3-color.png", "#", 3], handleSeedError("clients"));

                    // --- Seed Education ---
                    const educationSql = `INSERT INTO education (institution_name, degree_or_focus, period, description, display_order) VALUES (?, ?, ?, ?, ?)`;
                    databaseInstance.run(educationSql, ["FPT Polytechnic", "Web Development", "2022 — 2025", "Studied front-end...", 1], handleSeedError("education"));
                    databaseInstance.run(educationSql, ["Online Course Platform", "Advanced JavaScript", "2023", "Completed an intensive course...", 2], handleSeedError("education"));

                    // --- Seed Experience ---
                    const experienceSql = `INSERT INTO experience (job_title, company_name, period, description, display_order) VALUES (?, ?, ?, ?, ?)`;
                    databaseInstance.run(experienceSql, ["Freelance Web Developer", "Self-employed", "2023 — Present", "Developed custom websites...", 1], handleSeedError("experience"));
                    databaseInstance.run(experienceSql, ["Intern Web Developer", "Tech Company ABC", "Summer 2023", "Assisted senior developers...", 2], handleSeedError("experience"));

                    // --- Seed Skills ---
                    const skillSql = `INSERT INTO skills (name, percentage, category, display_order) VALUES (?, ?, ?, ?)`;
                    databaseInstance.run(skillSql, ["HTML & CSS", 90, "Frontend", 1], handleSeedError("skills"));
                    databaseInstance.run(skillSql, ["JavaScript", 85, "Frontend", 2], handleSeedError("skills"));
                    databaseInstance.run(skillSql, ["Angular", 80, "Frontend", 3], handleSeedError("skills"));
                    databaseInstance.run(skillSql, ["Node.js / Express", 75, "Backend", 4], handleSeedError("skills"));
                    databaseInstance.run(skillSql, ["SQL (SQLite/MySQL)", 70, "Database", 5], handleSeedError("skills"));
                    databaseInstance.run(skillSql, ["Git & GitHub", 85, "Tools", 6], handleSeedError("skills"));

                    // --- Seed Project Categories & Projects ---
                    const categorySql = `INSERT INTO project_categories (name, slug) VALUES (?, ?)`;
                    const projectSql = `INSERT INTO projects (title, slug, category_id, thumbnail_image_url, description, technologies_used, project_url, source_code_url, is_featured, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                    let webDevCatId, webDesignCatId, appCatId;

                    // Chain category inserts and then project inserts using callbacks (needed for lastID with sqlite3)
                    databaseInstance.run(categorySql, ["Web Development", "web-development"], function (err) {
                        handleSeedError("project_categories")(err); if (!err) {
                            webDevCatId = this.lastID;
                            databaseInstance.run(projectSql, ["Finance App", "finance-app", webDevCatId, "./assets/images/project-1.jpg", "A web application...", "Angular, Node.js...", "#", "#", 1, 1], handleSeedError("projects"));
                            databaseInstance.run(projectSql, ["Orizon Website", "orizon-website", webDevCatId, "./assets/images/project-2.png", "Company portfolio...", "HTML, CSS...", "#", "#", 0, 3], handleSeedError("projects"));
                        }
                        // Now insert the next category
                        databaseInstance.run(categorySql, ["Web Design", "web-design"], function (err) {
                            handleSeedError("project_categories")(err); if (!err) {
                                webDesignCatId = this.lastID;
                                databaseInstance.run(projectSql, ["Fundo Landing Page", "fundo-landing", webDesignCatId, "./assets/images/project-3.jpg", "Landing page design...", "Figma, HTML...", "#", null, 0, 2], handleSeedError("projects"));
                                databaseInstance.run(projectSql, ["MetaSpark Design", "metaspark-design", webDesignCatId, "./assets/images/project-6.png", "UI/UX design...", "Figma", null, null, 0, 5], handleSeedError("projects"));
                            }
                            // Now insert the final category
                            databaseInstance.run(categorySql, ["Applications", "applications"], function (err) {
                                handleSeedError("project_categories")(err); if (!err) {
                                    appCatId = this.lastID;
                                    databaseInstance.run(projectSql, ["Task Manager App", "task-manager", appCatId, "./assets/images/project-8.jpg", "Simple task management...", "Angular, LocalStorage", "#", "#", 1, 4], handleSeedError("projects"));
                                }

                                // --- Seed Certificates (After last category/project is done queuing) ---
                                const certificateSql = `INSERT INTO certificates (name, issuing_organization, issue_date, credential_url, description, display_order) VALUES (?, ?, ?, ?, ?, ?)`;
                                databaseInstance.run(certificateSql, ["Angular - Complete Guide", "Udemy", "2023-05-20", "#", "Comprehensive course...", 1], handleSeedError("certificates"));
                                databaseInstance.run(certificateSql, ["Responsive Web Design", "freeCodeCamp", "2022-11-10", "#", "Certification covering HTML5...", 2], handleSeedError("certificates"), () => {
                                    // Callback of the VERY LAST insert in the serialize block
                                    console.log("Finished queueing all seed data.");
                                    resolve(); // Resolve the main promise HERE
                                });
                            });
                        });
                    }); // End category chain


                }); // End db.serialize
            } else {
                console.log("Database already contains data. Skipping seeding.");
                resolve(); // Resolve nếu không cần seed
            }
        });
    });
}

/**
 * Khởi tạo database: Kết nối, tạo bảng, seed dữ liệu.
 * Đây là hàm chính sẽ được gọi từ server.js.
 * @returns {Promise<sqlite3.Database>} Promise trả về đối tượng DB đã sẵn sàng.
 */
async function initializeDatabase() {
    console.log("Initializing database...");
    try {
        const dbInstance = await connectDb(); // Kết nối
        await createTables(dbInstance);      // Tạo bảng
        await seedDatabase(dbInstance);      // Seed dữ liệu
        console.log("Database initialized successfully.");
        return dbInstance;                   // Trả về đối tượng DB
    } catch (error) {
        console.error("FATAL: Failed to initialize database:", error);
        process.exit(1); // Thoát ứng dụng nếu không khởi tạo được DB
    }
}

// Đóng kết nối khi ứng dụng thoát
process.on('SIGINT', () => {
    if (db) {
        console.log('Closing database connection...');
        db.close((err) => {
            if (err) {
                console.error('Error closing database connection:', err.message);
            } else {
                console.log('Database connection closed.');
            }
            process.exit(err ? 1 : 0);
        });
    } else {
        process.exit(0);
    }
});

module.exports = {
    initializeDatabase, // Hàm chính để khởi tạo
    getDb // Hàm để controller lấy đối tượng DB
};
