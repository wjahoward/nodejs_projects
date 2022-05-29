const { StatusCodes } = require("http-status-codes");
const CustomErr = require("../errors");
const Product = require("../models/Product");
const Review = require("../models/Review");
const { checkPermission } = require("../utils");

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
    // const reviews = await Review.find();

    // if want to get other properties of that field (entity) i.e. i want to show the price and name of the product field
    const reviews = await Review.find()
                                .populate({
                                    path: 'product',
                                    select: 'name price'
                                })
                                .populate({
                                    path: 'user',
                                    select: 'email'
                                });

    res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

const getSingleReview = async (req, res) => {
    const { id } = req.params;

    const review = await Review.findById(id);

    if (!review) {
        throw new CustomErr.NotFoundError(`No review with id ${id} is found`);
    }

    res.status(StatusCodes.OK).json(review);
};

const updateReview = async (req, res) => {
    const { id } = req.params;
    const { rating, title, comment } = req.body;
    req.body.user = req.user.userId;

    const review = await Review.findById(id);

    if (!review) {
        throw new CustomErr.NotFoundError(`No reivew with id ${id} is found`);
    }

    checkPermission(req, review.user);

    review.rating = rating;
    review.title = title;
    review.comment = comment;

    await review.save();
    res.status(StatusCodes.OK).json(review);
};

const deleteReview = async (req, res) => {
    const { id } = req.params;

    const review = await Review.findById(id);

    if (!review) {
        throw new CustomErr.NotFoundError(`No reivew with id ${id} is found`);
    }

    checkPermission(req, review.user); // check if is the user is the same as the owner of that review, before deleting the review
    await review.remove();

    res.status(StatusCodes.OK).json({msg: "Success! Review removed"});
};

const getSingleProductReviews = async (req, res) => {
    const { id } = req.params;
    const reviews = await Review.find({product: id});
    res.status(StatusCodes.OK).json({length: reviews.length, data: reviews});
}

module.exports = {
    createReview,
    getAllReviews,
    getSingleReview,
    updateReview,
    deleteReview,
    getSingleProductReviews
};