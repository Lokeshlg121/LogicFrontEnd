const apiEndpoint = 'http://localhost:3000/getPrompt'; 
const messagesDiv = document.getElementById('messages');
const userInput = document.getElementById('user-input');
const submitBtn = document.getElementById('submit-btn');

// Handle Sending User Input with Enter Key
userInput.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter' && !e.shiftKey && userInput.value.trim()) {
        e.preventDefault();  // Prevent newline on Enter
        await handleUserInput();
    }
});

// Handle Sending User Input with Submit Button
submitBtn.addEventListener('click', async () => {
    if (userInput.value.trim()) {
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
    appendMessage('> ' + question, 'user-message');
    userInput.value = ''; // Clear input field
    userInput.style.height = '40px'; // Reset textarea height

    // Disable input and button while processing
    userInput.disabled = true;
    submitBtn.disabled = true;

    // Call the API with the user question
    try {
        const response = await callChatGPTApi(question);
        console.log('API Response:', response); // Log the API response for debugging
        displayApiResponse(response); // Display the response from the API
    } catch (error) {
        appendMessage('Error: Unable to get response from the server.', 'bot-message');
    } finally {
        // Enable input and button after processing
        userInput.disabled = false;
        submitBtn.disabled = false;
    }
}

// Append a message to the chat window
function appendMessage(message, className) {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.classList.add(className);
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

        // Optionally display the conversation history if necessary
        // Check if conversation array exists and iterate
        if (apiResponse.conversation && Array.isArray(apiResponse.conversation)) {
            apiResponse.conversation.forEach(convo => {
                if (convo.role === 'system') {
                    appendMessage('System: ' + convo.content, 'bot-message');
                } else if (convo.role === 'user') {
                    appendMessage('> ' + convo.content, 'user-message');
                } else if (convo.role === 'assistant') {
                    appendMessage(convo.content, 'bot-message');
                }
            });
        }
    } else {
        appendMessage('Error: ' + apiResponse.message, 'bot-message');
    }
}
