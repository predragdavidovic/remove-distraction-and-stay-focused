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
        initialPause: 5,
        isTimerActive: false,
        wasTimerElapsed: false,
    });
    console.log("App is installed sucessfully!");
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
    chrome.storage.local.get(['work', 'wasTimerElapsed', 'pause'], ({work, wasTimerElapsed, pause}) => {
        if (wasTimerElapsed) {
            chrome.storage.local.set({pause, isTimerActive: false}); 
            chrome.action.setBadgeText({text: `${(pause)}m`});    
        } else {
            chrome.storage.local.set({work, isTimerActive: true});
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
        chrome.storage.local.get(['initialTimer','initialPause'], ({initialTimer, initialPause}) => {
            chrome.storage.local.set({
                work: initialTimer,
                pause: initialPause, 
                isTimerActive: false,
                wasTimerElapsed: !wasTimerElapsed,
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