//UI DOM elements
const
    clickToExpMin = document.querySelectorAll(".click-to-change")


//Click to expand/minimize card
clickToExpMin.forEach(element=> {
    element.addEventListener('click', ()=> 
    element.parentElement.parentElement.classList.toggle('active')
    )
})
