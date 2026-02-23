const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Importáld a route-okat
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const seriesRoutes = require('./routes/seriesRoutes');
const interactionRoutes = require('./routes/interactionRoutes');
const adminRoutes = require('./routes/adminRoutes');
// --- ÚJ SOR: Importáljuk a searchRoute-ot ---
const searchRoutes = require('./routes/searchRoutes'); 
// ----------------------------------------------

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));

// --- JAVÍTÁS ITT: MÉRET LIMIT NÖVELÉSE ---
// Az alapbeállítás (100kb) helyett 10MB-ot engedélyezünk a képek miatt
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// ------------------------------------------

// Végpontok használata
app.use('/api/auth', authRoutes);
app.use('/api/filmek', movieRoutes);
app.use('/api/sorozatok', seriesRoutes);
app.use('/api/interactions', interactionRoutes);
app.use('/api/admin', adminRoutes);
// --- ÚJ SOR: Bekötjük a keresőt az /api alá ---
app.use('/api', searchRoutes); 
// ----------------------------------------------

app.use((req, res) => {
    res.status(404).json({ message: 'Az útvonal nem található' });
});

module.exports = app;