const https = require('https');
const http = require('http');

//* Prints the data
function printMessage(username, badgeCount, points) {
    const message = `${username} has ${badgeCount} total badge(s) and ${points} points in JavaScript`;
    console.log(message);
}

function printError(error) {
    console.error(error.message)
}

function getProfile (username) {
    try {
        let request = https.get(`https://teamtreehouse.com/profiles/${username}.json`, (response) => {
            console.log(response.statusCode);
            if (response.statusCode === 200){
            let body = '';
            // Read the data
            response.on('data', data => {
                body += data.toString();
            });

            response.on('end', () => {
                // Parse the data
                try {
                    let profile = JSON.parse(body)
                    printMessage(username, profile.badges.length, profile.points.JavaScript)
                   //* Used for catching synchronous errros (Native Javascript).
                } catch(error) {
                    printError(error)
                }
            });
        } else {
            //* Handles errors for all HTTP status codes other than 200.
            const message = `There was an error getting the profile for ${username} (${http.STATUS_CODES[response.statusCode]})`
            console.log(response.statusCode);
            let httpError = new Error(message)
            printError(httpError)
        }
        });

        
        // * Used for catching asynchronous errors (Node functions).
        request.on('error', (error) => {
            console.log(`Incorrect URL: ${error.code} - ${error.hostname}` );
        })
        // * Used for catching synchronous errros (Native Javascript).
    } catch(error) { 
        printError(error)
}
}

let users = process.argv.slice(2)
users.forEach(user => {
        getProfile(user)
    }
)