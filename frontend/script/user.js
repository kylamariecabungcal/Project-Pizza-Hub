document.getElementById('loginForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const messageDiv = document.getElementById('message');
  messageDiv.textContent = '';  // Clear any previous messages

  try {
    const response = await fetch('http://localhost:4000/api/user/login', {  // Correct API route
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',  // Ensure the Content-Type is set to application/json
      },
      body: JSON.stringify({ username, password }),  // Send username and password as JSON
    });

    const data = await response.json();  // Parse the response as JSON
    if (response.ok) {
      messageDiv.textContent = 'Login successful!';
      messageDiv.style.color = 'green';

      // Store token if login is successful
      localStorage.setItem('token', data.token);
      window.location.href = '/frontend/index.html';  // Redirect after successful login
    } else {
      messageDiv.textContent = data.message;
      messageDiv.style.color = 'red';
    }
  } catch (err) {
    messageDiv.textContent = 'Something went wrong. Please try again.';
    messageDiv.style.color = 'red';
  }
});
