const db = require('../config/db');
const bcrypt = require('bcryptjs');

// --- 1. ÖSSZES FELHASZNÁLÓ LISTÁZÁSA ---
exports.getAllUsers = async (req, res) => {
    try {
        // PONTOSAN AZOKAT AZ OSZLOPOKAT KÉRJÜK, AMIK A KÉPEN VANNAK
        const sql = 'SELECT id, nev, username, email, role, regisztracio_datum, avatar FROM users ORDER BY regisztracio_datum DESC';
        const [users] = await db.query(sql);
        res.json(users);
    } catch (error) {
        console.error("Hiba a felhasználók lekérésekor:", error);
        res.status(500).json({ message: 'Szerver hiba az adatok lekérésekor.' });
    }
};

// --- 2. FELHASZNÁLÓ TÖRLÉSE ---
exports.deleteUser = async (req, res) => {
    const id = req.params.id;
    try {
        // Először a kapcsolódó adatokat töröljük, hogy ne legyen SQL hiba
        await db.query('DELETE FROM reviews WHERE user_id = ?', [id]);
        await db.query('DELETE FROM kedvencek WHERE user_id = ?', [id]);
        
        // Listák törlése (kicsit bonyolultabb, mert a list_items-et is törölni kell)
        await db.query('DELETE FROM custom_list_items WHERE list_id IN (SELECT id FROM custom_lists WHERE user_id = ?)', [id]);
        await db.query('DELETE FROM custom_lists WHERE user_id = ?', [id]);

        // Végül a felhasználót
        await db.query('DELETE FROM users WHERE id = ?', [id]);
        
        res.json({ message: 'Felhasználó sikeresen törölve.' });
    } catch (error) {
        console.error("Törlési hiba:", error);
        res.status(500).json({ message: 'Hiba a törléskor.' });
    }
};

// --- 3. FELHASZNÁLÓ SZERKESZTÉSE ---
exports.updateUser = async (req, res) => {
    const id = req.params.id;
    const { email, password, role } = req.body;

    try {
        // Megnézzük, hogy az email foglalt-e MÁS által
        const [existing] = await db.query('SELECT id FROM users WHERE email = ? AND id != ?', [email, id]);
        
        if (existing.length > 0) {
            return res.status(400).json({ message: "Ez az email cím már foglalt!" });
        }

        let sql;
        let params;

        if (password && password.trim() !== "") {
            // HA VAN új jelszó -> Titkosítjuk és a 'password_hash' oszlopba mentjük
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            
            sql = 'UPDATE users SET email = ?, role = ?, password_hash = ? WHERE id = ?';
            params = [email, role, hashedPassword, id];
        } else {
            // HA NINCS új jelszó -> Csak emailt és rangot mentünk
            sql = 'UPDATE users SET email = ?, role = ? WHERE id = ?';
            params = [email, role, id];
        }

        await db.query(sql, params);

        res.json({ message: "Sikeres frissítés!", user: { id, email, role } });

    } catch (error) {
        console.error("Frissítési hiba:", error);
        res.status(500).json({ message: 'Hiba a frissítéskor.' });
    }
};