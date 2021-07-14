if (typeof newDiv === 'undefined') {
    let newDiv = document.createElement("div");
    newDiv.style.zIndex = 99999999;
    newDiv.style.position = "fixed";
    newDiv.style.top= "0px";
    newDiv.style.left = "0px"
    newDiv.style.height = "100%";
    newDiv.style.width = "100%";
    newDiv.style.backgroundColor = 'red';
    newDiv.classList.add("__distraction-blocker__");
    document.body.append(newDiv);
}