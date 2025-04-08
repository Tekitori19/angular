// server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose(); // Use verbose for more detailed logs
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000; // Port for the backend server
const DB_PATH = path.join(__dirname, 'portfolio.db'); // Database file location

// --- Database Setup ---
let db; // Declare db variable outside

function connectDatabase() {
    db = new sqlite3.Database(DB_PATH, (err) => {
        if (err) {
            console.error('Error opening database:', err.message);
            // Handle error appropriately, maybe exit or retry
        } else {
            console.log(`Connected to the SQLite database at ${DB_PATH}`);
            createTablesAndSeed(); // Call the combined function
        }
    });
}

// Function to create tables and then seed if necessary
function createTablesAndSeed() {
    db.serialize(() => {
        console.log('Checking/Creating database tables...');

        // Profile Table (Removed map_embed_url)
        db.run(`CREATE TABLE IF NOT EXISTS profile (
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

        // Social Links Table
        db.run(`CREATE TABLE IF NOT EXISTS social_links (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            platform TEXT NOT NULL,
            url TEXT NOT NULL,
            icon_name TEXT,
            display_order INTEGER DEFAULT 0
        )`, handleTableCreationError("social_links"));

        // Services Table
        db.run(`CREATE TABLE IF NOT EXISTS services (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            icon_image_url TEXT,
            display_order INTEGER DEFAULT 0
        )`, handleTableCreationError("services"));

        // Testimonials Table
        db.run(`CREATE TABLE IF NOT EXISTS testimonials (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            client_name TEXT NOT NULL,
            client_avatar_url TEXT,
            quote TEXT NOT NULL,
            date DATE,
            display_order INTEGER DEFAULT 0
        )`, handleTableCreationError("testimonials"));

        // Clients Table
        db.run(`CREATE TABLE IF NOT EXISTS clients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            logo_image_url TEXT NOT NULL,
            website_url TEXT,
            display_order INTEGER DEFAULT 0
        )`, handleTableCreationError("clients"));

        // Education Table
        db.run(`CREATE TABLE IF NOT EXISTS education (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            institution_name TEXT NOT NULL,
            degree_or_focus TEXT,
            period TEXT,
            description TEXT,
            display_order INTEGER DEFAULT 0
        )`, handleTableCreationError("education"));

        // Experience Table
        db.run(`CREATE TABLE IF NOT EXISTS experience (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            job_title TEXT NOT NULL,
            company_name TEXT,
            period TEXT,
            description TEXT,
            display_order INTEGER DEFAULT 0
        )`, handleTableCreationError("experience"));

        // Skills Table
        db.run(`CREATE TABLE IF NOT EXISTS skills (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            percentage INTEGER NOT NULL,
            category TEXT,
            display_order INTEGER DEFAULT 0
        )`, handleTableCreationError("skills"));

        // Project Categories Table
        db.run(`CREATE TABLE IF NOT EXISTS project_categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            slug TEXT NOT NULL UNIQUE
        )`, handleTableCreationError("project_categories"));

        // Projects Table
        db.run(`CREATE TABLE IF NOT EXISTS projects (
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
            is_featured INTEGER DEFAULT 0, -- 0 for false, 1 for true
            display_order INTEGER DEFAULT 0,
            FOREIGN KEY (category_id) REFERENCES project_categories(id) ON DELETE SET NULL
        )`, handleTableCreationError("projects"));

        // Certificates Table
        db.run(`CREATE TABLE IF NOT EXISTS certificates (
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

        // Contact Submissions Table
        db.run(`CREATE TABLE IF NOT EXISTS contact_submissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            full_name TEXT NOT NULL,
            email TEXT NOT NULL,
            subject TEXT,
            message TEXT NOT NULL,
            submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            is_read INTEGER DEFAULT 0 -- 0 for false, 1 for true
        )`, handleTableCreationError("contact_submissions"), () => {
            // This callback runs after the *last* CREATE TABLE statement finishes
            console.log('Database table creation/checking process finished.');
            // Now attempt to seed the database
            seedDatabase();
        });
    });
}

