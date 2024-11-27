document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");
    const messageDiv = document.getElementById("message");

    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();

        
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?!.*\s).{8,20}$/;

        
        if (!passwordRegex.test(password)) {
            messageDiv.textContent = "Password must be 8-20 characters, include at least one uppercase letter, one number, and contain no spaces.";
            return;
        }

        if (password !== confirmPassword) {
            messageDiv.textContent = "Passwords do not match.";
            return;
        }

        try {
            const response = await fetch("http://localhost:4000/api/users/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Registration successful!");
                window.location.href = "/frontend/login.html";
            } else {
                messageDiv.textContent = data.message || "Registration failed.";
            }
        } catch (error) {
            console.error("Error:", error);
            messageDiv.textContent = "An error occurred. Please try again later.";
        }
    });
});