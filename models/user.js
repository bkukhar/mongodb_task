const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = new Schema({
        firstName: {type: String, minlength: 4, maxlength: 50, required: true},
        lastName: {type: String, minlength: 3, maxlength: 60, required: true},
        role: {type: String, enum: ['admin', 'writer', 'guest']},
        createdAt: {type: Date, default: Date.now},
        numberOfArticles: {type: Number, default: 0, required: false},
        nickname: {type: String, required: false}
    },
    {
        collection: 'users'
    });

user.set('validateBeforeSave', false);

module.exports = mongoose.model('User', user);