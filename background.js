const initiallyBlockedPages = [
    'facebook.com', 
    'twitter.com',
    'instagram.com',
    'youtube.com',
    'netflix.com',
];
let enableApp = false;

function isPageBlocked(url, tab) {
    const currentTab = tab.url || tab[0].url;
    const regUrl = RegExp(`${url}*`, 'g');
    return !!regUrl.exec(currentTab);
}

function blockPage(tab, tabId) {
    chrome.storage.local.get('blockedPages', ({blockedPages}) => {
        blockedPages.map(url => {
            if (isPageBlocked(url, tab)) {
                chrome.scripting.executeScript({
                    target: {tabId: tabId},
                    files: ['script.js'],
                });
            }
        });            
    });
}

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({blockedPages: initiallyBlockedPages});
    console.log("App is installed sucessfully!");
});

chrome.action.onClicked.addListener(() => {
    if (!enableApp) {
        enableApp = true;
        setTimeout(() => {
            enableApp = false
        }, 1000 * 60);
    }
});

chrome.tabs.onActivated.addListener(({tabId, windowId}) => {
    if (!enableApp) {
        return;
    }
    chrome.tabs.query({active: true}).
    then(tab => blockPage(tab, tabId)).
    catch(err => console.error(err));
});

chrome.tabs.onUpdated.addListener((tabId,changeInfo, tab) => {
    if (!enableApp) {
        return;
    }
    blockPage(tab, tabId);
})
