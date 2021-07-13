const textArea = document.getElementById("blocked_items_area");
const workInput = document.getElementById("work_in_minutes");
const pauseInput = document.getElementById("pause_in_minutes");
const workPreview = document.getElementById("work_present");
const pausePreview = document.getElementById("pause_present");
const changes = document.querySelector('.changes');
const applyChanges = document.querySelector("button");

function timeInProperForm(time) {
    const properForm = time > 1 ? 'minutes' : 'minute';
    return `${time} ${properForm}`;
}

chrome.runtime.onMessage.addListener(function({message}) {
    console.log("I recived message ", message);
});

function setCurrentSliderValues(work, pause) {
    workPreview.innerHTML = timeInProperForm(work);
    pausePreview.innerHTML = timeInProperForm(pause);
    workInput.value = work;
    pauseInput.value = pause;
}

function setValues() {
    chrome.storage.local.get(['blockedPages', 'work', 'pause'], ({blockedPages, work, pause}) => {
        blockedPages.forEach(site => {
            textArea.value += `${site}
`;});
    setCurrentSliderValues(work, pause);
    })
};

setValues();

applyChanges.addEventListener('click', e => {
    const blockedPages = textArea.value.split(/\s/).filter(url => url);
    chrome.storage.local.set({
        blockedPages,
        work: workInput.value, 
        pause: pauseInput.value,
        initialWork: workInput.value,
        initialPause: pauseInput.value,
        isTimerActive: false,
        wasTimerElapsed: false,
    });
    changes.classList.add('active');
});

workInput.oninput = function() {
    workPreview.innerHTML = timeInProperForm(this.value);
}

pauseInput.oninput = function() {
    pausePreview.innerHTML = timeInProperForm(this.value);
}