// Import the User model for database operations
import User from "../models/user.model.js";
import { getConnectedUsers, getIO } from "../socket/socket.server.js";

// Function to handle 'swipe right' action (liking a user)
export const swipeRight = async (req, res) => {
    try {
        const { likedUserId } = req.params; // Extract the ID of the liked user from request parameters
        const currentUser = await User.findById(req.user.id); // Find the current user by ID
        const likedUser = await User.findById(likedUserId); // Find the liked user by their ID

        // Check if the liked user exists
        if (!likedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found' // Error message for non-existent user
            });
        }

        // If the liked user is not already in the current user's likes list
        if (!currentUser.likes.includes(likedUserId)) {
            currentUser.likes.push(likedUserId); // Add liked user to current user's likes array
            await currentUser.save(); // Save the updated current user

            // If the liked user has also liked the current user, create a match
            if (likedUser.likes.includes(currentUser.id)) {
                currentUser.matches.push(likedUserId); // Add liked user to current user's matches
                likedUser.matches.push(currentUser.id); // Add current user to liked user's matches
                
                // Save both users' data concurrently
                await Promise.all([
                    currentUser.save(),
                    likedUser.save()
                ]);

                // TODO: Send a notification when a match is made (not implemented yet)
                 
                const connectedUsers = getConnectedUsers(); // Get connected users from socket server
                const io = getIO(); // Get the Socket.IO instance

                // Check if the liked user is connected, and send a notification
                const likedUserSocketId = connectedUsers.get(likedUserId);
                if (likedUserSocketId) {
                    io.to(likedUserSocketId).emit("newMatch", {
                        _id: currentUser._id,
                        name: currentUser.name,
                        image: currentUser.image
                    });
                }

                // Check if the current user is connected, and send a notification
                const currentUserSocketId = connectedUsers.get(currentUser._id.toString());
                if (currentUserSocketId) {
                    io.to(currentUserSocketId).emit("newMatch", {
                        _id: likedUser._id,
                        name: likedUser.name,
                        image: likedUser.image
                    });
                }
            }
        }

        // Return a successful response with the updated user data
        res.status(200).json({
            success: true,
            user: currentUser // Return the updated current user object
        });
    } catch (err) {
        // Handle server errors
        res.status(500).json({
            success: false,
            message: 'Internal server error' // General error message
        });
        console.log(err); // Log the error for debugging
    }
};

// Function to handle 'swipe left' action (disliking a user)
export const swipeLeft = async (req, res) => {
    try {
        const { dislikedUserId } = req.params; // Extract the ID of the disliked user from request parameters
        const currentUser = await User.findById(req.user.id); // Find the current user by ID

        // If the disliked user is not already in the dislikes list
        if (!currentUser.dislikes.includes(dislikedUserId)) {
            currentUser.dislikes.push(dislikedUserId); // Add disliked user to dislikes array
            await currentUser.save(); // Save the updated current user
        }

        // Return a successful response with the updated user data
        res.status(200).json({
            success: true,
            user: currentUser // Return the updated current user object
        });
    } catch (err) {
        // Handle server errors
        res.status(500).json({
            success: false,
            message: 'Internal server error' // General error message
        });
        console.log(err); // Log the error for debugging
    }
};

// Function to get all matched users for the current user
export const getMatches = async (req, res) => {
    try {
        // Find the current user and populate the 'matches' field with specific details (name, image)
        const user = await User.findById(req.user.id).populate("matches", "name image");

        // Return a successful response with the matched users
        res.status(200).json({
            success: true,
            matches: user.matches // Return the list of matches
        });
    } catch (err) {
        // Handle server errors
        res.status(500).json({
            success: false,
            message: 'Internal server error' // General error message
        });
        console.log(err); // Log the error for debugging
    }
};

// Function to get a list of user profiles based on certain filters
export const getUserProfile = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id); // Find the current user by ID

        // Find other users based on specific filters:
        // 1. Exclude current user
        // 2. Exclude users already liked, disliked, or matched by the current user
        // 3. Match based on gender preference (current user’s gender preference and others' preference)
        const users = await User.find({
            $and: [
                { _id: { $ne: currentUser.id } }, // Exclude the current user
                { _id: { $nin: currentUser.likes } }, // Exclude users already liked
                { _id: { $nin: currentUser.dislikes } }, // Exclude users already disliked
                { _id: { $nin: currentUser.matches } }, // Exclude already matched users
                { 
                    gender: currentUser.genderPreference === "both" 
                        ? { $in: ["male", "female"] } // If both genders are preferred, include both
                        : currentUser.genderPreference // Otherwise, filter based on the user's gender preference
                },
                { genderPreference: { $in: [currentUser.gender, "both"] } } // Match others' preference for user's gender
            ]
        });

        // Return a successful response with the filtered list of users
        res.status(200).json({
            success: true,
            users // Return the list of users that match the criteria
        });
    } catch (err) {
        // Handle server errors
        res.status(500).json({
            success: false,
            message: 'Internal server error' // General error message
        });
        console.log(err); // Log the error for debugging
    }
};
