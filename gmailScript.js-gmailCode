const apiUrl = 'https://backendlogictech.cloudbyvin.com'
// const apiUrl = 'http://localhost:3000'


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
        const response = await fetch(`${apiUrl}/api/emails`, {
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
  
  document.getElementById('sidebar-toggle').addEventListener('click', function() {
    const sidebar = document.getElementById('sidebar');
    const appWrapper = document.getElementById('app-wrapper');
    sidebar.classList.toggle('active');
    appWrapper.classList.toggle('active');
});

document.getElementById('twitter-login').addEventListener('click', function() {
  window.open('twitterUi.html', '_blank');
});

document.getElementById('google-login').addEventListener('click', () => {
  console.log("hiiiii")
  window.open('gmailUi.html', '_blank');
});

// document.getElementById('twitter-login').addEventListener('click', async () => {
//   try {
//       console.log("About to call login API for Twitter");
//       const response = await fetch(`${apiUrl}/login-twitter`, {
//           method: 'GET',
//           credentials: 'include'
//       });

//       if (response.ok) {
//           const data = await response.json();
//           console.log("Redirecting to Twitter authorization URL:", data.url);
//           window.location.href = data.url;
//       } else {
//           const errorData = await response.json();
//           alert('Error during Twitter login: ' + errorData.error);
//       }
//   } catch (error) {
//       console.error('Error during login request:', error);
//       alert('Error during login request: ' + error.message);
//   }
// });