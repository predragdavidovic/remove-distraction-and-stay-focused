const textArea = document.getElementById("blocked_items_area");
const work = document.getElementById("work_in_minutes");
const pause = document.getElementById("pause_in_minutes");
const applyChanges = document.querySelector("button");

function setInitallyBlockedSites() {
    chrome.storage.local.get('blockedPages', ({blockedPages}) => {
        blockedPages.forEach(site => {
            textArea.value += `${site}
`;});
    })
};

applyChanges.addEventListener('click', e => {
    const blockedPages = textArea.value.split(/\s/).filter(url => url);
    chrome.storage.local.set({
        blockedPages,
        work: work.value, 
        pause: pause.value,
        initialTimer: work.value,
        isTimerActive: true,
    });
});

setInitallyBlockedSites();