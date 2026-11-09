let user = getCurrentUser();

// Small number made from the email, so each member gets the same number every time
function hashEmail(email) {
    let total = 7;
    for (let i = 0; i < email.length; i++) {
        total = (total * 31 + email.charCodeAt(i)) % 10000;
    }
    return String(total).padStart(4, "0");
}

function showProfile() {
    let words = user.name.split(" ");
    let initials = words[0].charAt(0);
    if (words.length > 1) {
        initials = initials + words[1].charAt(0);
    }
    document.getElementById("avatar").textContent = initials.toUpperCase();

    let hour = new Date().getHours();
    let greeting = "Good evening";
    if (hour < 12) {
        greeting = "Good morning";
    } else if (hour < 18) {
        greeting = "Good afternoon";
    }
    document.getElementById("greeting").textContent = greeting + ",";
    document.getElementById("userName").textContent = user.name;
    document.getElementById("userEmail").textContent = user.email;

    let area = "Not set";
    if (user.township) {
        area = user.township + " Township, Yangon";
    }
    document.getElementById("userArea").textContent = area;
    document.getElementById("memberNo").textContent = "CAT-YGN-" + hashEmail(user.email);
    document.getElementById("statSince").textContent = user.joined;

    // Only these townships have a hospital listed in the directory
    const hospitalTownships = ["Ahlone", "Bahan", "Dagon", "Hlaing", "Insein", "Kamayut", "Kyauktada", "Lanmadaw",
        "Latha", "Mayangone", "Mingaladon", "North Okkalapa", "Sanchaung", "Tamwe", "Thingangyun", "Yankin"];
    if (hospitalTownships.includes(user.township)) {
        const link = document.getElementById("townshipLink");
        link.href = "hospital-directory.html?township=" + encodeURIComponent(user.township);
        link.getElementsByTagName("strong")[0].textContent = "Hospitals in " + user.township;
    }
}

function showArea() {
    const levelTag = document.getElementById("areaLevel");
    const advice = document.getElementById("areaAdvice");

    if (!user.township) {
        levelTag.className = "level-tag level-none";
        levelTag.textContent = "Township not set";
        document.getElementById("areaTitle").textContent = "Choose your home township";
        document.getElementById("areaText").textContent = "Pick your Yangon township in Edit passport to see the health warnings for your area.";
        advice.hidden = true;
        return;
    }

    document.getElementById("areaTitle").textContent = user.township + " Township";
    advice.textContent = "What to do: " + CHOLERA_ACTION;

    if (isAlertTownship(user.township)) {
        levelTag.className = "level-tag level-alert";
        levelTag.textContent = "ALERT: named in a cholera report";
        document.getElementById("areaText").textContent = "Your township was named in the August 2026 cholera reports.";
    } else {
        levelTag.className = "level-tag level-low";
        levelTag.textContent = "Not named in an alert";
        document.getElementById("areaText").textContent = "Your township was not named in the reports, but cholera was reported in Yangon in August 2026.";
    }

    document.getElementById("areaLink").href = "early-warning.html?township=" + encodeURIComponent(user.township);
    document.getElementById("areaLink").textContent = "See the early warning for " + user.township;

    const source = document.getElementById("areaSource");
    source.textContent = "Source: ";
    const link = document.createElement("a");
    link.href = SOURCES.news.url;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = SOURCES.news.name;
    source.appendChild(link);
    source.appendChild(document.createTextNode(". Reviewed " + WARNING_UPDATED + "."));
}

function showCalendar() {
    let months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
    let rows = [
        ["Dengue", [5, 6, 7, 8, 9]],
        ["Cholera", [5, 6, 7, 8, 9]],
        ["Malaria", [4, 5, 6, 7, 8, 9]]
    ];
    let now = new Date().getMonth();
    let box = document.getElementById("calendar");

    box.appendChild(makeElement("span", "", ""));
    for (let m = 0; m < 12; m++) {
        let season = "cool";
        if (m >= 2 && m <= 4) {
            season = "hot";
        } else if (m >= 5 && m <= 9) {
            season = "rainy";
        }
        let css = "month " + season;
        if (m == now) {
            css = css + " now";
        }
        box.appendChild(makeElement("span", css, months[m]));
    }

    for (let r = 0; r < rows.length; r++) {
        box.appendChild(makeElement("span", "row-label", rows[r][0]));
        for (let m = 0; m < 12; m++) {
            let css = "cell";
            if (rows[r][1].indexOf(m) != -1) {
                css = css + " on";
            }
            if (m == now) {
                css = css + " now";
            }
            box.appendChild(makeElement("span", css, ""));
        }
    }

    let text = "It is the cool season. Dengue, cholera and malaria usually fall, but keep emptying standing water.";
    if (now >= 2 && now <= 4) {
        text = "It is the hot season. Water is scarce, so keep stored drinking water covered, and clean storage drums before the rains. Malaria starts to rise in May.";
    } else if (now >= 5 && now <= 9) {
        text = "It is the rainy season, the peak time for dengue, cholera and malaria. Empty standing water weekly and boil drinking water.";
    }
    document.getElementById("seasonNow").textContent = text;
}

