import User from "../models/user.model.js";
import jwt from 'jsonwebtoken';

// Function to generate a JWT token
const signToken = (id) => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return token;
}

// Signup controller
export const signup = async (req, res) => {
    const { name, email, password, age, gender, genderPreference } = req.body;

    try {
        // Validate required fields
        if (!email || !password || !age || !gender || !genderPreference) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Validate age
        if (age < 18) {
            return res.status(400).json({
                success: false,
                message: 'You must be at least 18 years old'
            });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            });
        }

        // Create new user
        const newUser = await User.create({
            name,
            email,
            password,
            age,
            gender,
            genderPreference
        });

        // Generate token
        const token = signToken(newUser._id);

        // Set cookie with token
        res.cookie("token", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
            httpOnly: true, // client-side cannot access cookie
            secure: process.env.NODE_ENV === 'production',  // only set cookie over HTTPS in production
            sameSite: "strict"
        });

        // Send response
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: newUser
        });

    } catch (err) {
        console.error('Error in signup', err);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Login controller
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Find user by email and include password field
        const user = await User.findOne({ email }).select('+password');

        // Validate user and password
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate token
        const token = signToken(user._id);

        // Set cookie with token
        res.cookie("token", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // only set cookie over HTTPS in production
            sameSite: "strict"
        });

        // Send response
        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            user
        });

    } catch (err) {
        console.error('Error in login', err);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Logout controller
export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({
        success: true,
        message: 'User logged out successfully'
    });
};
