window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('accessToken');
  
    const fetchEmailsBtn = document.getElementById('fetch-emails-btn');
    if (accessToken) {
      // Enable the Fetch Emails button after authentication
      fetchEmailsBtn.disabled = false;
    }
  
    // Event listener for "Fetch Emails" button click
    fetchEmailsBtn.addEventListener('click', async () => {
      try {
        // Show a loading indicator
        const emailList = document.getElementById('email-list');
        emailList.innerHTML = '<div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>';
  
        // Fetch emails from the backend API using the access token
        const response = await fetch(`http://localhost:3000/api/emails`, {
          headers: {
            'Authorization': `Bearer ${accessToken}` // Pass the access token in the Authorization header
          }
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const emails = await response.json();
        emailList.innerHTML = ''; // Clear the existing list
  
        // Display emails if available
        if (emails.length) {
          emails.forEach(email => {
            emailList.appendChild(createEmailCard(email));
          });
        } else {
          emailList.innerHTML = '<div class="alert alert-info">No emails found.</div>';
        }
      } catch (error) {
        console.error('Error fetching emails:', error);
        document.getElementById('email-list').innerHTML = `<div class="alert alert-danger">Error fetching emails: ${error.message}. Please try again.</div>`;
      }
    });
  
    // Function to create an email card
    function createEmailCard(email) {
      const emailItem = document.createElement('div');
      emailItem.className = 'card mb-3';
      emailItem.innerHTML = `
        <div class="card-body">
          <h5 class="card-title">From: ${email.from}</h5>
          <h6 class="card-subtitle mb-2 text-muted">Subject: ${email.subject}</h6>
          <p class="card-text"><strong>Snippet:</strong> ${email.snippet}</p>
          <p class="card-text"><strong>Body:</strong></p>
          <pre>${email.body}</pre>
        </div>
      `;
      return emailItem;
    }
  });
  