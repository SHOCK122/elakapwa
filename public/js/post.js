document.addEventListener('DOMContentLoaded', init, false);

let messages
let message
let requestURL = '../js/messages.json';
let request = new XMLHttpRequest()
request.open('GET', requestURL)
request.responseType = 'json'
request.send()
let msgIndex = 0
let lang = "eng"
const el = document.getElementById('langbar')
children = el.querySelectorAll('.lang')
for (let child of children) {
    child.addEventListener('click',changeLang)
}
const prev = document.getElementById('prev')
prev.onclick = () => getDifMessage(-1)
const next = document.getElementById('next')
next.onclick = () => getDifMessage(1)

async function init() {
    request.onload =  function () {
        messages = request.response
        console.log(messages)
        post()
    }
}

async function getRandomMessage(length) {
    let randomIndex = Math.floor(Math.random() * length)
    message = messages[randomIndex]
    msgIndex = randomIndex
}

function getSpecificMessage(i) {
    if (messages) {
        while (i >= messages.length) {
            i -= messages.length
        }
        while (i < 0) {
            i += (messages.length)
        }
    }
    message = messages[i]
    msgIndex=i
    post()
}

function getDifMessage(dif) {
    i = msgIndex + dif
    getSpecificMessage(i)
    console.log(i)
}

function changeLang() {
    lang = this.id
    post()
}

function post() {
    let language = 'eng'
    switch (lang) {
        case 'eng':
            language = 'English'
            break;
        case 'fr':
            language = 'French'
            break;
        case 'swh':
            language = 'Swahili'
            break;
        default:
            language = 'English'
    }
    if (message == undefined) {
        getRandomMessage(messages.length)
    }
    const idElem = document.querySelector('.message_id')
    const intervElem = document.querySelector('.intervention')
    const genElem = document.querySelector('.general_audience')
    const tarElem = document.querySelector('.target_audience')
    const promElem = document.querySelector('.promote')
    const msgElem = document.querySelector('.message')
    idElem.innerHTML = message.id
    message.intervention.English ? intervElem.innerHTML = message.intervention[language] : intervElem.innerHTML = message.intervention
    //intervElem.innerHTML = message.intervention
    genElem.innerHTML = message.general_audience
    tarElem.innerHTML = message.target_audience
    promElem.innerHTML = message.promoted_behavior
    msgElem.innerHTML = message.message[language]
    
}