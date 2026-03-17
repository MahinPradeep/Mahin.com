function loadComplaints(filter) {
    let complaints = JSON.parse(localStorage.getItem("complaints")) || [];
    let tableBody = document.getElementById("complaintTableBody");
    tableBody.innerHTML = "";

    complaints.forEach((complaint, index) => {
        if (filter === "all" || complaint.category.toLowerCase() === filter.toLowerCase()) {
            let row = `
                <tr>
                    <td>${complaint.name || "N/A"}</td>
                    <td>${complaint.phone ? complaint.phone : "N/A"}</td>
                    <td>${complaint.dept || "N/A"}</td>
                    <td>${complaint.issue || "N/A"}</td>
                    <td>${complaint.category || "N/A"}</td>
                    <td class="status ${complaint.status.toLowerCase()}">${complaint.status}</td>
                    <td>
                        <button class="action-button resolve" onclick="updateStatus(${index}, 'Resolved')">Resolve</button>
                        <button class="action-button reject" onclick="updateStatus(${index}, 'Rejected')">Reject</button>
                        <button class="action-button delete" onclick="deleteComplaint(${index})">Delete</button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        }
    });
}

// Update Complaint Status
function updateStatus(index, status) {
    let complaints = JSON.parse(localStorage.getItem("complaints")) || [];
    complaints[index].status = status;
    localStorage.setItem("complaints", JSON.stringify(complaints));
    loadComplaints("all");
}

// Delete Complaint
function deleteComplaint(index) {
    let complaints = JSON.parse(localStorage.getItem("complaints")) || [];
    complaints.splice(index, 1);
    localStorage.setItem("complaints", JSON.stringify(complaints));
    loadComplaints("all");
}

// Logout Function
function logoutAdmin() {
    window.location.href = "admin.html"; // Redirect to Admin Login Page
}

// Export to Excel Function
function exportToExcel() {
    let complaints = JSON.parse(localStorage.getItem("complaints")) || [];
    let csvContent = "data:text/csv;charset=utf-8,";

    // CSV Header
    csvContent += "Name,Phone,Department,Complaint,Category,Status\n";

    // CSV Data Rows
    complaints.forEach(complaint => {
        csvContent += `"${complaint.name}","${complaint.phone}","${complaint.dept}","${complaint.issue}","${complaint.category}","${complaint.status}"\n`;
    });

    // Download as CSV File
    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "complaints_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Load all complaints on page load
document.addEventListener("DOMContentLoaded", function () {
    loadComplaints("all");

    // Add Logout and Export Event Listeners
    document.getElementById("logoutButton").addEventListener("click", logoutAdmin);
    document.getElementById("exportButton").addEventListener("click", exportToExcel);
});
