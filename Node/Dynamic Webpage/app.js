import http from 'http';
import {home, user} from './router.js'

//* Create a webserver
http.createServer((request, response) => {
    home(request, response);
    user(request, response);
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337');

