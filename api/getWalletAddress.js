// api/getWalletAddress.js
export default function handler(req, res) {
  // Your logic to generate or retrieve a wallet address
  const walletAddresses = [
    "EQB4djqmv2I3jFdfw12jp9iGuC4uXtGpX1GaZ-5W5_EOsb3K",
    "EQD4dFqmv5I3jkdwf9gfk9iGcZuuXtGpX1GtB-9W5_FEJxN",
    "EQH7hFvmv3I3jqkw22k9foiGc4tFxGpX1FqZ-5H5_GRPsbT"
  ];

  // Select a random address
  const randomIndex = Math.floor(Math.random() * walletAddresses.length);
  const walletAddress = walletAddresses[randomIndex];

  // Send a JSON response with the wallet address
  res.status(200).json({ walletAddress });
}

const cors = require('cors');
app.use(cors({
    origin: 'https://anasamhs2017.github.io',
}));
