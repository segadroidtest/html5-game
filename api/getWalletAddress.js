// api/getWalletAddress.js
export default function handler(req, res) {
    // Simulating an API that returns a random wallet address
    const addresses = [
        "EQB4djqmv2I3jFdfw12jp9iGuC4uXtGpX1GaZ-5W5_EOsb3K",
        "EQD4dFqmv5I3jkdwf9gfk9iGcZuuXtGpX1GtB-9W5_FEJxN",
        "EQH7hFvmv3I3jqkw22k9foiGc4tFxGpX1FqZ-5H5_GRPsbT"
    ];
    
    const randomAddress = addresses[Math.floor(Math.random() * addresses.length)];

    // Respond with the wallet address
    res.status(200).json({ walletAddress: randomAddress });
}
