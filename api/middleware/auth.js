import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

// Middleware function to protect routes, allowing only authenticated users
export const protectRoute = async (req, res, next) => {
    try {
        // Extract the token from the cookies
        const { token } = req.cookies;
        
        // If no token is found, return a 401 (Unauthorized) error
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token not found' // Error message indicating no token was provided
            });
        }
        
        // Verify the token using the JWT secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // If the token verification fails, return a 401 error
        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: 'Token is not valid' // Error message indicating the token is invalid
            });
        }
        
        // Find the user in the database using the decoded token's user ID
        const user = await User.findById(decoded.id);
        
        // If no user is found, return a 401 error
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found' // Error message indicating the user doesn't exist
            });
        }
        
        // Attach the user data to the request object for use in the next middleware or route handler
        req.user = user;
        
        // Move to the next middleware or route handler
        next();
        
    } catch (err) {
        // Log any error that occurs and return a 401 error
        console.log(err);
        res.status(401).json({
            success: false,
            message: 'Invalid token' // Error message for any issues during token validation
        });
    }
};
