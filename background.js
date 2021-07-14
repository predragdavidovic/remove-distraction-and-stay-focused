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
        initialWork: 25,
        initialPause: 5,
        isTimerActive: false,
        wasTimerElapsed: false,
        isExtensionIconClickable: false,
        areChangesDisabled: false
    });
});

chrome.alarms.onAlarm.addListener(() => {
    chrome.storage.local.get(['wasTimerElapsed','work', 'pause'], ({work, pause, wasTimerElapsed}) => {
        if (wasTimerElapsed) {
            badgeTimer(pause, wasTimerElapsed);
        } else {
            badgeTimer(work, wasTimerElapsed);
        }
    });
});

chrome.action.onClicked.addListener(() => {
    chrome.storage.local.get(['work', 'blockedPages', 'wasTimerElapsed','isExtensionIconClickable', 'pause'], ({work, blockedPages,isExtensionIconClickable, wasTimerElapsed, pause}) => {
        if (isExtensionIconClickable) {
            return;
        }
        chrome.storage.local.set({areChangesDisabled: true});
        chrome.runtime.sendMessage({message: true});

        blockCurrentlyOpenedPages(blockedPages);

        if (wasTimerElapsed) {
            unBlockPages(blockedPages);
            chrome.storage.local.set({pause, isTimerActive: false, isExtensionIconClickable: true}); 
            chrome.action.setBadgeBackgroundColor({color: '#46b04b'});
            chrome.action.setBadgeText({text: `${(pause)}m`});
        } else {
            chrome.storage.local.set({work, isTimerActive: true, isExtensionIconClickable: true});
            chrome.action.setBadgeBackgroundColor({color: '#c20404'});
            chrome.action.setBadgeText({text: `${(work)}m`});
        }
        chrome.alarms.create({periodInMinutes: 1});
    });
});

chrome.tabs.onActivated.addListener(({tabId, windowId}) => {
    chrome.storage.local.get(['isTimerActive','wasTimerElapsed'], ({isTimerActive, wasTimerElapsed}) => {
        if (!isTimerActive || wasTimerElapsed) {
            return;
        }
        chrome.tabs.query({active: true}).
        then(tab => blockPage(tab, tabId)).
        catch(err => console.error(err));
    });
});

chrome.tabs.onUpdated.addListener((tabId,changeInfo, tab) => {
    chrome.storage.local.get(['isTimerActive','wasTimerElapsed'], ({isTimerActive, wasTimerElapsed}) => {
        if (!isTimerActive || wasTimerElapsed) {
            return;
        }
        blockPage(tab, tabId);
    });
});

function badgeTimer(currentTime, wasTimerElapsed) {
    currentTime--;
    if (currentTime >= 1) {
        const time = wasTimerElapsed ? 'pause' : 'work';
        chrome.storage.local.set({[time]: currentTime});
        chrome.action.setBadgeText({text: `${(currentTime)}m`});
    } else {
        chrome.action.setBadgeText({text: ``});
        chrome.alarms.clearAll();
        chrome.runtime.sendMessage({message: false});
        chrome.storage.local.get(['initialWork','initialPause'], ({initialWork, initialPause}) => {
            chrome.storage.local.set({
                work: initialWork,
                pause: initialPause, 
                isTimerActive: false,
                wasTimerElapsed: !wasTimerElapsed,
                isExtensionIconClickable: false,
                areChangesDisabled: false
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
                executeScript(tabId);
            }
        });            
    });
}

function unBlockPages(blockedPages) {
    chrome.tabs.query({}).then(data => {
        data.forEach(tab => {
            blockedPages.forEach(blockedPage => {
               let blockedPageRegex = RegExp(`${blockedPage}*`, 'g');
                if (!!blockedPageRegex.exec(tab.url)) {
                    executeScript2(tab.id);
                }
            });
        })
    });
}

function blockCurrentlyOpenedPages(blockedPages) {
    chrome.tabs.query({}).then(data => {
        data.forEach(tab => {
            blockedPages.forEach(blockedPage => {
               let blockedPageRegex = RegExp(`${blockedPage}*`, 'g');
                if (!!blockedPageRegex.exec(tab.url)) {
                    executeScript(tab.id);
                }
            });
        })
    });
}

function executeScript(tabId) {
    chrome.scripting.executeScript({
        target: {tabId: tabId},
        files: ['./site/blockPageScript.js'],
    });
}

function executeScript2(tabId) {
    chrome.scripting.executeScript({
        target: {tabId: tabId},
        files: ['./site/unblockPages.js'],
    });
}