const navLinks = document.querySelectorAll('.nav-link')
const contents = document.querySelectorAll('.content')
const temp = document.querySelector('.temp')
const form = document.querySelector('.contact-form')

function updateNav(e){
    navLinks.forEach(nav => {
        if (e == nav){
            nav.classList.add("active")
        } else {
            nav.classList.remove("active")
        }
    })

    contents.forEach(content => {
        if (e.innerHTML.toLowerCase() == content.id){
            content.classList.remove("d-none")
        } else {
            content.classList.add("d-none")
        }
    })
}

navLinks.forEach(nav => {
    nav.addEventListener('click', () => {
        updateNav(nav)
    })
})

form.addEventListener('submit', function(e){
    e.preventDefault()
    const name = document.querySelector('.contact-form input#name').value
    const email = document.querySelector('.contact-form input#email').value
    const subject = document.querySelector('.contact-form select#subject').value
    const body = document.querySelector('.contact-form textarea#body').value
    if (name && email && subject && body){
        window.open(`mailto:maztamam67@gmail.com?subject=${subject}&body=Hi.%20My%20name%20is%20${name}%0D%0A%0D%0A${body}%20%3A%29`)
    } else {
        alert('The input form is invalid!')
    }
})

fetch('https://api.openweathermap.org/data/2.5/weather?q=Bantul,id&appid=446595f1123c96e84c9c6965efe508d7')
    .then(response => response.json())
    .then(data => {
        temp.innerHTML = Math.round(data.main.temp) - 273
    })
    .catch(err => console.log(err))