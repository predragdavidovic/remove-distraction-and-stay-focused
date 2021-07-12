window.onload=function(){
    document.body.innerHTML = "Forbiden";
    const img = document.createElement('img');
    img.src = chrome.runtime.getURL('/images/focus.jpg');
    document.body.append(img);   
}