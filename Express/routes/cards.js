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
    console.log('in cards no query');

    let randomCardID = Math.floor(Math.random() * (max - min) + min);
    res.redirect(`/cards/${randomCardID}`);
});
/* 
* Since all '/cards' routes are being directed into this file, we don't need
* to specify router.get('/cards'), we can simply just use '/' instead.
*/
router.get('/:id', (req, res) => {
    const name = req.cookies.username;
    if (!isUserLogedIn(name)){
        return res.redirect('/hello');
    }
    const { side } = req.query;
    const { id  } = req.params;

    // If there is no side specified in the query, redirect to the question part of the card.
    if (!side) {
        // Return to avoid rest of code executing, will result in HTTP_ERROR by node.
        return res.redirect(`/cards/${id}?side=question`);
    }
    const text = cards[id][side];
    const { hint } = cards[id];
    const templateData = { text, side, name };

    // Only show hint when the question is showing.
    if (side === 'question') {
        templateData.hint = hint;
    }
    //* Another way to access dyamic values in our template.
    // res.locals.prompt = 'Who is buried in a random tomb?'
    res.render('card', templateData);
});

function isUserLogedIn(name) {
    if (name === undefined) {
        console.log('User not logged in.');
        return false
    } else {
        return true
    }
}

module.exports = router;