const express = require('express');
const router = express.Router();

// * The brackets are the equivilent of cards = data.cards.
//* The text file is by default parsed into JSON when using node, we don't need to parse it ourselves.
const { data } = require('../data/flashCardData.json');
const { cards } = data;

/* 
* Since all '/cards' routes are being directed into this file, we don't need
* to specify router.get('/cards'), we can simply just use '/' instead.
*/
router.get('/:id', (req, res) => {
    //* Another way to access dyamic values on our template.
    // res.locals.prompt = 'Who is buried in a random tomb?'
    res.render('card', {
        prompt: cards[req.params.id].question, 
        hint: cards[req.params.id].hint
    });
});

module.exports = router;