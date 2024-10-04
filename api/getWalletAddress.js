// pages/api/getWalletAddress.js
const addresses = [
    "EQB4djqmv2I3jFdfw12jp9iGuC4uXtGpX1GaZ-5W5_EOsb3K",
    "EQD4dFqmv5I3jkdwf9gfk9iGcZuuXtGpX1GtB-9W5_FEJxN",
    "EQH7hFvmv3I3jqkw22k9foiGc4tFxGpX1FqZ-5H5_GRPsbT"
];

// Store wallets based on user IDs
const userWallets = {}; 

export default function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS'); // Allow GET and OPTIONS methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allow content-type header

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const userId = req.query.userId; // Expect user ID as a query parameter

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required.' });
    }

    console.log(`Received request for user ID: ${userId}`); // Log the incoming user ID

    // Check if wallet address already exists for this user
    if (!userWallets[userId]) {
        // Generate a random address for the user
        const randomAddress = addresses[Math.floor(Math.random() * addresses.length)];
        userWallets[userId] = randomAddress; // Store the address for this user
    }

    // Send the wallet address back to the user
    res.status(200).json({ walletAddress: userWallets[userId] });
}
