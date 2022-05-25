const { StatusCodes } = require("http-status-codes");
const Product = require("../models/Product");
const CustomErr = require("../errors");

const createProduct = async (req, res) => {
    req.body.user = req.user.userId;
    const product = await Product.create(req.body);
    res.status(StatusCodes.OK).json(product);
};

const getAllProducts = async (req, res) => {
    const products = await Product.find();
    res.status(StatusCodes.OK).json(products);
};

const getSingleProduct = async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    
    if (!product) {
        throw new CustomErr.NotFoundError(`No such product of id ${id} is found`);
    }

    res.status(StatusCodes.OK).json(product);
};

const updateProduct = async (req, res) => {
    const { id } = req.params;

    const product = await Product.findOneAndUpdate({
        _id: id},
        req.body,
        {
            new: true,
            runValidators: true
        }
    );

    if (!product) {
        throw new CustomErr.NotFoundError(`No such product of id ${id} is found`);
    }

    res.status(StatusCodes.OK).json(product);
    
};

const deleteProduct = async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    
    if (!product) {
        throw new CustomErr.NotFoundError(`No such product of id ${id} is found`);
    }

    await product.remove();
    res.status(StatusCodes.OK).json({msg: "Product has been removed"});
};

const uploadImage = async (req, res) => {
    res.send("upload image");
};

module.exports = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImage
};