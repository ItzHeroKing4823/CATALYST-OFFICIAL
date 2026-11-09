// Yangon Early Warning System (educational page).
// Every alert on this page is a real report. The facts and source links live in warning-data.js and below.

// ---------- 1. Information stored in arrays and objects ----------

const LEVELS = ["low", "moderate", "high", "critical"];
const LEVEL_TEXT = { low: "Low", moderate: "Moderate", high: "High", critical: "Critical" };

const DISEASES = {
    "Dengue Fever": {
        signs: "Sudden high fever, bad headache, pain behind the eyes, muscle and joint pain, rash.",
        prevention: [
            "Remove stagnant water (flower pots, drums, old tyres) every week to stop mosquitoes breeding.",
            "Cover water storage containers.",
            "Use mosquito nets and repellent, and wear long sleeves.",
            "Do not take aspirin or ibuprofen for fever. See a doctor early."
        ],
        extra: "Check on neighbours, clean drains together, and go to a clinic quickly if there is bleeding or severe stomach pain."
    },
    "Cholera": {
        signs: "Sudden watery diarrhoea, vomiting, leg cramps and a strong thirst.",
        prevention: [
            "Drink safe and treated water. Boil or chlorinate it.",
            "Maintain proper food hygiene. Keep food covered and eat it fresh.",
            "Wash hands with soap and water, especially before eating and after the toilet.",
            "Start oral rehydration salts at the first loose stool."
        ],
        extra: "Go to hospital if you cannot keep fluids down. Do not share a toilet with sick people without washing your hands."
    },
    "Measles": {
        signs: "Fever, cough, runny nose and red eyes, then a rash.",
        prevention: [
            "Check every child's vaccine card. Two doses of the measles vaccine are needed.",
            "Keep a child with fever and rash away from others.",
            "Call a clinic before visiting so staff can protect other patients.",
            "Wash hands regularly."
        ],
        extra: "Ask your clinic about catch-up vaccination for any child who missed a dose."
    },
    "Tuberculosis": {
        signs: "A cough that lasts more than 2 weeks, fever, night sweats, weight loss.",
        prevention: [
            "Get a TB test for any cough that lasts 2 weeks. Testing and treatment are free through the National TB Programme.",
            "Cover your cough and open windows for fresh air.",
            "Finish the whole course of TB medicine.",
            "Follow official public health announcements."
        ],
        extra: "People living with someone who has TB should ask a clinic for a check-up."
    },
    "Malaria": {
        signs: "Fever with chills and sweats, headache and tiredness.",
        prevention: [
            "Sleep under a treated mosquito net.",
            "Remove stagnant water around the home.",
            "Ask for a malaria test if you have a fever after travelling to a forest or border area.",
            "Follow official public health announcements."
        ],
        extra: "Do not wait. Get tested the same day if you had fever after a forest trip."
    },
    "Avian Influenza": {
        signs: "Fever, cough, sore throat and trouble breathing after contact with sick or dead birds.",
        prevention: [
            "Do not touch sick or dead birds.",
            "Wash hands with soap after touching poultry or eggs.",
            "Cook poultry and eggs thoroughly.",
            "Tell the local livestock or health office about sick poultry."
        ],
        extra: "Call a hospital before going in if you have a fever after contact with birds."
    }
};

// The name used for reports that cover all of Yangon and not one township
const REGION = "Yangon Region";

// Every alert has: township (or REGION), disease, level, kind ("alert" or "update"), date (shown), iso (for age check),
// cases (a number only when a verified township number exists, otherwise null), description and sources (a list).
const ALERTS = [];

// 1. Cholera: the four townships named by the Ministry of Health. The figures are for all of Yangon.
const CHOLERA_TEXT = "Named by the Ministry of Health (13 Aug 2026) as one of the townships with most cases. " +
    "Figures are for Yangon as a whole, not this township: on 13 Aug, 171 people were in hospital with diarrhoea (54 severe), more than 90 tested positive for cholera and 1 death was reported. " +
    "Later reports (18 Aug) said about 500 had been hospitalised, 149 tested positive on rapid tests and 3 people had died. No township numbers were published.";

