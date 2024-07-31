const Joi = require('joi');

const taskSchemaIsValid = Joi.object({
    name: Joi.string().min(5).required().messages({
        'string.base': 'Task name must be a string!',
        'string.min': 'Task name must be at least 5 characters long!',
        'any.required': 'Task name is required!'
    }),
    description: Joi.string().max(200).required().messages({
        'string.base': 'Description must be a string!',
        'string.max': 'Description must be no more than 200 characters long!',
        'any.required': 'Description is required!'
    }),
    deadline: Joi.date().iso().required().messages({
        'date.base': 'Deadline must be a valid date!',
        'date.format': 'Deadline must be in ISO format (YYYY-MM-DD)!',
        'any.required': 'Deadline is required!'
    }),
    image: Joi.string().required().messages({
        'any.required': 'Image is required!'
    })
    // image: Joi.string().uri()
});   

const emailPattern = /^[^\s@]+@[a-z]+\.[a-z]+$/;

const userSchemaIsValid = Joi.object({
    username: Joi.string().min(3).required().messages({
        'string.base': 'Username must be a string!',
        'string.min': 'Username must be at least 3 characters long!',
        'any.required': 'Username is required!'
    }),
    email: Joi.string().pattern(emailPattern).required().messages({
        'string.pattern.base': 'Invalid email address format!',
        'any.required': 'Email is required!'
    }),
    password: Joi.string().min(6).required().messages({
        'string.base': 'Password must be a string!',
        'string.min': 'Password must be at least 6 characters long!',
        'any.required': 'Password is required!'
    }),
    repass: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.only': 'Passwords do not match!',
        'any.required': 'Confirm password is required!'
    })
});

module.exports = { userSchemaIsValid, taskSchemaIsValid };
