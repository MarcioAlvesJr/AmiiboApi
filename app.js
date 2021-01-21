
let amiibos = undefined
    selectedAmiibos = []
    load = {
        from: 0,
        until: 0
    }
    amiibosToLoadEachTime = 10
//UI DOM elements
    listOfCards = document.querySelector('.itens')
    input = document.querySelector('input')
    loadMoreBtn = document.querySelector('.add-more')

loadMoreBtn.addEventListener('click', loadMore)
input.addEventListener("keyup", ()=> {
    listOfCards.innerHTML = ""
    loadMoreBtn.style.display = "none"
    if(input.value.length != 0){
        selectAmiibos(input.value.toLowerCase())
    }
})

listOfCards.innerHTML = ""

getData()
async function getData() {
    let myObject = await fetch("https://amiiboapi.com/api/amiibo/")
    amiibos = await myObject.json()
    amiibos = await amiibos.amiibo
}


function selectAmiibos(text){
    selectedAmiibos = []
    
    let words = text.split(" "),
        doesItContainall = 0
    
    words.forEach(word => word.toLowerCase)


    amiibos.forEach(amiibo =>{
        
        words.forEach(word=>{
            let containsText = 0
            amiibo.name.toLowerCase().includes(word) ? containsText++ :{}
            amiibo.amiiboSeries.toLowerCase().includes(word) ? containsText++ :{}
            amiibo.character.toLowerCase().includes(word) ? containsText++ :{}
            amiibo.gameSeries.toLowerCase().includes(word) ? containsText++ :{}
            amiibo.type.toLowerCase().includes(word) ? containsText++ :{}
            
            if(typeof amiibo.release.au  === 'string'){
            amiibo.release.au.toLowerCase().includes(word) ? containsText++ :{}
            }
            if(typeof amiibo.release.eu  === 'string'){
                amiibo.release.eu.toLowerCase().includes(word) ? containsText++ :{}
            }
            if(typeof amiibo.release.jp  === 'string'){
                amiibo.release.jp.toLowerCase().includes(word) ? containsText++ :{}
            }
            if(typeof amiibo.release.na  === 'string'){
                amiibo.release.na.toLowerCase().includes(word) ? containsText++ :{}
            }
            if (containsText > 0){
                doesItContainall++
            }
        })



        if (doesItContainall == words.length){
            selectedAmiibos.push(amiibo)
        }
        doesItContainall = 0
    })

    load.from = 0
    load.until = amiibosToLoadEachTime
    loadAmiibos()
}

function loadAmiibos(){

    if(selectedAmiibos.length > load.until){
        loadMoreBtn.style.display = "flex"
    }else{
        loadMoreBtn.style.display = "none"
    }
    selectedAmiibos.forEach((amiibo,idx) => {
        if(idx>=load.from && idx<load.until){
            createCard(
                amiibo.name,
                amiibo.image ,
                amiibo.amiiboSeries ,
                amiibo.gameSeries ,
                amiibo.type ,
                amiibo.release.au ,
                amiibo.release.jp ,
                amiibo.release.eu ,
                amiibo.release.na ,)
        }

    })

}

function loadMore(){
    load.from = load.from+amiibosToLoadEachTime
    load.until = load.until+amiibosToLoadEachTime
    loadAmiibos()

}

function createCard(name, img, amiiboSeries, gameSeries, type, ausRelease, japRelease, eurRelease, norRelease){

    const card = document.createElement("li")
    let year = getEarliestYear(ausRelease,japRelease,eurRelease)
    card.classList.add('card')
    
    card.innerHTML = `
    <div class="top-box">
    <span class="title">${name} - ${year}</span> 
    <div class="click-to-change"><img src="/img/trace.svg" alt=""><img src="/img/trace.svg" alt=""></div> </div>
    <div class="content-wrapper">
        <div class="content">
            <img src="${img}" alt="">
            <div class="info amiibo-series">${amiiboSeries}</div>
            <div class="info game-series">${gameSeries}</div>
            <div class="info type">${type}</div>
            <div class="info release-date">
                <ul>
                    <li class="australia" ${ausRelease == null ? `style="display:none;"`:""}>${ausRelease}</li>
                    <li class="japan"${japRelease == null ? `style="display:none;"`:""}>${japRelease}</li>
                    <li class="europe"${eurRelease == null ? `style="display:none;"`:""}>${eurRelease}</li>
                    <li class="north-america"${norRelease == null ? `style="display:none;"`:""}>${norRelease}</li>
                </ul>
            </div>
        </div>
    </div>`


    card.querySelector(".click-to-change").addEventListener('click', ()=>
        card.querySelector(".click-to-change").parentElement.parentElement.classList.toggle('active')
        )
    listOfCards.appendChild(card)
}

function getEarliestYear(ausRelease,japRelease,eurRelease){
    const years = [ausRelease,japRelease,eurRelease]
    let validYears = [],
        earlyYear = 0

    years.forEach(year => {
        if (typeof year === 'string') {
         validYears.push(parseInt(`${year[0]}${year[1]}${year[2]}${year[3]}`,10))    
       }
    })
    earlyYear = validYears[0]
    validYears.forEach((year,idx) =>{
        if(idx >0 && earlyYear>year){
            earlyYear = year 
        }
    })


    return earlyYear
}

//createCard("Mario","https://raw.githubusercontent.com/N3evin/AmiiboAPI/master/images/icon_00000000-00000002.png","Super Smash Bros.", "Super Mario", "Figure", "2014-11-29" , "2014-12-06","2014-11-28","2014-11-21")
