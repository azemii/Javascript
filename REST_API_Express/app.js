const express = require('express');
const fs = require('fs');
const app = express();

const records = require('./records');

app.use(express.json())
/** 
 * Get all the quotes from the database.
 */
app.get('/quotes', async (req, res)=> {
    try {
        let quotes = await records.getQuotes();
        res.json(quotes)
    } catch (err) {
        res.status(404).json( {message: err.message} );
    }
    
});

/**
 * Get's a specific quote from the database using the unique ID.
 */
app.get('/quotes/:id', async (req, res)=> {
    const id = req.params.id;
    try {
        const quote = await records.getQuote(id);
        if(quote) {
            res.json(quote);
        } else {
            res.status(404).json({ message: 'Quote not found with id of: ' + id });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
     
});

/**
 * Creates a new quote in the database. 
 */
app.post('/quotes', async (req, res) => {
    const newQuote = req.body.quote;
    const newAuthor = req.body.author;
    try {
        if (newQuote && newAuthor ) {
            const quote = await records.createQuote({
                quote: newQuote,
                author: newAuthor
            });
            res.status(201).json(quote);
        } else {
            res.status(400).json( { message: 'Quote and author required'} );
        }
        
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
    
});

app.put('/quotes/:id', async (req, res) => {
    const id = req.params.id;
    const updatedQuote = req.body.quote;
    const updatedAuthor = req.body.author;
    
    try {
        const quote = await records.getQuote(id);
        if (quote) {
            quote.quote = updatedQuote;
            quote.author = updatedAuthor;
            await records.updateQuote(quote)
            //* Since we're not returning anything, we need to end() to avoid haning.
            //* 204 means not content, we are not returning anything, just updating and ending the request.
            res.status(204).end(); 
        } else {
            res.status(404).json({ message: 'Quote not found with id of: ' + id });
        }
        
    } catch (err) {
        res.status(500).json( {message: err.message} );
    }
});


app.listen(3000, () => console.log('Quote API listening on port 3000!'));
