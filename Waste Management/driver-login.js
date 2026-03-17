/* =========================
   AUTO REDIRECT IF ALREADY LOGGED IN
========================= */

document.addEventListener("DOMContentLoaded", function () {

    const session = localStorage.getItem("driverSession");

    if (session) {
        window.location.replace("driver.html");
    }
});


/* =========================
   DRIVER LOGIN FUNCTION
========================= */

function driverLogin() {

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const error = document.getElementById("loginError");

    error.textContent = "";

    if (!username || !password) {
        error.textContent = "Please enter username and password.";
        return;
    }

    // Get registered drivers from Municipal Dashboard
    const registeredDrivers = JSON.parse(localStorage.getItem("registeredDrivers"));

    if (!registeredDrivers || registeredDrivers.length === 0) {
        error.textContent = "No drivers registered by Municipal.";
        return;
    }

    // Check if driver exists
    const foundDriver = registeredDrivers.find(driver =>
        driver.username === username &&
        driver.password === password
    );

    if (!foundDriver) {
        error.textContent = "Invalid Username or Password.";
        return;
    }

    // Save session
    localStorage.setItem("driverSession", JSON.stringify({
        username: foundDriver.username,
        name: foundDriver.name
    }));

    // Redirect to dashboard
    window.location.replace("driver.html");
}
