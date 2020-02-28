var express = require('express');
var router = express.Router();
const postController = require('../controllers/postController');
const checkToken = require('../modules/auth/checkToken');

router.use('/', checkToken.isLoggedin);
router.post('/', postController.create);
router.get('/', postController.readAll);
router.get('/:postIdx', postController.read);
router.put('/:postIdx', postController.update);
router.delete('/:postIdx', postController.delete);

module.exports = router;
