const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const authMiddleware = require('../middleware/auth');

router.post('/register', accountController.register);
router.post('/login', accountController.login);
router.get('/me', accountController.getUser);
router.get('/premium', authMiddleware, accountController.getPremium);
router.patch('/premium', authMiddleware, accountController.patchPremium);

module.exports = router;
