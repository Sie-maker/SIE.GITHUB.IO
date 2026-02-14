// ================= ADMIN SETTINGS =================
const adminPassword = "SIEadmin123"; // Change this to your secret password
let isAdmin = false;

// ================= LOAD REVIEWS =================
let reviews = JSON.parse(localStorage.getItem("reviews")) || [];

// ================= DISPLAY REVIEWS =================
function displayReviews() {
    const reviewContainer = document.getElementById("allReviews");
    const ratingDisplay = document.querySelector(".rating");
    const statsDisplay = document.querySelector(".review-stats");

    if (!reviewContainer || !ratingDisplay || !statsDisplay) return;

    reviewContainer.innerHTML = "";

    if (reviews.length === 0) {
        ratingDisplay.innerHTML = "Top Rating: 0 / 5";
        statsDisplay.innerHTML =
            "0 people rated this product <br> 0 customers wrote a review <br> 0 people read these reviews";
        return;
    }

    let totalRating = 0;

    reviews.forEach((review, index) => {
        totalRating += parseInt(review.rating);

        reviewContainer.innerHTML += `
            <div style="margin-bottom:20px;">
                <strong>${review.name}</strong> - ${"⭐".repeat(review.rating)} <br>
                ${review.message}
                ${isAdmin ? `
                <br>
                <button onclick="deleteReview(${index})"
                style="margin-top:5px;background:red;color:white;border:none;padding:5px 10px;border-radius:4px;">
                Delete
                </button>` : ""}
            </div>
        `;
    });

    let average = (totalRating / reviews.length).toFixed(1);

    ratingDisplay.innerHTML = "Top Rating: " + average + " / 5";
    statsDisplay.innerHTML =
        reviews.length + " people rated this product <br>" +
        reviews.length + " customers wrote a review <br>" +
        (reviews.length * 3) + " people read these reviews";
}

// ================= SUBMIT REVIEW =================
function submitReview() {
    const name = document.getElementById("reviewerName").value.trim();
    const rating = document.getElementById("reviewRating").value;
    const message = document.getElementById("reviewMessage").value.trim();

    if (name === "" || message === "") {
        alert("Please fill all fields");
        return;
    }

    reviews.push({ name, rating, message });
    localStorage.setItem("reviews", JSON.stringify(reviews));

    document.getElementById("reviewerName").value = "";
    document.getElementById("reviewMessage").value = "";

    displayReviews();
}

// ================= DELETE REVIEW (ADMIN ONLY) =================
function deleteReview(index) {
    if (!isAdmin) return;

    reviews.splice(index, 1);
    localStorage.setItem("reviews", JSON.stringify(reviews));
    displayReviews();
}

// ================= ADMIN LOGIN =================
function adminLogin() {
    const password = prompt("Enter Admin Password:");

    if (password === adminPassword) {
        isAdmin = true;
        alert("Admin mode activated");
        displayReviews();
    } else {
        alert("Wrong password");
    }
}

// ================= INITIAL LOAD =================
document.addEventListener("DOMContentLoaded", displayReviews);
function openMenu() {
    document.getElementById("sideMenu").classList.add("active");
    document.getElementById("menuOverlay").classList.add("active");
}

function closeMenu() {
    document.getElementById("sideMenu").classList.remove("active");
    document.getElementById("menuOverlay").classList.remove("active");
}

// Make functions available to HTML buttons
window.submitReview = submitReview;
window.deleteReview = deleteReview;
window.adminLogin = adminLogin;

// SECRET KEY TO SHOW ADMIN BUTTON
document.addEventListener("keydown", function(event) {
    if (event.ctrlKey && event.key.toLowerCase() === "a") {
        const btn = document.getElementById("adminBtn");
        if (btn.style.display === "none" || btn.style.display === "") {
            btn.style.display = "inline-block";
            alert("Admin button unlocked");
        }
    }
});