for (let i = 0; i < ALERT_TOWNSHIPS.length; i++) {
    ALERTS.push({
        township: ALERT_TOWNSHIPS[i],
        disease: "Cholera",
        level: "high",
        kind: "alert",
        date: "18 August 2026",
        iso: "2026-08-18",
        cases: null,
        description: CHOLERA_TEXT,
        sources: [SOURCES.choleraMoh, SOURCES.news]
    });
}

// 2. Dengue: the Ministry of Health gave numbers for the Yangon region only
ALERTS.push({
    township: REGION,
    disease: "Dengue Fever",
    level: "moderate",
    kind: "alert",
    date: "17 August 2026",
    iso: "2026-08-17",
    cases: null,
    description: "From January to July 2026 Myanmar recorded over 3,500 dengue cases and 10 deaths. The Yangon region had the most, with more than 2,000 cases. " +
        "This is fewer than in the same period of 2025, but the ministry says dengue is most common in July and August. No township numbers were published.",
    sources: [SOURCES.dengueMoh]
});

// 3. Measles: an update, because no case was found in Myanmar and Yangon is not named
ALERTS.push({
    township: REGION,
    disease: "Measles",
    level: "low",
    kind: "update",
    date: "1 June 2026",
    iso: "2026-06-01",
    cases: null,
    description: "A large measles outbreak is happening in Bangladesh. The UN Health Cluster bulletin of May 2026 said no measles case had been found in Myanmar and the risk is highest in townships near the Bangladesh border (Rakhine and Chin). Yangon is not named. Check that every child has had two doses.",
    sources: [SOURCES.cluster]
});

// Words for the "no newer report" note
const NO_UPDATE_NOTE = "The European Centre for Disease Prevention and Control (ECDC) said on 27 Oct 2026 that Myanmar has sent no new cholera update since 28 Sep 2026. " +
    "This means we do not know the situation now. Older warnings may be out of date, so check the Ministry of Health.";

const SOURCE_LIST = [
    ["mohs", "Official announcements from Myanmar's Ministry of Health."],
    ["who", "Global health facts, disease fact sheets and outbreak news."],
    ["whoSearo", "WHO bulletins and situation reports for Myanmar and South-East Asia."],
    ["ecdcHome", "A monthly worldwide cholera update that shows which countries have reported."],
    ["unicef", "Health advice for children and families, including vaccination."]
];

// ---------- 2. Helper functions ----------

// Alerts that the page should use now (all of them are real)
function getVisibleAlerts() {
    return ALERTS;
}

// Active alerts are the ones that are not "update" notices
function getActiveAlerts() {
    let active = [];

    for (let i = 0; i < ALERTS.length; i++) {
        if (ALERTS[i].kind == "alert") {
            active.push(ALERTS[i]);
        }
    }
    return active;
}

// Alerts that apply to a township: its own alerts and the Yangon-wide ones
function getTownshipAlerts(name) {
    let found = [];

    for (let i = 0; i < ALERTS.length; i++) {
        if (ALERTS[i].township == name || ALERTS[i].township == REGION) {
            found.push(ALERTS[i]);
        }
    }
    return found;
}

// The overall risk of a township is the highest level of the alerts that name this township.
// Yangon-wide alerts do not raise it, because they say nothing about one township.
function getTownshipRisk(name) {
    let best = 0;

    for (let i = 0; i < ALERTS.length; i++) {
        if (ALERTS[i].township == name && ALERTS[i].kind == "alert" && LEVELS.indexOf(ALERTS[i].level) > best) {
            best = LEVELS.indexOf(ALERTS[i].level);
        }
    }
    return LEVELS[best];
}

// How many days ago a report was made
function daysOld(entry) {
    let ms = new Date() - new Date(entry.iso);
    return Math.floor(ms / 86400000);
}

function setBadge(element, level) {
    element.className = "risk-badge risk-" + level;
    element.textContent = LEVEL_TEXT[level];
}

// A list of source links, such as "Source: Xinhua ..., Bloomberg ..."
function makeSourceLine(entry) {
    let foot = makeElement("p", "ew-meta", "");
    foot.appendChild(document.createTextNode(entry.sources.length > 1 ? "Sources: " : "Source: "));

    for (let i = 0; i < entry.sources.length; i++) {
        let link = makeElement("a", "", entry.sources[i].name);
        link.href = entry.sources[i].url;
        link.target = "_blank";
        link.rel = "noopener";
        foot.appendChild(link);
        if (i < entry.sources.length - 1) {
            foot.appendChild(document.createTextNode("; "));
        }
    }
    return foot;
}

