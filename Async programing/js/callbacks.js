const astrosUrl = 'http://api.open-notify.org/astros.json';
const wikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
const peopleList = document.getElementById('people');
const btn = document.querySelector('button');

// Make an AJAX request
function getJSON(url, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.onload = () => {
    if(xhr.status === 200) {
      let data = JSON.parse(xhr.responseText);
      // Use return here to exit the scope. Works without return as well
      // but return does provide a safety net to ensure the execution stops.
      return callback(data)
    }
  };
  xhr.send();
}

// Generate the markup for each profile
function generateHTML(data) {
  const section = document.createElement('section');
  peopleList.appendChild(section);
  // Check if request returns a 'standard' page from Wiki
  if (data.type === 'standard') {
    section.innerHTML = `
      <img src=${data.thumbnail.source}>
      <h2>${data.title}</h2>
      <p>${data.description}</p>
      <p>${data.extract}</p>
    `;
  } else {
    section.innerHTML = `
      <img src="img/profile.jpg" alt="ocean clouds seen from space">
      <h2>${data.title}</h2>
      <p>Results unavailable for ${data.title}</p>
      ${data.extract_html}
    `;
  }
}

/**
 * 1. On clicking the button we first retrive all the data from the astrosURL, which provides us 
 *    with all the current astronauts in space. 
 * 2. When the use this data to extract the name of all the astronauts and get a summary from
 *    wikipedia.
 * 3. The summary, which includes an image and short description, is then formated and displayed
 *    on the page using the generateHTML function.
 */
btn.addEventListener('click', (event)=> {
  getJSON(astrosUrl, (json) => {
    json.people.map(person => 
    getJSON(wikiUrl+person.name, generateHTML));
  })
 event.target.style.display = 'none'
})
