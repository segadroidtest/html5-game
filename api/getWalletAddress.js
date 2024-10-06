// pages/api/getWalletAddress.js

// Allow cross-origin requests
export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
    res.setHeader('Access-Control-Allow-Methods', 'GET'); // Allowed methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allowed headers

    // Store wallet addresses based on user IDs in memory
    const userWallets = {}; 

    // Existing addresses for random selection
    const addresses = [
        "EQB4djqmv2I3jFdfw12jp9iGuC4uXtGpX1GaZ-5W5_EOsb3K",
        "EQD4dFqmv5I3jkdwf9gfk9iGcZuuXtGpX1GtB-9W5_FEJxN",
        "EQH7hFvmv3I3jqkw22k9foiGc4tFxGpX1FqZ-5H5_GRPsbT"
    ];

    const userId = req.query.userId; // Expect user ID as a query parameter

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required.' });
    }

    // Check if wallet address already exists for this user
    if (!userWallets[userId]) {
        // Generate a random address for the user and store it
        const randomAddress = addresses[Math.floor(Math.random() * addresses.length)];
        userWallets[userId] = randomAddress; // Store the address for this user
    }

    // Send the wallet address back to the user
    res.status(200).json({ walletAddress: userWallets[userId] });
}