// ---------- 3. Dashboard ----------

function showDashboard() {
    let active = getActiveAlerts();
    let high = 0;
    let regionWide = 0;

    for (let i = 0; i < TOWNSHIP_NAMES.length; i++) {
        let risk = getTownshipRisk(TOWNSHIP_NAMES[i]);
        if (risk == "high" || risk == "critical") {
            high = high + 1;
        }
    }
    for (let i = 0; i < ALERTS.length; i++) {
        if (ALERTS[i].township == REGION) {
            regionWide = regionWide + 1;
        }
    }

    document.getElementById("totalAlerts").textContent = active.length;
    document.getElementById("highTownships").textContent = high;
    document.getElementById("regionNotices").textContent = regionWide;
    document.getElementById("lastUpdated").textContent = WARNING_UPDATED;
    document.getElementById("dataMode").textContent = "All entries are real reports. Newest report: " + WARNING_UPDATED + ". Last checked for news: " + WARNING_CHECKED + ". " + NO_UPDATE_NOTE;
}

// ---------- 4. Township search and selection ----------

function fillTownshipList() {
    let select = document.getElementById("townshipSelect");
    let search = document.getElementById("townshipSearch").value.toLowerCase().trim();
    let chosen = select.value;
    let shown = 0;

    select.innerHTML = "";
    for (let i = 0; i < TOWNSHIP_NAMES.length; i++) {
        let name = TOWNSHIP_NAMES[i];
        if (name.toLowerCase().includes(search)) {
            select.appendChild(new Option(name, name));
            shown = shown + 1;
        }
    }

    select.value = chosen;
    document.getElementById("townshipCount").textContent = shown + " of " + TOWNSHIP_NAMES.length + " townships shown.";
}

function showTownship() {
    let name = document.getElementById("townshipSelect").value;

    if (name == "") {
        return;
    }

    let list = getTownshipAlerts(name);
    let risk = getTownshipRisk(name);

    document.getElementById("townshipStart").hidden = true;
    document.getElementById("townshipInfo").hidden = false;
    document.getElementById("townshipName").textContent = name + " Township";
    setBadge(document.getElementById("townshipRisk"), risk);
    document.getElementById("hospitalLink").href = "hospital-directory.html?township=" + encodeURIComponent(name);

    // Diseases, case numbers, date and explanation
    let diseases = [];
    let cases = "Not available (no verified township numbers)";
    let date = "No report for this township";
    let named = false;

    for (let i = 0; i < list.length; i++) {
        if (!diseases.includes(list[i].disease)) {
            diseases.push(list[i].disease);
        }
        if (list[i].cases != null) {
            cases = list[i].cases + " (" + list[i].disease + ")";
        }
        if (list[i].township == name) {
            named = true;
        }
        if (list[i].township == name) {
            date = list[i].date;
        }
    }

    let why = "No report names this township. This does not mean there is no risk, because reports often name only some townships. Keep up basic prevention.";
    if (named) {
        why = "The Ministry of Health named this township in the August 2026 cholera reports, so this project rates it High. " + NO_UPDATE_NOTE;
    }

    if (diseases.length == 0) {
        diseases.push("None reported.");
    }

    document.getElementById("townshipDiseases").textContent = diseases.join(", ") + " (Yangon-wide reports included)";
    document.getElementById("townshipCases").textContent = cases;
    document.getElementById("townshipDate").textContent = date;
    document.getElementById("townshipWhy").textContent = why;

    showAlertCards(name);
    setPreventionFromTownship(name, list);
}

// ---------- 5. Disease alert cards ----------

function makeList(items) {
    let ul = document.createElement("ul");

    for (let i = 0; i < items.length; i++) {
        ul.appendChild(makeElement("li", "", items[i]));
    }
    return ul;
}

