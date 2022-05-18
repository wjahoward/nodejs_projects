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
    const { feature, company, name, sort, fields, numericFilters } = req.query; // filter criteria
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

    // numeric filters https://localhost:3000/api/v1/products?numericFilters=price>40,rating>=4.5
    if (numericFilters) {
        const operatorMap = {
          '>': '$gt',
          '>=': '$gte',
          '=': '$eq',
          '<': '$lt',
          '<=': '$lte',
        };
        const regEx = /\b(<|>|>=|=|<|<=)\b/g;
        let filters = numericFilters.replace(regEx,
              (match) => `-${operatorMap[match]}-`);
        const options = ['price', 'rating'];
        filters = filters.split(',').forEach((item) => {
            const [field, operator, values] = item.split('-');
            if (options.includes(field)) {
                queryObject[field] = { [operator]: Number(value) };
            }
        });
        console.log(filters);
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

    // pagination
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit;

    result = result.skip(skip).limit(limit);

    const products = await result;
    return res.status(200).json(products);  
};

module.exports = {
    getAllProducts,
    getAllProductsStatic
};