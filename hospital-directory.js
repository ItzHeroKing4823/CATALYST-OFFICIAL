function filterDirectory() {
    let search = document.getElementById("directorySearch").value.toLowerCase().trim();
    let type = document.getElementById("filterType").value;
    let township = document.getElementById("filterTownship").value;

    let items = document.getElementsByClassName("facility-item");
    let shown = 0;

    for (let i = 0; i < items.length; i++) {
        let itemName = items[i].getAttribute("data-name").toLowerCase();
        let itemTownship = items[i].getAttribute("data-township");
        let itemType = items[i].getAttribute("data-type");

        let matchSearch = itemName.includes(search) || itemTownship.toLowerCase().includes(search);
        let matchType = (type == "all" || itemType == type);
        let matchTownship = (township == "all" || itemTownship == township);

        if (matchSearch && matchType && matchTownship) {
            items[i].hidden = false;
            shown = shown + 1;
        } else {
            items[i].hidden = true;
        }
    }

    document.getElementById("visible-count").innerHTML = shown;
    document.getElementById("noResults").hidden = (shown > 0);
}

document.getElementById("directorySearch").addEventListener("input", filterDirectory);
document.getElementById("filterType").addEventListener("change", filterDirectory);
document.getElementById("filterTownship").addEventListener("change", filterDirectory);

let query = window.location.search;

if (query.indexOf("township=") != -1) {
    let select = document.getElementById("filterTownship");
    select.value = decodeURIComponent(query.split("township=")[1]);

    if (select.value == "") {
        select.value = "all";
    }
}

filterDirectory();
