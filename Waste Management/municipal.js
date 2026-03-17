const contentArea = document.getElementById("contentArea");

/* =========================
   REPORTS SECTION
========================= */

function showReports() {
    const reports = JSON.parse(localStorage.getItem("reports")) || [];

    contentArea.innerHTML = `
        <h3>Total Reports: ${reports.length}</h3>

        <div class="action-buttons">
            <button class="btn-clear" onclick="clearReports()">Clear All</button>
            <button class="btn-download" onclick="downloadReportsPDF()">Download PDF</button>
        </div>

        <div id="reportsList"></div>
    `;

    renderReports();
}
function renderReports() {
    const reports = JSON.parse(localStorage.getItem("reports")) || [];
    const completed = JSON.parse(localStorage.getItem("driverCompleted")) || [];
    const container = document.getElementById("reportsList");

    if (reports.length === 0 && completed.length === 0) {
        container.innerHTML = `<div class="empty-state">No Reports Available</div>`;
        return;
    }

    let html = "";

    // 🔵 Pending Reports
    reports.forEach((r, index) => {
        html += `
            <div class="report-card">
                <strong>Address:</strong> ${r.address} <br><br>

                <strong>Description:</strong><br>
                ${r.description}

                <br><br>
                <strong>Time:</strong> ${r.time} <br><br>

                ${r.image ? `<img src="${r.image}" class="report-image" onclick="openImage('${r.image}')">` : ""}

                <div class="card-actions">
                    <button class="btn-accept" onclick="acceptReport(${index})">Accept</button>
                    <button class="btn-reject" onclick="rejectReport(${index})">Reject</button>
                </div>
            </div>
        `;
    });

    // 🟢 Completed Reports from Driver
    completed.forEach((r) => {
        html += `
            <div class="report-card completed">
                <strong>✔ Completed - ${r.address}</strong><br><br>
                <strong>Driver:</strong> ${r.driver}<br>
                <strong>Driver Location:</strong> ${r.lat}, ${r.lng}<br><br>

                <strong>Before:</strong><br>
                ${r.image ? `<img src="${r.image}" class="report-image" onclick="openImage('${r.image}')">` : ""}

                <br><br>
                <strong>After Collection:</strong><br>
                ${r.afterImage ? `<img src="${r.afterImage}" class="report-image" onclick="openImage('${r.afterImage}')">` : ""}
            </div>
        `;
    });

    container.innerHTML = html;
}


function acceptReport(index) {

    let reports = JSON.parse(localStorage.getItem("reports")) || [];
    let driverReports = JSON.parse(localStorage.getItem("driverReports")) || [];

    const acceptedReport = reports[index];

    if (!acceptedReport) return;

    // Add status
    acceptedReport.status = "Accepted";

    // Push to driver storage
    driverReports.push(acceptedReport);

    // Remove from municipal pending list
    reports.splice(index, 1);

    // Save both
    localStorage.setItem("reports", JSON.stringify(reports));
    localStorage.setItem("driverReports", JSON.stringify(driverReports));

    alert("✅ Report Accepted & Sent to Driver!");

    showReports(); // reload UI
}



function rejectReport(id) {

    let reports = JSON.parse(localStorage.getItem("reports")) || [];

    const rejectedReport = reports.find(r => r.id === id);

    if (rejectedReport) {
        sendEmail(rejectedReport.email, "Rejected", rejectedReport.address);
    }

    // ❌ REMOVE FROM STORAGE COMPLETELY
    reports = reports.filter(r => r.id !== id);

    localStorage.setItem("reports", JSON.stringify(reports));

    alert("❌ Report Rejected & Deleted!");
    loadReports();
}


function clearReports() {
    localStorage.removeItem("reports");
    showReports();
}

function updateReport(index, value) {
    let reports = JSON.parse(localStorage.getItem("reports")) || [];
    reports[index].description = value;
    localStorage.setItem("reports", JSON.stringify(reports));
}

