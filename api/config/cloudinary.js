// Import the 'v2' version of the Cloudinary library for handling media uploads and transformations
import {v2 as cloudinary} from 'cloudinary';

// Import the 'dotenv' library to load environment variables from a .env file into process.env
import dotenv from 'dotenv';

// Load the environment variables from the .env file into process.env
dotenv.config();

// Configure Cloudinary with credentials (cloud name, API key, and API secret) using the values from environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME, // Your Cloudinary cloud name stored in the .env file
    api_key: process.env.CLOUDINARY_API_KEY, // Your Cloudinary API key stored in the .env file
    api_secret: process.env.CLOUDINARY_SECRET_KEY // Your Cloudinary secret key stored in the .env file
});

// Export the configured Cloudinary instance for use in other parts of the application
export default cloudinary;
