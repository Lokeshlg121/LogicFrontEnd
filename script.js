const apiUrl = 'https://backendlogictech.cloudbyvin.com'
// const apiUrl = 'http://localhost:3000'
const signupForm = document.getElementById('signup-form');
const loginForm = document.getElementById('login-form');
const chatContainer = document.getElementById('chat-container');
const signupContainer = document.getElementById('signup-container');
const loginContainer = document.getElementById('login-container');
const messagesDiv = document.getElementById('messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-btn');

const toggleForms = () => {
    if (signupContainer.style.display === 'none') {
        signupContainer.style.display = 'block';
        loginContainer.style.display = 'none';
    } else {
        signupContainer.style.display = 'none';
        loginContainer.style.display = 'block';
    }
};

// Handle Signup
signupForm.addEventListener('submit', async (e) => {
    // console.log("processprocess.envprocess.envprocess.envprocess.env",process.env);
    e.preventDefault(); // Prevent form from submitting and refreshing the page

    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    try {
        const response = await fetch(`${apiUrl}/signup`, { // Replace with your actual signup API URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        console.log("data", data);
        if (data.signup) {
            localStorage.setItem('userEmail', email); // Store email in localStorage
            alert('Signup successful!');
            window.location.href = 'index2.html'; // Redirect to index2.html
            toggleForms(); // Switch to login form
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error('Error during signup:', error);
        alert('There was an issue signing up.',error);
    }
});

// Handle Login
loginForm.addEventListener('submit', async (e) => {
    // console.log("processprocess.envprocess.envprocess.envprocess.env",process.env);
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${apiUrl}/login`, { // Replace with your actual login API URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (data.success) {
            localStorage.setItem('userEmail', email); // Store email in localStorage
            alert('Login successful!');
            window.location.href = 'index2.html'; // Redirect to index2.html
        } else {
            alert('Login failed.');
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('There was an issue logging in.');
    }
});

// Handle Sending Messages
sendButton.addEventListener('click', async () => {
    const question = userInput.value.trim();
    if (question) {
        appendMessage('You: ' + question); // Display user message
        userInput.value = ''; // Clear input

        // Simulating a response (You can replace this with an actual API call)
        const response = await simulateChatGPTResponse(question);
        appendMessage('ChatGPT: ' + response);
    }
});

// Function to append messages to the chat
const appendMessage = (message) => {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    // messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Auto-scroll to bottom
};

// Simulate a response from ChatGPT (replace this with actual API call)
const simulateChatGPTResponse = async (question) => {
    // Here you can integrate an actual API for getting responses
    // For simulation, we just return a dummy response
    return new Promise(resolve => {
        setTimeout(() => {
            resolve("This is a dummy response to your question: " + question);
        }, 1000); // Simulated delay
    });
};
