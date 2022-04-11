let allMessages
let filteredMessages = []
let currentMessage
let requestURL = '../js/messages.json';
let msgIndex = 0
let interventions
let general_audiences
let target_audiences
let promoted_behaviors
let language = "English"

let filter = {
    intervention: [],//["Assisted delivery"],
    target_audience: []//["Pregnant women", "The mother", "Women"],
    //general_audiences: ["Women", "Community", "Woman in labor"],
    //promoted_behaviors: []
}

const languages = document.getElementsByClassName('lang')
for (const lang of languages) {
    lang.addEventListener('click', changeLang)
    // lang.addEventListener('click', e => {
    //     console.log(e.target)
    //     e.target.classList.add('highlight')
    // })
}

function setCategories(categoryType) {
    let categoriesStore = [...new Set(allMessages.map(mes => {
        cat = mes[categoryType][language].toLowerCase().trim()
        return cat
    })
    .sort())]
    categoriesStore.forEach(cat => {
        print_element(cat, `f_${categoryType}`, "a", setFilters)
    })
    return categoriesStore
}

function clearHighlights() {
    let filCon = document.getElementsByClassName('filter-container')[0]
    console.log(filCon)
    for (const cat of filCon.children) {
        for (const child of cat.children) {
            child.classList.remove('highlight')
        }
    }
}

function setFilters(categoryType, category, link) {
    if (!filter[categoryType].length) {
        filter.intervention = []
        filter.target_audience = []
        clearHighlights()
    }
    if (filter[categoryType].includes(category)) {
        const index = filter[categoryType].indexOf(category)
        if (index > -1) {
            filter[categoryType].splice(index, 1)
            link.classList.remove('highlight')
        }
    }
    else {
        filter[categoryType].push(category)
        link.classList.add('highlight')
    }

    applyFilters()
}

function caseTrimFilter() {
    for (const cat in filter) {
        filter[cat].forEach(function (t, i, itself) {
            itself[i] = t.toLowerCase().trim()
        })
    }
}

function applyFilters() {
    isEmpty = true
    for (const cat in filter) {
        if (isEmpty) {
            filter[cat].length ? isEmpty = false : true
        }
    }
    if (!isEmpty) {
        filteredMessages = []
        caseTrimFilter()
        for (const i in allMessages) {
            if (filter.intervention.includes(allMessages[i].intervention[language].toLowerCase().trim())) {
                filteredMessages.push(allMessages[i])
            }
            else if (filter.target_audience.includes(allMessages[i].target_audience[language].toLowerCase().trim())) {
                filteredMessages.push(allMessages[i])
            }
        }
    }
    else {
        console.log(allMessages)
        filteredMessages = [...allMessages]
    }
    getSpecificMessage(filteredMessages[0].id)
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
    language = this.id
    wipeContents("f_intervention")
    wipeContents("f_target_audience")
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
    wipeContents("debugger")
    if (currentMessage == undefined) {
        if (filteredMessages.length > 0) {
            getRandomMessage(filteredMessages.length)
            console.log(filteredMessages)
        }
        else {
            applyFilters()
        }
    }
    const idElem = document.querySelector('.message_id')
    const intervElem = document.querySelector('.intervention')
    const genElem = document.querySelector('.general_audience')
    const tarElem = document.querySelector('.target_audience')
    const promElem = document.querySelector('.promote')
    const msgElem = document.querySelector('.message')
    const audPlayer = document.getElementById('audio_player')
    //audPlayer.setAttribute('src', `https://elakapwa.s3.amazonaws.com/Elaka${currentMessage.id}.${getFileType()}`)
    audPlayer.setAttribute('src', `../audio/Elaka${currentMessage.id}.${getFileType()}`)
    idElem.innerHTML = currentMessage.id
    currentMessage.intervention.English ? intervElem.innerHTML = currentMessage.intervention[language] : intervElem.innerHTML = currentMessage.intervention
    currentMessage.general_audience.English ? genElem.innerHTML = currentMessage.general_audience[language] : genElem.innerHTML = currentMessage.general_audience
    currentMessage.target_audience.English ? tarElem.innerHTML = currentMessage.target_audience[language] : tarElem.innerHTML = currentMessage.target_audience
    currentMessage.promoted_behavior.English ? promElem.innerHTML = currentMessage.promoted_behavior[language] : promElem.innerHTML = currentMessage.promoted_behavior
    currentMessage.message.English ? msgElem.innerHTML = currentMessage.message[language] : msgElem.innerHTML = currentMessage.message

    print_element(msgIndex)
    print_element(allMessages[msgIndex].id)
}

function getFileType() {
    let connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
        if (['slow-2g', '2g', '3g'].includes(connection.effectiveType)) {
            return "mp3"
        }
        else {
            return "mp3"//"ogg"
        }
    }
    // TO DO:
    // check if ogg is cached before fallback to mp3
    return "mp3"
}

function wipeContents(parentID) {
    let parent = document.getElementById(parentID)
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild)
    }
}

function print_element(variable, parentID = "debugger", type = "p", callback) {
    let parent = document.getElementById(parentID)
    let element = document.createElement(type)
    element.innerHTML = variable
    if (callback) {
        element.addEventListener('click', e => {
            return callback(parentID.slice(2, parentID.length), variable, e.target)
        }, false)
        // element.addEventListener('click',e => {
        //     console.log(e.target)
        // })
    }
    parent.appendChild(element)

    return element
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