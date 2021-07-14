const textArea = document.getElementById("blocked_items_area");
const workInput = document.getElementById("work_in_minutes");
const pauseInput = document.getElementById("pause_in_minutes");
const workPreview = document.getElementById("work_present");
const pausePreview = document.getElementById("pause_present");
const warrningElement = document.querySelector('.warrning');
const changes = document.querySelector('.changes');
const applyChanges = document.querySelector("button");

function timeInProperForm(time) {
    const properForm = time > 1 ? 'minutes' : 'minute';
    return `${time} ${properForm}`;
}

function setCurrentSliderValues(work, pause) {
    workPreview.innerHTML = timeInProperForm(work);
    pausePreview.innerHTML = timeInProperForm(pause);
    workInput.value = work;
    pauseInput.value = pause;
}

function manageWarrning(isDisabled) {
    const manageClass = isDisabled ? 'add' : 'remove';
    warrningElement.classList[manageClass]('warrning-active');
}

function manageDisable(isDisabled) {
    const manageClass = isDisabled ? 'add' : 'remove';
    textArea.disabled = isDisabled;
    workInput.disabled = isDisabled;
    pauseInput.disabled = isDisabled;
    applyChanges.disabled = isDisabled;
    applyChanges.classList[manageClass]('disabled_element');
    workInput.classList[manageClass]('disabled_element');
    pauseInput.classList[manageClass]('disabled_element');
    manageWarrning(isDisabled);
}

function setValues() {
    chrome.storage.local.get(['blockedPages', 'work', 'pause', 'areChangesDisabled'], ({blockedPages, work, pause, areChangesDisabled}) => {
        blockedPages.forEach(site => {
            textArea.value += `${site}
`;});
    setCurrentSliderValues(work, pause);
    manageDisable(areChangesDisabled);
    })
};

setValues();

chrome.runtime.onMessage.addListener(({message}) => {
    manageDisable(message);
    manageWarrning(message);
    if (message) {
        changes.classList.remove('active');
    }
  });

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