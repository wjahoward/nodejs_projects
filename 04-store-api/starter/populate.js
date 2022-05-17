// populate sample data into MongoDB

require('dotenv').config();

const connectDB = require('./db/connect');
const Product = require('./models/product');

const productsJson = require('./products.json');

const startPopulating = async () => {
    try {
        console.log("start populating");
        await connectDB(process.env.MONGO_URI);
        await Product.deleteMany(); // cleans the entire Product table first before populating
        await Product.create(productsJson);
        console.log("done populating");
    } catch (err) {
        console.log(err);
    }
};

startPopulating();