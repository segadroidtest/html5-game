export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
    res.setHeader('Access-Control-Allow-Methods', 'GET'); // Allowed methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allowed headers
    
    // Your existing logic
    try {
        const addresses = [
            "EQB4djqmv2I3jFdfw12jp9iGuC4uXtGpX1GaZ-5W5_EOsb3K",
            "EQD4dFqmv5I3jkdwf9gfk9iGcZuuXtGpX1GtB-9W5_FEJxN",
            "EQH7hFvmv3I3jqkw22k9foiGc4tFxGpX1FqZ-5H5_GRPsbT"
        ];
        
        const randomAddress = addresses[Math.floor(Math.random() * addresses.length)];
        res.status(200).json({ walletAddress: randomAddress });
    } catch (error) {
        console.error("Error in API handler:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
