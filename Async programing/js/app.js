const select = document.getElementById('breeds');
const card = document.querySelector('.card'); 
const form = document.querySelector('form');

const dogAPI = 'https://dog.ceo/api/breeds/image/random'
const breedAPI = 'https://dog.ceo/api/breeds/list'

// ------------------------------------------
//  FETCH FUNCTIONS
// ------------------------------------------
async function fetchData(url) {
    return fetch(url)
            .then(checkStatus)
            .then(response => response.json())
            .catch(error => console.log('Looks like there was a problem: ', error ))
}
 Promise.all([
    fetchData(breedAPI),
    fetchData(dogAPI)
   
 ])
 .then(data => {
     const  breedList= data[0].message
     const randomImage = data[1].message

     generateOptions(breedList)
     generateImage(randomImage)
 })

// ------------------------------------------
//  HELPER FUNCTIONS
// ------------------------------------------
function checkStatus(response){
    if (response.ok){
        return Promise.resolve(response)
    }else {
        return Promise.reject(new Error(response.statusText))
    }
}

function generateImage(data) {
    const html = `
        <img src='${data}'>
        <p>Click to view images of ${select.value}</p>
    `
    card.innerHTML = html
}

function generateOptions(data) {
  data.forEach(dog => {
      let option = new Option(dog)
      select.appendChild(option)
  });
}

function fetchBreedImage(){
    const breed = select.value
    const breedImageURL = `https://dog.ceo/api/breed/${breed}/images/random`
    fetchData(breedImageURL)
        .then(data => generateImage(data.message))
}


// ------------------------------------------
//  EVENT LISTENERS
// ------------------------------------------
card.addEventListener('click', fetchBreedImage)
select.addEventListener('change',fetchBreedImage )
form.addEventListener('submit', postData)


// ------------------------------------------
//  POST DATA
// ------------------------------------------
function postData(event){
    event.preventDefault()
    const name = document.getElementById('name').value
    const comment = document.getElementById('comment').value

    fetch('https://jsonplaceholder.typicode.com/comments', {
        method:'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({name, comment}) // Shorthand for name: name, comment: comment
    })
    .then(checkStatus)
    .then(response => response.json())
    .then(console.log)
}
