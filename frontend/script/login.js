document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const messageDiv = document.getElementById("message");

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();  

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();
        const rememberMe = document.getElementById("remember-me").checked;

        
        if (!username || !password) {
            messageDiv.textContent = "Both fields are required.";
            return;
        }

        

        try {
    
            const response = await fetch("http://localhost:4000/api/user/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            
            if (response.ok) {
                const contentType = response.headers.get("Content-Type");
                let data;

                if (contentType && contentType.includes("application/json")) {
                    data = await response.json();
                } else {
                    
                    const text = await response.text();
                    console.error("Expected JSON, but got HTML: ", text);
                    messageDiv.textContent = "Unexpected response format from server.";
                    return;
                }

                
                if (rememberMe) {
                    
                    localStorage.setItem("user", JSON.stringify({ username, token: data.token }));
                }

                alert("Login successful!");
                window.location.href = "/frontend/dashboard.html";  
            } else {
            
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