function showAlertCards(name) {
    let box = document.getElementById("alertCards");
    let note = document.getElementById("alertCardsNote");
    let list = getTownshipAlerts(name);

    box.innerHTML = "";
    document.getElementById("alertTownship").textContent = name + " Township";

    if (list.length == 0) {
        note.textContent = "No report names this township. Look at the Prevention Recommendations below to stay safe.";
        return;
    }
    note.textContent = list.length + " report(s) apply to this township.";

    for (let i = 0; i < list.length; i++) {
        let entry = list[i];
        let info = DISEASES[entry.disease];
        let card = makeElement("article", "ew-card", "");

        let top = makeElement("div", "ew-card-top", "");
        top.appendChild(makeElement("h3", "", entry.disease));
        let badge = makeElement("span", "", "");
        setBadge(badge, entry.level);
        top.appendChild(badge);
        card.appendChild(top);

        card.appendChild(makeElement("p", "ew-meta", "Area: " + entry.township + (entry.township == REGION ? " (all townships)" : " Township")));
        card.appendChild(makeElement("p", "", entry.description));
        if (daysOld(entry) > 60) {
            card.appendChild(makeElement("p", "ew-old", "This report is " + daysOld(entry) + " days old. Check the Ministry of Health for newer news."));
        }
        card.appendChild(makeElement("h4", "", "Warning signs and symptoms"));
        card.appendChild(makeElement("p", "", info.signs));
        card.appendChild(makeElement("h4", "", "Recommended preventive actions"));
        card.appendChild(makeList(info.prevention));

        let foot = makeSourceLine(entry);
        foot.appendChild(document.createElement("br"));
        foot.appendChild(document.createTextNode("Report date: " + entry.date));
        card.appendChild(foot);

        box.appendChild(card);
    }
}

// ---------- 6. Notifications with filters ----------

function noticeTitle(entry) {
    if (entry.kind == "update") {
        return "UPDATE";
    }
    switch (entry.level) {
        case "critical":
            return "CRITICAL ALERT";
        case "high":
            return "HIGH ALERT";
        case "moderate":
            return "MODERATE ALERT";
        default:
            return "LOW-RISK NOTICE";
    }
}

function showNotices() {
    let township = document.getElementById("filterTownship").value;
    let disease = document.getElementById("filterDisease").value;
    let risk = document.getElementById("filterRisk").value;

    let list = ALERTS.slice();
    // Highest risk first
    list.sort(function (a, b) {
        return LEVELS.indexOf(b.level) - LEVELS.indexOf(a.level);
    });

    let box = document.getElementById("noticeList");
    let shown = 0;
    box.innerHTML = "";

    for (let i = 0; i < list.length; i++) {
        let entry = list[i];

        // A township filter also keeps the Yangon-wide reports
        if (township != "all" && entry.township != township && entry.township != REGION) {
            continue;
        }
        if (disease != "all" && entry.disease != disease) {
            continue;
        }
        if (risk != "all" && entry.level != risk) {
            continue;
        }

        let item = makeElement("li", "notice notice-" + entry.level, "");
        let head = makeElement("strong", "", noticeTitle(entry) + ": ");
        item.appendChild(head);
        item.appendChild(document.createTextNode(entry.disease + " in " + entry.township + (entry.township == REGION ? " (all townships). " : ". ")));
        item.appendChild(document.createTextNode(entry.description));
        item.appendChild(makeElement("span", "notice-date", "Report date: " + entry.date));
        item.appendChild(makeSourceLine(entry));
        box.appendChild(item);
        shown = shown + 1;
    }

    document.getElementById("noticeCount").textContent = "Showing " + shown + " of " + list.length + " reports.";
    document.getElementById("noNotices").hidden = shown > 0;
}

function fillFilters() {
    let townshipFilter = document.getElementById("filterTownship");
    let diseaseFilter = document.getElementById("filterDisease");
    let riskFilter = document.getElementById("filterRisk");

    townshipFilter.appendChild(new Option("All townships", "all"));
    for (let i = 0; i < TOWNSHIP_NAMES.length; i++) {
        townshipFilter.appendChild(new Option(TOWNSHIP_NAMES[i], TOWNSHIP_NAMES[i]));
    }

    diseaseFilter.appendChild(new Option("All diseases", "all"));
    let preventSelect = document.getElementById("preventDisease");
    for (let name in DISEASES) {
        diseaseFilter.appendChild(new Option(name, name));
        preventSelect.appendChild(new Option(name, name));
    }

    riskFilter.appendChild(new Option("All risk levels", "all"));
    for (let i = 0; i < LEVELS.length; i++) {
        riskFilter.appendChild(new Option(LEVEL_TEXT[LEVELS[i]], LEVELS[i]));
    }
}

