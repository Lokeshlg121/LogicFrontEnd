document.getElementById('fetchEmailsButton').addEventListener('click', fetchEmails);

async function fetchEmails() {
    const emailList = document.getElementById('emailList');
    emailList.innerHTML = 'Loading...';

    try {
        const response = await fetch('http://localhost:5000/emails');
        if (!response.ok) {
            throw new Error('Failed to fetch emails');
        }
        const data = await response.json();
        displayEmails(data.messages);
    } catch (error) {
        emailList.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    }
}

function displayEmails(messages) {
    const emailList = document.getElementById('emailList');
    if (messages.length === 0) {
        emailList.innerHTML = '<p>No unread emails found.</p>';
        return;
    }

    const list = document.createElement('ul');
    messages.forEach(message => {
        const listItem = document.createElement('li');
        listItem.textContent = `Message ID: ${message.id}`;
        list.appendChild(listItem);
    });

    emailList.innerHTML = '';
    emailList.appendChild(list);
}
