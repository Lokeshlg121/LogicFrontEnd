const apiUrl = 'https://backendlogictech.cloudbyvin.com'
// const apiUrl = 'http://localhost:3000'
// 

window.addEventListener('load', () => {
    const fetchEmailsBtn = document.getElementById('fetch-emails-btn');
    const email = localStorage.getItem('userEmail')
    // Event listener for "Fetch Emails" button click
    fetchEmailsBtn.addEventListener('click', async () => {
      try {
        // Show a loading indicator
        const emailList = document.getElementById('email-list');
        emailList.innerHTML = '<div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>';
  
        // Fetch emails from the backend API using the access token
        const response = await fetch(`${apiUrl}/getUserDbEmails?email=${encodeURIComponent(email)}`, {
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        const emails = data.uniqueData;
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
          <h5 class="card-title">From: ${email.senderEmail || "Unknown"}</h5>
          <h6 class="card-subtitle mb-2 text-muted">Subject: ${email.ContentSubject || "No subject"}</h6>
          <p class="card-text"><strong>Body:</strong></p>
          <div class="email-body">${email.contentDescription || "No content"}</div>
                <button class="btn btn-warning mt-3 summarize-btn" data-email='${JSON.stringify(email)}'>Summarize It</button>
        </div>
      `;
      
      return emailItem;
    }
    function handleSummarizeClick(event) {
      const email = JSON.parse(event.target.getAttribute('data-email'));

      // Store the email data in sessionStorage
      sessionStorage.setItem("emailData", JSON.stringify(email));

      // Redirect to the summarization page
      window.location.href = 'index2.html';  // Replace with your actual redirect URL
  }
  document.getElementById('email-list').addEventListener('click', (event) => {
    if (event.target && event.target.classList.contains('summarize-btn')) {
        handleSummarizeClick(event);
    }
});
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

//   try {
//       console.log("About to call login API for Twitter");
//               console.log("Redirecting to Twitter authorization URL:", data.url);
//           window.location.href = data.url;
//       } else {
//           const errorData = await response.json();
//           alert('Error during Twitter login: ' + errorData.error);
//       }
//   } catch (error) {
//       console.error('Error during login request:', error);
//       alert('Error during login request: ' + error.message);
//   }
// });   const response = await fetch(`${apiUrl}/login-twitter`, {
//           method: 'GET',
//           credentials: 'include'
//       });

//       if (response.ok) {
//           const data = await response.json();
//