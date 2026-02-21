const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Fontos: A server.js-ben '/api/admin'-ra van kötve, így a végpontok:
// GET    http://localhost:5000/api/admin/users
// DELETE http://localhost:5000/api/admin/users/:id
// PUT    http://localhost:5000/api/admin/users/:id

router.get('/users', adminController.getAllUsers);
router.delete('/users/:id', adminController.deleteUser);
router.put('/users/:id', adminController.updateUser);

module.exports = router;