async function downloadReportsPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF("p", "mm", "a4");

    const reports = JSON.parse(localStorage.getItem("reports")) || [];
    if (reports.length === 0) {
        alert("No reports available to download.");
        return;
    }

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let y = 25;

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Municipal Waste Reports", pageWidth / 2, y, { align: "center" });

    y += 10;
    doc.line(margin, y, pageWidth - margin, y);
    y += 15;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    reports.forEach((r, i) => {

        if (y > pageHeight - 40) {
            doc.addPage();
            y = 20;
        }

        doc.setFont("helvetica", "bold");
        doc.text(`Report ${i + 1}`, margin, y);
        y += 8;

        doc.setFont("helvetica", "normal");

        doc.text(`Address: ${r.address}`, margin, y);
        y += 8;

        const splitDesc = doc.splitTextToSize(
            `Description: ${r.description}`,
            pageWidth - 2 * margin
        );
        doc.text(splitDesc, margin, y);
        y += splitDesc.length * 6;

        doc.text(`Time: ${r.time}`, margin, y);
        y += 10;

        if (r.image) {
            try {
                const imgWidth = 70;
                const imgHeight = 50;

                doc.addImage(r.image, "JPEG", margin, y, imgWidth, imgHeight);
                y += imgHeight + 10;
            } catch (e) {}
        }

        doc.line(margin, y, pageWidth - margin, y);
        y += 15;
    });

    doc.save("Municipal_Reports.pdf");
}

/* =========================
   FEEDBACK SECTION
========================= */

function showFeedback() {
    const feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];

    contentArea.innerHTML = `
        <h3>Total Feedback: ${feedbacks.length}</h3>

        <div class="action-buttons">
            <button class="btn-clear" onclick="clearFeedback()">Clear All</button>
            <button class="btn-download" onclick="downloadFeedbackPDF()">Download PDF</button>
        </div>

        <div id="feedbackList"></div>
    `;

    renderFeedback();
}

function renderFeedback() {
    const feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
    const container = document.getElementById("feedbackList");

    if (feedbacks.length === 0) {
        container.innerHTML = `<div class="empty-state">No Feedback Available</div>`;
        return;
    }

    container.innerHTML = feedbacks.map((f, index) => `
        <div class="feedback-card">
            <strong>Rating:</strong> ⭐ ${f.rating} <br><br>

            <strong>Message:</strong><br>
            <input type="text" value="${f.text}"
                onchange="updateFeedback(${index}, this.value)"
                style="width:100%; padding:8px; margin-top:6px; border-radius:6px; border:none;">

            <br><br>

            <strong>Time:</strong> ${f.time}

            <div class="card-actions">
                <button class="btn-delete" onclick="deleteFeedback(${index})">Delete</button>
            </div>
        </div>
    `).join("");
}

function deleteFeedback(index) {
    let feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
    feedbacks.splice(index, 1);
    localStorage.setItem("feedbacks", JSON.stringify(feedbacks));
    showFeedback();
}

function clearFeedback() {
    localStorage.removeItem("feedbacks");
    showFeedback();
}

function updateFeedback(index, value) {
    let feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
    feedbacks[index].text = value;
    localStorage.setItem("feedbacks", JSON.stringify(feedbacks));
}

function downloadFeedbackPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF("p", "mm", "a4");

    const feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
    if (feedbacks.length === 0) {
        alert("No feedback available.");
        return;
    }

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let y = 25;

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Citizen Feedback Report", pageWidth / 2, y, { align: "center" });

    y += 10;
    doc.line(margin, y, pageWidth - margin, y);
    y += 15;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    feedbacks.forEach((f, i) => {

        if (y > pageHeight - 40) {
            doc.addPage();
            y = 20;
        }

        doc.setFont("helvetica", "bold");
        doc.text(`Feedback ${i + 1}`, margin, y);
        y += 8;

        doc.setFont("helvetica", "normal");

        doc.text(`Rating: ${f.rating}/5`, margin, y);
        y += 8;

        const splitText = doc.splitTextToSize(
            `Message: ${f.text}`,
            pageWidth - 2 * margin
        );
        doc.text(splitText, margin, y);
        y += splitText.length * 6;

        doc.text(`Time: ${f.time}`, margin, y);
        y += 10;

        doc.line(margin, y, pageWidth - margin, y);
        y += 15;
    });

    doc.save("Citizen_Feedback.pdf");
}

