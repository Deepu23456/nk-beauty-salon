// =======================
// NAVBAR SCRIPT (WORKS ON ALL PAGES)
// =======================
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");
const dropdown = document.querySelector(".dropdown");
const dropbtn = document.querySelector(".dropbtn");

if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        hamburger.classList.toggle("open");
    });
}

if (dropbtn && dropdown) {
    dropbtn.addEventListener("click", (e) => {
        if (window.innerWidth <= 900) {
            e.preventDefault();
            dropdown.classList.toggle("active");
        }
    });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        const targetId = this.getAttribute("href");

        if (document.querySelector(targetId)) {
            e.preventDefault();
            document.querySelector(targetId).scrollIntoView({
                behavior: "smooth"
            });

            if (window.innerWidth <= 900 && navLinks && hamburger) {
                navLinks.classList.remove("active");
                hamburger.classList.remove("open");
                if (dropdown) dropdown.classList.remove("active");
            }
        }
    });
});

document.querySelectorAll(".dropdown-content a").forEach(link => {
    link.addEventListener("click", () => {
        if (window.innerWidth <= 900 && navLinks && hamburger) {
            navLinks.classList.remove("active");
            hamburger.classList.remove("open");
            if (dropdown) dropdown.classList.remove("active");
        }
    });
});


// =======================
// GLOBAL BOOKING DATA
// =======================
let bookingData = null;


// =======================
// COMMON QR POPUP (WORKS EVERYWHERE)
// =======================
const qrOverlay = document.getElementById("qrOverlay");
const closeQR = document.getElementById("closeQR");
const payDetails = document.getElementById("payDetails");
const paidBtn = document.getElementById("paidBtn");

if (closeQR && qrOverlay) {
    closeQR.addEventListener("click", () => {
        qrOverlay.classList.remove("active");
        document.body.classList.remove("popup-open");
    });
}

if (qrOverlay) {
    qrOverlay.addEventListener("click", (e) => {
        if (e.target === qrOverlay) {
            qrOverlay.classList.remove("active");
            document.body.classList.remove("popup-open");
        }
    });
}


// =======================
// PAID BUTTON (WORKS EVERYWHERE)
// =======================
if (paidBtn) {
    paidBtn.addEventListener("click", () => {
        if (!bookingData) {
            alert("Booking data not found. Please book again.");
            return;
        }

        if (!bookingData.advance || bookingData.advance <= 0) {
            alert("Advance payment is compulsory!");
            return;
        }

        const invoiceText = `
NK Beauty Salon & Academy

Booking Confirmed ✅

Customer Name: ${bookingData.customerName}
Service: ${bookingData.serviceName}
Total Amount: ₹${bookingData.totalPrice}
Advance Paid: ₹${bookingData.advance}
Date: ${bookingData.date}
Time: ${bookingData.time}

Status: CONFIRMED
Thank you for booking!
`;

        const blob = new Blob([invoiceText], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "NK_Appointment_Invoice.txt";
        link.click();

        const salonNumber = "918851727183";

        const msg = `New Booking Confirmed ✅

Customer: ${bookingData.customerName}
Service: ${bookingData.serviceName}
Total: ₹${bookingData.totalPrice}
Advance Paid: ₹${bookingData.advance}
Date: ${bookingData.date}
Time: ${bookingData.time}`;

        const whatsappUrl = `https://wa.me/${salonNumber}?text=${encodeURIComponent(msg)}`;
        window.open(whatsappUrl, "_blank");

        qrOverlay.classList.remove("active");
        document.body.classList.remove("popup-open");
    });
}


// =======================
// SERVICE PAGE POPUP (beauty.html, nails.html etc.)
// =======================
const popupOverlay = document.getElementById("popupOverlay");
const closePopup = document.getElementById("closePopup");

const serviceNameInput = document.getElementById("serviceName");
const servicePriceInput = document.getElementById("servicePrice");

const payNowBtn = document.getElementById("payNowBtn");
const advanceAmount = document.getElementById("advanceAmount");

if (popupOverlay && closePopup) {
    closePopup.addEventListener("click", () => {
        popupOverlay.classList.remove("active");
        document.body.classList.remove("popup-open");
    });

    popupOverlay.addEventListener("click", (e) => {
        if (e.target === popupOverlay) {
            popupOverlay.classList.remove("active");
            document.body.classList.remove("popup-open");
        }
    });
}

// Book button click (auto fill service + price)
document.querySelectorAll(".book-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const service = btn.getAttribute("data-service");
        const price = btn.getAttribute("data-price");

        if (serviceNameInput) serviceNameInput.value = service;
        if (servicePriceInput) servicePriceInput.value = "₹" + price;

        if (popupOverlay) {
            popupOverlay.classList.add("active");
            document.body.classList.add("popup-open");
        }
    });
});

