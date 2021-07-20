function removeElementsByClass(className){
    document.body.classList.remove('___distraction-blocker___');
    const elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}

removeElementsByClass('__distraction-blocker__');