/* =========================
   NEWS SECTION
========================= */

function showNews() {
    const news = JSON.parse(localStorage.getItem("news")) || [];

    contentArea.innerHTML = `
        <div class="news-section">
            <h3>Manage News</h3>

            <input type="text" id="newsInput" placeholder="Enter news...">
            <button onclick="addNews()">Add</button>

            <div id="newsList"></div>
        </div>
    `;

    renderNews();
}

function renderNews() {
    const news = JSON.parse(localStorage.getItem("news")) || [];
    const container = document.getElementById("newsList");

    if (news.length === 0) {
        container.innerHTML = `<div class="empty-state">No News Available</div>`;
        return;
    }

    container.innerHTML = news.map((n, index) => `
        <div class="news-item">
            <span>${n}</span>

            <div class="news-actions">
                <button class="news-update" onclick="updateNews(${index})">Update</button>
                <button class="news-delete" onclick="deleteNews(${index})">Delete</button>
            </div>
        </div>
    `).join("");
}

function addNews() {
    const input = document.getElementById("newsInput");
    if (!input.value.trim()) return;

    let news = JSON.parse(localStorage.getItem("news")) || [];
    news.push(input.value);
    localStorage.setItem("news", JSON.stringify(news));

    input.value = "";
    renderNews();
}

function deleteNews(index) {
    let news = JSON.parse(localStorage.getItem("news")) || [];
    news.splice(index, 1);
    localStorage.setItem("news", JSON.stringify(news));
    renderNews();
}

function updateNews(index) {
    let news = JSON.parse(localStorage.getItem("news")) || [];
    const updated = prompt("Update news:", news[index]);
    if (updated !== null) {
        news[index] = updated;
        localStorage.setItem("news", JSON.stringify(news));
        renderNews();
    }
}

/* =========================
   IMAGE MODAL
========================= */

function openImage(src) {
    const modal = document.createElement("div");
    modal.className = "image-modal";
    modal.innerHTML = `<img src="${src}">`;
    modal.style.display = "flex";

    modal.onclick = () => modal.remove();
    document.body.appendChild(modal);
}

/* =========================
   LOGOUT
========================= */

document.getElementById("logoutBtn").onclick = function () {
    window.location.href = "index.html";
};
/* =========================
   DRIVER COMPLETED REPORTS
========================= */

