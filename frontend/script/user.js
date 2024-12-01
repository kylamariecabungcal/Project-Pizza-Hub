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
      await Swal.fire({
        title: 'Login Successful',
        html: '<div>Redirecting to your dashboard...</div>',
        imageUrl: '/frontend/images/pizza.gif',
        imageAlt: 'Loading...',
        allowOutsideClick: false,
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 2000,
        width: '300px',
        imageWidth: 150,
        imageHeight: 150
      });

      localStorage.setItem('token', data.token);
      window.location.href = '/frontend/index.html';
    } else {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      
      Toast.fire({
        icon: "error",
        title: data.message || 'Login failed'
      });
    }
  } catch (err) {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    
    Toast.fire({
      icon: "error",
      title: "Something went wrong. Please try again."
    });
  }
});

function togglePassword() {
  const passwordField = document.getElementById("password");
  const toggleIcon = document.getElementById("toggle-icon");
  
  if (passwordField.type === "password") {
      passwordField.type = "text";
      toggleIcon.classList.remove("bi-eye");
      toggleIcon.classList.add("bi-eye-slash");
  } else {
      passwordField.type = "password";
      toggleIcon.classList.remove("bi-eye-slash");
      toggleIcon.classList.add("bi-eye");
  }
}

