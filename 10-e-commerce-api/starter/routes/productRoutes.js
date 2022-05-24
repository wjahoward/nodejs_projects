const express = require('express');
const router = express.Router();
const {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImage
} = require('../controllers/productController');
const { authenticateUser, authorizePermissions } = require('../middleware/authentication');

router.route('/')
    .post([authenticateUser, authorizePermissions('admin')],
    createProduct)
    .get(getAllProducts);

// order of the routes here are important
// need to be before ':id' route
router.route('/uploadImage')
    .post([authenticateUser, authorizePermissions('user')],
    uploadImage);

router.route('/:id')
    .get(getSingleProduct)
    .patch([authenticateUser, authorizePermissions('admin')], 
    updateProduct)
    .delete([authenticateUser, authorizePermissions('admin')], 
    deleteProduct);

module.exports = router;