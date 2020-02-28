var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');
const checkToken = require('../modules/auth/checkToken');

// userIdx 보안 문제상 토큰 내부에
router.post('/', userController.create);
router.post('/signin', userController.signin);

router.use('/', checkToken.isLoggedin);
router.get('/', userController.read);
router.put('/', userController.update);
router.delete('/', userController.delete);

module.exports = router;
