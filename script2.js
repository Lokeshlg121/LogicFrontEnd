// API endpoint
// const apiEndpoint = 'https://backendlogictech.cloudbyvin.com/getPrompt'; 
// const apiEndpoint = 'http://localhost:3000/getPrompt'; 
const apiUrl = 'https://backendlogictech.cloudbyvin.com'
// const apiUrl = 'http://localhost:3000'
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
        const response = await fetch(`${apiUrl}/login-twitter`, {
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
    console.log("window.locationwindow.location",window.location);
    const oauth_token = params.get('oauth_token');
    const oauth_verifier = params.get('oauth_verifier');

    if (oauth_token) {
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
        if(response.statusCode == 400){
            alert('Please enter a valid ChatGPT ID.')
            return;
        }else{
            displayApiResponse(response);
        }
    } catch (error) {
        alert('Enter valid id of chatgpt');
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
    // Retrieve email from local storage
    const email = localStorage.getItem('userEmail') || 'default@example.com'; // Replace 'default@example.com' with your desired default value

    // Make the API call with the email as userId
    const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            prompt: question,
            userId: email
        }),
    });
    console.log("responseresponseresponse",response);
    if (!response.ok) {
        throw new Error('API request failed');
    }
    if(response.statusCode === 400){
        console.log("inside ifffffffff of styatus")
        alert(response.message)
    }
    const data = await response.json();
    return data;
}


// Display the response from the API
// Display the response from the API and clear existing messages
// Display the response from the API and clear existing messages
function displayApiResponse(apiResponse) {
    // Clear existing messages in the chat window
    messagesDiv.innerHTML = '';

    // Check if the API response is successful
    if (apiResponse.statusCode === 200) {
        // If there's a conversation array, add each message in order
        if (apiResponse.conversation && Array.isArray(apiResponse.conversation)) {
            apiResponse.conversation.forEach(convo => {
                if (convo.role === 'user') {
                    appendMessage('> ' + convo.content, 'user-message');
                } else if (convo.role === 'assistant') {
                    appendMessage(convo.content, 'bot-message');
                }
            });
        } else {
            // Add the main response message to the chat if no conversation array is present
            appendMessage(apiResponse.response, 'bot-message');
        }
    } else {
        appendMessage('Error: ' + apiResponse.message, 'bot-message');
    }
}



