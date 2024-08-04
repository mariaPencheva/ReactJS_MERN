const bcrypt = require('bcryptjs');
const { User } = require('../models/User');
const { createToken } = require('../utils/jwtUtils');

const { userSchemaIsValid } = require('../utils/validationSchemas');

exports.signup = async (req, res) => {
    const { error } = userSchemaIsValid.validate(req.body);

    if (error) {
        console.error('Validation error:', error.details[0].message);
        return res.status(400).send(error.details[0].message);
    }

    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        const token = createToken(user);
        res.status(201).json({ token, user });

    } catch (error) {
        // console.error('Error registering user:', error);
        res.status(500).send('Error registering user');
    }
};

exports.signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).send('User does not exist!');
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).send('Password does not match');
        }

        const token = createToken(user);

        res.json({
            token,
            user: {
                _id: user._id,
                username: user.username,
                createdTasks: user.createdTasks,
                takenTasks: user.takenTasks,
                completedTasks: user.completedTasks
            }
        });

    } catch (error) {
        console.error('Error during signin:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getProfile = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).send('User not authenticated');
        }

        const user = await User.findById(req.user._id).select('_id username');

        if (!user) {
            return res.status(404).send('User not found');
        }

        res.json({ _id: user._id, username: user.username });
    } catch (error) {
        console.error('Error fetching user data from Server:', error);
        res.status(500).send('Error fetching user data');
    }
};

