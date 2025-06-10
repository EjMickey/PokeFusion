const { User, validate, validateLogin } = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi')

exports.register = async (req, res) => {
    try {
        const { error } = validate(req.body)
        if (error)
            return res.status(400).send({ message: error.details[0].message })
        const user = await User.findOne({ email: req.body.email })

        if (user)
            return res
                .status(409)
                .send({ message: "User with given email already Exist!" })
        const salt = await bcrypt.genSalt(Number(process.env.SALT))
        const hashPassword = await bcrypt.hash(req.body.password, salt)
        await new User({ ...req.body, password: hashPassword }).save()
        res.status(201).send({ message: "User created successfully" })
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "Internal Server Error" })
    }
};

exports.login = async (req, res) => {
    try {
        const { error } = validateLogin(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message })
        const user = await User.findOne({ email: req.body.email })
        if (!user)
            return res.status(401).send({ message: "Invalid Email or Password" })
        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        )
        if (!validPassword)
            return res.status(401).send({ message: "Invalid Email or Password" })
        const token = user.generateAuthToken();
        res.status(200).send({ data: token, message: "logged in successfully" })
        console.log('logged in successfully')
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "Internal Server Error" })
    }
};

exports.getUser = async (req, res) => {
    console.log("Moj profil");
    res.send("Mój profil");
};


exports.getPremium = async (req, res) => {
    try {
        const user = await User.findById({_id: req.user._id});
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        if (user.premium_account) {
            return res.status(200).send({ message: 'premium' });
        } else {
            return res.status(200).send({ message: 'nonpremium' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Server error' });
    }
};

exports.patchPremium = async(req, res) =>{
    try{
        const user = await User.findById({_id: req.user._id});
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        if (user.premium_account) {
            await User.findOneAndUpdate({_id: req.user._id}, {premium_account: false})
            return res.status(200).send({ message: 'changed to nonpremium' });
        } else {
            await User.findOneAndUpdate({_id: req.user._id}, {premium_account: true})
            return res.status(200).send({ message: 'changed to premium' });
        }
    }
    catch(err){
        console.error(err)
    }
}