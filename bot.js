const TelegramBot = require('node-telegram-bot-api');
const fetch = require('node-fetch');

// Replace the token with your bot token
const token = '8047643548:AAH9GroXRXG3bD8OGa6rBN-grgIGk1pM6LM';
const bot = new TelegramBot(token, { polling: false });

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const welcomeMessage = "Welcome! Use /getWallet to generate your wallet address.";
    bot.sendMessage(chatId, welcomeMessage);
});

bot.onText(/\/getWallet/, async (msg) => {
    const chatId = msg.chat.id;

    // Fetch wallet address from your API
    try {
        const response = await fetch('https://html5-game-pi.vercel.app/api/getWalletAddress');
        const data = await response.json();
        bot.sendMessage(chatId, `Your wallet address is: ${data.walletAddress}`);
    } catch (error) {
        console.error("Error fetching wallet address:", error);
        bot.sendMessage(chatId, "There was an error retrieving your wallet address.");
    }
});

// Don't forget to set the webhook
bot.setWebHook(`https://html5-game-pi.vercel.app/api/index`);
