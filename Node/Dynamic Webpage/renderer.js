import fs from 'fs';

/**
 * Replaces all placeholder items inside a HTML template string with the correct values.
 * @param {Array} values the values to be put in the placeholder positions
 * @param {String} content the HTML template string
 * @returns returns the HTML template string updated with the values at the correct position
 */
function mergeValues(values, content){
    for (const key in values) {
        content = content.replace('{{'+ key + '}}', values[key]);
    }
    return content
}

export function view(templatName, values, response) {
    let fileContents = fs.readFileSync('./views/' + templatName + '.html', {encoding: 'utf-8'});
    fileContents = mergeValues(values, fileContents);
    response.write(fileContents);
}