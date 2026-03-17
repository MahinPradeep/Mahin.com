document.getElementById("adminLoginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission

    const username = document.getElementById("adminUsername").value;
    const password = document.getElementById("adminPassword").value;
    const errorMsg = document.getElementById("adminLoginError");

    // Set your admin credentials
    const adminUser = "admin";
    const adminPass = "1234";

    if (username === adminUser && password === adminPass) {
        window.location.href = "admin-dashboard.html"; // Redirect to Admin Dashboard
    } else {
        errorMsg.classList.remove("hidden");
    }
});
