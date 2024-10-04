const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for requests from your front-end (GitHub Pages)
app.use(cors());

// Simulate a database to store user wallet addresses
let userWallets = {};

// Function to generate a random wallet address
function generateUniqueWalletAddress() {
    let addresses = [
        "EQB4djqmv2I3jFdfw12jp9iGuC4uXtGpX1GaZ-5W5_EOsb3K",
        "EQD4dFqmv5I3jkdwf9gfk9iGcZuuXtGpX1GtB-9W5_FEJxN",
        "EQH7hFvmv3I3jqkw22k9foiGc4tFxGpX1FqZ-5H5_GRPsbT"
    ];
    let randomIndex = Math.floor(Math.random() * addresses.length);
    return addresses[randomIndex];
}

// Endpoint to get a wallet address for a specific user
app.get('/getWalletAddress', (req, res) => {
    const user_id = req.query.user_id; // Retrieve user_id from query string
    
    if (!user_id) {
        return res.status(400).send({error: "user_id is required"});
    }
    
    // Check if the user already has a wallet address
    if (!userWallets[user_id]) {
        // If not, generate a new one and store it
        userWallets[user_id] = generateUniqueWalletAddress();
    }

    // Respond with the wallet address
    res.send({walletAddress: userWallets[user_id]});
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
