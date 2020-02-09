var mongoose = require('mongoose')
var unique_validator = require('mongoose-unique-validator')
var crypto = require('crypto')
var jwt = require('jsonwebtoken');
var secret = "some random string used for jwt"

const userSchema = new mongoose.Schema({
    username: {
        type: String, 
        lowercase: true, 
        unique: true, 
        required: [true, "can't be blank"], 
        index: true
    },
    email: {
        type: String, 
        lowercase: true,
        unique: true, 
        required: [true, "can't be blank"], 
        match: [/\S+@\S+\.\S+/, 'is invalid'],
        index: true
    },
    hash: String,
    salt: String,
    is_staff: {
        type: Boolean,
        default: false,
    }
});

userSchema.plugin(unique_validator, {'message': 'already taken.'})
userSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex')
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
}
userSchema.methods.validate_password = function(password){
    var given_hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
    return this.hash === given_hash
}
userSchema.methods.generateJWT = function() {
    var today = new Date()
    var exp = new Date(today)
    exp.setDate(today.getDate() + 60)

    return jwt.sign({
        id: this._id,
        username: this.username,
        exp: parseInt(exp.getTime() / 1000),
        is_staff: this.is_staff,
    }, secret)
}
userSchema.methods.toAuthJSON = function() {
    return {
        username: this.username,
        email : this.email,
        token: this.generateJWT(),
        is_staff: this.is_staff,
    }
}

const User = mongoose.model('User', userSchema)

module.exports = User;