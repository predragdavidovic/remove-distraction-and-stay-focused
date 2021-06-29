chrome.runtime.onInstalled.addListener(() => {
    const initiallyBlockedPages = [
        'facebook.com', 
        'twitter.com',
        'instagram.com',
        'youtube.com',
        'netflix.com',
    ];
    
    chrome.storage.local.set({
        blockedPages: initiallyBlockedPages, 
        work: 25,
        pause: 5,
        initialTimer: 25,
        isTimerActive: false,
    });
    console.log("App is installed sucessfully!");
});

chrome.alarms.onAlarm.addListener(() => {
    chrome.storage.local.get('work', ({work}) => {
        badgeTimer(work);
    });
});

chrome.action.onClicked.addListener(() => {
    chrome.storage.local.get('work', ({work}) => {
        chrome.storage.local.set({work, isTimerActive: true});
        chrome.alarms.create({periodInMinutes: 1});
        chrome.action.setBadgeText({text: `${(work)}m`});
    });
});

chrome.tabs.onActivated.addListener(({tabId, windowId}) => {
    chrome.storage.local.get('isTimerActive', ({isTimerActive}) => {
        if (!isTimerActive) {
            return;
        }
        chrome.tabs.query({active: true}).
        then(tab => blockPage(tab, tabId)).
        catch(err => console.error(err));
    });
});

chrome.tabs.onUpdated.addListener((tabId,changeInfo, tab) => {
    chrome.storage.local.get('isTimerActive', ({isTimerActive}) => {
        if (!isTimerActive) {
            return;
        }
        blockPage(tab, tabId);
    });
});

function badgeTimer(work) {
    work--;
    if (work >= 1) {
        chrome.storage.local.set({work});
        chrome.action.setBadgeText({text: `${(work)}m`});
    } else {
        chrome.action.setBadgeText({text: ``});
        chrome.alarms.clearAll();
        chrome.storage.local.get('initialTimer', ({initialTimer}) => {
            chrome.storage.local.set({
                work: initialTimer, 
                isTimerActive: false
            });
        });
    }
}

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
                    files: ['./site/script.js'],
                });
            }
        });            
    });
}