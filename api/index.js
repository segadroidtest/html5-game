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
