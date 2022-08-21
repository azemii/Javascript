const express = require('express');
const app = express();
const quoteRoutes = require('./routes/quotes');


app.use('/api', quoteRoutes);
/*
* Throws a 404 error when no route has matched a reqeust.
* Should be placed at the end, after all routes have been defined. 
*/
app.use((req, res, next) => {
    const err = new Error('Not Found');
    next(err);
});

app.use((err, req, res, next ) => {
    // Make the error object available through the locals.
    res.locals.error = err; 
    res.status(err.status || 500).json({
        error: {
            message: err.message
        }
    });
})

app.listen(3000, () => console.log('Quote API listening on port 3000!'));
