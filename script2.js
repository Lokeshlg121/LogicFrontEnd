const apiEndpoint = 'http://52.14.63.130:3000/getPrompt'; 
const messagesDiv = document.getElementById('messages');
const userInput = document.getElementById('user-input');
const submitBtn = document.getElementById('submit-btn');

// To prevent multiple submissions
let isSubmitting = false;

// Handle Sending User Input with Enter Key
userInput.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter' && !e.shiftKey && userInput.value.trim()) {
        e.preventDefault();  // Prevent newline on Enter
        if (!isSubmitting) {
            await handleUserInput(); 
        }
    }
});

// Handle Sending User Input with Submit Button
submitBtn.addEventListener('click', async () => {
    if (userInput.value.trim() && !isSubmitting) {
        await handleUserInput(); 
    }
});

// Adjust textarea height dynamically
userInput.addEventListener('input', () => {
    userInput.style.height = '40px'; // Reset the height
    userInput.style.height = `${userInput.scrollHeight}px`; // Set new height
});

// Handle the user input and send it to the API
async function handleUserInput() {
    const question = userInput.value.trim();

    if (!question || isSubmitting) return; // Prevent processing empty or multiple submissions

    appendMessage('> ' + question, 'user-message'); // Append question only once
    userInput.value = ''; // Clear input field
    userInput.style.height = '40px'; // Reset textarea height

    // Disable input and button while processing to prevent duplicate calls
    isSubmitting = true;
    userInput.disabled = true;
    submitBtn.disabled = true;

    // Call the API with the user question
    try {
        const response = await callChatGPTApi(question);
        console.log('API Response:', response); // Only logging API response
        displayApiResponse(response); // Display the response from the API
    } catch (error) {
        appendMessage('Error: Unable to get response from the server.', 'bot-message');
    } finally {
        // Enable input and button after processing
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

    // Check if it's a bot message and append a Twitter icon
    if (className === 'bot-message') {
        const twitterIcon = document.createElement('a');
        twitterIcon.href = '#'; // Prevent default link behavior
        twitterIcon.innerHTML = '<i class="fab fa-twitter"></i>'; // FontAwesome Twitter icon
        twitterIcon.style.marginLeft = '10px'; // Add space between text and icon

        // Add click event to Twitter icon
        twitterIcon.addEventListener('click', () => {
            sendTextToApi(message);
        });

        // Append the Twitter icon to the message
        messageElement.appendChild(twitterIcon);
    }

    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Auto-scroll to bottom
}

// Call the API and get the response
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
        // Display the assistant's response in the chat
        appendMessage(apiResponse.response, 'bot-message');

        // If the conversation array exists, avoid re-displaying the main response
        if (apiResponse.conversation && Array.isArray(apiResponse.conversation)) {
            apiResponse.conversation.forEach(convo => {
                 if (convo.role === 'usersddd') {
                    appendMessage('> ' + convo.content, 'user-message');
                } else if (convo.role === 'assistant') {
                    // Avoid adding the same message twice by checking for duplicates
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

// Send the message text to an API when the Twitter icon is clicked
async function sendTextToApi(messageText) {
    try {
        const response = await fetch('http://localhost:3000/postTweet', {  // Replace with your actual API endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tweetContent: messageText
            }),
        });

        if (response.ok) {
            console.log('Text sent successfully');
            alert('Tweet uploaded successfully!');  // Show popup on success
        } else {
            console.error('Failed to send text:', response.statusText);
            alert('Failed to upload the tweet.');  // Show error popup on failure
        }
    } catch (error) {
        console.error('Error sending text:', error);
        alert('An error occurred while uploading the tweet.');  // Show error popup on exception
    }
}

