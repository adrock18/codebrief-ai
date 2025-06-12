// server/controllers/userController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- User Registration ---
exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. Check if user already exists
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        // 2. Create a new user instance
        user = new User({ username, password });

        // 3. Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // 4. Save the user to the database
        await user.save();

        res.status(201).json({ message: 'User registered successfully!' });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

// --- User Login ---
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. Check if the user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        // 2. Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        // 3. If credentials are correct, create a JWT token
        const payload = {
            user: {
                id: user.id // Add user's unique DB id to the payload
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET, // Your secret key from .env
            { expiresIn: '3h' },   // Token expires in 3 hours
            (err, token) => {
                if (err) throw err;
                res.json({ token }); // Send the token back to the client
            }
        );

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};