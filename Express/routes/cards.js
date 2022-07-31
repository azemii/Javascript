const express = require('express');
const router = express.Router();

/* 
* Since all '/cards' routes are being directed into this file, we don't need
* to specify router.get('/cards'), we can simply just use '/' instead.
*/
router.get('/', (req, res) => {
    //* Another way to access dyamic values on our template.
    // res.locals.prompt = 'Who is buried in a random tomb?'
    res.render('card', {prompt: 'Who has won the most championships in F1 racing?', hint: 'He is from the UK'});
});

module.exports = router;