const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'Please provide rating']
    },
    title: {
        type: String,
        trim: true,
        required: [true, 'Please provide review title'],
        maxlength: 100
    },
    comment: {
        type: String,
        required: [true, 'Please provide review text']
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Types.ObjectId,
        ref: 'Product',
        required: true
    }
}, {
    timestamps: true
});

// compound index is restricting the user on how many times
// a user can create it
// for example, in this example, we want the user to only have
// 1 review for 1 product
ReviewSchema.index({ user: 1, product: 1 }, { unique: true });

ReviewSchema.statics.calculateAverageRating = async function (productId) {
    const result = await this.aggregate([
        {$match:{product:productId}},
        {$group:{
            _id:null,
            averageRating:{ $avg:'$rating' },
            numOfReviews: { $sum: 1 }
        }}
    ]);
    try {
        await this.model('Product').findOneAndUpdate(
            { _id: productId },
            {
                averageRating: Math.ceil(result[0]?.averageRating || 0), // the '?' is included in case if there are no more reviews of that product
                numOfReviews: result[0]?.numOfReviews || 0
,            }
        );
    } catch (err) {
        console.log(err); 
    }
};

ReviewSchema.post('save', async function() {
    await this.constructor.calculateAverageRating(this.product); 
});

ReviewSchema.post('remove', async function () {
    await this.constructor.calculateAverageRating(this.product);
});

module.exports = mongoose.model('Review', ReviewSchema);