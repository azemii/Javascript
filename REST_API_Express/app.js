const { log } = require('console');
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

app.set('view engine', 'pug');
app.set("views", path.join(__dirname, "views"));
app.use(express.static('public'));

//* Middleware to handle errors for our index route
function asyncHandler(callback){
  console.log(req.body);
  return async (req, res, next) => {
    try {
      await callback(req, res, next);
    } catch (error) {
      res.render('error', { error });
    }
  }
}

//* CALLBACKS
// function getUsers(cb){
//   fs.readFile('data.json', 'utf8', (err, data) => {
//     if (err) return cb(err);
//     const users = JSON.parse(data);
//     return cb(null, users);
//   });
// }

// app.get('/', (req,res) => {
//   getUsers((err, users)=> {
//     if (err) {
//       return res.render('error', { error: err })
//     } else {
//       res.render('index.pug', {title: 'Users', users: users.users});
//       console.log(users);
//     }
//   })
// }); 

//* Same example, but using Promises
function getUsers(cb){
  return new Promise((resolve, reject) => {
    fs.readFile('data.json', 'utf-8', (err, data) => {
      if(err) {
        reject(err);
      }else {
        const users = JSON.parse(data);
        resolve(users);
      }
    })
  })
}

// app.get('/', (req,res) => {
//   getUsers()
//   .then(users => res.render('index', {title: 'Users', users: users.users}))
//   .catch(error => res.render('error', error))

// }); 

//* Using ASYNC-Await
// app.get('/', async (req,res) => {
//   try {
//     const users = await getUsers();
//     throw new Error('Bombaa')
//     res.render('index', {title: 'Users', users: users.users});
//   }catch(error) {
//     res.render('error', { error });
//   }
// }); 

//* Using Async-Await with cleaner error-handling
app.get('/', asyncHandler(async (req, res) => {
  const users = await getUsers();
  res.render('index', { title: 'Users', users: users.users });
})); 



app.listen(3000, () => console.log('App listening on port 3000!'));