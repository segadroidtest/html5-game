let apiUrl;

if (window.location.hostname === "localhost") {
    apiUrl = 'http://localhost:3000/submit-referral'; // Local development
} else {
    apiUrl = 'https://anasamhs2017.github.io/submit-referral'; // Live server
}

document.getElementById('submitButton').onclick = function() {
    const referralCode = 'someReferralCode'; // Replace with actual referral code
    const telegramId = 'user_telegram_id'; // Replace with actual Telegram ID
    
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ referralCode, telegramId }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
};

function depositTON(telegramId, amount) {
    fetch('https://anasamhs2017.github.io/deposit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ telegramId, amount }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

// Show QR Code
function showDepositQRCode(walletAddress) {
    $('#qrcode').empty();
    $('#qrcode').qrcode(walletAddress);
}
function submitReferral(referralCode, telegramId) {
    fetch('https://anasamhs2017.github.io/submit-referral', { // Update this URL to your server
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ referralCode, telegramId }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        // Handle success (e.g., show success message)
    })
    .catch((error) => {
        console.error('Error:', error);
        // Handle error (e.g., show error message)
    });
}

if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', () => {
    document.body.style.height = window.visualViewport.height + 'px';
  });
}
// This will ensure user never overscroll the page
window.addEventListener('scroll', () => {
  if (window.scrollY > 0) window.scrollTo(0, 0);
});