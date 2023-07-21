const { mongooesToObject } = require('../../util/mongoose');
const { mutipleMongooseToObject } = require('../../util/mongoose');
const productModel = require('../models/productModel');
const jwt = require("jsonwebtoken");
const customerModel = require("../models/customerModel");
const generateToken = require('../middleware/generateToken')
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();


const menu = async (res) => {
    try {
        const products = await productModel.find();
        res.status(200).json({
            menu: mutipleMongooseToObject(products),
        })
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const productDetail = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id)
        res.status(200).json(product);
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
}

const createOrder = async (req, res) => {

}

//[post] /api/user/register
const register = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPasword = await bcrypt.hash(req.body.password, salt);
        const {
            phoneNumber, email
        } = req.body;

        const phoneNumberExists = await customerModel.findOne({
            phoneNumber
        })
        if (phoneNumberExists) {
            return res.status(403).json({
                message: "Số điện thoại đã tồn tại"
            })
        };

        const emailExists = await customerModel.findOne({
            email
        })
        if (emailExists) {
            return res.status(403).json({
                message: "Email đã tồn tại"
            })
        }

        const newCustomer = new customerModel({
            phoneNumber,
            email,
            password: hashedPasword,
        })

        await newCustomer.save()
        return res.status(200).json({
            message: "Tạo tài khoản thành công",
        })

    } catch (error) {
        console.log(error)
        return res.status(404).json({
            message: "Tạo tài khoản thất bại"
        })
    }
}

//[post] /api/user/login
const login = async (req, res) => {
    try {
        const account = await customerModel.findOne({ phoneNumber: req.body.phoneNumber })
        if (!account) {
            return res.status(404).json({ message: "Số điện thoại không tồn tại" })
        }

        const validPassword = await bcrypt.compare(
            req.body.password,
            account.password
        );
        if (!validPassword) {
            return res.status(401).json({ message: "Sai mật khẩu" })
        }

        if (account && validPassword) {
            const token = generateToken(account)

            //loại bỏ thuộc tính password ra khỏi object account khi response
            const { password, ...others } = account._doc;
            return res.status(200).json({
                message: "Đăng nhập thành công",
                ...others,
                token
            })
        }

    } catch (error) {
        console.log(error)
        return res.status(403).json({
            message: "Đăng nhập thất bại"
        })
    }
}

//[get] /api/user/profile/:id
const getProfile = async (req, res) => {
    try {
        const profile = await customerModel.findById(req.params.id);
        res.status(200).json(profile)
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
}

const updateProfile = async (req, res) => {

}

module.exports = {
    menu,
    register,
    login,
    productDetail,
    createOrder,
    updateProfile,
    getProfile,
}