// Helper function for handling table creation errors
function handleTableCreationError(tableName) {
    return function (err) {
        if (err) {
            console.error(`Error creating/checking ${tableName} table:`, err.message);
        }
    };
}

// Function to seed database with initial data if empty
function seedDatabase() {
    console.log("Checking if database needs seeding...");
    // Check if profile table has any data
    db.get("SELECT COUNT(*) as count FROM profile", (err, row) => {
        if (err) {
            console.error("Error checking profile table for seeding:", err.message);
            return;
        }

        // Only seed if the profile table is empty
        if (row.count === 0) {
            console.log("Database is empty. Seeding initial data...");
            db.serialize(() => {
                // --- Seed Profile (Only one, removed map_embed_url) ---
                // Using Parameterized Query (even for seeding) is good practice
                const profileSql = `INSERT INTO profile (full_name, job_title, avatar_image_url, email, phone, birthday, address, about_text) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
                const profileParams = [
                    "Phan Duong Dinh",
                    "Web Developer",
                    "./assets/images/my-avatar.png",
                    "your.email@example.com", // Replace!
                    "0989999999",
                    "2003-12-19",
                    "Hanoi, Vietnam",
                    `I'm a passionate Web Developer based in Vietnam, specializing in creating dynamic and user-friendly web applications. I enjoy turning complex problems into simple, beautiful, and intuitive designs.\n\nMy goal is to build functional, attractive websites and continuously learn new technologies to deliver high-quality products.`
                ];
                db.run(profileSql, profileParams, handleSeedError("profile"));

                // --- Seed Social Links ---
                const socialSql = `INSERT INTO social_links (platform, url, icon_name, display_order) VALUES (?, ?, ?, ?)`;
                db.run(socialSql, ["Facebook", "#", "logo-facebook", 1], handleSeedError("social_links"));
                db.run(socialSql, ["GitHub", "https://github.com/yourusername", "logo-github", 2], handleSeedError("social_links")); // Replace '#'
                db.run(socialSql, ["LinkedIn", "#", "logo-linkedin", 3], handleSeedError("social_links"));

                // --- Seed Services ---
                const serviceSql = `INSERT INTO services (title, description, icon_image_url, display_order) VALUES (?, ?, ?, ?)`;
                db.run(serviceSql, ["Web design", "Modern and high-quality design at a professional level.", "./assets/images/icon-design.svg", 1], handleSeedError("services"));
                db.run(serviceSql, ["Web development", "High-quality development of sites at the professional level.", "./assets/images/icon-dev.svg", 2], handleSeedError("services"));
                db.run(serviceSql, ["Mobile apps", "Development of applications for iOS and Android.", "./assets/images/icon-app.svg", 3], handleSeedError("services"));

                // --- Seed Testimonials ---
                const testimonialSql = `INSERT INTO testimonials (client_name, client_avatar_url, quote, date, display_order) VALUES (?, ?, ?, ?, ?)`;
                db.run(testimonialSql, ["Daniel Lewis", "./assets/images/avatar-1.png", "Duong Dinh was great to work with. Very communicative and delivered excellent results on our project.", "2023-10-15", 1], handleSeedError("testimonials"));
                db.run(testimonialSql, ["Jessica Miller", "./assets/images/avatar-2.png", "Highly recommend! Professional, skilled, and attentive to detail.", "2023-11-01", 2], handleSeedError("testimonials"));

                // --- Seed Clients ---
                const clientSql = `INSERT INTO clients (name, logo_image_url, website_url, display_order) VALUES (?, ?, ?, ?)`;
                db.run(clientSql, ["Client Logo 1", "./assets/images/logo-1-color.png", "#", 1], handleSeedError("clients"));
                db.run(clientSql, ["Client Logo 2", "./assets/images/logo-2-color.png", "#", 2], handleSeedError("clients"));
                db.run(clientSql, ["Client Logo 3", "./assets/images/logo-3-color.png", "#", 3], handleSeedError("clients"));

                // --- Seed Education ---
                const educationSql = `INSERT INTO education (institution_name, degree_or_focus, period, description, display_order) VALUES (?, ?, ?, ?, ?)`;
                db.run(educationSql, ["FPT Polytechnic", "Web Development", "2022 — 2025", "Studied front-end and back-end technologies, database management, and UI/UX principles.", 1], handleSeedError("education"));
                db.run(educationSql, ["Online Course Platform", "Advanced JavaScript", "2023", "Completed an intensive course on modern JavaScript features and best practices.", 2], handleSeedError("education"));

                // --- Seed Experience ---
                const experienceSql = `INSERT INTO experience (job_title, company_name, period, description, display_order) VALUES (?, ?, ?, ?, ?)`;
                db.run(experienceSql, ["Freelance Web Developer", "Self-employed", "2023 — Present", "Developed custom websites and web applications for various clients using Angular, Node.js, and other technologies.", 1], handleSeedError("experience"));
                db.run(experienceSql, ["Intern Web Developer", "Tech Company ABC", "Summer 2023", "Assisted senior developers in building and testing features for a large-scale web application.", 2], handleSeedError("experience"));

                // --- Seed Skills ---
                const skillSql = `INSERT INTO skills (name, percentage, category, display_order) VALUES (?, ?, ?, ?)`;
                db.run(skillSql, ["HTML & CSS", 90, "Frontend", 1], handleSeedError("skills"));
                db.run(skillSql, ["JavaScript", 85, "Frontend", 2], handleSeedError("skills"));
                db.run(skillSql, ["Angular", 80, "Frontend", 3], handleSeedError("skills"));
                db.run(skillSql, ["Node.js / Express", 75, "Backend", 4], handleSeedError("skills"));
                db.run(skillSql, ["SQL (SQLite/MySQL)", 70, "Database", 5], handleSeedError("skills"));
                db.run(skillSql, ["Git & GitHub", 85, "Tools", 6], handleSeedError("skills"));

                // --- Seed Project Categories & Projects ---
                const categorySql = `INSERT INTO project_categories (name, slug) VALUES (?, ?)`;
                const projectSql = `INSERT INTO projects (title, slug, category_id, thumbnail_image_url, description, technologies_used, project_url, source_code_url, is_featured, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

                let webDevCatId, webDesignCatId, appCatId;

                // Insert Web Dev Category then Projects
                db.run(categorySql, ["Web Development", "web-development"], function (err) { // Use function() for this.lastID
                    handleSeedError("project_categories")(err);
                    if (!err) {
                        webDevCatId = this.lastID;
                        db.run(projectSql, ["Finance App", "finance-app", webDevCatId, "./assets/images/project-1.jpg", "A web application for personal finance tracking.", "Angular, Node.js, SQLite, Chart.js", "#", "#", 1, 1], handleSeedError("projects"));
                        db.run(projectSql, ["Orizon Website", "orizon-website", webDevCatId, "./assets/images/project-2.png", "Company portfolio website.", "HTML, CSS, JavaScript", "#", "#", 0, 3], handleSeedError("projects"));
                    }
                });

                // Insert Web Design Category then Projects
                db.run(categorySql, ["Web Design", "web-design"], function (err) {
                    handleSeedError("project_categories")(err);
                    if (!err) {
                        webDesignCatId = this.lastID;
                        db.run(projectSql, ["Fundo Landing Page", "fundo-landing", webDesignCatId, "./assets/images/project-3.jpg", "Landing page design for a startup.", "Figma, HTML, CSS", "#", null, 0, 2], handleSeedError("projects"));
                        db.run(projectSql, ["MetaSpark Design", "metaspark-design", webDesignCatId, "./assets/images/project-6.png", "UI/UX design concept.", "Figma", null, null, 0, 5], handleSeedError("projects"));
                    }
                });

                // Insert Applications Category then Projects
                db.run(categorySql, ["Applications", "applications"], function (err) {
                    handleSeedError("project_categories")(err);
                    if (!err) {
                        appCatId = this.lastID;
                        db.run(projectSql, ["Task Manager App", "task-manager", appCatId, "./assets/images/project-8.jpg", "Simple task management application.", "Angular, LocalStorage", "#", "#", 1, 4], handleSeedError("projects"));
                    }
                });

                // --- Seed Certificates ---
                const certificateSql = `INSERT INTO certificates (name, issuing_organization, issue_date, credential_url, description, display_order) VALUES (?, ?, ?, ?, ?, ?)`;
                db.run(certificateSql, ["Angular - The Complete Guide", "Udemy", "2023-05-20", "#", "Comprehensive course covering Angular fundamentals and advanced topics.", 1], handleSeedError("certificates"));
                db.run(certificateSql, ["Responsive Web Design", "freeCodeCamp", "2022-11-10", "#", "Certification covering HTML5, CSS3, and responsive design principles.", 2], handleSeedError("certificates"));

                // Final message after attempting all seeds
                // Note: Due to async nature, this might log before all INSERTs fully complete,
                // but it indicates the seeding *process* has finished queueing.
                console.log("Finished queueing seed data.");

            }); // End db.serialize for seeding
        } else {
            console.log("Database already contains data. Skipping seeding.");
        }
    });
}

// Helper function for handling seeding errors
function handleSeedError(tableName) {
    return function (err) {
        if (err) {
            // Ignore UNIQUE constraint errors during seeding as they might happen if run multiple times by mistake
            if (!err.message.includes('UNIQUE constraint failed')) {
                console.error(`Error seeding ${tableName}:`, err.message);
            }
        }
    };
}

// --- Middleware ---
app.use(cors()); // Enable Cross-Origin Resource Sharing for your Angular app
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// --- API Routes ---
// NOTE: All database interactions below use Parameterized Queries (e.g., db.all(sql, params, ...))
// This is the standard way to prevent SQL Injection vulnerabilities.
// The 'sqlite3' library handles escaping the parameters safely.

// GET: Fetch all portfolio data needed for the main pages
app.get('/api/portfolio-data', (req, res) => {
    if (!db) return res.status(503).json({ error: 'Database not connected' });

    // Using Promise.all to fetch data concurrently
    const queries = [
        new Promise((resolve, reject) => {
            // Fetch profile (expecting only one row)
            db.get("SELECT * FROM profile LIMIT 1", [], (err, row) => {
                if (err) reject(err); else resolve(row || {}); // Return empty obj if no profile
            });
        }),
        new Promise((resolve, reject) => {
            db.all("SELECT * FROM social_links ORDER BY display_order ASC", [], (err, rows) => {
                if (err) reject(err); else resolve(rows || []);
            });
        }),
        new Promise((resolve, reject) => {
            db.all("SELECT * FROM services ORDER BY display_order ASC", [], (err, rows) => {
                if (err) reject(err); else resolve(rows || []);
            });
        }),
        new Promise((resolve, reject) => {
            db.all("SELECT * FROM testimonials ORDER BY display_order ASC", [], (err, rows) => {
                if (err) reject(err); else resolve(rows || []);
            });
        }),
        new Promise((resolve, reject) => {
            db.all("SELECT * FROM clients ORDER BY display_order ASC", [], (err, rows) => {
                if (err) reject(err); else resolve(rows || []);
            });
        }),
        new Promise((resolve, reject) => {
            db.all("SELECT * FROM education ORDER BY display_order ASC", [], (err, rows) => {
                if (err) reject(err); else resolve(rows || []);
            });
        }),
        new Promise((resolve, reject) => {
            db.all("SELECT * FROM experience ORDER BY display_order ASC", [], (err, rows) => {
                if (err) reject(err); else resolve(rows || []);
            });
        }),
        new Promise((resolve, reject) => {
            db.all("SELECT * FROM skills ORDER BY display_order ASC, percentage DESC", [], (err, rows) => {
                if (err) reject(err); else resolve(rows || []);
            });
        }),
        new Promise((resolve, reject) => {
            db.all("SELECT * FROM project_categories ORDER BY name ASC", [], (err, rows) => {
                if (err) reject(err); else resolve(rows || []);
            });
        }),
        new Promise((resolve, reject) => {
            // Join projects with categories
            const projectSql = `SELECT p.*, c.name as category_name, c.slug as category_slug
                                FROM projects p
                                LEFT JOIN project_categories c ON p.category_id = c.id
                                ORDER BY p.display_order ASC`;
            db.all(projectSql, [], (err, rows) => {
                if (err) reject(err); else resolve(rows || []);
            });
        }),
        new Promise((resolve, reject) => {
            db.all("SELECT * FROM certificates ORDER BY display_order ASC, issue_date DESC", [], (err, rows) => {
                if (err) reject(err); else resolve(rows || []);
            });
        }),
    ];

    // Resolve all promises
    Promise.all(queries)
        .then(([profile, socialLinks, services, testimonials, clients, education, experience, skills, projectCategories, projects, certificates]) => {
            // Structure the response
            res.json({
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
            });
        })
        .catch(err => {
            console.error('Error fetching portfolio data:', err.message);
            res.status(500).json({ error: 'Failed to fetch portfolio data', details: err.message });
        });
});

// GET: Fetch a single project by its slug (Parameterized Query prevents SQL Injection)
app.get('/api/projects/:slug', (req, res) => {
    if (!db) return res.status(503).json({ error: 'Database not connected' });
    const slug = req.params.slug; // User-controlled input
    const sql = `SELECT p.*, c.name as category_name, c.slug as category_slug
                 FROM projects p
                 LEFT JOIN project_categories c ON p.category_id = c.id
                 WHERE p.slug = ?`; // Placeholder '?' is used

    // The slug is passed as a parameter, not concatenated into the string
    db.get(sql, [slug], (err, row) => {
        if (err) {
            console.error('Error fetching project by slug:', err.message);
            return res.status(500).json({ error: 'Database error', details: err.message });
        }
        if (row) {
            res.json(row);
        } else {
            res.status(404).json({ error: 'Project not found' });
        }
    });
});

// GET: Fetch a single certificate by its ID (Parameterized Query prevents SQL Injection)
app.get('/api/certificates/:id', (req, res) => {
    if (!db) return res.status(503).json({ error: 'Database not connected' });
    const id = req.params.id; // User-controlled input
    const sql = "SELECT * FROM certificates WHERE id = ?"; // Placeholder '?' is used

    // The id is passed as a parameter
    db.get(sql, [id], (err, row) => {
        if (err) {
            console.error('Error fetching certificate by ID:', err.message);
            return res.status(500).json({ error: 'Database error', details: err.message });
        }
        if (row) {
            res.json(row);
        } else {
            res.status(404).json({ error: 'Certificate not found' });
        }
    });
});


// POST: Handle contact form submission (Parameterized Query prevents SQL Injection)
app.post('/api/contact', (req, res) => {
    if (!db) return res.status(503).json({ error: 'Database not connected' });

    // Destructure data from request body (user-controlled input)
    const { fullname, email, subject, message } = req.body;

    // Basic server-side validation
    if (!fullname || !email || !message) {
        return res.status(400).json({ error: 'Full name, email, and message are required.' });
    }
    // Simple email format check
    if (!/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ error: 'Invalid email format.' });
    }

    const sql = `INSERT INTO contact_submissions (full_name, email, subject, message) VALUES (?, ?, ?, ?)`; // Placeholders
    // Parameters are passed separately in an array
    const params = [fullname, email, subject || null, message];

    db.run(sql, params, function (err) { // Use function() to access this.lastID
        if (err) {
            console.error('Error saving contact submission:', err.message);
            return res.status(500).json({ error: 'Failed to save message', details: err.message });
        }
        console.log(`New contact submission saved with ID: ${this.lastID}`);
        // Respond with success status and message
        res.status(201).json({ success: true, message: 'Message received successfully!', id: this.lastID });
    });
});

// --- Basic Root Route for Testing ---
app.get('/', (req, res) => {
    res.send('Portfolio Backend API is running!');
});

// --- Start Server ---
// Initialize DB connection, create tables, and seed data before starting listener
connectDatabase();

app.listen(PORT, () => {
    console.log(`Backend server listening on http://localhost:${PORT}`);
});

// --- Graceful Shutdown ---
process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server and DB connection.');
    if (db) {
        db.close((err) => {
            if (err) {
                console.error('Error closing database:', err.message);
            } else {
                console.log('Database connection closed.');
            }
            process.exit(err ? 1 : 0);
        });
    } else {
        process.exit(0);
    }
});
