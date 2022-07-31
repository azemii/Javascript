const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();

//* Setting pug as the template handler for our server. 
app.set('view engine', 'pug');

//* Middleware mounted on the application.
//* Middleware is used on all requests, unless specified otherwise.
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());


app.use((req, res, next) => {
    req.message = 'This message made it';
    console.log('Hello');
    // Since we don't send anything back to the client here, with res.send, or res.render
    // we have to call next(). Next lets Express know that this middleware is done, and
    // it should continune down the line to the next middleware and run that code.
    // If we don't use next() here, the application will just hang and load indefinitly. 
    next();
});

app.use((req, res, next) => {
    console.log(req.message);
    console.log('World');
    next();
});

app.get('/', (req, res) => {
    const name = req.cookies.username
    if (name){
        res.render('index',{ name }); // Shorthand for {name: name}
    }else {
        res.redirect('/hello')
    }
});

//* Used for singing out the user and clearing the cookies stored.
//* Always redirect after a 'POST' to avoid x2 submissions.
app.post('/goodbye', (req, res) => {
    res.clearCookie('username');
    res.redirect('/hello');
    console.log('Cookie \'username\' cleared');
});

app.get('/cards', (req, res) => {
    //* Another way to access dyamic values on our template.
    // res.locals.prompt = 'Who is buried in a random tomb?'
    res.render('card', {prompt: 'Who is buried in a random tomb?', hint: 'Looser'});
});

app.get('/hello', (req, res) => {
    const name = req.cookies.username
    if (name){
        res.redirect('/');
    }else {
        res.render('hello');
    }
    
});

app.post('/hello', (req, res) => {
    res.cookie('username', req.body.username);
    res.redirect('/');
});

/*
* Throws a 404 error when no route has matched a reqeust.
* Should be placed at the end, after all routes have been defined. 
*/
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/* 
 * Error handler. Indentified by having 4 paramenters, first of which being err.
 * Express will jump to this middleware incase of an error, if no error middleware
 * is defined, it will use a default error handler.
*/
app.use((err, req, res, next) => {
    // Make the error object available through the locals. Later used in our template.
    res.locals.error = err; 
    res.status(err.status);
    res.render('error');
})


app.listen(3000, () => {
    console.log('The application is running on localhost:3000');
});