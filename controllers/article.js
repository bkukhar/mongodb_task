const Article = require('../models/article');
const User = require('../models/user');

module.exports = {
    createArticle: function createArticle(req, res) {
        const Joi = require('joi');
        const schema = Joi.object().keys({
            title: Joi.string().min(5).max(400).required(),
            description: Joi.string().min(5).max(5000).required(),
            owner: Joi.string().required(),
            subtitle: Joi.string().optional(),
            category: Joi.string().valid(['sport', 'games', 'history']).required()
        });
        const data = req.body;

        Joi.validate(data, schema, (err) => {
            if (err) {
                res.status(400).json({
                    status: 'error',
                    message: 'Sorry, please make sure that tittle, description, owner and category fields are not empty',
                    requirements: {
                        category: 'field can accept only one of these values: sport, games or history',
                        title: 'should not be shorter that 5 characters',
                        description: 'minimal length 5 characters',
                        owner: 'user id of article owner',
                        recommendation: 'Please make sure that all fields fit the requirements and try send again'
                    },
                    data: data
                });
            } else {
                const owner = req.body.owner;
                User.findOne({_id: owner})
                    .then(user => {
                        if (!user) {
                            return res.status(400).json({
                                status: 'error',
                                message: 'User with this id cannot be found'
                            })
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
                                    User.findById(owner, function (error, user) {
                                        const change = user.numberOfArticles;
                                        user.numberOfArticles = change + 1;
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
                                            message: 'Article was created successfully',
                                            data: article,
                                            userinfo: user
                                        });
                                    });


                                });
                        }
                    })
            }
        });
    },

    getArticles: function getArticles(req, res, next) {
        const title = req.body.title;
        const subtitle = req.body.subtitle;
        const description = req.body.description;
        const owner = req.body.owner;
        const category = req.body.category;
        if (title) {
            Article.find({title: title}, function (error, articles) {
                if (error) {
                    res.status(400).json('Cannot find article with this title')
                } else {
                    res.json(articles)
                }
            });
        } else if (owner) {
            Article.find({owner: owner}, function (error, articles) {
                if (error) {
                    return next(new Error(error))
                }
                res.json(articles)
            });
        } else if (description) {
            Article.find({description: description}, function (error, articles) {
                if (error) {
                    return next(new Error(error))
                }
                res.json(articles)
            });
        } else if (subtitle) {
            Article.find({subtitle: subtitle}, function (error, articles) {
                if (error) {
                    return next(new Error(error))
                }
                res.json(articles)
            });
        } else if (category) {
            Article.find({subtitle: category}, function (error, articles) {
                if (error) {
                    return next(new Error(error))
                }
                res.json(articles)
            });
        } else {
            Article.find(function (err, articles) {
                if (err) {
                    return next(new Error(err))
                }
                res.json(articles)
            })
        }

    },

    updateArticle: function updateArticle(req, res) {
        const id = req.params.id;
        Article.findOne({_id: id})
            .then(article => {
                if (!article) {
                    res.status(400).json({
                        status: 'error',
                        message: 'Article with this id cannot be found'
                    })
                } else {
                    Article.findById(id, function (error, article) {
                        if (req.body.title) article.title = req.body.title;
                        if (req.body.subtitle) article.subtitle = req.body.subtitle;
                        if (req.body.description) article.description = req.body.description;
                        article.updatedAt = Date.now();
                        article.save({
                            function (error, article) {
                                if (error) {
                                    res.status(400).send('Cannot update article')
                                } else {
                                    article.updatedAt = Date.now;
                                    res.status(200).json(article)
                                }
                            }
                        });

                        res.status(200).json({
                            status: 'success',
                            message: 'Article was updated successfully',
                            data: article
                        });
                    });
                }
            })
    },

    deleteArticle: function deleteArticle(req, res) {
        const id = req.params.id;
        Article.findOneAndDelete({_id: id}, function (err, article) {
            if (!article) {
                res.status(400).json({
                    status: 'error',
                    message: 'Article with ' + id + ' id cannot be found'
                })
            } else {
                const owner = article.owner;
                User.findById(owner, function (error, user) {
                    const change = user.numberOfArticles;
                    user.numberOfArticles = change - 1;
                    user.save({
                        function (error, user) {
                            if (error) {
                                res.status(400).send('Cannot update user info')
                            } else {
                                res.status(200).json(user)
                            }
                        }
                    });
                    res.json('Article was successfully removed: ' + article.title)
                })
            }
        })
    }
};