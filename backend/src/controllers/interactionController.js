const db = require('../config/db');

// --- SEGÉDFÜGGVÉNY: Átlag újraszámolása ---
async function updateAverageRating(filmId, sorozatId) {
    try {
        const FALLBACK_RATING = 8.0; 
        const targetId = filmId || sorozatId;
        const targetTable = filmId ? 'filmek' : 'sorozatok';
        const idColumn = filmId ? 'film_id' : 'sorozat_id';

        const [baseData] = await db.query(`SELECT alap_rating FROM ${targetTable} WHERE id = ?`, [targetId]);
        const baseRating = (baseData[0] && baseData[0].alap_rating) ? parseFloat(baseData[0].alap_rating) : FALLBACK_RATING;

        const [stats] = await db.query(
            `SELECT SUM(rating) as total_score, COUNT(*) as vote_count FROM reviews WHERE ${idColumn} = ?`, 
            [targetId]
        );

        const userTotalScore = stats[0].total_score ? parseFloat(stats[0].total_score) : 0;
        const userVoteCount = stats[0].vote_count ? parseInt(stats[0].vote_count) : 0;

        const finalRating = (baseRating + userTotalScore) / (1 + userVoteCount);
        const roundedRating = finalRating.toFixed(1);

        await db.query(`UPDATE ${targetTable} SET rating = ? WHERE id = ?`, [roundedRating, targetId]);
    } catch (err) { console.error("Hiba az átlag frissítésekor:", err); }
}

// --- KEDVENCEK ---
exports.addToFavorites = async (req, res) => {
    const { userId, filmId, sorozatId } = req.body;
    if (!userId || (!filmId && !sorozatId)) return res.status(400).json({ message: "Hiányzó adatok!" });

    try {
        const [existing] = await db.query('SELECT * FROM kedvencek WHERE user_id = ? AND (film_id = ? OR sorozat_id = ?)', [userId, filmId || null, sorozatId || null]);
        if (existing.length > 0) return res.status(400).json({ message: "Már a kedvencek között van!" });

        await db.query('INSERT INTO kedvencek (user_id, film_id, sorozat_id, added_at) VALUES (?, ?, ?, NOW())', [userId, filmId || null, sorozatId || null]);
        res.status(200).json({ message: "Hozzáadva a kedvencekhez!" });
    } catch (err) { res.status(500).json({ message: "Szerver hiba" }); }
};

exports.getFavorites = async (req, res) => {
    const { userId } = req.params;
    try {
        const query = `
            SELECT k.id, k.added_at, 
                   f.id as film_id, f.cim as film_cim, f.poszter_url as film_poster, 
                   f.leiras as film_leiras, f.rating as film_rating, f.megjelenes_ev as film_ev,
                   
                   s.id as sorozat_id, s.cim as sorozat_cim, s.poszter_url as sorozat_poster,
                   s.leiras as sorozat_leiras, s.rating as sorozat_rating, s.megjelenes_ev_start as sorozat_ev
            FROM kedvencek k 
            LEFT JOIN filmek f ON k.film_id = f.id 
            LEFT JOIN sorozatok s ON k.sorozat_id = s.id 
            WHERE k.user_id = ? 
            ORDER BY k.added_at DESC
        `;
        const [results] = await db.query(query, [userId]);

        // Platformok lekérdezése
        for (const item of results) {
            let platformSql = `SELECT p.id, p.nev, p.logo_url, p.weboldal_url FROM media_platformok mp JOIN platformok p ON mp.platform_id = p.id`;
            const params = [];
            if (item.film_id) { platformSql += ` WHERE mp.film_id = ?`; params.push(item.film_id); } 
            else { platformSql += ` WHERE mp.sorozat_id = ?`; params.push(item.sorozat_id); }
            try { const [platforms] = await db.query(platformSql, params); item.platformok = platforms || []; } 
            catch (pErr) { item.platformok = []; }
        }
        res.status(200).json(results);
    } catch (err) { console.error("SQL Hiba (Favorites):", err); res.status(500).json({ message: "Szerver hiba." }); }
};

