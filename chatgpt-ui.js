const registerBtn = document.getElementById('register-btn');
const loginBtn = document.getElementById('login-btn');
const chatBtn = document.getElementById('chat-btn');
const responseDiv = document.getElementById('response');

// User Registration
registerBtn.addEventListener('click', async () => {
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    responseDiv.innerHTML = data.message; // Display response message
});

// User Login
loginBtn.addEventListener('click', async () => {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (data.success) {
        localStorage.setItem('token', data.token); // Save token in local storage
        responseDiv.innerHTML = 'Login successful! Your API Key: ' + data.apiKey;
    } else {
        responseDiv.innerHTML = data.message;
    }
});

// ChatGPT API Access
chatBtn.addEventListener('click', async () => {
    const prompt = document.getElementById('chat-prompt').value;
    const token = localStorage.getItem('token'); // Get token from local storage

    const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, prompt }),
    });

    const data = await response.json();
    if (data.success) {
        responseDiv.innerHTML = 'Response: ' + data.message;
    } else {
        responseDiv.innerHTML = data.message;
    }
});
