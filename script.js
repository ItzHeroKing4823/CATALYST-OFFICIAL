// The 33 townships of Yangon city (used by the sign up form and the account page)
const TOWNSHIP_NAMES = [
    "Ahlone", "Bahan", "Botahtaung", "Dagon", "Dagon Seikkan", "Dala", "Dawbon", "East Dagon",
    "Hlaing", "Hlaingthaya", "Insein", "Kamayut", "Kyauktada", "Kyimyindaing", "Lanmadaw", "Latha",
    "Mayangone", "Mingalar Taung Nyunt", "Mingaladon", "North Dagon", "North Okkalapa", "Pabedan",
    "Pazundaung", "Sanchaung", "Seikkan", "Seikkyi Kanaungto", "Shwepyitha", "South Dagon",
    "South Okkalapa", "Tamwe", "Thaketa", "Thingangyun", "Yankin"
];

function toggleMenu() {
    const menu = document.getElementById("mobileMenu");
    const button = document.getElementById("menuBtn");

    if (menu.classList.contains("open")) {
        menu.classList.remove("open");
        button.innerHTML = "&#9776;";
        button.setAttribute("aria-expanded", "false");
    } else {
        menu.classList.add("open");
        button.innerHTML = "&times;";
        button.setAttribute("aria-expanded", "true");
    }
}

function closeMenu() {
    const menu = document.getElementById("mobileMenu");

    if (menu.classList.contains("open")) {
        toggleMenu();
    }
}

document.getElementById("menuBtn").addEventListener("click", toggleMenu);

const footerYear = document.getElementById("footerYear");
if (footerYear != null) {
    footerYear.innerHTML = new Date().getFullYear();
}

function subscribe(event) {
    event.preventDefault();

    const email = document.getElementById("footerEmail").value.trim();
    const message = document.getElementById("footerMessage");

    if (email == "" || email.indexOf("@") == -1) {
        message.innerHTML = "Please type a correct email address.";
    } else {
        message.innerHTML = "Thank you for your interest in CATALYST! Newsletter subscriptions are not connected yet.";
        document.getElementById("footerEmail").value = "";
    }
}

const footerForm = document.getElementById("footerForm");
if (footerForm != null) {
    footerForm.addEventListener("submit", subscribe);
}

// ---------- Accounts (saved in this browser with localStorage) ----------

// Read a saved value. If it is missing or damaged, give back the fallback instead of crashing the page.
function readSaved(key, fallback) {
    try {
        const value = JSON.parse(localStorage.getItem(key));
        return value == null ? fallback : value;
    } catch (error) {
        return fallback;
    }
}

function getCurrentUser() {
    return readSaved("catalystUser", null);
}

function getUsers() {
    return readSaved("catalystUsers", []);
}

// Make one HTML element with a class and some text
function makeElement(tag, className, text) {
    const element = document.createElement(tag);

    element.className = className;
    element.textContent = text;
    return element;
}

function logout() {
    localStorage.removeItem("catalystUser");
    saveFlash("You have been logged out. See you again soon!", "info");
    window.location.href = "index.html";
}

// ---------- Short messages that stay on screen for a few seconds ----------

// Save a message so the next page can show it
function saveFlash(text, type) {
    sessionStorage.setItem("catalystFlash", JSON.stringify({ text: text, type: type }));
}

function showToast(text, type) {
    const toast = document.createElement("div");
    toast.className = "toast toast-" + type;
    toast.setAttribute("role", "status");

    let icon = "";
    switch (type) {
        case "success":
            icon = "\u2714 ";
            break;
        case "error":
            icon = "\u2716 ";
            break;
        default:
            icon = "\u2139 ";
    }
    toast.textContent = icon + text;
    document.body.appendChild(toast);

    // Click the message to close it. After that the click listener is removed.
    const closeToast = () => {
        toast.removeEventListener("click", closeToast);
        toast.remove();
    };
    toast.addEventListener("click", closeToast);
    setTimeout(closeToast, 6000);
}

function showFlash() {
    const saved = sessionStorage.getItem("catalystFlash");

    if (saved == null) {
        return;
    }
    const flash = JSON.parse(saved);
    sessionStorage.removeItem("catalystFlash");
    showToast(flash.text, flash.type);
}

// ---------- Header and menus ----------

function markCurrentPage() {
    let page = window.location.pathname.split("/").pop();
    if (page == "") {
        page = "index.html";
    }

    const links = document.querySelectorAll(".main-nav a, .mobile-menu ul a");
    links.forEach((link) => {
        if (link.getAttribute("href") == page) {
            link.classList.add("current");
            link.setAttribute("aria-current", "page");
        }
    });
}

function fillAccountButtons(box, firstName) {
    box.innerHTML = "";

    const accountLink = document.createElement("a");
    accountLink.href = "account.html";
    accountLink.className = "nav-btn nav-btn-white";
    accountLink.textContent = "Hi, " + firstName;
    box.appendChild(accountLink);

    const logoutButton = document.createElement("button");
    logoutButton.type = "button";
    logoutButton.className = "nav-btn nav-btn-teal";
    logoutButton.textContent = "Log Out";
    logoutButton.addEventListener("click", logout);
    box.appendChild(logoutButton);
}

function showLoginState() {
    const user = getCurrentUser();

    if (user == null) {
        return;
    }

    const firstName = user.name.split(" ")[0];
    fillAccountButtons(document.getElementById("headerButtons"), firstName);
    fillAccountButtons(document.getElementById("mobileAuth"), firstName);

    const signInLinks = document.getElementsByClassName("signin-link");
    while (signInLinks.length > 0) {
        signInLinks[0].href = "account.html";
        signInLinks[0].textContent = "My Account";
        signInLinks[0].classList.remove("signin-link");
    }

    const signUpLinks = document.getElementsByClassName("signup-link");
    while (signUpLinks.length > 0) {
        const item = signUpLinks[0].parentElement;
        if (item.tagName == "LI") {
            item.remove();
        } else {
            signUpLinks[0].remove();
        }
    }
}

// ---------- FAQ accordion (one answer open at a time) ----------

function setupAccordions() {
    const questions = document.querySelectorAll(".faq-question");

    questions.forEach((question) => {
        question.addEventListener("click", () => {
            const item = question.parentElement;
            const wasOpen = item.classList.contains("open");

            // Close every question in the same accordion first
            const group = item.parentElement.querySelectorAll(".faq-item");
            group.forEach((other) => {
                other.classList.remove("open");
                other.querySelector(".faq-question").setAttribute("aria-expanded", "false");
            });

            // Then open this one, unless it was already open
            if (!wasOpen) {
                item.classList.add("open");
                question.setAttribute("aria-expanded", "true");
            }
        });
    });
}

markCurrentPage();
showLoginState();
setupAccordions();
showFlash();

if (typeof AOS != "undefined") {
    AOS.init({ duration: 800, once: true, offset: 60 });
}
