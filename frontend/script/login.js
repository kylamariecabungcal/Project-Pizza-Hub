document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const messageDiv = document.getElementById("message");

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();  // Prevent default form submission

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();
        const rememberMe = document.getElementById("remember-me").checked;

        // Validate that the username (email) and password are not empty
        if (!username || !password) {
            messageDiv.textContent = "Both fields are required.";
            return;
        }

        

        try {
            // Send login request to the backend
            const response = await fetch("http://localhost:4000/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            // Check if the response is JSON
            if (response.ok) {
                const contentType = response.headers.get("Content-Type");
                let data;

                if (contentType && contentType.includes("application/json")) {
                    data = await response.json();
                } else {
                    // If the response is not JSON, log the raw response (HTML)
                    const text = await response.text();
                    console.error("Expected JSON, but got HTML: ", text);
                    messageDiv.textContent = "Unexpected response format from server.";
                    return;
                }

                // Handle successful login
                if (rememberMe) {
                    // Save user info to localStorage if "Remember me" is checked
                    localStorage.setItem("user", JSON.stringify({ username, token: data.token }));
                }

                alert("Login successful!");
                window.location.href = "/frontend/dashboard.html";  // Redirect to dashboard
            } else {
                // Handle non-OK response
                const text = await response.text();
                console.error("Error response: ", text);
                messageDiv.textContent = "Login failed. Please check your credentials.";
            }
        } catch (error) {
            console.error("Error:", error);
            messageDiv.textContent = "An error occurred. Please try again later.";
        }
    });
});
