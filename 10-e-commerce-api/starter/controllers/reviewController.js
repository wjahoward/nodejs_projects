const { StatusCodes } = require("http-status-codes");
const CustomErr = require("../errors");
const Product = require("../models/Product");
const Review = require("../models/Review");

const createReview = async (req, res) => {
    const { product } = req.body;
    req.body.user = req.user.userId;

    const isProductValid = await Product.findById(product);

    // check if product is available
    if (!isProductValid) {
        throw new CustomErr.NotFoundError(`No product with id ${product} is found`);
    }

    // check if user has already made a review
    const isReviewValid = await Review.findOne({
        product: product,
        user: req.body.user
    });

    if (isReviewValid) {
        throw new CustomErr.BadRequestError(`You have already submitted a review on this product`);
    }

    const review = await Review.create(req.body);
    res.status(StatusCodes.CREATED).send(review);
};

const getAllReviews = async (req, res) => {
    console.log(req);
    res.send("get all reviews");
};

const getSingleReview = async (req, res) => {
    res.send("get single review");
};

const updateReview = async (req, res) => {
    res.send("update review");
};

const deleteReview = async (req, res) => {
    res.send("delete review");
};

module.exports = {
    createReview,
    getAllReviews,
    getSingleReview,
    updateReview,
    deleteReview
};