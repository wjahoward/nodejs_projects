const express = require('express');
const router = express.Router();

const {createProduct, getAllProducts} = require('../controllers/productController');
const {uploadProdutImage} = require('../controllers/uploadsController');

router.route('/').post(createProduct).get(getAllProducts);
router.route('/uploads').post(uploadProdutImage);

module.exports = router;