const apiUrl = 'https://backendlogictech.cloudbyvin.com'
// const apiUrl = 'http://localhost:3000'
// Check if user is already authenticated
function checkAuthentication() {
    const oauth_token = localStorage.getItem('oauth_token');
    const oauth_verifier = localStorage.getItem('oauth_verifier');

    if (oauth_token) {
        // User is authenticated, show the tweet container
        document.getElementById('tweet-container').style.display = 'block';
        document.getElementById('login-twitter-btn').style.display = 'none';
    } else {
        document.getElementById('tweet-container').style.display = 'none';
    }
}

// Call checkAuthentication on page load
document.addEventListener('DOMContentLoaded', checkAuthentication);

// Event listener for login with Twitter button
document.getElementById('login-twitter-btn').addEventListener('click', async () => {
    try {
        const isTwitterConnected = localStorage.getItem('isTwitterConnected');
        console.log("isTwitterConnectedisTwitterConnected",isTwitterConnected);
        if(isTwitterConnected){
            const userChoice = confirm("Twitter is already connected in the application. Do you still want to connect Twitter again?");
    
            if (!userChoice) {
              // User selected "No"
              return; // Exit the function
            }
        }
        const response = await fetch(`${apiUrl}/login-twitter`, {
            method: 'GET',
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            window.location.href = data.url; // Redirect user to Twitter authorization page
        } else {
            const errorData = await response.json();
            alert('Error during Twitter login: ' + errorData.error);
        }
    } catch (error) {
        console.error('Error during login request:', error);
        alert('Error during login request: ' + error.message);
    }
});

// Function to handle the callback from Twitter and store tokens
async function handleTwitterCallback() {
    const params = new URLSearchParams(window.location.search);
    console.log("URL of the twiiter callback",window.location);
    const oauth_token = params.get('oauth_token');
    const oauth_verifier = params.get('oauth_verifier');
    console.log("oauth_token",oauth_token,"sdsd",oauth_verifier)
    if (oauth_token && oauth_verifier) {
        try {
            const response = await fetch(`${apiUrl}/callback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ oauth_token, oauth_verifier })
            });

            const data = await response.json();
            if (response.ok && data.access_token) {
                // Store tokens in local storage
                localStorage.setItem('oauth_token', data.access_token);
                localStorage.setItem('oauth_verifier', oauth_verifier);
                alert("hey boy",data.access_token);
                // console.log()
                document.getElementById('tweet-container').style.display = 'block';
                document.getElementById('login-twitter-btn').style.display = 'none';

                window.location.href = 'success.html';
            } else {
                alert('Error verifying Twitter callback: ' + (data.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error during callback handling:', error);
            alert('Error during callback handling: ' + error.message);
        }
    }
}

// Automatically handle callback if present in URL
document.addEventListener('DOMContentLoaded', handleTwitterCallback);

