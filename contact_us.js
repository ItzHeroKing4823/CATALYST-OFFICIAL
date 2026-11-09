let contactForm = document.getElementById("contactForm");
let formMessage = document.getElementById("formMessage");

function sendContact(event) {
    event.preventDefault();

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let subject = document.getElementById("subject").value;
    let message = document.getElementById("message").value.trim();

    if (name == "" || email == "" || subject == "" || message == "") {
        formMessage.textContent = "Please complete all fields.";
        formMessage.style.background = "#fdeaea";
        formMessage.style.color = "#b42318";
        formMessage.classList.add("show");
    } else {
        formMessage.textContent = "Thank you for contacting CATALYST! A sending service must be connected to deliver your message.";
        formMessage.style.background = "#e5f7f3";
        formMessage.style.color = "#08785f";
        formMessage.classList.add("show");
        contactForm.reset();
    }
}

contactForm.addEventListener("submit", sendContact);
