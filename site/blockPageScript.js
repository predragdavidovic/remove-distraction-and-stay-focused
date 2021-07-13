if (typeof newDiv === 'undefined') {
    let newDiv = document.createElement("div");
    newDiv.style.zIndex = 99999999;
    newDiv.style.position = "absolute";
    newDiv.style.top= "0";
    newDiv.style.height = "100%";
    newDiv.style.width = "100%";
    newDiv.style.backgroundColor = 'red';
    newDiv.classList.add("__distraction-blocker__");
    document.body.append(newDiv);
}