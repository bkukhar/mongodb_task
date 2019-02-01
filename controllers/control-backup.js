const Article = require('../models/article');
const User = require('../models/user');

module.exports = {
    createArticle: function createArticle(req, res) {
        const Joi = require('joi');
        const schema = Joi.object().keys({
            title: Joi.string().min(5).max(400).required(),
            description: Joi.string().min(5).max(5000).required(),
            owner: Joi.string().required(),
            category: Joi.required()
            // createdAt: Joi.required(),
            // updatedAt: Joi.required()
        });
        const data = req.body;

        Joi.validate(data, schema, (err) => {
            if (err) {
                res.status(400).json({
                    status: 'error',
                    message: 'Please make sure that tittle, description, owner and category fields are not empty',
                    data: data
                });
            } else {
                Article.create(
                    {
                        title: req.body.title,
                        subtitle: req.body.subtitle,
                        description: req.body.description,
                        owner: req.body.owner,
                        category: req.body.category
                    },
                    function (error, article) {

                        res.status(200).json({
                            status: 'success',
                            message: 'Article was created successfully',
                            data: article
                        });
                    });
                const owner=req.body.owner;
                User.findById(owner, function (error, user) {
                    const change = user.numberOfArticles;
                    user.numberOfArticles = change+1;
                    user.save({
                        function (error, user) {
                            if (error) {
                                res.status(400).send('Cannot update user info')
                            } else {
                                res.status(200).json(user)
                            }
                        }
                    });

                    res.status(200).json({
                        status: 'success',
                        message: 'User info was updated successfully',
                        data: user
                    });
                });
            }
        });
    },

    getArticles: function getUsers(req, res, next) {
        Article.find(function (err, articles) {
            if (err) {
                return next(new Error(err))
            }
            res.json(articles)
        })
    },

    updateArticles:
};