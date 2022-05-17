const Product = require('../models/product');

const getAllProductsStatic = async (req, res) => {
    const products = await Product.find();
    return res.status(200).json({products});
};

const getAllProducts = async (req, res) => {
    const { feature } = req.query; // filter criteria
    const queryObject = {};

    if (feature) {
        queryObject.feature = feature === 'true' ? true : false;
    }

    const products = await Product.find(queryObject);
    return res.status(200).json(products);
};

module.exports = {
    getAllProducts,
    getAllProductsStatic
};