// Send the message text to Twitter API for posting as a tweet
async function sendTextToApi(messageText) {
   
    try {
        const params = new URLSearchParams(window.location.search);
        console.log("window.locationwindow.location",window.location);
        const oauth_token2 = params.get('oauth_token');
        console.log("oauth_token2oauth_token2oauth_token2oauth_token2oauth_token2",oauth_token2);
        const oauth_token = localStorage.getItem('oauth_token') || oauth_token2;
        console.log("inside function")
        console.log("localStorage.getItem('oauth_token');",localStorage.getItem('oauth_token'));    
        const response = await fetch(`${apiUrl}/tweet?oauth_token=${encodeURIComponent(oauth_token)}`, {
            method: 'POST',
            credentials: 'include',
                headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                status: messageText,
                oauth_token: oauth_token
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

document.getElementById('twitter-login').addEventListener('click', function() {
    window.location.href = 'twiterUi.html';
});

document.getElementById('google-login').addEventListener('click', () => {
    console.log("hiiiii")
    window.open('gmailUi.html', '_blank');
});

document.getElementById('popup-submit').addEventListener('click', () => {
    const inputText = document.getElementById('popup-input').value;
    const email = localStorage.getItem('userEmail'); // Retrieve email from localStorage

    if (inputText && email) {
        // Call your API here with the input data and email
        fetch(`${apiUrl}/insertChatGptKey`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ chatGptKey: inputText, email: email }), // Pass both inputText and email
        })
        .then(response => response.json())
        .then(data => {
            console.log('API response:', data);
            console.log("data.statusCodedata.statusCodedata.statusCode",data.statusCode);
            if(data.statusCode ===400){
                alert('Enter valid chast gpt id')                
        // Close the popup after submitting
        document.getElementById('popup').style.display = 'none';
        document.getElementById('popup-overlay').style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
        document.getElementById('popup').style.display = 'none';
        document.getElementById('popup-overlay').style.display = 'none';
    } else {
        console.error('Input text or email is missing.');
    }
});

function updateKey(){
    const inputText = document.getElementById('popup-input').value;
    const email = localStorage.getItem('userEmail'); // Retrieve email from localStorage

    if (inputText && email) {
        // Call your API here with the input data and email
        fetch(`${apiUrl}/insertChatGptKey`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ chatGptKey: inputText, email: email }), // Pass both inputText and email
        })
        .then(response => response.json())
        .then(data => {
            console.log('API response:', data);
        })
        .catch(error => {
            console.error('Error:', error);
        });

        // Close the popup after submitting
        document.getElementById('popup').style.display = 'none';
        document.getElementById('popup-overlay').style.display = 'none';
    } else {
        console.error('Input text or email is missing.');
    }
}

function checkKeyStatus() {
    // Example API call using fetch
    fetch("https://example.com/api/check-key-status")
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Hide popup if API returns success
                document.getElementById("overlay").style.display = "none";
                document.getElementById("popup").style.display = "none";
            } else {
                // Show popup if API returns false
                document.getElementById("overlay").style.display = "block";
                document.getElementById("popup").style.display = "block";
            }
        })
        .catch(error => {
            console.error("Error checking key status:", error);
            // Optionally, handle errors by showing the popup
            document.getElementById("overlay").style.display = "block";
            document.getElementById("popup").style.display = "block";
        });
}


// Function to show the popup
function showPopup() {
    document.getElementById("overlay").style.display = "block";
    document.getElementById("popup").style.display = "block";
}

// Event listener for the "Connect ChatGPT" button
document.getElementById("connect-chatgpt-btn").addEventListener("click", showPopup);


document.getElementById('popup-cancel').addEventListener('click', () => {
    document.getElementById("popup").style.display = "none";
});

// function addHistoryItems(count) {

//     const historyList = document.getElementById("historyBar");
//     // Clear any existing items
//     historyList.innerHTML = "";
//     // for (let i = 0; i < 2; i++) {
//         //     const li = document.createElement("li");
//         //     li.classList.add("custom-history-item");
//         //     historyList.appendChild(li);
//         // }
//         // Add specified number of <li> items
//         // for (let i = 1; i <= count; i++) {
//             console.log("countcountcount",count);
//     count.map((item,index)=>{
//            alert("inside mao",item)
//         const li = document.createElement("li");
//         li.id = `history-item-${i}`;
//         li.innerHTML = `<i id="history-item-1"><i class="fas fa-history"></i> History Item ${i}`;
//         li.id = `history-item-${i}`;
//         li.classList.add("custom-history-item");

//          if (index === 0) {
//             li.style.marginTop = "100px";
//         }

//         historyList.appendChild(li);
//        })
       
//     // }
// }

// // Call the function with the desired count
// const arr = ["10","20","30"]
// addHistoryItems(arr); // 

function addHistoryItems(count) {
    const historyList = document.getElementById("historyBar");
    // Clear any existing items
    historyList.innerHTML = "";

    // Add specified number of <li> items
    count.forEach((item, index) => {
        const li = document.createElement("li");
        li.id = `history-item-${index + 1}`; // Use the index to generate a unique id
        li.classList.add("custom-history-item");

        // Add content inside the li
        li.innerHTML = `<i class="fas fa-history"></i>${item}`;

        // Add some margin for the first item (optional)
        if (index === 0) {
            li.style.marginTop = "100px";
        }

        // Append the list item to the history bar
        historyList.appendChild(li);
    });
}

// Call the function with the desired array
const arr = ["10", "20", "30","30"];
addHistoryItems(arr); 