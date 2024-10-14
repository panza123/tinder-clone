import io from "socket.io-client";

// Determine the socket URL based on the environment
const SOCKET_URL = process.env.MODE === "production" ? "http://localhost:5000" : '/';

let socket = null;

// Initialize the socket connection
export const initializeSocket = (userId) => {
	if (socket) {
		socket.disconnect();
	}

	socket = io(SOCKET_URL, {
		auth: { userId },
	});
};

// Get the current socket instance
export const getSocket = () => {
	if (!socket) {
		throw new Error("Socket not initialized");
	}
	return socket;
};

// Disconnect the socket connection
export const disconnectSocket = () => {
	if (socket) {
		socket.disconnect();
		socket = null;
	}
};