exports.removeFromFavorites = async (req, res) => {
    const { userId, itemId, filmId, sorozatId } = req.body;
    try {
        let sql = 'DELETE FROM kedvencek WHERE user_id = ?';
        const params = [userId];

        if (itemId) { sql += ' AND id = ?'; params.push(itemId); } 
        else if (filmId) { sql += ' AND film_id = ?'; params.push(filmId); } 
        else if (sorozatId) { sql += ' AND sorozat_id = ?'; params.push(sorozatId); } 
        else { return res.status(400).json({ message: "Hiányzó azonosító!" }); }

        await db.query(sql, params);
        res.status(200).json({ message: "Törölve." });
    } catch (err) { console.error("Törlési hiba:", err); res.status(500).json({ message: "Hiba törléskor." }); }
};

// --- SAJÁT LISTA ---
exports.addToMyList = async (req, res) => {
    const { userId, filmId, sorozatId } = req.body;
    if (!userId) return res.status(400).json({ message: "Nincs bejelentkezve!" });

    try {
        let [lists] = await db.query('SELECT id FROM custom_lists WHERE user_id = ? LIMIT 1', [userId]);
        let listId;
        if (lists.length === 0) {
            const [newList] = await db.query('INSERT INTO custom_lists (user_id, title, is_public, created_at) VALUES (?, "Saját listám", 0, NOW())', [userId]);
            listId = newList.insertId;
        } else { listId = lists[0].id; }

        const [existingItem] = await db.query('SELECT * FROM custom_list_items WHERE list_id = ? AND (film_id = ? OR sorozat_id = ?)', [listId, filmId || null, sorozatId || null]);
        if (existingItem.length > 0) return res.status(400).json({ message: "Ez a tétel már a listádon van!" });

        await db.query('INSERT INTO custom_list_items (list_id, film_id, sorozat_id, added_at) VALUES (?, ?, ?, NOW())', [listId, filmId || null, sorozatId || null]);
        res.status(200).json({ message: "Hozzáadva a saját listához!" });
    } catch (err) { res.status(500).json({ message: "Szerver hiba" }); }
};

exports.getMyList = async (req, res) => {
    const { userId } = req.params;
    try {
        const query = `
            SELECT cli.id, cli.added_at, 
                   f.id as film_id, f.cim as film_cim, f.poszter_url as film_poster, 
                   f.leiras as film_leiras, f.rating as film_rating, f.megjelenes_ev as film_ev,
                   s.id as sorozat_id, s.cim as sorozat_cim, s.poszter_url as sorozat_poster,
                   s.leiras as sorozat_leiras, s.rating as sorozat_rating, s.megjelenes_ev_start as sorozat_ev
            FROM custom_list_items cli 
            JOIN custom_lists cl ON cli.list_id = cl.id 
            LEFT JOIN filmek f ON cli.film_id = f.id 
            LEFT JOIN sorozatok s ON cli.sorozat_id = s.id 
            WHERE cl.user_id = ? 
            ORDER BY cli.added_at DESC
        `;
        const [results] = await db.query(query, [userId]);

        for (const item of results) {
            let platformSql = `SELECT p.id, p.nev, p.logo_url, p.weboldal_url FROM media_platformok mp JOIN platformok p ON mp.platform_id = p.id`;
            const params = [];
            if (item.film_id) { platformSql += ` WHERE mp.film_id = ?`; params.push(item.film_id); } 
            else { platformSql += ` WHERE mp.sorozat_id = ?`; params.push(item.sorozat_id); }
            try { const [platforms] = await db.query(platformSql, params); item.platformok = platforms || []; } 
            catch (pErr) { item.platformok = []; }
        }
        res.status(200).json(results);
    } catch (err) { console.error("SQL Hiba (MyList):", err); res.status(500).json({ message: "Szerver hiba" }); }
};

exports.removeFromMyList = async (req, res) => {
    const { userId, itemId, filmId, sorozatId } = req.body; 
    try {
        const [lists] = await db.query('SELECT id FROM custom_lists WHERE user_id = ? LIMIT 1', [userId]);
        if (lists.length === 0) return res.status(404).json({ message: "Nincs listád." });
        const listId = lists[0].id;

        let sql = 'DELETE FROM custom_list_items WHERE list_id = ?';
        const params = [listId];

        if (itemId) { sql += ' AND id = ?'; params.push(itemId); } 
        else if (filmId) { sql += ' AND film_id = ?'; params.push(filmId); } 
        else if (sorozatId) { sql += ' AND sorozat_id = ?'; params.push(sorozatId); } 
        else { return res.status(400).json({ message: "Hiányzó azonosító!" }); }

        await db.query(sql, params);
        res.status(200).json({ message: "Törölve." });
    } catch (err) { console.error("Lista törlési hiba:", err); res.status(500).json({ message: "Hiba törléskor." }); }
};

