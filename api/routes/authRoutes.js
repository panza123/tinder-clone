import express from 'express';
import { login, logout, signup } from '../controller/auth.controller.js';
import { protectRoute } from '../middleware/auth.js';

const router = express.Router();

// Route for user signup
router.post("/signup", signup);

// Route for user login
router.post("/login", login);

// Route for user logout
router.post("/logout", logout);

// Route to get user profile information (protected route)
router.get("/me", protectRoute, (req, res) => {
    // Respond with the user data if the request is authenticated
    res.status(200).json({
        success: true,
        user: req.user // Send the authenticated user's information
    });
});

export default router;
