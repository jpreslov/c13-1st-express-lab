//similar to React import; enables use of express
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

let app = express();
let chirps = [];
let publicPath = path.join(__dirname, '../public');

//parse URL-encoded bodies (apprently bodyParser is deprecated)
app.use(bodyParser.urlencoded({ extended: false }));

//console logs anything user puts in after localhost:3000 in the address bar
app.use(express.static(publicPath), (req, res, next) => {
  console.log(req.url);
  next();
});


app.use('/', (req, res, next) => {
  let newChirp = { username: req.body.username, message: req.body.message };

  if (fs.existsSync('chirps.json')) {
      //grabs chirps from already existing chirps.json file if it has already been made
    chirps = JSON.parse(fs.readFileSync('chirps.json'));

    //combines old chirps and new chirp into one array
    chirps = [...chirps, newChirp];

    //overwrites chirps.json with updated chirps array
    fs.writeFile('chirps.json', JSON.stringify(chirps), (err) => console.err(err));
  } else {
      //makes chirps.json file if it doesn't exist yet
    fs.writeFile('chirps.json', JSON.stringify(chirps), (err) => console.err(err));
  }

  next();
});

//show the user their inputted username and message when they click submit
app.post('/formsubmissions', (req, res, next) => {
  res.send(`Username: ${req.body.username}\
            Message: ${req.body.message}`);
});

//tell express where to run the server
let port = 1234;
app.listen(port, console.log(`Listening on port ${port}`));

//use the get method on the home url, respond with the string
// app.get('/', (req, res, next) => {
//     res.send('Hello from the web server side!')
// })
