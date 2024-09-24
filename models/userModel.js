const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return v.length >= 6; // Example validation: password must be at least 6 characters long
            },
            message: props => `${props.value} is not a valid password! Password must be at least 6 characters long.`
        }
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
