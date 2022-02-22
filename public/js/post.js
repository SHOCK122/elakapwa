let allMessages
let filteredMessages = []
let currentMessage
let requestURL = '../js/messages.json';
let msgIndex = 0
let interventions
let general_audiences
let target_audiences
let promoted_behaviors
let filter = {
    interventions: [],//["Assisted delivery"],
    target_audiences: []//["Pregnant women", "The mother", "Women"],
    //general_audiences: ["Women", "Community", "Woman in labor"],
    //promoted_behaviors: []
}
let lang = "eng"
const el = document.getElementById('langbar')
children = el.querySelectorAll('.lang')
for (let child of children) {
    child.addEventListener('click', changeLang)
}


function setCategories() {
    language = getLanguage()
    interventions = [...new Set(allMessages.map(mes => mes.intervention[getLanguage()].toLowerCase().trim()).sort())]
    general_audiences = [...new Set(allMessages.map(mes => mes.general_audience.toLowerCase().trim()).sort().reverse())]
    target_audiences = [...new Set(allMessages.map(mes => mes.target_audience[getLanguage()].toLowerCase().trim()).sort().reverse())]
    promoted_behaviors = [...new Set(allMessages.map(mes => mes.promoted_behavior[getLanguage()].toLowerCase().trim()).sort().reverse())]
    print_debug(target_audiences, "target audiences")
}

function setFilters(categoryType, category) {

}

function caseTrimFilter() {
    for (let cat in filter) {
        filter[cat].forEach(function (t, i, itself) {
            itself[i] = t.toLowerCase().trim()
        })
    }
}

function applyFilters() {
    isEmpty = true
    for (let cat in filter) {
        while (isEmpty) {
            cat.length ? isEmpty = false : true
        }
    }
    if (isEmpty) {
        caseTrimFilter()
        for (let i in allMessages) {
            if (filter.interventions.includes(allMessages[i].intervention[getLanguage()].toLowerCase().trim())) {
                filteredMessages.push(allMessages[i])
            }
            else if (filter.target_audiences.includes(allMessages[i].target_audience[getLanguage()].toLowerCase().trim())) {
                filteredMessages.push(allMessages[i])
            }
        }
    }
    else {
        filteredMessages = allMessages.slice()
    }
}

function getLanguage() {
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
    print_debug(language, "language", true)
    return language
}

function getSpecificMessage(i) {
    if (filteredMessages) {
        while (i >= filteredMessages.length) {
            i -= filteredMessages.length
        }
        while (i < 0) {
            i += (filteredMessages.length)
        }
    }
    currentMessage = filteredMessages[i]
    msgIndex = i
    post()
}

function getDifMessage(dif) {
    i = msgIndex + dif
    getSpecificMessage(i)
}

function changeLang() {
    lang = this.id
    post()
}

function getRandomMessage(length) {
    let randomIndex = Math.floor(Math.random() * length)
    currentMessage = filteredMessages[randomIndex]
    msgIndex = randomIndex
}

function post() {
    language = getLanguage()
    if (currentMessage == undefined) {
        if (filteredMessages.length > 0) {
            getRandomMessage(filteredMessages.length)
            console.log(filteredMessages)
        }
        else {
            applyFilters()
            getRandomMessage(filteredMessages.length)
        }
    }
    const idElem = document.querySelector('.message_id')
    const intervElem = document.querySelector('.intervention')
    const genElem = document.querySelector('.general_audience')
    const tarElem = document.querySelector('.target_audience')
    const promElem = document.querySelector('.promote')
    const msgElem = document.querySelector('.message')
    idElem.innerHTML = currentMessage.id
    currentMessage.intervention.English ? intervElem.innerHTML = currentMessage.intervention[language] : intervElem.innerHTML = currentMessage.intervention
    currentMessage.general_audience.English ? genElem.innerHTML = currentMessage.general_audience[language] : genElem.innerHTML = currentMessage.general_audience
    currentMessage.target_audience.English ? tarElem.innerHTML = currentMessage.target_audience[language] : tarElem.innerHTML = currentMessage.target_audience
    currentMessage.promoted_behavior.English ? promElem.innerHTML = currentMessage.promoted_behavior[language] : promElem.innerHTML = currentMessage.promoted_behavior
    currentMessage.message.English ? msgElem.innerHTML = currentMessage.message[language] : msgElem.innerHTML = currentMessage.message

    print_debug(msgIndex, 'msgIndex')
    print_debug(allMessages[msgIndex].id, 'messages[msgIndex].id')

}

function print_debug(variable, msg = "", reset = false) {
    // let pel = document.createElement("p")
    // if (msg) { pel.innerHTML = pel.innerHTML = `${msg}: ` }
    // pel.innerHTML = `${pel.innerHTML}${variable}`
    // if (reset) {
    //     while (debugArea.firstChild) {
    //         debugArea.removeChild(debugArea.firstChild)
    //     }
    // }
    // debugArea.appendChild(pel)
}

fetch(requestURL)
    .then(
        function (response) {
            if (response.status !== 200) {
                console.log('Not OK!: ' +
                    response.status);
                return;
            }
            response.json().then(function (data) {
                allMessages = data
                setCategories()
                post()
                console.log(allMessages)
            })
        }
    )
    .catch(function (err) {
        console.log('Fetch Error!', err)
    })


const prev = document.getElementById('prev')
prev.onclick = () => getDifMessage(-1)
const next = document.getElementById('next')
next.onclick = () => getDifMessage(1)
let debugArea = document.getElementById('debugger')