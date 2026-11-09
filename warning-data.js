// The real, sourced facts that are shared by the early warning page, the home page and the account page.
// Every fact here comes from a report we found online (see the links). Nothing is invented.
// How to update: read the sources again, change the facts below, then change the two dates.

const WARNING_UPDATED = "18 August 2026";   // date of the newest report we use
const WARNING_CHECKED = "9 November 2026";  // day we last searched for newer official reports

const SOURCES = {
    news: {
        name: "Bloomberg via The Star (18 Aug 2026)",
        url: "https://www.thestar.com.my/aseanplus/aseanplus-news/2026/08/18/major-alert-in-myanmar-as-cholera-outbreak-kills-three-in-myanmar-hundreds-more-fall-ill"
    },
    choleraMoh: {
        name: "Xinhua: Ministry of Health cholera update (13 Aug 2026)",
        url: "http://www.xinhuanet.com/english/asiapacific/20260813/56e4b5f48d0a4835831f551f83dd1f48/c.html"
    },
    dengueMoh: {
        name: "Xinhua: Ministry of Health dengue figures (17 Aug 2026)",
        url: "https://english.news.cn/20260817/951cbb66721243b5946a7941d0298b39/c.html"
    },
    ecdc: {
        name: "ECDC cholera monthly update (27 Oct 2026)",
        url: "https://www.ecdc.europa.eu/en/public-health-events/2006-eip-00031/2026-10-27"
    },
    cluster: {
        name: "Myanmar Health Cluster Bulletin (May 2026)",
        url: "https://progressivevoicemyanmar.org/2026/06/01/myanmar-health-cluster-bulletin-may-2026"
    },
    mohs: { name: "Ministry of Health (MoHS)", url: "https://www.mohs.gov.mm/" },
    who: { name: "World Health Organization (WHO)", url: "https://www.who.int/" },
    whoSearo: { name: "WHO South-East Asia Region", url: "https://www.who.int/southeastasia" },
    unicef: { name: "UNICEF", url: "https://www.unicef.org/" },
    ecdcHome: { name: "ECDC monthly cholera overview", url: "https://www.ecdc.europa.eu/en/all-topics-z/cholera/surveillance-and-disease-data/cholera-monthly" }
};

// Townships named in the August 2026 cholera reports
const ALERT_TOWNSHIPS = ["Kyauktada", "Lanmadaw", "Latha", "Pabedan"];

const CHOLERA_ACTION = "Start oral rehydration salts at the first loose stool. Drink only boiled or chlorinated water. Go to hospital if you cannot keep fluids down.";

function isAlertTownship(name) {
    return ALERT_TOWNSHIPS.includes(name);
}