function showDriverReports() {

    const completed = JSON.parse(localStorage.getItem("driverCompleted")) || [];

    contentArea.innerHTML = `
        <h3>🚛 Driver Completed Reports (${completed.length})</h3>
        <div id="driverReportsList"></div>
    `;

    const container = document.getElementById("driverReportsList");

    if (completed.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                No Completed Reports Yet
            </div>
        `;
        return;
    }

    container.innerHTML = completed.map((r, index) => `
        <div class="report-card completed">

            <h4>📍 ${r.address}</h4>

            <p><strong>Description:</strong><br>
            ${r.description}</p>

            <p><strong>Reported Time:</strong> ${r.time}</p>

            <p><strong>Completed At:</strong> ${r.completedTime}</p>

            ${r.lat && r.lng ? 
                `<p><strong>Location:</strong> ${r.lat}, ${r.lng}</p>` 
                : ""}

            <div class="image-row">
                <div>
                    <strong>Before:</strong><br>
                    ${r.image ? `<img src="${r.image}" class="report-image">` : "No Image"}
                </div>

                <div>
                    <strong>After Collection:</strong><br>
                    ${r.afterImage ? `<img src="${r.afterImage}" class="report-image">` : "No Image"}
                </div>
            </div>

            <div class="card-actions">
    <button class="btn-download"
        onclick="downloadCompletedPDF(${index})">
        Download PDF
    </button>

    <button class="btn-delete"
        onclick="deleteCompletedReport(${index})">
        Delete
    </button>
</div>


        </div>
    `).join("");
}
function downloadCompletedPDF(index) {

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF("p", "mm", "a4");

    const completed = JSON.parse(localStorage.getItem("driverCompleted")) || [];
    const r = completed[index];
    if (!r) return;

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const margin = 20;
    const usableWidth = pageWidth - margin * 2;

    let y = 25;

    /* ===== TITLE ===== */
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Completed Waste Collection Report", pageWidth / 2, y, { align: "center" });

    y += 10;
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);

    y += 15;

    /* ===== BODY TEXT ===== */
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    // Address (wrapped properly)
    let addressText = doc.splitTextToSize(`Address: ${r.address}`, usableWidth);
    doc.text(addressText, margin, y);
    y += addressText.length * 6 + 4;

    // Description (wrapped properly)
    let descText = doc.splitTextToSize(`Description: ${r.description}`, usableWidth);
    doc.text(descText, margin, y);
    y += descText.length * 6 + 4;

    doc.text(`Reported Time: ${r.time}`, margin, y);
    y += 8;

    doc.text(`Completed Time: ${r.completedTime}`, margin, y);
    y += 8;

    if (r.lat && r.lng) {
        doc.text(`Location: ${r.lat}, ${r.lng}`, margin, y);
        y += 12;
    } else {
        y += 8;
    }

    /* ===== IMAGE SECTION ===== */
    const imgWidth = 75;
    const imgHeight = 55;

    if (r.image && r.afterImage) {

        doc.setFont("helvetica", "bold");
        doc.text("Before:", margin, y);
        doc.text("After:", pageWidth - margin - imgWidth, y);

        y += 5;

        doc.addImage(r.image, "JPEG", margin, y, imgWidth, imgHeight);
        doc.addImage(r.afterImage, "JPEG", pageWidth - margin - imgWidth, y, imgWidth, imgHeight);

        y += imgHeight + 10;

    } else if (r.image) {

        doc.setFont("helvetica", "bold");
        doc.text("Image:", margin, y);
        y += 5;

        doc.addImage(r.image, "JPEG", margin, y, imgWidth, imgHeight);
    }

    /* ===== FOOTER ===== */
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text(
        "Generated by Municipal Waste Management System",
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" }
    );

    doc.save("Completed_Report.pdf");
}
function deleteCompletedReport(index) {

    if (!confirm("Are you sure you want to delete this completed report?")) {
        return;
    }

    let completed = JSON.parse(localStorage.getItem("driverCompleted")) || [];

    if (!completed[index]) return;

    completed.splice(index, 1);

    localStorage.setItem("driverCompleted", JSON.stringify(completed));

    alert("🗑 Report Deleted Successfully!");

    showDriverReports(); // refresh list
}

function showRegistration() {
    const content = document.getElementById("contentArea");

    content.innerHTML = `
        <div class="registration-container">
            <h3>🚛 Driver Registration</h3>

            <form id="driverForm">
                <input type="text" id="driverName" placeholder="Driver Name" required>
                <input type="text" id="driverPhone" placeholder="Phone Number" required>
                <input type="text" id="licenseNo" placeholder="License Number" required>
                <input type="text" id="vehicleNo" placeholder="Vehicle Number" required>
                <input type="text" id="username" placeholder="Username" required>
                <input type="password" id="password" placeholder="Password" required>

                <button type="submit">Register Driver</button>
            </form>
        </div>
    `;

    document.getElementById("driverForm").addEventListener("submit", function(e) {
        e.preventDefault();

        const drivers = JSON.parse(localStorage.getItem("registeredDrivers")) || [];

        const newDriver = {
            name: document.getElementById("driverName").value,
            phone: document.getElementById("driverPhone").value,
            license: document.getElementById("licenseNo").value,
            vehicle: document.getElementById("vehicleNo").value,
            username: document.getElementById("username").value,
            password: document.getElementById("password").value
        };

        // Check if username already exists
        const exists = drivers.some(driver => driver.username === newDriver.username);

        if (exists) {
            alert("Username already exists! Try another.");
            return;
        }

        drivers.push(newDriver);
        localStorage.setItem("registeredDrivers", JSON.stringify(drivers));

        alert("Driver Registered Successfully!");

        document.getElementById("driverForm").reset();
    });
}
function showRegistrations() {
    const content = document.getElementById("contentArea");
    const drivers = JSON.parse(localStorage.getItem("registeredDrivers")) || [];

    if (drivers.length === 0) {
        content.innerHTML = `
            <div class="empty-state">
                🚫 No Registered Drivers Found
            </div>
        `;
        return;
    }

    let html = `
        <div class="action-buttons">
            <button class="btn-clear" onclick="clearAllDrivers()">Clear All</button>
            <button class="btn-download" onclick="downloadDriversPDF()">Download PDF</button>
        </div>
        <div id="driversList">
    `;

    drivers.forEach((driver, index) => {
        html += `
            <div class="driver-card">
                <h4>🚛 ${driver.name}</h4>
                <p><strong>Phone:</strong> ${driver.phone}</p>
                <p><strong>License:</strong> ${driver.license}</p>
                <p><strong>Vehicle:</strong> ${driver.vehicle}</p>
                <p><strong>Username:</strong> ${driver.username}</p>
                <p><strong>Password:</strong> ${driver.password}</p>

                <div class="card-actions">
                    <button class="btn-delete" onclick="deleteDriver(${index})">Delete</button>
                </div>
            </div>
        `;
    });

    html += `</div>`;
    content.innerHTML = html;
}

/* Delete single driver */
function deleteDriver(index) {
    const drivers = JSON.parse(localStorage.getItem("registeredDrivers")) || [];
    drivers.splice(index, 1);
    localStorage.setItem("registeredDrivers", JSON.stringify(drivers));
    showRegistrations();
}

/* Clear all drivers */
function clearAllDrivers() {
    if (confirm("Are you sure you want to delete all registered drivers?")) {
        localStorage.removeItem("registeredDrivers");
        showRegistrations();
    }
}

/* Download PDF */
function downloadDriversPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const drivers = JSON.parse(localStorage.getItem("registeredDrivers")) || [];

    doc.setFontSize(16);
    doc.text("Registered Drivers Report", 20, 20);

    let y = 30;

    drivers.forEach((driver, i) => {
        doc.setFontSize(12);
        doc.text(`Driver ${i + 1}`, 20, y);
        y += 8;
        doc.text(`Name: ${driver.name}`, 25, y); y += 8;
        doc.text(`Phone: ${driver.phone}`, 25, y); y += 8;
        doc.text(`License: ${driver.license}`, 25, y); y += 8;
        doc.text(`Vehicle: ${driver.vehicle}`, 25, y); y += 8;
        doc.text(`Username: ${driver.username}`, 25, y); y += 8;
        doc.text(`Password: ${driver.password}`, 25, y); y += 12;

        if (y > 270) {
            doc.addPage();
            y = 20;
        }
    });

    doc.save("Registered_Drivers.pdf");
}
function registerDriver() {

    const name = document.getElementById("driverName").value.trim();
    const username = document.getElementById("driverUsername").value.trim();
    const password = document.getElementById("driverPassword").value.trim();

    if (!name || !username || !password) {
        alert("Please fill all fields");
        return;
    }

    let drivers = JSON.parse(localStorage.getItem("registeredDrivers")) || [];

    // Prevent duplicate username
    const alreadyExists = drivers.find(d => d.username === username);
    if (alreadyExists) {
        alert("Username already exists!");
        return;
    }

    drivers.push({
        name: name,
        username: username,
        password: password
    });

    localStorage.setItem("registeredDrivers", JSON.stringify(drivers));

    alert("Driver Registered Successfully!");

    document.getElementById("driverName").value = "";
    document.getElementById("driverUsername").value = "";
    document.getElementById("driverPassword").value = "";
}
