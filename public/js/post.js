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
console.log(el)
children = el.querySelectorAll('.lang')
console.log(children)
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
    intervElem.innerHTML = message.intervention
    genElem.innerHTML = message.general_audience
    tarElem.innerHTML = message.target_audience
    promElem.innerHTML = message.promoted_behavior
    switch (lang) {
        case 'eng':
            msgElem.innerHTML = message.message.English
            break;
        case 'fr':
            msgElem.innerHTML = message.message.French
            break;
        case 'swh':
            msgElem.innerHTML = message.message.Swahili
            break;
        default:
            msgElem.innerHTML = message.message.English
    }
}