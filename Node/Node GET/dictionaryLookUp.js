const https = require('https');
const http = require('http')
const API_KEY = '7184a86f-ccdf-4a17-a2fe-f3f18dbd0d36';

//* https://www.dictionaryapi.com/api/v3/references/collegiate/json/voluminous?key=your-api-key

function printDefinition(definition){
    let id = definition[0].meta.id;
    let wordDefinition = definition[0].shortdef.join('\n')
    console.log('Word: ' + id);
    console.log('-----------------');
    console.log('Definition: ' + wordDefinition);
}

function getWordDefinition(searchTerm){
    //* Try and make a request to the API
    try {
        let request = https.get(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${searchTerm}?key=${API_KEY}`,(response) => {
            let body = '';
            if(response.statusCode === 200) {
                response.on('data', (dataChunk) => {
                    body += dataChunk.toString();
                });
                response.on('end', () => {
                    // * Try and parse the data
                    try {
                        let definition = JSON.parse(body);
                        printDefinition(definition);
                        
                    } catch (error) {
                        console.error('There was an error parsing the data to JSON: ' +  error);
                    }
                    //* Handle any response Errors
                }).on('error', (error) => {
                    console.error('There was an error with the response: '  + error);
                });
            } else {
                console.error('HTTP Error, status code: ' + http.STATUS_CODES[response.statusCode])
            }
            
        });
    } catch(error){
        console.error('There was an error fetching data from the URL: ' + error);
    }
}

let word = process.argv.slice(2)
if (word.length > 1) {
    console.error('Only one word at a time is allowed.');
} else {
    getWordDefinition(word)

}


