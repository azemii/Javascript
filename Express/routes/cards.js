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
    const { side } = req.query;
    const { id  } = req.params;
    const text = cards[id][side];
    const { hint } = cards[id];
    const templateData = { text, side, id };

    // Only show hint when the question is showing.
    if (side === 'question') {
        templateData.hint = hint;
    }
    //* Another way to access dyamic values in our template.
    // res.locals.prompt = 'Who is buried in a random tomb?'
    console.log(templateData);
    res.render('card', templateData);
});

module.exports = router;