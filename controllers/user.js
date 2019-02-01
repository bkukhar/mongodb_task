const User = require('../models/user');
const Article = require('../models/article');

module.exports = {
    createUser: function createUser(req, res) {
        const Joi = require('joi');
        const schema = Joi.object().keys({
            firstName: Joi.string().min(4).max(50).required(),
            lastName: Joi.string().min(3).max(60).required()
        });
        const data = req.body;

        Joi.validate(data, schema, (err) => {
            if (err) {
                res.status(400).json({
                    status: 'error',
                    message: 'Invalid request data: Please make sure that firstName and lastName are not empty',
                    data: data
                });
            } else {
                User.create(
                    {
                        firstName: req.body.firstName,
                        lastName: req.body.lastName
                    },
                    function (error, user) {
                        res.status(200).json({
                            status: 'success',
                            message: 'User was created successfully',
                            data: user
                        });
                    })
            }
        });
    },

    getUsers: function getUsers(req, res, next) {
        User.find(function (err, users) {
            if (err) {
                return next(new Error(err))
            }
            res.json(users)
        })
    },

    getUser: function getUser(req, res, next) {
        const id = req.params.id;
        User.findOne({_id: id})
            .then(user => {
                if (!user) {
                    res.status(400).json({
                        status: 'error',
                        message: 'User with this id cannot be found'
                    })
                } else {
                    res.json(user)
                }
            })
    },

    getUserArticles: function getUserArticles(req, res, next) {
        const id = req.params.id;
        User.findOne({_id: id})
            .then(user => {
                if (!user) {
                    res.status(400).json({
                        status: 'error',
                        message: 'User with this id cannot be found'
                    })
                } else {
                    Article.find({owner: id}, function (error, articles) {
                        if (error) {
                            return next(new Error(error))
                        }
                        res.json(articles)
                    });
                }
            })
    },

    updateUser: function updateUser(req, res) {
        const id = req.params.id;
        User.findOne({_id: id})
            .then(user => {
                if (!user) {
                    res.status(400).json({
                        status: 'error',
                        message: 'User with this id cannot be found'
                    })
                } else {
                    User.findById(id, function (error, user) {
                        if (req.body.firstName) user.firstName = req.body.firstName;
                        if (req.body.lastName) user.lastName = req.body.lastName;
                        user.save({
                            function (error, user) {
                                if (error) {
                                    res.status(400).send('Cannot update user information')
                                } else {
                                    res.status(200).json(user)
                                }
                            }
                        });

                        res.status(200).json({
                            status: 'success',
                            message: 'User information was updated successfully',
                            data: user
                        });
                    });
                }
            })
    },

    deleteUser: function deleteUser(req, res) {
        const id = req.params.id;
        User.findOneAndDelete({_id: id}, function (err, user) {
            if (!user) {
                res.status(400).json({
                    status: 'error',
                    message: 'User with ' + id + ' id cannot be found'
                })
            } else {
                res.json('User was successfully removed: ' + user.firstName)
            }
        })
    }
};
