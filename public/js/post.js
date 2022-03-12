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
let language

function setCategories(categoryType) {
    language = getLanguage()
    let categoriesStore = [...new Set(allMessages.map(mes => {
        cat = mes[categoryType][language].toLowerCase().trim()
        return cat
    })
    .sort())]
    categoriesStore.forEach(cat => {
        print_element(cat, `f_${categoryType}`, "a")
    })
    return categoriesStore
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
            if (filter.interventions.includes(allMessages[i].intervention[language].toLowerCase().trim())) {
                filteredMessages.push(allMessages[i])
            }
            else if (filter.target_audiences.includes(allMessages[i].target_audience[language].toLowerCase().trim())) {
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
    whipeContents("f_intervention")
    whipeContents("f_target_audience")
    interventions = setCategories("intervention")
    target_audiences = setCategories("target_audience")
    post()

}

function getRandomMessage(length) {
    let randomIndex = Math.floor(Math.random() * length)
    currentMessage = filteredMessages[randomIndex]
    msgIndex = randomIndex
}

function post() {
    whipeContents("debugger")
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
    const audPlayer = document.getElementById('audio_player')
    audPlayer.setAttribute('src', `https://elakapwa.s3.amazonaws.com/elaka${currentMessage.id}.mp4`)
    idElem.innerHTML = currentMessage.id
    currentMessage.intervention.English ? intervElem.innerHTML = currentMessage.intervention[language] : intervElem.innerHTML = currentMessage.intervention
    currentMessage.general_audience.English ? genElem.innerHTML = currentMessage.general_audience[language] : genElem.innerHTML = currentMessage.general_audience
    currentMessage.target_audience.English ? tarElem.innerHTML = currentMessage.target_audience[language] : tarElem.innerHTML = currentMessage.target_audience
    currentMessage.promoted_behavior.English ? promElem.innerHTML = currentMessage.promoted_behavior[language] : promElem.innerHTML = currentMessage.promoted_behavior
    currentMessage.message.English ? msgElem.innerHTML = currentMessage.message[language] : msgElem.innerHTML = currentMessage.message

    print_element(msgIndex)
    print_element(allMessages[msgIndex].id)

}

function whipeContents(parentID) {
    let parent = document.getElementById(parentID)
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild)
    }
}

function print_element(variable, parentID = "debugger", type = "p") {
    let parent = document.getElementById(parentID)
    let element = document.createElement(type)
    element.innerHTML = variable
    parent.appendChild(element)
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
                interventions = setCategories("intervention")
                target_audiences = setCategories("target_audience")
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