function clearFilters() {
    document.getElementById("filterTownship").value = "all";
    document.getElementById("filterDisease").value = "all";
    document.getElementById("filterRisk").value = "all";
    showNotices();
}

// ---------- 7. Prevention recommendations ----------

function showPrevention() {
    let disease = document.getElementById("preventDisease").value;
    let township = document.getElementById("townshipSelect").value;
    let info = DISEASES[disease];

    // The risk comes from the chosen township. If there is no report for this disease, it is Low.
    let risk = "low";
    let note = "Choose a township above to see its risk for this disease. Showing the Low-risk advice.";

    if (township != "") {
        note = "Risk for " + township + " Township:";
        let list = getTownshipAlerts(township);
        for (let i = 0; i < list.length; i++) {
            if (list[i].disease == disease && list[i].kind == "alert" && LEVELS.indexOf(list[i].level) > LEVELS.indexOf(risk)) {
                risk = list[i].level;
            }
        }
    }

    document.getElementById("preventRiskNote").textContent = note;
    setBadge(document.getElementById("preventRisk"), risk);
    document.getElementById("preventTitle").textContent = disease;

    let ul = document.getElementById("preventList");
    ul.innerHTML = "";
    for (let i = 0; i < info.prevention.length; i++) {
        ul.appendChild(makeElement("li", "", info.prevention[i]));
    }
    ul.appendChild(makeElement("li", "", "Follow official public health announcements."));

    // High and Critical risk get extra advice
    let extra = document.getElementById("preventExtra");
    if (risk == "high" || risk == "critical") {
        extra.textContent = "Extra care because the risk is " + LEVEL_TEXT[risk] + ": " + info.extra;
        extra.hidden = false;
    } else {
        extra.hidden = true;
    }
}

// When a township is chosen, pick the disease with the highest risk there
function setPreventionFromTownship(name, list) {
    let best = -1;
    let disease = document.getElementById("preventDisease").value;

    for (let i = 0; i < list.length; i++) {
        if (list[i].kind == "alert" && LEVELS.indexOf(list[i].level) > best) {
            best = LEVELS.indexOf(list[i].level);
            disease = list[i].disease;
        }
    }
    document.getElementById("preventDisease").value = disease;
    showPrevention();
}

// ---------- 8. Official sources ----------

function showSources() {
    let ul = document.getElementById("sourceList");

    for (let i = 0; i < SOURCE_LIST.length; i++) {
        let source = SOURCES[SOURCE_LIST[i][0]];
        let li = makeElement("li", "", "");
        let link = makeElement("a", "", source.name);
        link.href = source.url;
        link.target = "_blank";
        link.rel = "noopener";
        li.appendChild(link);
        li.appendChild(makeElement("span", "", SOURCE_LIST[i][1]));
        ul.appendChild(li);
    }
}

// ---------- 9. Start the page and connect the buttons ----------

fillFilters();
fillTownshipList();
showSources();
showDashboard();
showNotices();
showPrevention();

document.getElementById("townshipSearch").addEventListener("input", fillTownshipList);
document.getElementById("townshipSelect").addEventListener("change", showTownship);
document.getElementById("filterTownship").addEventListener("change", showNotices);
document.getElementById("filterDisease").addEventListener("change", showNotices);
document.getElementById("filterRisk").addEventListener("change", showNotices);
document.getElementById("clearFilters").addEventListener("click", clearFilters);
document.getElementById("preventDisease").addEventListener("change", showPrevention);

// Choose a township from the web address (early-warning.html?township=Latha) or from the signed in account
let wanted = new URLSearchParams(window.location.search).get("township");
let user = getCurrentUser();

if (wanted != null && TOWNSHIP_NAMES.includes(wanted)) {
    document.getElementById("townshipSelect").value = wanted;
} else if (user != null && user.township) {
    document.getElementById("townshipSelect").value = user.township;
}
if (user != null) {
    document.getElementById("townshipHint").textContent = user.township
        ? "Showing the home township saved in your account."
        : "Add your home township in your account page to see it here automatically.";
}
showTownship();
