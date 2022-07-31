import EventEmitter from 'events';
import { get } from "https";
import { STATUS_CODES } from "http";

/**
 * An EventEmitter to get a Treehouse students profile.
 * @param username
 * @constructor
 */
export class Profile extends EventEmitter{
    constructor(username){
    super();
    //* Needed for calling the methods of EventEmitter
    let profileEmitter = this;

    let request = get(`https://teamtreehouse.com/profiles/${username}.json`, (response) => {
        var body = "";
        if (response.statusCode === 200) {
            //* Read the data
            response.on('data', (chunk) => {
                console.log('Reciving...');
                body += chunk;
                profileEmitter.emit('data', chunk);
            });

            response.on('end',  () => {
                try {
                    //* Parse the data
                    var profile = JSON.parse(body);
                    profileEmitter.emit('end', profile);
                } catch (error) {
                    profileEmitter.emit('error', error);
                }
            }).on('error', (error) => {
                profileEmitter.emit('error', error);
            });
        }else {
            const message = `There was an error getting the profile for ${username} (${STATUS_CODES[response.statusCode]})\n`
            profileEmitter.emit('error', new Error(message));
        }        
    });
    }
}

export default Profile;