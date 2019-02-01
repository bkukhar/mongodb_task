const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const article = new Schema({
        title: {type: String, minlength: 5, maxlength: 400, required: true, text: true},
        subtitle: {type: String, minlength: 5, required: false},
        description: {type: String, minlength: 5, maxlength: 5000, required: true},
        owner: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }],
        category: {
            type: String,
            enum: ['sport', 'games', 'history'],
            description: "can only be one of the enum values",
            required: true
        },
        createdAt: {type: Date, default: Date.now, required: true},
        updatedAt: {type: Date, default: Date.now, required: true}
    },
    {
        collection: 'articles'
    });

// article.set('validateBeforeSave', false);

module.exports = mongoose.model('Article', article);