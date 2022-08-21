const express = require('express');
const router = express.Router();
const records = require('../records')
/**
 * Middleware that handles try catch blocks for our routes. 
 * @param {Object} callback The callback function
 * @returns returns a callback used for router.use
 */
 function asyncHandler(callback) {
    return async (req, res, next) => {
        try {
            await callback(req, res, next)
        } catch (err) {
            next(err);
        }
    }
}

router.use(express.json())

/** 
 * Get all the quotes from the database.
 */
router.get('/quotes', async (req, res)=> {
    let quotes = await records.getQuotes();
    res.json(quotes)    
});

/**
 * Get's a specific quote from the database using the unique ID.
 */
router.get('/quotes/:id', asyncHandler( async(req, res, next)=> {
    const id = req.params.id;
    const quote = await records.getQuote(id);
    if(quote) {
        res.json(quote);
    } else {
        const err = new Error('Quote not found with id of: ' + id);
        res.status(404);
        next(err);
    }
     
}));

/**
 * Creates a new quote in the database. 
 */
router.post('/quotes', asyncHandler( async(req, res, next) => {
    const newQuote = req.body.quote;
    const newAuthor = req.body.author;
    if (newQuote && newAuthor ) {
        const quote = await records.createQuote({
            quote: newQuote,
            author: newAuthor
        });
        res.status(201).json(quote);
    } else {
        const err = new Error('Quote and author required');
        res.status(400);
        next(err);
    }
}));
    


/**
 * Updates exsisting quote with a new author and quote
 */
router.put('/quotes/:id', asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const updatedQuote = req.body.quote;
    const updatedAuthor = req.body.author;

    const quote = await records.getQuote(id);
    if (quote) {
        quote.quote = updatedQuote;
        quote.author = updatedAuthor;
        await records.updateQuote(quote)
        //* Since we're not returning anything, we need to end() to avoid haning.
        //* 204 means not content, we are not returning anything, just updating and ending the request.
        res.status(204).end(); 
    } else {
        const err = new Error('Quote not found with id of: ' + id);
        res.status(404);
        next(err);
    }
}));

/**
 * Deletes a specific quote from the database.
 */
router.delete('/quotes/:id', asyncHandler(async (req, res) => {
    const id = req.params.id;

    const quote = await records.getQuote(id);
    if (quote){
        await records.deleteQuote(quote);
        res.status(204).end();
    } else {
        const err = new Error('Quote not found with id of: ' + id);
        res.status(404);
        next(err);
    }
}));

module.exports = router;