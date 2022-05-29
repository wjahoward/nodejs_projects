const Product = require('../models/Product');

const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { checkPermission } = require('../utils');
const Order = require('../models/Order');

const fakeStripeAPI = async ({amount, currency}) => {
    const client_secret = 'someRandomValue';
    return {client_secret, amount};
};

const getAllOrders = async (req, res) => {
    const orders = await Order.find();
    res.status(StatusCodes.OK).json(orders);
};

const getSingleOrder = async (req, res) => {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
        throw new CustomError.NotFoundError(`No such order with id ${id}`);
    }

    checkPermission(req.user, order.user);
    res.status(StatusCodes.OK).json(order);
};

const getCurrentUserOrders = async (req, res) => {
    const orders = await Order.find({
        user: req.user.userId
    });
    res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

const createOrder = async (req, res) => {
    const { tax, shippingFees, items } = req.body;
    let orderItems = [];
    let subtotal = 0;

    if (!items || items.length < 1) {
        throw new CustomError.BadRequestError('No cart items provided');
    }

    if (!tax || !shippingFees) {
        throw new CustomError.BadRequestError('Please provide tax and shipping fee');
    }

    for (const item of items) {
        const dbProductId = item.product;
        const dbProduct = await Product.findById(dbProductId);

        if (!dbProduct) {
            throw new CustomError.NotFoundError(`No such product of id ${dbProductId} is found`);
        }

        const {name, price, image, _id} = dbProduct;
        const singleOrderItem = {
            amount: item.amount,
            name,
            price,
            image,
            product: _id
        }

        // add item to order
        orderItems = [...orderItems, singleOrderItem];

        // calculate subtotal
        subtotal += item.amount * price;
    }

    const total = tax + shippingFees + subtotal;
    // get client secret
    const paymentIntent = await fakeStripeAPI({
        amount: total,
        currency: 'usd'
    });

    const order = await Order.create({
        orderItems, 
        total,
        subtotal,
        tax,
        shippingFees,
        clientSecret: paymentIntent.client_secret,
        user: req.user.userId
    });

    res.status(StatusCodes.CREATED).json({order, clientSecret: order.clientSecret});
};

const updateOrder = async (req, res) => {
    const { id } = req.params;
    const { paymentIntentId } = req.body;

    const order = await Order.findById(id);

    if (!order) {
        throw new CustomError.NotFoundError(`No order with id ${id}`);
    }

    checkPermission(req.user, order.user);

    order.paymentIntentId = paymentIntentId;
    order.status = 'paid';
    await order.save();
};

module.exports = {
    getAllOrders,
    getSingleOrder,
    getCurrentUserOrders,
    createOrder,
    updateOrder
};