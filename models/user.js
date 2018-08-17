const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Message = require('../models/message');

const mongooseUniqueValidator = require('mongoose-unique-validator');

const userSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    messages: [{type: Schema.Types.ObjectId, ref: 'Message'}]
});

userSchema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('User', userSchema);