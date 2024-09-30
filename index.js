const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const TonWeb = require('tonweb');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: 'https://anasamhs2017.github.io', // Allow requests from your game origin
}));
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb+srv://game_bot:AzeRty2018@affiliate.jj42e.mongodb.net/?retryWrites=true&w=majority&appName=affiliate', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
    username: String,
    telegramId: String,
    referralLink: String,
    walletAddress: String,
    referrals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const User = mongoose.model('User', userSchema);

// Your master seed (keep it secure)
const masterSeed = 'recipe auto receive symbol live awesome task entry distance leopard loud fat author popular amount where govern toy snow cave attitude add sphere bean';

// Function to generate unique wallet addresses
async function generateWalletAddress(userId) {
    const tonWeb = new TonWeb();
    const seed = tonWeb.utils.toHex(masterSeed);
    const hdKey = tonWeb.utils.createHDKey(seed);
    const childKey = hdKey.derivePath(`m/44'/396'/0'/0/${userId}`);
    const walletAddress = childKey.getAddress();
    return walletAddress;
}

// API to handle referral submissions
app.post('/submit-referral', async (req, res) => {
    const { referralCode, telegramId } = req.body;

    let user = await User.findOne({ telegramId });
    if (!user) {
        const newUserId = Date.now();
        const walletAddress = await generateWalletAddress(newUserId);

        user = new User({
            username: `User${telegramId}`,
            telegramId,
            referralLink: `referral-${telegramId}`,
            walletAddress,
        });
        await user.save();
    }

    const referrer = await User.findOne({ referralLink: referralCode });
    if (referrer) {
        referrer.referrals.push(user._id);
        await referrer.save();
        res.json({ message: 'Referral successful!', walletAddress: user.walletAddress });
    } else {
        res.status(400).json({ message: 'Invalid referral code.' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.post('/deposit', async (req, res) => {
    const { telegramId, amount } = req.body;

    const user = await User.findOne({ telegramId });
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    // Here you would validate the deposit with TON blockchain
    user.balance += amount; // Assume the user has a balance field
    await user.save();

    res.json({ message: 'Deposit successful!', newBalance: user.balance });
});