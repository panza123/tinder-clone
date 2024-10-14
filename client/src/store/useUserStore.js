import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useUserStore = create((set) => ({
	loading: false,
	authUser: null, // Assuming you want to store the authenticated user's info here

	updateProfile: async (data) => {
		try {
			set({ loading: true });

			// API call to update the profile
			console.log("Sending request to update profile...");
			const res = await axiosInstance.put("/users/update", data);

			console.log("Profile updated, response:", res.data);

			// Update the user state with new data, including the image URL
			set((state) => ({
				authUser: { ...state.authUser, ...res.data }, // Assuming res.data contains the updated user data
			}));

			toast.success("Profile updated successfully");
		} catch (error) {
			console.error("Error occurred during profile update:", error);
			toast.error(error?.response?.data?.message || "Something went wrong while updating the profile");
		} finally {
			set({ loading: false });
		}
	},
	setAuthUser: (user) => set({ authUser: user }), // Method to set authenticated user data
}));
