const ErrorHandler = require('./../utilities/errorHandler')
const bcrypt = require('bcryptjs')
const helper = require('./../utilities/helper')
const User = require('./../models/userModel')

exports.signUp = async(req, res, next)=>{
    try {
        const {name, email, password } = req.body
        const hash = await helper.getHashPassword(password)
        if(!name || !email || !password){
            return next(new ErrorHandler('Please provide a valid input.'))
        }
        req.body.password = hash

        const user = await User.create(req.body)
        if(user && user._id){
            res.json({
                success: true,
                data: user
            })
        }else{
            return next(new ErrorHandler('Failed to create user.'))
        }
    } catch (err) {
        return next(err)
    }
}


exports.login = async(req, res, next)=>{
    try {
        const { email, password } = req.body;
        const user = await User.findOne({email});
        if (!user) {
            return next(new ErrorHandler('User not found', 404))
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return next(new ErrorHandler('Invalid credentials', 400));
        }
        
        console.log(user)
        const token = helper.getToken({_id: user._id, email: user.email})
        console.log(token)
        res.json({
            success: true,
            data: user,
            token: token
        })
    } catch (err) {
        return next(err)
    }
}


exports.me = async(req, res, next)=>{
    try {
        const user = req.user
        if(user && user._id){
            res.json({
                success: true,
                data: user
            })
        }else{
            return next(new ErrorHandler('Unauthorized', 401));
        }
    } catch (err) {
        return next(err)
    }
}

