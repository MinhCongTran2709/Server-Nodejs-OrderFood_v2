const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema

const Customer = new Schema({
    authFacebokId: {
        type: String,
        unique: true,
        default: null,
    },

    authGoogleId: {
        type: String,
        unique: true,
        default: null,
    },

    username: {
        type: String,
    },

    fullName: {
        type: String
    },

    password: {
        type: String,
    },

    phoneNumber: {
        type: String,
        unique: true
    },

    email: {
        type: String,
        unique: true
    },

    address: {
        type: String
    },

    avatar: {
        type: String
    },

    CID: {
        type: String,
        unique: true
    },

    role: {
        type: String,
        default: "customer"
    },

    disabled: {
        type: Boolean,
        default: false
    },

    createdAt: {
        type: Date,
        default: Date.now()
    }

},
    {
        versionKey: false,
        timestamps: true,
    }
)

module.exports = mongoose.model('customers', Customer);