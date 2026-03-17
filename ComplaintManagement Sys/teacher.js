// Teacher Login Functionality
document.getElementById("teacherLoginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    if (username === "teacher" && password === "1234") {
        document.getElementById("loginSection").classList.add("hidden"); // Hide login form
        document.getElementById("complaintSection").classList.remove("hidden"); // Show complaint form
    } else {
        document.getElementById("loginError").classList.remove("hidden");
        setTimeout(() => document.getElementById("loginError").classList.add("hidden"), 3000);
    }
});

document.getElementById("teacherComplaintForm").addEventListener("submit", function (e) {
    e.preventDefault();

    let teacherName = document.getElementById("teacherName").value;
    let phone = document.getElementById("teacherPhone").value.trim(); // Ensure Phone Number Exists
    let dept = document.getElementById("Department").value;
    let issue = document.getElementById("issue").value;

    if (!phone) {
        alert("Phone number is required!");
        return;
    }

    let complaint = {
        name: teacherName,
        phone: phone,
        dept: dept,
        issue: issue,
        category: "teacher",
        status: "Pending"
    };

    let complaints = JSON.parse(localStorage.getItem("complaints")) || [];
    complaints.push(complaint);
    localStorage.setItem("complaints", JSON.stringify(complaints));

    document.getElementById("successMessage").classList.remove("hidden");
    setTimeout(() => document.getElementById("successMessage").classList.add("hidden"), 3000);

    this.reset();
});
