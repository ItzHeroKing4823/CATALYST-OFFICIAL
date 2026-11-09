function checkSymptoms(event) {
    event.preventDefault();

    let ageSelect = document.getElementById("ageRange");
    let age = ageSelect.options[ageSelect.selectedIndex].text;

    let symptoms = [];
    let names = [];
    let boxes = document.getElementsByName("symptom");
    for (let i = 0; i < boxes.length; i++) {
        if (boxes[i].checked) {
            symptoms.push(boxes[i].value);
            names.push(boxes[i].parentElement.textContent.trim());
        }
    }

    let duration = "";
    let radios = document.getElementsByName("duration");
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            duration = radios[i].value;
        }
    }

    let redFlags = 0;
    let flagBoxes = document.getElementsByName("redflag");
    for (let i = 0; i < flagBoxes.length; i++) {
        if (flagBoxes[i].checked) {
            redFlags = redFlags + 1;
        }
    }

    let level = "routine";
    if (redFlags > 0) {
        level = "emergency";
    } else if (symptoms.length >= 3 || duration == "4-7 days" || duration == "More than 1 week") {
        level = "urgent";
    }

    let diseases = [];
    let notes = [];
    if (symptoms.includes("fever") && symptoms.includes("body_aches") && symptoms.includes("headache")) {
        diseases.push("Dengue Fever", "Influenza", "Malaria");
        notes.push("Dengue cases rise in Myanmar's rainy season (June to October). Malaria is a risk in forest and border areas such as Kayin, Tanintharyi and Southern Chin. Do not take aspirin or ibuprofen for a fever that may be dengue.");
    }
    if (symptoms.includes("cough") && (duration == "More than 1 week")) {
        diseases.push("Tuberculosis");
        notes.push("A cough lasting more than 2 weeks needs a TB test. TB testing and treatment are free through the National TB Programme.");
    }
    if (symptoms.includes("cough") || symptoms.includes("sore_throat")) {
        diseases.push("Avian Flu", "Upper Respiratory Infection");
    }
    if (symptoms.includes("diarrhea") || symptoms.includes("nausea")) {
        diseases.push("Cholera", "Gastroenteritis");
        notes.push("Cholera was confirmed in Yangon and Sittwe in August 2026. Start oral rehydration salts at the first watery stool, drink only boiled or chlorinated water and go to hospital if you cannot keep fluids down.");
    }
    if (symptoms.includes("rash")) {
        diseases.push("Measles", "Viral Exanthem");
        notes.push("Myanmar's measles vaccine coverage was 71% in 2025. Keep a child with fever and rash away from others and call a clinic first.");
    }
    if (diseases.length == 0) {
        diseases.push("Viral Fever / Non-Specific Infection");
    }

    let noteBox = document.getElementById("myanmarNote");
    if (notes.length > 0) {
        noteBox.textContent = "Myanmar note: " + notes.join(" ");
        noteBox.hidden = false;
    } else {
        noteBox.hidden = true;
    }

    let diseaseHtml = "";
    for (let i = 0; i < diseases.length; i++) {
        diseaseHtml = diseaseHtml + '<span class="disease-tag">' + diseases[i] + "</span>";
    }
    document.getElementById("diseaseList").innerHTML = diseaseHtml;

    let badge = document.getElementById("triageBadge");
    let headline = document.getElementById("triageHeadline");
    let list = document.getElementById("recommendationsList");

    if (level == "emergency") {
        badge.className = "result-badge badge-emergency";
        badge.textContent = "EMERGENCY CARE";
        headline.textContent = "Immediate Emergency Medical Care Required";
        list.innerHTML = "<li>Go to the nearest Emergency Department straight away.</li>" +
            "<li>Do not drive yourself if you have severe chest pain or confusion.</li>" +
            "<li>In Yangon call 192 for an ambulance.</li>";
    } else if (level == "urgent") {
        badge.className = "result-badge badge-urgent";
        badge.textContent = "URGENT CARE";
        headline.textContent = "See a Doctor within 24 Hours";
        list.innerHTML = "<li>Book an appointment with a doctor or visit an urgent care clinic.</li>" +
            "<li>Drink plenty of fluids.</li>" +
            "<li>Rest at home and stay away from others if the symptoms look infectious.</li>";
    } else {
        badge.className = "result-badge badge-routine";
        badge.textContent = "SELF-CARE";
        headline.textContent = "Self-Care & Symptom Monitoring";
        list.innerHTML = "<li>Rest and drink enough fluids.</li>" +
            "<li>Watch your symptoms for any change in the next 48 hours.</li>" +
            "<li>See a doctor if the symptoms get worse.</li>";
    }

    let chosen = "none";
    if (names.length > 0) {
        chosen = names.join(", ");
    }
    document.getElementById("summaryText").textContent =
        "Age: " + age + ". Symptoms: " + chosen + ". Duration: " + duration + ".";

    document.getElementById("startText").hidden = true;
    document.getElementById("resultBox").hidden = false;
    document.getElementById("resultArea").scrollIntoView({ behavior: "smooth", block: "nearest" });
}

document.getElementById("symptomForm").addEventListener("submit", checkSymptoms);

function resetChecker() {
    document.getElementById("symptomForm").reset();
    document.getElementById("resultBox").hidden = true;
    document.getElementById("startText").hidden = false;
}

document.getElementById("resetBtn").addEventListener("click", resetChecker);
