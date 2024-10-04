// api/index.js
const TelegramBot = require('node-telegram-bot-api');
const fetch = require('node-fetch');

const token = '8047643548:AAH9GroXRXG3bD8OGa6rBN-grgIGk1pM6LM';
const bot = new TelegramBot(token);

export default async (req, res) => {
    if (req.method === 'POST') {
        const update = req.body;

        // Handle incoming updates from Telegram
        if (update.message) {
            const chatId = update.message.chat.id;

            // Example command handling
            if (update.message.text === '/start') {
                bot.sendMessage(chatId, 'Welcome! Type /openapp to access the mini app.');
            }

            // Other command handling can go here...
        }

        res.status(200).send('OK');
    } else {
        res.status(405).send('Method Not Allowed');
    }
};

    
// pages/api/getWalletAddress.js
const addresses = [
    "EQB4djqmv2I3jFdfw12jp9iGuC4uXtGpX1GaZ-5W5_EOsb3K",
    "EQD4dFqmv5I3jkdwf9gfk9iGcZuuXtGpX1GtB-9W5_FEJxN",
    "EQH7hFvmv3I3jqkw22k9foiGc4tFxGpX1FqZ-5H5_GRPsbT"
];

const userWallets = {}; // Store wallets based on user IDs

export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
    res.setHeader('Access-Control-Allow-Methods', 'GET'); // Allowed methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allowed headers
    const userId = req.query.userId; // Expect user ID as a query parameter

    // Check if wallet address already exists for this user
    if (!userWallets[userId]) {
        // Generate a random address for the user
        const randomAddress = addresses[Math.floor(Math.random() * addresses.length)];
        userWallets[userId] = randomAddress; // Store the address for this user
    }

    // Send the wallet address back to the user
    res.status(200).json({ walletAddress: userWallets[userId] });
}

