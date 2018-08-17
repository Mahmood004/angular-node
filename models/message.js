const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('../models/user');

const messageSchema = new Schema({
    content: {type: String, required: true},
    user: {type: Schema.Types.ObjectId, ref: 'User'}
});

messageSchema.post('remove', function(message) {
    console.log('inside post operation method')
    User.findById(message.user, function(err, user) {
        if (err) {
            return res.status(500).json({
                title: 'An error occured post operation',
                error: err
            });
        }
        console.log(message);
        user.messages.pull(message);
        user.save();
    })
})

module.exports = mongoose.model('Message', messageSchema);