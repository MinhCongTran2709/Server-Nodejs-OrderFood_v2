const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema

const Product = new Schema({
    productName: {
        type: String,
    },

    category: {
        type: String,
    },

    image: {
        type: String,
    },

    starRating: {
        type: Schema.Types.ObjectId,
        ref: 'revi'
    },

    price: {
        type: Number,
    },

    createdAt: {
        type: Date,
        default: Date.now(),
    },

    deleted: {
        type: Boolean,
        default: false,
    }
},
    {
        versionKey: false,
        timestamps: true,
    }
)

Product.plugin(mongooseDelete, { overrideMethods: "all" });

module.exports = mongoose.model('products', Product);