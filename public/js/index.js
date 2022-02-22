document.addEventListener('DOMContentLoaded', init, false);

function init() {
    if (!navigator.onLine) {
        const statusElem = document.querySelector('.page-status')
        statusElem.innerHTML = 'offline'
    }
}

function burger() {
    let ol = document.getElementsByClassName('overlay')[0];
    let menu = document.getElementsByClassName('modal')[0];
    if (menu.style.display === 'block') {
        menu.style.display = 'none';
        ol.style.zIndex = -1
    } else {
        menu.style.display = 'block';
        ol.style.zIndex = 1
    }
}
