
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");
const dropdown = document.querySelector(".dropdown");

// Mobile menu toggle
hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});

// Dropdown toggle for mobile
dropdown.addEventListener("click", (e) => {
    if (window.innerWidth <= 900) {
        e.preventDefault();
        dropdown.classList.toggle("active");
    }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute("href")).scrollIntoView({
            behavior: "smooth"
        });
    });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute("href")).scrollIntoView({
            behavior: "smooth"
        });
    });
});