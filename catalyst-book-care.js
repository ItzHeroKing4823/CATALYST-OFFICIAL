const bookingForm = document.getElementById("bookingForm");
const calendarTitle = document.getElementById("calendarTitle");
const calendarDays = document.getElementById("calendarDays");
const appointmentDate = document.getElementById("appointmentDate");
const reminderList = document.getElementById("reminderList");
const hospitalSelect = document.getElementById("hospital");
const hospitalSearch = document.getElementById("hospitalSearch");

const bookingModal = new bootstrap.Modal(
    document.getElementById("bookingModal")
);

let displayedMonth = new Date();
let selectedDate = "";

let appointments = JSON.parse(
    localStorage.getItem("catalystAppointments")
) || [];

appointments.forEach(function (item) {
    if (!item.id) {
        item.id = Date.now() + Math.random();
    }

    if (item.completed === undefined) {
        item.completed = false;
    }
});

function saveAppointments() {
    localStorage.setItem(
        "catalystAppointments",
        JSON.stringify(appointments)
    );
}

function dateToString(date) {
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    if (month < 10) {
        month = "0" + month;
    }
    if (day < 10) {
        day = "0" + day;
    }

    return year + "-" + month + "-" + day;
}

const today = dateToString(new Date());

document.getElementById("dob").max = today;
appointmentDate.min = today;

const originalHospitalOptions = [];

for (let i = 0; i < hospitalSelect.options.length; i++) {
    originalHospitalOptions.push({
        value: hospitalSelect.options[i].value,
        text: hospitalSelect.options[i].textContent
    });
}

hospitalSearch.addEventListener("input", function () {
    const searchValue = hospitalSearch.value.toLowerCase().trim();

    hospitalSelect.innerHTML = "";

    originalHospitalOptions.forEach(function (hospital) {
        const option = document.createElement("option");

        option.value = hospital.value;
        option.textContent = hospital.text;

        hospitalSelect.appendChild(option);
    });

    if (searchValue !== "") {
        let matchingHospital = null;

        for (let i = 0; i < originalHospitalOptions.length; i++) {
            let hospital = originalHospitalOptions[i];

            if (matchingHospital == null && hospital.value !== "" &&
                hospital.text.toLowerCase().includes(searchValue)) {
                matchingHospital = hospital;
            }
        }

        if (matchingHospital) {
            hospitalSelect.value = matchingHospital.value;
        } else {
            hospitalSelect.value = "";
        }
    } else {
        hospitalSelect.value = "";
    }
});

hospitalSelect.addEventListener("change", function () {
    hospitalSearch.value = hospitalSelect.value;
});

function hasAppointmentOn(dateValue) {
    for (let i = 0; i < appointments.length; i++) {
        if (appointments[i].date === dateValue) {
            return true;
        }
    }
    return false;
}

function renderCalendar() {
    const year = displayedMonth.getFullYear();
    const month = displayedMonth.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    calendarTitle.textContent = displayedMonth.toLocaleDateString(
        "en-US",
        {
            month: "long",
            year: "numeric"
        }
    );

    calendarDays.innerHTML = "";

    for (let i = 0; i < firstDay; i++) {
        calendarDays.appendChild(
            document.createElement("div")
        );
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateValue = dateToString(date);

        const button = document.createElement("button");

        button.type = "button";
        button.className = "calendar-day";
        button.textContent = day;

        if (dateValue === selectedDate) {
            button.classList.add("selected");
        }

        if (hasAppointmentOn(dateValue)) {
            button.classList.add("has-booking");
        }

        if (dateValue < today) {
            button.disabled = true;
        }

        button.addEventListener("click", function () {
            selectedDate = dateValue;
            appointmentDate.value = dateValue;

            renderCalendar();
        });

        calendarDays.appendChild(button);
    }
}

function renderReminders() {
    reminderList.innerHTML = "";

    if (appointments.length === 0) {
        const message = document.createElement("p");

        message.className = "text-muted mb-0";
        message.textContent = "You do not have any appointments yet.";

        reminderList.appendChild(message);

        updateAppointmentSummary();
        return;
    }

    appointments.sort(function (a, b) {
        return (a.date + a.time).localeCompare(
            b.date + b.time
        );
    });

    appointments.forEach(function (item) {
        const reminder = document.createElement("div");

        reminder.className = "reminder-item";

        if (item.completed) {
            reminder.classList.add("completed");
        }

        const details = document.createElement("div");
        details.className = "reminder-details";

        const hospital = document.createElement("strong");
        hospital.textContent = item.hospital;

        const date = document.createElement("div");
        date.textContent = item.date + " - " + item.time;

        const patient = document.createElement("small");
        patient.className = "text-muted";
        patient.textContent = "Patient: " + item.name;

        const status = document.createElement("span");

        status.className = "reminder-status";

        if (item.completed) {
            status.classList.add("completed-status");
            status.textContent = "Completed";
        } else {
            status.classList.add("pending-status");
            status.textContent = "Pending";
        }

        details.appendChild(hospital);
        details.appendChild(date);
        details.appendChild(patient);
        details.appendChild(document.createElement("br"));
        details.appendChild(status);

        const actions = document.createElement("div");
        actions.className = "reminder-actions";

        const checkLabel = document.createElement("label");
        checkLabel.className = "reminder-check";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = item.completed;

        const checkText = document.createElement("span");
        checkText.textContent = "Completed";

        checkLabel.appendChild(checkbox);
        checkLabel.appendChild(checkText);

        checkbox.addEventListener("change", function () {
            let appointment = null;

            for (let i = 0; i < appointments.length; i++) {
                if (appointments[i].id === item.id) {
                    appointment = appointments[i];
                }
            }

            if (appointment) {
                appointment.completed = checkbox.checked;

                saveAppointments();
                renderReminders();
                renderCalendar();
            }
        });

        const cancelButton = document.createElement("button");

        cancelButton.type = "button";
        cancelButton.className = "btn btn-outline-danger btn-sm";
        cancelButton.innerHTML =
            '<i class="bi bi-trash me-1"></i>Cancel';

        cancelButton.addEventListener("click", function () {
            const confirmCancel = confirm(
                "Are you sure you want to cancel this appointment?"
            );

            if (confirmCancel) {
                let remaining = [];

                for (let i = 0; i < appointments.length; i++) {
                    if (appointments[i].id !== item.id) {
                        remaining.push(appointments[i]);
                    }
                }
                appointments = remaining;

                saveAppointments();
                renderReminders();
                renderCalendar();
            }
        });

        actions.appendChild(checkLabel);
        actions.appendChild(cancelButton);

        reminder.appendChild(details);
        reminder.appendChild(actions);

        reminderList.appendChild(reminder);
    });

    updateAppointmentSummary();
}

