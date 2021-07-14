if (!hasClass()) {
    // create elements
    const container = document.createElement("div");
    const paragraphDescription = document.createElement("p");
    const paragraphMotivation = document.createElement("p");
    const image = document.createElement('img');

    // Add content to elements
    paragraphDescription.innerHTML = "Page is blocked until a break timer starts.";
    paragraphMotivation.innerHTML = "Be prodactive and stay focused!"
    image.src =  chrome.runtime.getURL("./images/forbiden.png");
    
    // style container
    container.style.zIndex = 99999999;
    container.style.position = "fixed";
    container.style.textAlign = "center";
    container.style.fontSize = "16px";
    container.style.paddingTop = "100px";
    container.style.fontFamily = "Arial, Helvetica, sans-serif";
    container.style.top= "0px";
    container.style.left = "0px"
    container.style.height = "100%";
    container.style.width = "100%";
    container.style.background = "rgb(228,228,228)";
    container.style.background = "linear-gradient(0deg, rgba(228,228,228,1) 17%, rgba(231,231,231,1) 47%, rgba(211,211,211,1) 73%, rgba(210,210,210,1) 87%)";
    image.style.width = "127px";
    image.style.height = "127px";
    image.style.margin = "0px auto";
    container.classList.add("__distraction-blocker__");
    paragraphDescription.style.margin ="16px 0px";
    paragraphMotivation.style.margin ="0px 0px";
    
    // append elements to container  
    container.append(image);
    container.append(paragraphDescription);
    container.append(paragraphMotivation);
    document.body.append(container);
    document.body.classList.add('___distraction-blocker___');
}

function hasClass() {
    return document.body.classList.contains('___distraction-blocker___')
}