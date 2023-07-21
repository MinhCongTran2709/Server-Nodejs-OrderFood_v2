const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;

const Order = new Schema({
    customerId: {
        type: Schema.Types.ObjectId,
        ref: "customers"
    },

    fullName: {
        type: String,
    },

    address: {
        type: String,
    },

    phoneNumber: {
        type: String,
    },

    products: [
        {
            productId: {
                type: Schema.Types.ObjectId,
                ref: "products"
            },

            productName: {
                type: Schema.Types.String,
                ref: "products"
            },

            quanlity: {
                type: Number,
            },

            unitPrice: {
                type: Schema.Types.Number,
                ref: "products"
            }
        }
    ],

    totalPrice: {
        type: Number,
    },

    status: {
        type: String,
        default: "Chờ xác nhận"
    },

    createdAt: {
        type: Date,
        default: Date.now()
    },


    deliveredAt: {
        type: Date,
        default: Date.now()
    },

    receivedAt: {
        type: Date,
        default: Date.now()
    }
},
    {
        versionKey: false,
        timestamps: true,
    }
)

Order.plugin(mongooseDelete, { overrideMethods: "all" });

module.exports = mongoose.model('orders', Order);