function updateAppointmentSummary() {
    const total = appointments.length;

    let completed = 0;

    for (let i = 0; i < appointments.length; i++) {
        if (appointments[i].completed) {
            completed = completed + 1;
        }
    }

    const pending = total - completed;

    document.getElementById("totalAppointments").textContent = total;
    document.getElementById("pendingAppointments").textContent = pending;
    document.getElementById("completedAppointments").textContent = completed;
}

function addSlipRow(label, value) {
    const row = document.createElement("div");
    row.className = "slip-row";

    const left = document.createElement("span");
    const right = document.createElement("strong");

    left.textContent = label;
    right.textContent = value || "Not provided";

    row.appendChild(left);
    row.appendChild(right);

    document.getElementById("bookingSlipDetails").appendChild(row);
}

document.getElementById("prevMonth").addEventListener("click", function () {
    displayedMonth.setMonth(displayedMonth.getMonth() - 1);

    renderCalendar();
});

document.getElementById("nextMonth").addEventListener("click", function () {
    displayedMonth.setMonth(displayedMonth.getMonth() + 1);

    renderCalendar();
});

appointmentDate.addEventListener("change", function () {
    selectedDate = appointmentDate.value;

    if (selectedDate) {
        displayedMonth = new Date(selectedDate + "T12:00:00");

        renderCalendar();
    }
});

bookingForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!bookingForm.checkValidity()) {
        bookingForm.reportValidity();
        return;
    }

    const date = appointmentDate.value;

    if (!date || date < today) {
        alert("Please choose today or a future appointment date.");
        return;
    }

    const dob = document.getElementById("dob").value;

    if (dob > today) {
        alert("Date of birth cannot be in the future.");
        return;
    }

    const booking = {
        id: Date.now() + Math.random(),
        hospital: hospitalSelect.value,
        name: document.getElementById("patientName").value.trim(),
        age: document.getElementById("age").value,
        dob: dob,
        phone: document.getElementById("phone").value.trim(),
        condition: document.getElementById("condition").value.trim(),
        symptoms: document.getElementById("symptoms").value.trim(),
        duration: document.getElementById("duration").value,
        notes: document.getElementById("notes").value.trim(),
        date: date,
        time: document.getElementById("appointmentTime").value,
        completed: false
    };

    appointments.push(booking);

    saveAppointments();

    const slip = document.getElementById("bookingSlipDetails");

    slip.innerHTML = "";

    addSlipRow("Hospital", booking.hospital);
    addSlipRow("Patient name", booking.name);
    addSlipRow("Age", booking.age);
    addSlipRow("Date of birth", booking.dob);
    addSlipRow("Phone", booking.phone);
    addSlipRow("Suspected condition", booking.condition);
    addSlipRow("Symptoms", booking.symptoms);
    addSlipRow("Duration", booking.duration);
    addSlipRow("Appointment date", booking.date);
    addSlipRow("Appointment time", booking.time);

    if (booking.notes) {
        addSlipRow("Additional notes", booking.notes);
    }

    renderCalendar();
    renderReminders();

    bookingModal.show();

    bookingForm.reset();

    selectedDate = "";
    appointmentDate.value = "";
    hospitalSearch.value = "";

    hospitalSearch.dispatchEvent(new Event("input"));

    renderCalendar();
});

bookingForm.addEventListener("reset", function () {
    selectedDate = "";
    appointmentDate.value = "";
    hospitalSearch.value = "";

    setTimeout(function () {
        hospitalSearch.dispatchEvent(new Event("input"));
        renderCalendar();
    }, 0);
});

document.getElementById("printSlip").addEventListener("click", function () {
    window.print();
});

document.getElementById("footerForm").addEventListener("submit", function (event) {
    event.preventDefault();

    document.getElementById("footerMessage").textContent =
        "Thank you! This demo form does not send or store email addresses.";

    this.reset();
});

document.getElementById("footerYear").textContent =
    new Date().getFullYear();

saveAppointments();
renderCalendar();
renderReminders();
