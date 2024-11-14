const apiUrl = 'https://backendlogictech.cloudbyvin.com'
// const apiUrl = 'http://localhost:3000'
// 

window.addEventListener('load', () => {
  const fetchEmailsBtn = document.getElementById('fetch-emails-btn');
  const summarizeSelectedBtn = document.getElementById('summarize-selected-btn');
  const email = localStorage.getItem('userEmail');
  
  // Event listener for "Fetch Emails" button click
  fetchEmailsBtn.addEventListener('click', async () => {
      try {
          const emailList = document.getElementById('email-list');
          emailList.innerHTML = '<div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>';

          // Fetch emails from the backend API
          const response = await fetch(`${apiUrl}/getUserDbEmails?email=${encodeURIComponent(email)}`, {});
          
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

  // Function to create an email card with a checkbox positioned outside the card
  function createEmailCard(email) {
      const container = document.createElement('div');
      container.className = 'd-flex align-items-start mb-3';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'select-email-checkbox me-2';
      checkbox.setAttribute('data-email', JSON.stringify(email));

      const emailCard = document.createElement('div');
      emailCard.className = 'card flex-grow-1';

      emailCard.innerHTML = `
          <div class="card-body">
              <h5 class="card-title">From: ${email.senderEmail || "Unknown"}</h5>
              <h6 class="card-subtitle mb-2 text-muted">Subject: ${email.ContentSubject || "No subject"}</h6>
              <p class="card-text"><strong>Body:</strong></p>
              <div class="email-body">${email.contentDescription || "No content"}</div>
              <button class="btn btn-warning mt-3 summarize-btn" data-email='${JSON.stringify(email)}'>Summarize It</button>
          </div>
      `;

      container.appendChild(checkbox);
      container.appendChild(emailCard);

      return container;
  }

  // Event handler for individual email summarization
  function handleSummarizeClick(event) {
      const email = JSON.parse(event.target.getAttribute('data-email'));
      sessionStorage.setItem("emailData", JSON.stringify(email));
      // Redirect to the summarization page
      window.location.href = 'index2.html'; // Replace with your actual redirect URL
  }

  // Event handler for checkbox selection
  document.getElementById('email-list').addEventListener('click', (event) => {
      if (event.target && event.target.classList.contains('summarize-btn')) {
          handleSummarizeClick(event);
      }
      
      if (event.target && event.target.classList.contains('select-email-checkbox')) {
          updateSummarizeSelectedButton();
      }
  });

  // Update "Summarize Selected Emails" button based on checkbox selections
  function updateSummarizeSelectedButton() {
      const selectedEmails = getSelectedEmails();
      if (selectedEmails.length > 0) {
          summarizeSelectedBtn.style.display = 'block';
      } else {
          summarizeSelectedBtn.style.display = 'none';
      }
  }

  // Get selected emails
  function getSelectedEmails() {
      const checkboxes = document.querySelectorAll('.select-email-checkbox:checked');
      return Array.from(checkboxes).map(checkbox => JSON.parse(checkbox.getAttribute('data-email')));
  }

  // Event listener for "Summarize Selected Emails" button
  summarizeSelectedBtn.addEventListener('click', () => {
      const selectedEmails = getSelectedEmails();
      // console.log("selectedEmailsselectedEmails",selectedEmails);
          const combinedContent = selectedEmails.reduce((acc, item) => acc + item.contentDescription + "\n", "");
          const obj = {
            contentDescription: combinedContent
          };
    // console.log("combinedContentcombinedContent",combinedContent);
      if (selectedEmails.length > 0) {
          sessionStorage.setItem("emailData", JSON.stringify(obj));

          window.location.href = 'index2.html'; // Replace with your actual redirect URL
      } else {
          alert("Please select at least one email to summarize.");
      }
  });
});
;
  
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