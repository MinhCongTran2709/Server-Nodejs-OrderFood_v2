// const { mongooesToObject } = require('../../util/mongoose');
// const { mutipleMongooseToObject } = require('../../util/mongoose');
const productModel = require('../models/productModel');
const jwt = require("jsonwebtoken");
const customerModel = require("../models/customerModel");
const orderModel = require("../models/orderModel"); 
const generateToken = require('../middleware/generateToken')
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

//@ [get] /api/user/menu
//@ access public 
const menu = async (req, res) => {
    try {
        const products = await productModel.find();
        res.status(200).json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}
//@ [get] /api/user/product-detail
//@ access public 
const productDetail = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id)
        res.status(200).json(product);
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
}

//@[post] /api/user/create-order
//@desc create new order
//@access logged in
const createOrder = async (req, res) => {
    const {
        cart,
        fullName,
        address,
        phoneNumber,
        customerId,
    } = req.body

    try {
        const totalPrice = cart.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );
        const newOrder = new orderModel({
            customerId,
            products: cart,
            fullName,
            address,
            phoneNumber,
            totalPrice,
        })

        await newOrder.save()
        return res.status(200).json({
            success: true,
            message: 'Đặt hàng thành công'
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Dat hang that bai"
        })
    }
}

//@[post] /api/user/register
//@desc register user
//@access public
const register = async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPasword = await bcrypt.hash(req.body.password, salt);
    const userName = req.body.userName;

    try {

        const userNameExists = await customerModel.findOne({
            userName
        })
        if (userNameExists) {
            return res.status(403).json({
                message: "Số điện thoại đã tồn tại"
            })
        };

        const newCustomer = new customerModel({
            userName,
            email,
            password: hashedPasword,
        })

        // all good
        await newCustomer.save()
        return res.status(200).json({
            success: true,
            message: "Tạo tài khoản thành công",
        })

    } catch (error) {
        console.log(error)
        return res.status(403).json({
            success: false,
            message: "Tạo tài khoản thất bại"
        })
    }
}

//@[post] /api/user/login
//@desc login user
//@access public 
//@response account, token
const login = async (req, res) => {
    try {
        const account = await customerModel.findOne({ userName: req.body.userName })
        if (!account) {
            return res.status(403).json({ 
                success: false,
                message: "Tai khoan không tồn tại" 
            })
        }

        const validPassword = await bcrypt.compare(
            req.body.password,
            account.password
        );
        if (!validPassword) {
            return res.status(403).json({ 
                success: false,
                message: "Sai mật khẩu" 
            })
        }

        if (account && validPassword) {

            //generate token
            const token = generateToken(account)

            //remove password out of the response
            const { password, ...others } = account._doc;
            return res.status(200).json({
                success: true,
                message: "Đăng nhập thành công",
                ...others,
                token
            })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: flase,
            message: "Đăng nhập thất bại"
        })
    }
}

//@[get] /api/user/profile/:id
//@ access logged in
//@ desc profile user
const getProfile = async (req, res) => {
    try {
        const profile = await customerModel.findById(req.params.id);
        res.status(200).json(profile)
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
}


//@[put] /api/user/profile/update-profile/:id
//@ access logged in
//@ update profile user
const updateProfile = async (req, res) => {
    const { phoneNumber, email } = req.body
    try {
        const phoneNumberExsits = await customerModel.findOne(phoneNumber);
        if(phoneNumberExsits){
            return res.status(400).json({
                success: false,
                message: 'So dien thoai da ton tai'
            })
        }

        const emailExists = await customerModel.findOne(email)
        if(emailExists) {
            return res.status(400).json({
                success: false,
                message: 'Email da ton tai'
            })
        }

        await customerModel.updateOne({_id: req.params.id}, req.body);
        return res.status(200).json({
            success: true,
            message: 'Cap nhat thanh cong'
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "cap nhat that bai"
        })
    }
}

//@[get] /api/user/profile/history-order/:id
//@access logged in
//@get all user's history orders
const getHistoryOrder = async (req, res) => {
    try {
        const historyOrder = await orderModel.find({customerId: req.params.id})
        res.status(200).json(historyOrder)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Loi"
        })
    }
}

module.exports = {
    menu,
    register,
    login,
    productDetail,
    createOrder,
    updateProfile,
    getProfile,
    getHistoryOrder
}