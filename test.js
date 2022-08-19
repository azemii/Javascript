function testing(name, callback){
    console.log('Hello there ' + name);
    callback();
}

testing('Armend', ()=> {
    console.log('This is from the callback');
});