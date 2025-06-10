const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const Joi = require("joi")
const passwordComplexity = require("joi-password-complexity")

const userSchema = new mongoose.Schema({
    nick: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    premium_account: {type: Boolean, default: false}
})

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    })
    return token
}

const User = mongoose.model("User", userSchema)

const validate = (data) => {
    const schema = Joi.object({
        nick: Joi.string().min(3).max(30).required().label("Nick name"),
        email: Joi.string().email().required().label("Email"),
        password: passwordComplexity().required().label("Password"),
    })
    return schema.validate(data)
}

const validateLogin = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.required().label("Password"),
    })
    return schema.validate(data)
}

module.exports = { User, validate, validateLogin}