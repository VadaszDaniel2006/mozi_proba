const db = require('../config/db');

exports.globalSearch = async (req, res) => {
    const searchTerm = req.query.q; 

    if (!searchTerm || searchTerm.trim() === '') {
        return res.status(200).json([]); 
    }

    const searchQuery = `%${searchTerm}%`;

    try {
        const query = `
            SELECT 
                f.id, f.cim, f.poszter_url, f.megjelenes_ev AS ev, 'film' AS tipus 
            FROM filmek f
            LEFT JOIN kategoriak k ON f.kategoria_id = k.id
            LEFT JOIN rendezok r ON f.rendezo_id = r.id
            LEFT JOIN media_orszagok mo ON mo.film_id = f.id
            LEFT JOIN nemzetisegek n ON mo.nemzetiseg_id = n.id
            WHERE f.cim LIKE ? OR k.nev LIKE ? OR r.nev LIKE ? OR n.nev LIKE ? OR r.nemzetiseg LIKE ?

            UNION 

            SELECT 
                s.id, s.cim, s.poszter_url, s.megjelenes_ev_start AS ev, 'sorozat' AS tipus 
            FROM sorozatok s
            LEFT JOIN kategoriak k ON s.kategoria_id = k.id
            LEFT JOIN rendezok r ON s.rendezo_id = r.id
            LEFT JOIN media_orszagok mo ON mo.sorozat_id = s.id
            LEFT JOIN nemzetisegek n ON mo.nemzetiseg_id = n.id
            WHERE s.cim LIKE ? OR k.nev LIKE ? OR r.nev LIKE ? OR n.nev LIKE ? OR r.nemzetiseg LIKE ?
            
            ORDER BY cim ASC
            LIMIT 20;
        `;

        // Most már 10 paramétert adunk át (5 a filmeknek, 5 a sorozatoknak)
        const [results] = await db.query(query, [
            searchQuery, searchQuery, searchQuery, searchQuery, searchQuery,
            searchQuery, searchQuery, searchQuery, searchQuery, searchQuery
        ]);

        res.status(200).json(results);
    } catch (err) {
        console.error("Keresési hiba:", err);
        res.status(500).json({ message: "Hiba történt a keresés során." });
    }
};

exports.saveSearchHistory = async (req, res) => {
    const { userId, searchTerm } = req.body;
    if (!userId || !searchTerm) return res.status(400).json({ message: "Hiányzó adatok!" });

    try {
        await db.query('INSERT INTO search_history (user_id, search_term, searched_at) VALUES (?, ?, NOW())', [userId, searchTerm]);
        res.status(200).json({ message: "Előzmény elmentve!" });
    } catch (err) { res.status(500).json({ message: "Szerverhiba." }); }
};