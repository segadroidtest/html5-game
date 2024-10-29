const TelegramBot = require('node-telegram-bot-api');
const fetch = require('node-fetch');

const token = process.env.TELEGRAM_BOT_TOKEN;  // Make sure you set this in your environment variables
const bot = new TelegramBot(token, { polling: false });

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const update = req.body;

        // Handle incoming updates
        if (update.message) {
            const chatId = update.message.chat.id;

            if (update.message.text === '/start') {
                bot.sendMessage(chatId, "Welcome! Use /getWallet to generate your wallet address.");
            }

            if (update.message.text === '/getWallet') {
                try {
                    const response = await fetch('https://html5-game-pi.vercel.app/api/getWalletAddress');
                    const data = await response.json();
                    bot.sendMessage(chatId, `Your wallet address is: ${data.walletAddress}`);
                } catch (error) {
                    console.error("Error fetching wallet address:", error);
                    bot.sendMessage(chatId, "There was an error retrieving your wallet address.");
                }
            }
        }

        res.status(200).send('OK');
    } else {
        res.status(403).send('Forbidden');
    }
};
