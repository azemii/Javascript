/*
* Having a file called index.js in our routes folder, makes the import/require easier.
* Insted of doing require('./routes/index'), we can just do ('./routes'), since any file
* named index is going to be loaded by default. 
*/

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const name = req.cookies.username
    if (name){
        res.render('index',{ name }); // Shorthand for {name: name}
    }else {
        res.redirect('/hello')
    }
});

//* Used for singing out the user and clearing the cookies stored.
//* Always redirect after a 'POST' to avoid x2 submissions.
router.post('/goodbye', (req, res) => {
    res.clearCookie('username');
    res.redirect('/hello');
    console.log('Cookie \'username\' cleared');
});

router.get('/hello', (req, res) => {
    const name = req.cookies.username
    if (name){
        res.redirect('/');
    }else {
        res.render('hello');
    }
    
});

router.post('/hello', (req, res) => {
    res.cookie('username', req.body.username);
    res.redirect('/');
});

module.exports = router;