const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
// Feltételezem, hogy ez a fájl létezik nálad a middleware mappában:
const { protect } = require('../middleware/authMiddleware'); 

// Regisztráció
router.post('/register', authController.register);

// Bejelentkezés
router.post('/login', authController.login);

// Profil frissítése (Védett útvonal!)
router.put('/update-profile', protect, authController.updateProfile);
router.get('/me', protect, authController.getMe);

module.exports = router;