var express = require('express');
var router = express.Router();
var postController = require('../controllers/postController');

router.post('', postController.create);
router.get('', postController.readAll);
router.get('/:postIdx', postController.read);
router.put('/:postIdx', postController.update);
router.delete('/:postIdx', postController.delete);

module.exports = router;
