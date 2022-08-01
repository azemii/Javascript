const express = require('express');
const router = express.Router();

// * The brackets are the equivilent of cards = data.cards.
//* The text file is by default parsed into JSON when using node, we don't need to parse it ourselves.
const { data } = require('../data/flashCardData.json');
const { cards } = data;


//* If /cards get's request, provide a random card from the dataset.
router.get('/', (req, res)=> { 
    let max = cards.length;
    let min = 1;

    let randomCardID = Math.floor(Math.random() * (max - min) + min);
    res.redirect(`/cards/${randomCardID}`);
});
/* 
* Since all '/cards' routes are being directed into this file, we don't need
* to specify router.get('/cards'), we can simply just use '/' instead.
*/
router.get('/:id', (req, res) => {
    const { side } = req.query;
    const { id  } = req.params;

    // If there is no side specified in the query, redirect to the question part of the card.
    if (!side) {
        res.redirect(`/cards/${id}?side=question`);
    }

    const text = cards[id][side];
    const { hint } = cards[id];
    const templateData = { text, side };
    console.log(side);

    // Only show hint when the question is showing.
    if (side === 'question') {
        templateData.hint = hint;
    }
    //* Another way to access dyamic values in our template.
    // res.locals.prompt = 'Who is buried in a random tomb?'
    res.render('card', templateData);
});

module.exports = router;