const Product = require('../models/product');

const getAllProductsStatic = async (req, res) => {
    // const search = 'tm'; // consecutive 'tm' letters found
    const search = 'a'; // search for letter 'a'
    const products = await Product.find({
        name: { $regex: search, $options: 'i' /* case insensitive */}
    });
    return res.status(200).json({products});
};

const getAllProducts = async (req, res) => {
    const { feature, company, name } = req.query; // filter criteria
    const queryObject = {};

    if (feature) {
        queryObject.feature = feature === 'true' ? true : false;
    }

    if (company) {
        queryObject.company = company;
    }

    if (name) {
        queryObject.name = { $regex: name, $options: 'i' /* case insensitive */};
    }

    const products = await Product.find(queryObject);
    return res.status(200).json(products);
};

module.exports = {
    getAllProducts,
    getAllProductsStatic
};