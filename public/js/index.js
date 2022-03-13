document.addEventListener('DOMContentLoaded', init, false);

function init() {
    if (!navigator.onLine) {
        const statusElem = document.querySelector('.page-status')
        statusElem.innerHTML = 'offline'
    }
    else {
        /*TO DO:
        check if files in cache
        load based on user input (provide estimated data usage)
        load only files not in cache
        (retry partial downloads? might be automatic)
        */
        //preLoader() //
    }
}

// function preLoader() {
//     let connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
//     if (connection) {
//         if (!['slow-2g', '2g', '3g'].includes(connection.effectiveType)) {
//             prefetchAudioFiles()   
//         }
//     }
// }

// function prefetchAudioFiles() {
//     prefetchAudioFile("../audio/Elaka50.ogg")
// }

// function prefetchAudioFile(url) {
//     let request = new Request(url)
//     caches.match(request).then(response => {
//         if (response) {
//             console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!Found ', request.url, ' in cache');
//             return response;
//         }
//         else {
//             console.log("not found!",request.url)
//         }
//     }
//     )
// }

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