function showChecklist() {
    let items = [
        "Check every child's vaccine card for 2 measles-rubella doses",
        "Empty and scrub water storage drums every week",
        "Keep oral rehydration salts at home",
        "Sleep under a treated net when visiting forest or border areas",
        "Save the ambulance number 192 and know your nearest hospital",
        "Get a TB test for any cough that lasts 2 weeks"
    ];
    let key = "catalystChecklist_" + user.email;
    let saved = readSaved(key, []);

    let list = document.getElementById("checklist");

    function updateProgress() {
        let done = saved.length;
        document.getElementById("progressBar").style.width = Math.round(done * 100 / items.length) + "%";
        document.getElementById("progressText").textContent = done + " of " + items.length + " done";
    }

    for (let i = 0; i < items.length; i++) {
        let li = document.createElement("li");
        let label = document.createElement("label");
        let box = document.createElement("input");
        box.type = "checkbox";
        box.checked = saved.indexOf(i) != -1;

        box.addEventListener("change", function () {
            if (box.checked) {
                saved.push(i);
            } else {
                saved.splice(saved.indexOf(i), 1);
            }
            localStorage.setItem(key, JSON.stringify(saved));
            updateProgress();
        });

        label.appendChild(box);
        label.appendChild(makeElement("span", "", items[i]));
        li.appendChild(label);
        list.appendChild(li);
    }
    updateProgress();
}

function showAppointments() {
    let saved = readSaved("catalystAppointments", []);

    let upcoming = [];
    for (let i = 0; i < saved.length; i++) {
        if (saved[i].completed != true) {
            upcoming.push(saved[i]);
        }
    }
    upcoming.sort(function (a, b) {
        return String(a.date).localeCompare(String(b.date));
    });

    document.getElementById("statAppointments").textContent = saved.length;
    document.getElementById("statUpcoming").textContent = upcoming.length;

    if (upcoming.length == 0) {
        return;
    }
    document.getElementById("noAppointments").hidden = true;

    let list = document.getElementById("appointmentList");
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    for (let i = 0; i < upcoming.length && i < 4; i++) {
        let item = upcoming[i];
        let date = new Date(item.date + "T00:00:00");

        let row = makeElement("li", "appointment", "");

        let box = makeElement("div", "appointment-date", "");
        box.appendChild(makeElement("strong", "", date.getDate()));
        box.appendChild(makeElement("span", "", months[date.getMonth()]));
        row.appendChild(box);

        let text = makeElement("div", "", "");
        let reason = item.condition;
        if (reason == undefined || reason == "") {
            reason = "Appointment";
        }
        text.appendChild(makeElement("span", "reason", reason));
        text.appendChild(makeElement("span", "when", "Time: " + item.time));
        row.appendChild(text);

        list.appendChild(row);
    }
}

function showTip() {
    let tips = [
        "Wash your hands with soap and water for at least 20 seconds, especially before eating.",
        "Empty or cover containers that hold still water every week to stop mosquitoes breeding.",
        "Drink boiled or chlorinated water, and keep food covered and fresh.",
        "Ask your clinic which vaccinations you and your family need, and keep them up to date.",
        "Cover your cough or sneeze with a tissue or your elbow, then wash your hands.",
        "A fever that lasts more than two or three days is a reason to see a doctor. Test it for malaria if you were in a forest area.",
        "Keep oral rehydration salts at home. Start them at the first watery stool."
    ];
    let dayNumber = Math.floor(new Date() / 86400000);

    document.getElementById("tipText").textContent = tips[dayNumber % tips.length];
}

function fillTownshipOptions() {
    const select = document.getElementById("editTownship");
    select.appendChild(new Option("Not listed / not in Yangon", ""));

    TOWNSHIP_NAMES.forEach((name) => {
        select.appendChild(new Option(name + " Township", name));
    });
}

function saveProfile(event) {
    event.preventDefault();

    const newName = document.getElementById("editName").value.trim();
    const newTownship = document.getElementById("editTownship").value;

    if (newName.length < 2) {
        showToast("Please type your full name.", "error");
        return;
    }

    const users = getUsers();
    users.forEach((person) => {
        if (person.email == user.email) {
            person.name = newName;
            person.township = newTownship;
        }
    });
    localStorage.setItem("catalystUsers", JSON.stringify(users));

    user.name = newName;
    user.township = newTownship;
    localStorage.setItem("catalystUser", JSON.stringify(user));

    saveFlash("Your passport was saved.", "success");
    window.location.reload();
}

function deleteAccount() {
    if (!confirm("Delete your account from this browser? This cannot be undone.")) {
        return;
    }

    let users = getUsers();
    let remaining = [];
    for (let i = 0; i < users.length; i++) {
        if (users[i].email != user.email) {
            remaining.push(users[i]);
        }
    }
    localStorage.setItem("catalystUsers", JSON.stringify(remaining));
    localStorage.removeItem("catalystUser");
    localStorage.removeItem("catalystChecklist_" + user.email);
    saveFlash("Your account was deleted from this browser.", "info");
    window.location.href = "index.html";
}

if (user == null) {
    document.getElementById("loggedOut").hidden = false;
    openAuthModal("signin");
} else {
    document.getElementById("accountPreview").hidden = false;

    document.getElementById("loginBannerText").textContent = `\u2714 You are logged in as ${user.name} (${user.email})`;
    fillTownshipOptions();
    showProfile();
    showArea();
    showCalendar();
    showChecklist();
    showAppointments();
    showTip();

    document.getElementById("editName").value = user.name;
    document.getElementById("editTownship").value = user.township;

    let dialog = document.getElementById("editDialog");
    document.getElementById("editBtn").addEventListener("click", function () { dialog.showModal(); });
    document.getElementById("cancelEdit").addEventListener("click", function () { dialog.close(); });

    document.getElementById("logoutBtn").addEventListener("click", logout);
    document.getElementById("deleteBtn").addEventListener("click", deleteAccount);
    document.getElementById("editForm").addEventListener("submit", saveProfile);
}
