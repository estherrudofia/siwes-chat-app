const { Router } = require('express');
const authController = require('../controllers/authControllers');
const router = Router();
router.post('/api/signup', authController.signup)
router.post('/api/login', authController.login)
router.get('/api/logout', authController.logout)
router.get('/api/verifyuser',authController.verifyuser)

module.exports = router;