// pages/api/getWalletAddress.js
// Storing wallet addresses for each user in-memory. Note: in-memory storage won't persist across server restarts.
const userWallets = {}; 

export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
    res.setHeader('Access-Control-Allow-Methods', 'GET'); // Allowed methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allowed headers
    
    const userId = req.query.userId; // Expecting a userId query parameter

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required.' });
    }

    try {
        // Wallet addresses to choose from
        const addresses = [
            "EQB4djqmv2I3jFdfw12jp9iGuC4uXtGpX1GaZ-5W5_EOsb3K",
            "EQD4dFqmv5I3jkdwf9gfk9iGcZuuXtGpX1GtB-9W5_FEJxN",
            "EQH7hFvmv3I3jqkw22k9foiGc4tFxGpX1FqZ-5H5_GRPsbT"
        ];

        // Check if the user already has an assigned wallet address
        if (!userWallets[userId]) {
            // Assign a random address for this user if not already assigned
            const randomAddress = addresses[Math.floor(Math.random() * addresses.length)];
            userWallets[userId] = randomAddress;
        }

        // Send back the same address for this user ID on every request
        res.status(200).json({ walletAddress: userWallets[userId] });
    } catch (error) {
        console.error("Error in API handler:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
