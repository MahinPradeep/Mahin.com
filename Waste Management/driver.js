/* =========================
   PAGE PROTECTION + DRIVER NAME
========================= */

document.addEventListener("DOMContentLoaded", function () {

    const session = JSON.parse(localStorage.getItem("driverSession"));

    // 🔒 If not logged in → redirect
    if (!session) {
        window.location.replace("driver-login.html");
        return;
    }

    // ✅ Show logged in driver name
    const nameElement = document.getElementById("driverName");
    if (nameElement) {
        nameElement.textContent = "Welcome, " + session.name;
    }

    // Load assigned reports after validation
    loadAssignedReports();
});


/* =========================
   LOAD ASSIGNED REPORTS
========================= */

function loadAssignedReports() {

    const reports = JSON.parse(localStorage.getItem("driverReports")) || [];
    const container = document.getElementById("driverReports");

    if (!container) return;

    if (reports.length === 0) {
        container.innerHTML = `<div class="empty-state">No Assigned Locations</div>`;
        return;
    }

    container.innerHTML = reports.map((r, index) => `
        <div class="driver-card">
            <h4>📍 ${r.address}</h4>

            <p><strong>Description:</strong> ${r.description}</p>
            <p><strong>Time:</strong> ${r.time}</p>

            ${r.image ? `<img src="${r.image}" class="driver-image">` : ""}

            <br><br>

            <input type="file" accept="image/*"
                onchange="uploadAfterPhoto(event, ${index})">
        </div>
    `).join("");
}


/* =========================
   UPLOAD AFTER PHOTO
========================= */

function uploadAfterPhoto(event, index) {

    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function () {

        let driverReports = JSON.parse(localStorage.getItem("driverReports")) || [];
        let completed = JSON.parse(localStorage.getItem("driverCompleted")) || [];

        const report = driverReports[index];
        if (!report) return;

        const session = JSON.parse(localStorage.getItem("driverSession"));

        const completedReport = {
            ...report,
            afterImage: reader.result,
            completedTime: new Date().toLocaleString(),
            driver: session ? session.name : "Assigned Driver"
        };

        completed.push(completedReport);

        // Remove from assigned list
        driverReports.splice(index, 1);

        localStorage.setItem("driverReports", JSON.stringify(driverReports));
        localStorage.setItem("driverCompleted", JSON.stringify(completed));

        alert("✅ Work Completed & Sent to Municipality!");

        loadAssignedReports();
    };

    reader.readAsDataURL(file);
}


/* =========================
   LOGOUT FUNCTION
========================= */

function logout() {

    // 🔥 Remove session properly
    localStorage.removeItem("driverSession");

    // Redirect to Home page
    window.location.replace("index.html");
}










