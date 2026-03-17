document.getElementById("complaintForm").addEventListener("submit", function (e) {
    e.preventDefault();

    let name = document.getElementById("name").value;
    let regNo = document.getElementById("regNo").value;
    let dept = document.getElementById("dept").value;
    let phone = document.getElementById("studentPhone").value; // Fixed phone ID
    let issue = document.getElementById("issue").value;

    let newComplaint = {
        name: name,
        regNo: regNo,
        dept: dept,
        phone: phone, // Now correctly getting phone number
        issue: issue,
        category: "student",
        status: "Pending"
    };

    let complaints = JSON.parse(localStorage.getItem("complaints")) || [];
    complaints.push(newComplaint);
    localStorage.setItem("complaints", JSON.stringify(complaints));

    document.getElementById("complaintForm").reset();
    
    // Show success message
    let successMessage = document.getElementById("successMessage");
    successMessage.classList.remove("hidden");
    setTimeout(() => successMessage.classList.add("hidden"), 3000);
});
