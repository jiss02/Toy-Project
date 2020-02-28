var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController');

// userIdx 보안 문제상 토큰 내부에
router.post('', userController.signup);
router.post('/signin', userController.signin);
router.get('', userController.read);
router.put('', userController.update);
router.delete('', userController.delete);

module.exports = router;
