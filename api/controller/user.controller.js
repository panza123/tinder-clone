// Import Cloudinary configuration and User model
import cloudinary from "../config/cloudinary.js"
import User from "../models/user.model.js"

// Controller function to update the user's profile
export const updateProfile = async (req, res) => {
    try {
        // Destructure the image and other data from the request body
        const { image, ...otherData } = req.body;
        const updatedData = otherData; // Initialize the updated data with the non-image fields

        // Check if an image is included in the request
        if (image) {
            // Validate if the image is in the correct format (for simplicity, assuming it starts with "data:image")
            if (image.startsWith("data:image")) {
                try {
                    // Upload the image to Cloudinary using the uploader method
                    const uploadResponse = await cloudinary.uploader.upload(image);
                    
                    // Assign the uploaded image's secure URL to the updatedData object
                    updatedData.image = uploadResponse.secure_url;
                } catch (err) {
                    // Handle errors during the image upload (e.g., invalid data, upload failure)
                    return res.status(400).json({
                        success: false,
                        message: "Invalid image data" // Error message for invalid image data
                    });
                }
            }
        }

        // Update the user's profile in the database using the `findByIdAndUpdate` method
        const updateUser = await User.findByIdAndUpdate(req.user.id, updatedData, { new: true });

        // Send a success response with the updated user data
        res.status(200).json({
            success: true,
            user: updateUser // Return the updated user object
        });

    } catch (err) {
        // Log the error and send a server error response
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Server Error" // General error message for server issues
        });
    }
};
