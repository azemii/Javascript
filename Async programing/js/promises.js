const astrosUrl = 'http://api.open-notify.org/astros.json';
const wikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
const peopleList = document.getElementById('people');
const btn = document.querySelector('button');

function getJSON(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = () => {
      if(xhr.status === 200) {
        let data = JSON.parse(xhr.responseText);
        resolve(data)
      }else {
        reject(Error('There was an error fetching data from ' + url + ' Status code: ' + xhr.statusText ))
      }
    };
    xhr.onerror = () => reject(Error('Network error occured'))
    xhr.send();
  });
 
}

function getProfiles(json) {
  const profiles = json.people.map( person => {
    const craft = person.craft
    console.log(craft);
    // return getJSON(wikiUrl + person.name, generateHTML);  
    return fetch(wikiUrl + person.name )
           .then(response => response.json())
           .then (profile => { // profile is the reponse data in json format
            return {...profile, craft} // copy the entire profile data with '...' and add craft to the object.
           })
           .catch(err => console.log('Error fetching data from Wikipedia: ' + err) )     
  }); 
  return Promise.all(profiles)
}



// Generate the markup for each profile
function generateHTML(data) {
  data.map(personalData => {
    const section = document.createElement('section');
    peopleList.appendChild(section);
    // Check if request returns a 'standard' page from Wiki
    if (personalData.type === 'standard') {
      section.innerHTML = `
        <img src=${personalData.thumbnail.source}>
        <span>${personalData.craft}</span>
        <h2>${personalData.title}</h2>
        <p>${personalData.description}</p>
        <p>${personalData.extract}</p>
      `;
    } else {
      let data = extractJSONDataFromAmbigiousResult(personalData.title)
      data.then(json => {
        section.innerHTML = `
          <img src=${json.thumbnail.source}>
          <span>${personalData.craft}</span>
          <h2>${json.title}</h2>
          <p>Results unavailable for ${json.title}</p>
          ${json.extract_html}
        `;
      })
    
    }

  })
} 
/**
 * A helper function that narrows down the search when the initial search
 * gives more than one result. When there are several results from the intial
 * search, the function looks at the results and choses the results which has 
 * a word that ends with 'naut' in it, and then does another search, including
 * the occupation of the Astronaut, Taikonaut, Cosmonaut.
 * 
 * @param {String} searchTerm The term we are searching the wiki summary API for
 * @returns returns the data of a 'naut' person
 */
function extractJSONDataFromAmbigiousResult(searchTerm){
  return new Promise((resolve, reject) => {
    let data = getJSON(wikiUrl+searchTerm)
    let specificSearchTerm = ''
    data.then(json => {
      if (json.extract.includes('naut')){
        // Regex for words ending with 'naut'
        let regex = new RegExp(/\w*naut\b/gm)
        // Getting 2 values per search, ['astronaut', 'astronaut']. We only want a single value.
        let occupation = json.extract.match(regex)[0] 
        specificSearchTerm = searchTerm + ' ' +'('+occupation+')'
        let specificSearchTermData = getJSON(wikiUrl+specificSearchTerm)
        resolve(specificSearchTermData)
      }
    }) 
  });
}

btn.addEventListener('click', (event) => {
  event.target.textContent= 'Loading...'
  // getJSON(astrosUrl)
  fetch(astrosUrl)
  .then(response => response.json())
  .then(getProfiles)
  .then(generateHTML)
  .catch(err => {
    peopleList.innerHTML = '<h3>Something went wrong...</h3>'
    console.log(err)
  })
  .finally(() => {
    event.target.remove();
  })
  
});