// Pay now (service page)
if (payNowBtn) {
    payNowBtn.addEventListener("click", () => {
        const name = document.getElementById("customerName").value;
        const service = serviceNameInput.value;
        const price = parseInt(servicePriceInput.value.replace("₹", ""));
        const date = document.getElementById("appointmentDate").value;
        const time = document.getElementById("appointmentTime").value;
        const advance = parseInt(advanceAmount.value);

        if (!name || !date || !time) {
            alert("Please fill all required details!");
            return;
        }

        if (!advance || advance <= 0) {
            alert("Advance payment is compulsory!");
            return;
        }

        if (advance > price) {
            alert("Advance amount cannot be greater than total price!");
            return;
        }

        bookingData = {
            customerName: name,
            serviceName: service,
            totalPrice: price,
            date: date,
            time: time,
            advance: advance
        };

        if (payDetails) {
            payDetails.innerHTML = `Pay <b>₹${advance}</b> for <b>${service}</b>`;
        }

        popupOverlay.classList.remove("active");
        qrOverlay.classList.add("active");
    });
}


// =======================
// HOME SERVICE POPUP (ONLY ON index.html)
// =======================
const openHomeServicePopup = document.getElementById("openHomeServicePopup");
const homePopupOverlay = document.getElementById("homePopupOverlay");
const closeHomePopup = document.getElementById("closeHomePopup");

const homeServiceSelect = document.getElementById("homeServiceSelect");
const addHomeServiceBtn = document.getElementById("addHomeServiceBtn");
const selectedItems = document.getElementById("selectedItems");
const homeTotalPrice = document.getElementById("homeTotalPrice");
const homePayNowBtn = document.getElementById("homePayNowBtn");

let selectedServices = [];

function updateHomeTotal() {
    if (!homeTotalPrice) return;
    let total = selectedServices.reduce((sum, item) => sum + item.price, 0);
    homeTotalPrice.value = "₹" + total;
}

function renderHomeSelectedServices() {
    if (!selectedItems) return;
    selectedItems.innerHTML = "";

    selectedServices.forEach((service, index) => {
        const div = document.createElement("div");
        div.classList.add("selected-item");

        div.innerHTML = `
      <span>${service.name} - ₹${service.price}</span>
      <button type="button" class="remove-btn" data-index="${index}">Remove</button>
    `;

        selectedItems.appendChild(div);
    });

    updateHomeTotal();

    document.querySelectorAll(".remove-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            const index = btn.getAttribute("data-index");
            selectedServices.splice(index, 1);
            renderHomeSelectedServices();
        });
    });
}

if (openHomeServicePopup && homePopupOverlay) {
    openHomeServicePopup.addEventListener("click", () => {
        homePopupOverlay.classList.add("active");
        document.body.classList.add("popup-open");
    });
}

if (closeHomePopup && homePopupOverlay) {
    closeHomePopup.addEventListener("click", () => {
        homePopupOverlay.classList.remove("active");
        document.body.classList.remove("popup-open");
    });

    homePopupOverlay.addEventListener("click", (e) => {
        if (e.target === homePopupOverlay) {
            homePopupOverlay.classList.remove("active");
            document.body.classList.remove("popup-open");
        }
    });
}

if (addHomeServiceBtn && homeServiceSelect) {
    addHomeServiceBtn.addEventListener("click", () => {
        const selectedOption = homeServiceSelect.options[homeServiceSelect.selectedIndex];
        const serviceName = selectedOption.value;
        const servicePrice = parseInt(selectedOption.getAttribute("data-price"));

        if (!serviceName) {
            alert("Please select a service first!");
            return;
        }

        selectedServices.push({
            name: serviceName,
            price: servicePrice
        });

        renderHomeSelectedServices();
        homeServiceSelect.value = "";
    });
}

if (homePayNowBtn) {
    homePayNowBtn.addEventListener("click", () => {
        const name = document.getElementById("homeCustomerName").value;
        const date = document.getElementById("homeAppointmentDate").value;
        const time = document.getElementById("homeAppointmentTime").value;
        const advance = parseInt(document.getElementById("homeAdvanceAmount").value);

        let total = selectedServices.reduce((sum, item) => sum + item.price, 0);

        if (!name || !date || !time) {
            alert("Please fill all required details!");
            return;
        }

        if (selectedServices.length === 0) {
            alert("Please add at least 1 service!");
            return;
        }

        if (total < 2000) {
            alert("Home services are available only for minimum ₹2000 order.");
            return;
        }

        if (!advance || advance <= 0) {
            alert("Advance payment is compulsory!");
            return;
        }

        if (advance > total) {
            alert("Advance amount cannot be greater than total amount!");
            return;
        }

        const serviceNames = selectedServices.map(s => s.name).join(", ");

        bookingData = {
            customerName: name,
            serviceName: serviceNames + " (Home Service)",
            totalPrice: total,
            date: date,
            time: time,
            advance: advance
        };

        if (payDetails) {
            payDetails.innerHTML = `Pay <b>₹${advance}</b> for <b>${bookingData.serviceName}</b>`;
        }

        homePopupOverlay.classList.remove("active");
        qrOverlay.classList.add("active");

        selectedServices = [];
        renderHomeSelectedServices();
    });
}