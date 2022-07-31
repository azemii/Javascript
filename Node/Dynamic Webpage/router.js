import Profile from './profile.js';
import { view } from './renderer.js'
import queryString from 'node:querystring';


let commonHeader = {'Content-Type': 'text/html'}

export function home(request, response){
    if(request.url === '/'){
        if(request.method.toLowerCase() === 'get'){
            response.writeHead(200, commonHeader);
            view('header', {}, response);
            view('search', {}, response);
            view('footer', {}, response);
            response.end();
        }else {
            //* POST
            request.on('data', (postBody) => {
                let query = queryString.parse(postBody.toString());
                //* Redirect to the 'user' route (GET request). 
                response.writeHead(303,{'Location':'/' + query.username});
                response.end();
            })
        }
    }
}

export function user(request, response){
    //* Used to remove the '/', which only leaves us with the username passed in the url.
    let username = request.url.replace('/', '');
    if(username.length > 0){
        response.writeHead(200, commonHeader);
        view('header', {}, response);

        let studentProfile = new Profile(username)
        studentProfile.on('end', (profileJSON) => {
            let values = {
                avatarURL: profileJSON.gravatar_url,
                username: profileJSON.profile_name,
                badges: profileJSON.badges.length,
                javascriptPoints: profileJSON.points.JavaScript
            }
            view('profile', values , response);
            //* For each callback, there has to be a response.end.
            //* This method signals to the server that all of the response headers and body have been sent; 
            //* that server should consider this message complete. The method, response.end(), MUST be called on each response.
            view('footer', {}, response);
            response.end();
        });
        studentProfile.on('error', (error) => {
            //* For each callback, there has to be a response.end.
            view('error', {errorMessage: error.message}, response);
            view('search', {}, response);
            view('footer', {}, response);
            response.end();
        });
    }
}
