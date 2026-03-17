let map;
let marker;

// Initialize map (temporary default)
map = L.map('map').setView([20.5937, 78.9629], 5); // India center

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

// ===============================
// HIGH ACCURACY GPS LOCATION
// ===============================
navigator.geolocation.getCurrentPosition(
    position => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        map.setView([lat, lng], 18);

        marker = L.marker([lat, lng]).addTo(map);

        document.getElementById("lat").value = lat;
        document.getElementById("lng").value = lng;

        fetchAddress(lat, lng);
    },
    error => {
        alert("⚠️ GPS access denied. Please enable location.");
    },
    {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
    }
);

// ===============================
// CLICK MAP → EXACT LOCATION
// ===============================
map.on("click", function (e) {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;

    if (marker) {
        marker.setLatLng(e.latlng);
    } else {
        marker = L.marker(e.latlng).addTo(map);
    }

    document.getElementById("lat").value = lat;
    document.getElementById("lng").value = lng;

    fetchAddress(lat, lng);
});

// ===============================
// REVERSE GEOCODING (ADDRESS)
// ===============================
function fetchAddress(lat, lng) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data && data.display_name) {
                document.getElementById("locationText").value = data.display_name;
            } else {
                document.getElementById("locationText").value = "Address not found";
            }
        })
        .catch(() => {
            document.getElementById("locationText").value = "Unable to fetch address";
        });
}

document.getElementById("reportForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const fileInput = document.getElementById("photo");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please upload an image");
        return;
    }

    const reader = new FileReader();

    reader.onload = function () {

        const report = {
            id: Date.now(), // ✅ UNIQUE ID
            address: document.getElementById("locationText").value,
            description: document.getElementById("wasteDesc").value,
            lat: parseFloat(document.getElementById("lat").value),  // ✅ number
            lng: parseFloat(document.getElementById("lng").value),  // ✅ number
            image: reader.result,
            time: new Date().toLocaleString(),
            status: "Pending" // ✅ VERY IMPORTANT
        };

        let reports = JSON.parse(localStorage.getItem("reports")) || [];
        reports.push(report);
        localStorage.setItem("reports", JSON.stringify(reports));

        alert("✅ Waste reported successfully!");
        e.target.reset();
    };

    reader.readAsDataURL(file);
});


// ===============================
// FEEDBACK STAR RATING
// ===============================
const stars = document.querySelectorAll(".rating span");
const ratingInput = document.getElementById("feedbackRating");

stars.forEach(star => {
    star.addEventListener("click", () => {
        const value = star.getAttribute("data-value");
        ratingInput.value = value;

        stars.forEach(s => {
            s.classList.toggle("active", s.getAttribute("data-value") <= value);
        });
    });
});

document.getElementById("feedbackForm").addEventListener("submit", e => {
    e.preventDefault();

    const feedback = {
        rating: document.getElementById("feedbackRating").value,
        text: document.getElementById("feedbackText").value,
        time: new Date().toLocaleString()
    };

    let feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
    feedbacks.push(feedback);
    localStorage.setItem("feedbacks", JSON.stringify(feedbacks));

    alert("✅ Feedback submitted!");
    e.target.reset();
});
