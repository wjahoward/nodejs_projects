const Product = require('../models/product');

const getAllProductsStatic = async (req, res) => {
    // const search = 'tm'; // consecutive 'tm' letters found
    const search = 'a'; // search for letter 'a'
    // const products = await Product.find({
    //     name: { $regex: search, $options: 'i' /* case insensitive */}
    // });
    const products = await Product.find().sort('-name -price'); // basic sort by multiple arguments

    return res.status(200).json({products});
};

const getAllProducts = async (req, res) => {
    const { feature, company, name, sort, fields } = req.query; // filter criteria
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

    let result = Product.find(queryObject);

    if (sort) {
        const sortList = sort.split(',').join(' ');
        result = result.sort(sortList);
    } else {
        result = result.sort('createdAt');
    }

    if (fields) {
        const fieldsList = fields.split(',').join(' ');
        result = result.select(fieldsList); // show only certain fields as prescribed by the user
    }

    const products = await result;
    return res.status(200).json(products);
};

module.exports = {
    getAllProducts,
    getAllProductsStatic
};