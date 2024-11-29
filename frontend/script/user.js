document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = '';
  
    try {
      const response = await fetch('http://localhost:4000/api/user/login', {  
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
      if (response.ok) {
        messageDiv.textContent = 'Login successful!';
        messageDiv.style.color = 'green';

        localStorage.setItem('token', data.token);
        window.location.href = '/frontend/index.html';  
      } else {
        messageDiv.textContent = data.message;
        messageDiv.style.color = 'red';
      }
    } catch (err) {
      messageDiv.textContent = 'Something went wrong. Please try again.';
      messageDiv.style.color = 'red';
    }
  });
  