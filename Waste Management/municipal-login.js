document.getElementById("loginForm").addEventListener("submit", e => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === "admin" && password === "admin@123") {
        localStorage.setItem("municipalAuth", "true");
        location.href = "municipal.html";
    } else {
        document.getElementById("errorMsg").textContent =
            "Invalid username or password";
    }
});
