const getAllOrders = async (req, res) => {
    res.send("get all orders");
};

const getSingleOrder = async (req, res) => {
    res.send("get single order");
};

const getCurrentUserOrders = async (req, res) => {
    res.send("get current user order");
};

const createOrder = async (req, res) => {
    res.send("create an order");
};

const updateOrder = async (req, res) => {
    res.send("update an order");
};

module.exports = {
    getAllOrders,
    getSingleOrder,
    getCurrentUserOrders,
    createOrder,
    updateOrder
};