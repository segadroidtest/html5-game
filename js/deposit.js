
async function getBalance(walletAddress) {
    try {
        console.log(`Fetching balance for wallet address: ${walletAddress}`);
        const apiEndpoint = "https://toncenter.com/api/v2/getAddressInformation";
        const response = await fetch(`${apiEndpoint}?address=${walletAddress}&api_key=a6bc56466ebb8b52e20b5714e3c08634600bc33300e77a4f98e77a59a7336eaf`);
        if (!response.ok) {
            throw new Error(`Error fetching balance for ${walletAddress}: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("API response for balance data:", data); // Log the response for debugging

        // Convert the balance from nanoton to TON and return
        const balanceInTON = parseFloat(data.result.balance) / 1000000000;
        return balanceInTON || 0; // Ensure the balance is returned, default to 0 if undefined
    } catch (error) {
        console.error(`Error fetching balance for ${walletAddress}:`, error);
        return 0; // Return 0 in case of error
    }
}

let lastProcessedTimestamp = 0; // Track the timestamp of the latest processed transaction

async function initializeLastProcessedTimestamp(walletAddress) {
    const apiKey = "a6bc56466ebb8b52e20b5714e3c08634600bc33300e77a4f98e77a59a7336eaf";
    const apiEndpoint = `https://toncenter.com/api/v2/getTransactions?address=${walletAddress}&api_key=${apiKey}`;

    try {
        const response = await fetch(apiEndpoint, {
            method: 'GET',
            headers: {
                'X-API-Key': apiKey
            }
        });

        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            return;
        }

        const data = await response.json();
        console.log("Initializing with the latest transaction data:", data);

        // Set lastProcessedTimestamp to the most recent transaction's timestamp, if any
        if (data.result && Array.isArray(data.result) && data.result.length > 0) {
            lastProcessedTimestamp = data.result[0].utime; // Most recent transaction timestamp
        }
    } catch (error) {
        console.error("Error initializing lastProcessedTimestamp:", error);
    }
}

async function checkTransactions(walletAddress, userId) {
    const apiKey = "a6bc56466ebb8b52e20b5714e3c08634600bc33300e77a4f98e77a59a7336eaf";
    const apiEndpoint = `https://toncenter.com/api/v2/getTransactions?address=${walletAddress}&api_key=${apiKey}`;

    console.log(`Checking transactions for wallet address: ${walletAddress}`);

    try {
        const response = await fetch(apiEndpoint, {
            method: 'GET',
            headers: {
                'X-API-Key': apiKey
            }
        });

        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            return;
        }

        const data = await response.json();
        console.log("Transaction data:", data);

        if (data.result && Array.isArray(data.result) && data.result.length > 0) {
            // Sort transactions by timestamp in descending order (newest first)
            data.result.sort((a, b) => b.utime - a.utime);

            for (const transaction of data.result) {
                const timestamp = transaction.utime;
                const message = transaction.in_msg?.message || '';
                const valueInNanoton = transaction.in_msg?.value || transaction.value || 0;
                const amount = parseFloat(valueInNanoton) / 1000000000;

                // Check if the transaction is newer than the last processed and contains the userId
// Inside checkTransactions function, replace the alert with the showMessage call
if (timestamp > lastProcessedTimestamp && message.includes(userId)) {
        const popupMessage = `New deposit received: ${amount} TON 🎉`;
        showMessage(popupMessage);

        // Call backend to save deposit
        try {
            const response = await fetch("https://telegram-bot-degen-town.replit.app/deposit", { // Change to your server URL
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, amount })
            });

            if (!response.ok) {
                console.error("Failed to save deposit in database.");
            } else {
                console.log("Deposit saved in database.");
            }
        } catch (error) {
            console.error("Error saving deposit in database:", error);
        }

        lastProcessedTimestamp = timestamp;
        break; // Stop checking after the first match
    }

            }
        } else {
            console.log("No transactions found.");
        }
    } catch (error) {
        console.error("Error fetching transactions:", error);
    }
}

// Start by initializing lastProcessedTimestamp with the current latest transaction
const walletAddress = "EQAF72soTe3EGsvWES2iDFYra3imEA9tixwrQ0VUyc4D7w04";
const userId = Telegram.WebApp.initDataUnsafe.user.id.toString();
initializeLastProcessedTimestamp(walletAddress).then(() => {
    // Once initialized, start checking for new transactions at regular intervals
    setInterval(() => {
        checkTransactions(walletAddress, userId);
    }, 1500); // Check every 5 seconds
})

function showMessage(message) {
    const originalContent = document.getElementById("walletsection");
    const transactionMessage = document.getElementById("transactionMessage");

    // Set the message text in the transaction message div
    transactionMessage.querySelector("p").textContent = message; // Update the message

    // Shift the original content down
    originalContent.style.marginTop = "0px"; // Adjust this value as needed

    // Show the transaction message
    transactionMessage.style.display = "block";
    
    // Use requestAnimationFrame for smoother transitions
    requestAnimationFrame(() => {
        transactionMessage.style.opacity = 1; // Fade in
    });
}

function closeMessage() {
    const originalContent = document.getElementById("walletsection");
    const transactionMessage = document.getElementById("transactionMessage");

    // Fade out the transaction message
    transactionMessage.style.opacity = 0;
    originalContent.style.marginTop = "0px";

    // Wait for the fade-out transition to finish before hiding
    transactionMessage.addEventListener('transitionend', function() {
        transactionMessage.style.display = "none"; // Hide after fade out
        originalContent.style.marginTop = "0"; // Reset margin to return to original position
    }, { once: true }); // Remove the event listener after it triggers
}
    function showTon1() {
        window.location.href = `https://app.tonkeeper.com/transfer/${walletAddress}?amount=&text=${userId}`;
    }

    function showTon2() {
        window.location.href = `https://tonhub.com/transfer/${walletAddress}?amount=&text=${userId}`;
    }
