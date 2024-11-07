const apiUrl = 'https://backendlogictech.cloudbyvin.com'
function saveApiKey() {
    const apiKey = document.getElementById("apiKeyInput").value;
    if (apiKey) {
        // Save the API key in localStorage
        localStorage.setItem("openaiApiKey", apiKey);
        document.getElementById("successMessage").textContent = "API Key saved successfully!";
    } else {
        alert("Please enter a valid API key.");
    }
}

// Check if an API key is already saved
window.onload = function() {
    const savedKey = localStorage.getItem("openaiApiKey");
    if (savedKey) {
        document.getElementById("successMessage").textContent = "API Key is already saved!";
    }
};

async function sendMessage() {
    const apiKey = localStorage.getItem("openaiApiKey");
    const message = document.getElementById("userMessage").value;

    if (!apiKey || !message) {
        alert("Please ensure both API key and message are provided.");
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                apiKey: apiKey,
                message: message
            })
        });

        const data = await response.json();
        document.getElementById("responseMessage").textContent = data.reply;
    } catch (error) {
        document.getElementById("responseMessage").textContent = "Error: Unable to get a response from the server.";
        console.error("Error:", error);
    }
}
