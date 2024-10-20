// API endpoint
const apiEndpoint = 'http://localhost:3000/getPrompt'; 
const messagesDiv = document.getElementById('messages');
const userInput = document.getElementById('user-input');
const submitBtn = document.getElementById('submit-btn');

// To prevent multiple submissions
let isSubmitting = false;

// Handle user input with Enter key
userInput.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter' && !e.shiftKey && userInput.value.trim()) {
        e.preventDefault();
        if (!isSubmitting) {
            await handleUserInput(); 
        }
    }
});

// Toggle sidebar visibility
document.getElementById('sidebar-toggle').addEventListener('click', function() {
    const sidebar = document.getElementById('sidebar');
    const appWrapper = document.getElementById('app-wrapper');
    sidebar.classList.toggle('active');
    appWrapper.classList.toggle('active');
});

// Add event listener for Twitter login button
document.getElementById('twitter-login').addEventListener('click', async () => {
    try {
        console.log("About to call login API for Twitter");
        const response = await fetch('http://localhost:3000/login-twitter', {
            method: 'GET',
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Redirecting to Twitter authorization URL:", data.url);
            window.location.href = data.url;
        } else {
            const errorData = await response.json();
            alert('Error during Twitter login: ' + errorData.error);
        }
    } catch (error) {
        console.error('Error during login request:', error);
        alert('Error during login request: ' + error.message);
    }
});

// Handle Twitter callback and redirect to success page
async function handleTwitterCallback() {
    const params = new URLSearchParams(window.location.search);
    const oauth_token = params.get('oauth_token');
    const oauth_verifier = params.get('oauth_verifier');

    if (oauth_token && oauth_verifier) {
        try {
            const response = await fetch('http://localhost:3000/callback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ oauth_token, oauth_verifier })
            });

            const data = await response.json();
            console.log("Response from callback:", data);

            if (response.ok) {
                localStorage.setItem('oauth_token', data.accessToken);
                window.location.href = 'success.html?oauth_token=' + oauth_token;
            } else {
                alert('Error verifying Twitter callback: ' + data.error);
            }
        } catch (error) {
            console.error('Error during callback handling:', error);
            alert('Error during callback handling: ' + error.message);
        }
    }
}

// Automatically handle the callback if present
document.addEventListener('DOMContentLoaded', handleTwitterCallback);

// Handle user input with the submit button
submitBtn.addEventListener('click', async () => {
    if (userInput.value.trim() && !isSubmitting) {
        await handleUserInput(); 
    }
});

// Adjust textarea height dynamically
userInput.addEventListener('input', () => {
    userInput.style.height = '40px';
    userInput.style.height = `${userInput.scrollHeight}px`;
});

// Handle the user input and send it to the API
async function handleUserInput() {
    const question = userInput.value.trim();

    if (!question || isSubmitting) return;

    appendMessage('> ' + question, 'user-message');
    userInput.value = '';
    userInput.style.height = '40px';

    isSubmitting = true;
    userInput.disabled = true;
    submitBtn.disabled = true;

    try {
        const response = await callChatGPTApi(question);
        console.log('API Response:', response);
        displayApiResponse(response);
    } catch (error) {
        appendMessage('Error: Unable to get response from the server.', 'bot-message');
    } finally {
        isSubmitting = false;
        userInput.disabled = false;
        submitBtn.disabled = false;
    }
}

// Append a message to the chat window
function appendMessage(message, className) {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.classList.add(className);

    if (className === 'bot-message') {
        const twitterIcon = document.createElement('a');
        twitterIcon.href = '#';
        twitterIcon.innerHTML = '<i class="fab fa-twitter"></i>';
        twitterIcon.style.marginLeft = '10px';

        twitterIcon.addEventListener('click', () => {
            const isConfirmed = confirm('Are you sure you want to tweet this message?');
            if (isConfirmed) {
                sendTextToApi(message);
            }
        });

        messageElement.appendChild(twitterIcon);
    }

    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Call the ChatGPT API with the user input
async function callChatGPTApi(question) {
    const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            prompt: question
        }),
    });

    if (!response.ok) {
        throw new Error('API request failed');
    }

    const data = await response.json();
    return data;
}

// Display the response from the API
function displayApiResponse(apiResponse) {
    if (apiResponse.statusCode === 200) {
        appendMessage(apiResponse.response, 'bot-message');

        if (apiResponse.conversation && Array.isArray(apiResponse.conversation)) {
            apiResponse.conversation.forEach(convo => {
                if (convo.role === 'user') {
                    appendMessage('> ' + convo.content, 'user-message');
                } else if (convo.role === 'assistant') {
                    if (convo.content !== apiResponse.response) {
                        appendMessage(convo.content, 'bot-message');
                    }
                }
            });
        }
    } else {
        appendMessage('Error: ' + apiResponse.message, 'bot-message');
    }
}

// Send the message text to Twitter API for posting as a tweet
async function sendTextToApi(messageText) {
    const oauth_token = localStorage.getItem('oauth_token');

    try {
        const response = await fetch(`http://localhost:3000/tweet?oauth_token=${encodeURIComponent(oauth_token)}`, {
            method: 'POST',
            credentials: 'include',
                headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                status: messageText,
                // oauth_token: oauth_token
            }),
        });
        // const response = await fetch('http://35.94.170.31:3000/postTweet', {  // Replace with your actual API endpoint
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         tweetContent: messageText
        //     }),
        // });
        const data = await response.json();
        if (response.ok) {
            alert('Tweet posted successfully: ' + data.tweet.full_text);
        } else {
            alert('Error posting tweet: ' + (data.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error during tweet:', error);
        alert('Error during tweet: ' + error.message);
    }
}
