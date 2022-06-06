const express = require('express');
const router = express.Router();
const pages = require('../controllers/render');
const authController = require('../controllers/authControllers');

router.get('/', pages.index);
router.get('/api/register', pages.register);
router.get('/api/login', pages.login);
router.get('/chat', pages.chat);

router.post('/api/signup', authController.signup);
router.post('/api/login', authController.login);
router.get('/api/logout', authController.logout);
router.get('/api/verifyuser',authController.verifyuser);



module.exports = router;