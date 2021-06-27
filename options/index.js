const textArea = document.getElementById("blocked_items_area");
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
    chrome.storage.local.set({blockedPages});
});

setInitallyBlockedSites();