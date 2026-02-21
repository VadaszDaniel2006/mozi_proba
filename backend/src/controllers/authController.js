const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- REGISZTRÁCIÓ ---
exports.register = async (req, res) => {
    const { name, email, password, username, favoriteCategories } = req.body;

    if (!name || !email || !password || !username) {
        return res.status(400).json({ message: 'Minden mező kitöltése kötelező!' });
    }

    try {
        const [existing] = await db.query('SELECT * FROM users WHERE email = ? OR username = ?', [email, username]);
        
        if (existing.length > 0) {
            if (existing[0].email === email) return res.status(400).json({ message: 'Ez az email cím már foglalt!' });
            if (existing[0].username === username) return res.status(400).json({ message: 'Ez a felhasználónév már foglalt!' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // BESZÚRÁS: 'nev' oszlopba írjuk a 'name' változót!
        const sql = `INSERT INTO users (nev, email, password_hash, username, role, regisztracio_datum) VALUES (?, ?, ?, ?, 'user', NOW())`;
        const [result] = await db.query(sql, [name, email, hashedPassword, username]);
        const newUserId = result.insertId;

        // Lista létrehozása
        try {
            await db.query('INSERT INTO custom_lists (user_id, title, created_at) VALUES (?, ?, NOW())', [newUserId, 'Saját listám']);
        } catch (e) { console.warn("Lista létrehozási hiba:", e.message); }

        // Kategóriák mentése
        if (favoriteCategories && Array.isArray(favoriteCategories) && favoriteCategories.length > 0) {
            const categoryValues = favoriteCategories.map(cat => [newUserId, cat]);
            await db.query('INSERT INTO user_favorite_categories (user_id, category_id) VALUES ?', [categoryValues]);
        }

        res.status(201).json({ message: 'Sikeres regisztráció!' });

    } catch (error) {
        console.error("Regisztrációs hiba:", error);
        res.status(500).json({ message: 'Szerver hiba történt.' });
    }
};

// --- BEJELENTKEZÉS (JAVÍTVA) ---
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: 'Email és jelszó kötelező!' });

    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) return res.status(400).json({ message: 'Hibás email vagy jelszó!' });

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return res.status(400).json({ message: 'Hibás email vagy jelszó!' });

        // Kategóriák betöltése
        let favoriteCategoriesList = [];
        try {
            const [categoriesDB] = await db.query('SELECT category_id FROM user_favorite_categories WHERE user_id = ?', [user.id]);
            favoriteCategoriesList = categoriesDB.map(row => row.category_id);
        } catch (e) { console.warn("Kategória betöltési hiba:", e.message); }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'titkoskulcs', { expiresIn: '2h' });

        res.json({
            token,
            user: {
                id: user.id,
                name: user.nev,
                username: user.username, 
                email: user.email,
                avatar: user.avatar || "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png",
                
                // --- EZ HIÁNYZOTT: A ROLE MEZŐ ---
                role: user.role, 
                // ---------------------------------
                
                favoriteCategories: favoriteCategoriesList
            }
        });

    } catch (error) {
        console.error("Login hiba:", error);
        res.status(500).json({ message: 'Szerver hiba történt.' });
    }
};

// --- PROFIL FRISSÍTÉSE (JAVÍTOTT) ---
exports.updateProfile = async (req, res) => {
    const userId = req.user.id;
    const userRole = req.user.role; // A tokenből kinyerjük a rangot
    const { name, username, avatar, favoriteCategories } = req.body;

    console.log(`Profil frissítés: UserID=${userId}, Név=${name}`);

    try {
        // 1. ADATOK FRISSÍTÉSE
        const sql = `UPDATE users SET nev = ?, username = ?, avatar = ? WHERE id = ?`;
        
        await db.query(sql, [name, username, avatar, userId]);

        // 2. KATEGÓRIÁK CSERÉJE
        if (favoriteCategories && Array.isArray(favoriteCategories)) {
            // Törlés
            await db.query('DELETE FROM user_favorite_categories WHERE user_id = ?', [userId]);
            
            // Újra beszúrás
            if (favoriteCategories.length > 0) {
                const categoryValues = favoriteCategories.map(cat => [userId, cat]);
                await db.query('INSERT INTO user_favorite_categories (user_id, category_id) VALUES ?', [categoryValues]);
            }
        }

        res.status(200).json({
            message: "Profil sikeresen frissítve!",
            user: {
                id: userId,
                name: name,
                username: username,
                avatar: avatar,
                
                // --- ITT IS VISSZA KELL ADNI A ROLE-T, HOGY NE VESSZEN EL ---
                role: userRole,
                // -----------------------------------------------------------
                
                favoriteCategories: favoriteCategories
            }
        });

    } catch (error) {
        console.error("🔴 MENTÉSI HIBA:", error);
        
        if (error.code === 'ER_DATA_TOO_LONG') {
             return res.status(500).json({ message: "A kép túl nagy az adatbázisnak!" });
        }
        res.status(500).json({ message: "Szerver hiba történt a mentés közben." });
    }
};