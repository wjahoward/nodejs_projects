const path = require('path');
const { StatusCodes } = require('http-status-codes');

const uploadProdutImage = async (req, res) => {
    let productImage = req.files.image;

    const imagePath = path.join(__dirname, '../public/uploads/' + `${productImage.name}`);

    await productImage.mv(imagePath);
    return res
            .status(StatusCodes.OK)
            .json({image:{src: `/uploads/${productImage.name}`}});
};

module.exports = {
    uploadProdutImage
};