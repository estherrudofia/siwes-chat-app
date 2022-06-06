const express = require('express');
const router = express.Router();
const pages = require('../services/render');
const regs = require('../services/register');

router.get('/', pages.index);
router.get('/api/register', pages.register);
router.get('/api/login', pages.login);
router.get('/api/chat', pages.chat);

//create
router.post('/api/register',  regs.register);
router.post('/api/login/', regs.login);
router.get('/api/logout', regs.logout);

module.exports = router;