// --- VÉLEMÉNYEK ---
exports.getReviews = async (req, res) => {
    const { type, id } = req.params; 
    try {
        let sql = `SELECT r.id, r.comment, r.rating, r.created_at, u.username, u.avatar FROM reviews r JOIN users u ON r.user_id = u.id`;
        if (type === 'film') sql += ` WHERE r.film_id = ?`; else sql += ` WHERE r.sorozat_id = ?`;
        sql += ` ORDER BY r.created_at DESC`;
        const [results] = await db.query(sql, [id]);
        res.status(200).json(results);
    } catch (err) { console.error(err); res.status(500).json({ message: "Szerver hiba." }); }
};

exports.addReview = async (req, res) => {
    const { userId, filmId, sorozatId, comment, rating } = req.body;
    if (!userId) return res.status(401).json({ message: "Jelentkezz be!" });
    if (!rating) return res.status(400).json({ message: "Pontszám kötelező!" });
    if (!comment || comment.trim() === "") return res.status(400).json({ message: "Vélemény kötelező!" });

    try {
        const [existing] = await db.query('SELECT id FROM reviews WHERE user_id = ? AND (film_id = ? OR sorozat_id = ?)', [userId, filmId || null, sorozatId || null]);
        if (existing.length > 0) return res.status(400).json({ message: "Már értékelted!" });
        await db.query('INSERT INTO reviews (user_id, film_id, sorozat_id, comment, rating, created_at) VALUES (?, ?, ?, ?, ?, NOW())', [userId, filmId || null, sorozatId || null, comment, rating]);
        await updateAverageRating(filmId, sorozatId);
        res.status(200).json({ message: "Vélemény elküldve!" });
    } catch (err) { console.error("Hiba:", err); res.status(500).json({ message: "Szerver hiba." }); }
};

// --- JAVÍTOTT TÖRLÉS: ADMIN JOGOSULTSÁG ELLENŐRZÉSE ---
exports.deleteReview = async (req, res) => {
    const { userId, reviewId } = req.body;
    try {
        // 1. Lekérdezzük a usert, hogy admin-e
        const [userRows] = await db.query('SELECT role FROM users WHERE id = ?', [userId]);
        const isAdmin = userRows.length > 0 && userRows[0].role === 'admin';

        // 2. Megkeressük a törlendő véleményt
        const [review] = await db.query('SELECT film_id, sorozat_id, user_id FROM reviews WHERE id = ?', [reviewId]);
        if (review.length === 0) return res.status(404).json({ message: "A vélemény nem található." });
        
        // 3. Jogosultság ellenőrzése: saját vélemény VAGY admin
        if (review[0].user_id !== userId && !isAdmin) {
            return res.status(403).json({ message: "Nincs jogosultságod törölni ezt a véleményt!" });
        }

        const { film_id, sorozat_id } = review[0];
        
        // 4. Törlés és átlag frissítés
        await db.query('DELETE FROM reviews WHERE id = ?', [reviewId]);
        await updateAverageRating(film_id, sorozat_id);
        
        res.status(200).json({ message: "Sikeresen törölve!" });
    } catch (err) { console.error(err); res.status(500).json({ message: "Szerver hiba." }); }
};

// --- STÁTUSZ ---
exports.checkStatus = async (req, res) => {
    const { userId, filmId, sorozatId } = req.body;
    if (!userId) return res.status(200).json({ reviewed: false, favorite: false, listed: false });
    try {
        const [review] = await db.query('SELECT id FROM reviews WHERE user_id = ? AND (film_id = ? OR sorozat_id = ?)', [userId, filmId || null, sorozatId || null]);
        const [favorite] = await db.query('SELECT id FROM kedvencek WHERE user_id = ? AND (film_id = ? OR sorozat_id = ?)', [userId, filmId || null, sorozatId || null]);
        let listed = false;
        const [lists] = await db.query('SELECT id FROM custom_lists WHERE user_id = ? LIMIT 1', [userId]);
        if (lists.length > 0) {
            const [item] = await db.query('SELECT id FROM custom_list_items WHERE list_id = ? AND (film_id = ? OR sorozat_id = ?)', [lists[0].id, filmId || null, sorozatId || null]);
            if (item.length > 0) listed = true;
        }
        res.status(200).json({ reviewed: review.length > 0, favorite: favorite.length > 0, listed: listed });
    } catch (err) { console.error(err); res.status(500).json({ message: "Szerver hiba" }); }
};