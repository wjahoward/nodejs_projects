const { StatusCodes } = require("http-status-codes");
const Product = require("../models/Product");
const CustomErr = require("../errors");
const path = require('path');

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
    if (!req.files) {
        throw new CustomErr.BadRequestError('No File Uploaded');
    }

    const productImage = req.files.image;

    if (!productImage.mimetype.startsWith('image')) {
        throw new CustomErr.BadRequestError('Please Upload Image');
    }

    const maxSize = 1024 * 1024;

    if (productImage.size > maxSize) {
        throw new CustomErr.BadRequestError(`Please upload
        image smaller than 1MB`);
    }

    const imagePath = path.join(__dirname, `./public/uploads/${productImage.name}`);
    await productImage.mv(imagePath);
    res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}`});
};

module.exports = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImage
};