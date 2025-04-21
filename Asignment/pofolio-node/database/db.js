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
 * Seed dữ liệu mẫu với URL ảnh placeholder công khai.
 * @param {sqlite3.Database} databaseInstance Đối tượng kết nối DB.
 * @returns {Promise<void>}
 */
function seedDatabase(databaseInstance) {
    return new Promise((resolve, reject) => {
        if (!databaseInstance) return reject(new Error("Database instance not provided"));

        console.log("Checking if database needs seeding...");
        databaseInstance.get("SELECT COUNT(*) as count FROM profile", (err, row) => {
            if (err) {
                console.error("Error checking profile table for seeding:", err.message);
                return reject(err);
            }

            if (row.count === 0) {
                console.log("Database is empty. Seeding initial data...");
                databaseInstance.serialize(() => {

                    // --- Seed Profile ---
                    const profileSql = `INSERT INTO profile (full_name, job_title, avatar_image_url, email, phone, birthday, address, about_text) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
                    const profileParams = [
                        "Phan Duong Dinh",                  // <<< THAY BẰNG TÊN BẠN
                        "Full-Stack Developer",
                        "https://placehold.co/150x150/7F39DE/white?text=Avatar", // <<< Placeholder Avatar
                        "corclan19@gmail.com",   // <<< THAY BẰNG EMAIL BẠN
                        "09xxxxxxxx",
                        "2003-12-19",
                        "Hanoi, Vietnam",
                        `
I am a passionate Web Developer with expertise in building dynamic and responsive web applications. My skill set includes modern frameworks and technologies such as Angular, React, Node.js, and PHP. I specialize in creating scalable front-end interfaces and robust back-end systems, delivering seamless user experiences. With a strong focus on clean code and performance optimization, I am committed to crafting solutions that meet both user and business needs.
` // <<< VIẾT BIO CỦA BẠN
                    ];
                    databaseInstance.run(profileSql, profileParams, handleSeedError("profile"));

                    // --- Seed Social Links ---
                    const socialSql = `INSERT INTO social_links (platform, url, icon_name, display_order) VALUES (?, ?, ?, ?)`;
                    databaseInstance.run(socialSql, ["GitHub", "https://github.com/Tekitori19", "logo-github", 1], handleSeedError("social_links")); // <<< Link GitHub THẬT
                    databaseInstance.run(socialSql, ["Facebook", "https://www.facebook.com/dwcks999", "logo-facebook", 1], handleSeedError("social_links"));
                    databaseInstance.run(socialSql, ["LinkedIn", "https://linkedin.com/in/your-linkedin-profile", "logo-linkedin", 2], handleSeedError("social_links")); // <<< Link LinkedIn THẬT

                    // --- Seed Services ---
                    const serviceSql = `INSERT INTO services(title, description, icon_image_url, display_order) VALUES(?, ?, ?, ?)`;
                    databaseInstance.run(serviceSql, ["Responsive Web Design", "Creating websites that adapt seamlessly...", "https://placehold.co/60x60/FFC107/black?text=RWD", 1], handleSeedError("services")); // Placeholder Icon
                    databaseInstance.run(serviceSql, ["Angular Development", "Building dynamic single-page applications...", "https://placehold.co/60x60/DD0031/white?text=Angular", 2], handleSeedError("services")); // Placeholder Icon
                    databaseInstance.run(serviceSql, ["Node.js/Express API", "Developing robust backend services...", "https://placehold.co/60x60/4CAF50/white?text=API", 3], handleSeedError("services")); // Placeholder Icon
                    databaseInstance.run(serviceSql, ["Database Management", "Designing and managing databases...", "https://placehold.co/60x60/2196F3/white?text=DB", 4], handleSeedError("services")); // Placeholder Icon

                    // --- Seed Testimonials ---
                    const testimonialSql = `INSERT INTO testimonials(client_name, client_avatar_url, quote, date, display_order) VALUES(?, ?, ?, ?, ?)`;
                    databaseInstance.run(testimonialSql, ["Anh Tuan Nguyen (Tech Lead)", "https://placehold.co/80x80/3F51B5/white?text=TA", "Duong Dinh is a highly skilled developer...", "2024-03-15", 1], handleSeedError("testimonials")); // Placeholder Avatar
                    databaseInstance.run(testimonialSql, ["Ms. Emily Chen (PM)", "https://placehold.co/80x80/E91E63/white?text=EC", "Working with Duong Dinh was a pleasure...", "2023-11-20", 2], handleSeedError("testimonials")); // Placeholder Avatar
                    databaseInstance.run(testimonialSql, ["Dr. Hoang Pham (Professor)", "https://placehold.co/80x80/009688/white?text=HP", "An enthusiastic and quick learner...", "2023-06-10", 3], handleSeedError("testimonials")); // Placeholder Avatar

                    // --- Seed Clients ---
                    const clientSql = `INSERT INTO clients(name, logo_image_url, website_url, display_order) VALUES(?, ?, ?, ?)`;
                    databaseInstance.run(clientSql, ["FPT Software (Project)", "https://placehold.co/150x70/F44336/white?text=Logo+FPT", "https://fptsoftware.com", 1], handleSeedError("clients")); // Placeholder Logo
                    databaseInstance.run(clientSql, ["Example E-commerce", "https://placehold.co/150x70/9C27B0/white?text=Logo+Ecom", "#", 2], handleSeedError("clients")); // Placeholder Logo
                    databaseInstance.run(clientSql, ["Local NGO", "https://placehold.co/150x70/00BCD4/white?text=Logo+NGO", "#", 3], handleSeedError("clients")); // Placeholder Logo
                    databaseInstance.run(clientSql, ["University Project Group", "https://placehold.co/150x70/8BC34A/black?text=Logo+Uni", "#", 4], handleSeedError("clients")); // Placeholder Logo


                    // --- Seed Education (Giữ nguyên, không có ảnh) ---
                    const educationSql = `INSERT INTO education(institution_name, degree_or_focus, period, description, display_order) VALUES(?, ?, ?, ?, ?)`;
                    databaseInstance.run(educationSql, ["FPT Polytechnic Hanoi", "Software Development (Web Specialization)", "2022 — 2025", "Gained strong foundation...", 1], handleSeedError("education"));
                    databaseInstance.run(educationSql, ["Coursera", "Google UX Design Professional Certificate (Completed 3/7 courses)", "2023", "Learning foundational UX...", 2], handleSeedError("education"));

                    // --- Seed Experience (Giữ nguyên, không có ảnh) ---
                    const experienceSql = `INSERT INTO experience(job_title, company_name, period, description, display_order) VALUES(?, ?, ?, ?, ?)`;
                    databaseInstance.run(experienceSql, ["Full-Stack Developer (Freelance)", "Self-Employed", "Jan 2024 — Present", "Developing and maintaining...", 1], handleSeedError("experience"));
                    databaseInstance.run(experienceSql, ["Web Development Intern", "Example Tech Solutions", "Jun 2023 — Aug 2023", "Assisted the development team...", 2], handleSeedError("experience"));

                    // --- Seed Skills (Giữ nguyên, không có ảnh) ---
                    const skillSql = `INSERT INTO skills(name, percentage, category, display_order) VALUES(?, ?, ?, ?)`;
                    databaseInstance.run(skillSql, ["HTML5 & CSS3 (Sass/SCSS)", 95, "Frontend", 1], handleSeedError("skills"));
                    databaseInstance.run(skillSql, ["JavaScript (ES6+)", 90, "Core", 2], handleSeedError("skills"));
                    databaseInstance.run(skillSql, ["TypeScript", 85, "Core", 3], handleSeedError("skills"));
                    databaseInstance.run(skillSql, ["Angular", 85, "Frontend", 4], handleSeedError("skills"));
                    databaseInstance.run(skillSql, ["Node.js", 80, "Backend", 5], handleSeedError("skills"));
                    databaseInstance.run(skillSql, ["Express.js", 80, "Backend", 6], handleSeedError("skills"));
                    databaseInstance.run(skillSql, ["SQL (MySQL, SQLite)", 75, "Database", 8], handleSeedError("skills"));
                    databaseInstance.run(skillSql, ["MongoDB", 65, "Database", 9], handleSeedError("skills"));
                    databaseInstance.run(skillSql, ["RESTful APIs", 85, "Backend", 10], handleSeedError("skills"));
                    databaseInstance.run(skillSql, ["Git & GitHub", 90, "Tools", 11], handleSeedError("skills"));
                    databaseInstance.run(skillSql, ["Docker (Basic)", 60, "Tools", 12], handleSeedError("skills"));


                    // --- Seed Project Categories & Projects (Sử dụng Placeholder Thumnails) ---
                    const categorySql = `INSERT OR IGNORE INTO project_categories (name, slug) VALUES (?, ?)`;
                    const projectSql = `INSERT INTO projects (title, slug, category_id, thumbnail_image_url, description, technologies_used, project_url, source_code_url, is_featured, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                    let fullStackCatId, webDesignCatId, appCatId;

                    databaseInstance.run(categorySql, ["Full-Stack App", "full-stack-app"], function (err) {
                        handleSeedError("project_categories")(err); if (!err || err.message.includes('UNIQUE constraint failed')) {
                            databaseInstance.get(`SELECT id FROM project_categories WHERE slug = ?`, ["full-stack-app"], (errCat, rowCat) => {
                                if (rowCat) fullStackCatId = rowCat.id;
                                if (fullStackCatId) {
                                    databaseInstance.run(projectSql,
                                        ["E-commerce Platform (Uni Project)", "ecommerce-uni-project", fullStackCatId, "https://placehold.co/400x250/3F51B5/white?text=E-commerce", "A sample e-commerce site built with Angular...", "Angular, Node.js...", "#", "https://github.com/your-github/ecommerce-project", 1, 1], // Placeholder Thumbnail
                                        handleSeedError("projects")
                                    );
                                    databaseInstance.run(projectSql,
                                        ["Task Management App", "task-manager-fullstack", fullStackCatId, "https://placehold.co/400x250/03A9F4/white?text=Task+Manager", "A web app to manage daily tasks...", "Angular, Node.js...", "#", "https://github.com/your-github/task-app", 0, 3], // Placeholder Thumbnail
                                        handleSeedError("projects")
                                    );
                                }
                                insertNextCategory();
                            });
                        } else { insertNextCategory(); }
                    });

                    function insertNextCategory() {
                        databaseInstance.run(categorySql, ["Frontend Example", "frontend-example"], function (err) {
                            handleSeedError("project_categories")(err); if (!err || err.message.includes('UNIQUE constraint failed')) {
                                databaseInstance.get(`SELECT id FROM project_categories WHERE slug = ?`, ["frontend-example"], (errCat, rowCat) => {
                                    if (rowCat) webDesignCatId = rowCat.id;
                                    if (webDesignCatId) {
                                        databaseInstance.run(projectSql,
                                            ["Portfolio Website (This site!)", "portfolio-angular", webDesignCatId, "https://placehold.co/400x250/FF9800/white?text=Portfolio", "The personal portfolio website you are currently viewing...", "Angular, TypeScript...", "/", "https://github.com/your-github/this-portfolio", 1, 2], // Placeholder Thumbnail
                                            handleSeedError("projects")
                                        );
                                    }
                                    insertFinalCategory();
                                });
                            } else { insertFinalCategory(); }
                        });
                    }

                    function insertFinalCategory() {
                        databaseInstance.run(categorySql, ["Learning/Other", "other"], function (err) {
                            handleSeedError("project_categories")(err); if (!err || err.message.includes('UNIQUE constraint failed')) {
                                databaseInstance.get(`SELECT id FROM project_categories WHERE slug = ?`, ["other"], (errCat, rowCat) => {
                                    if (rowCat) appCatId = rowCat.id;
                                    seedCertificates();
                                });
                            } else { seedCertificates(); }
                        });
                    }


                    function seedCertificates() {
                        // --- Seed Certificates ---
                        const certificateSql = `INSERT INTO certificates (name, issuing_organization, issue_date, credential_url, description, image_url, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)`;
                        databaseInstance.run(certificateSql, ["EF SET English Certificate (C1 Advanced)", "EF Standard English Test", "2023-08-15", "https://www.efset.org/cert/YourCertID", "Achieved C1 Advanced level...", "https://placehold.co/300x200/795548/white?text=Cert+EFSET", 1], handleSeedError("certificates")); // Placeholder Image
                        databaseInstance.run(certificateSql, ["Introduction to Git and GitHub", "Coursera (Google)", "2023-02-10", "#", "Learned version control...", "https://placehold.co/300x200/9E9E9E/black?text=Cert+Git", 2], handleSeedError("certificates")); // Placeholder Image
                        // Callback lệnh cuối
                        databaseInstance.run("SELECT 1", [], () => {
                            console.log("Finished queueing all seed data.");
                            resolve();
                        });
                    }


                }); // End serialize
            } else {
                console.log("Database already contains data. Skipping seeding.");
                resolve();
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
