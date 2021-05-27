const connection = require('./db-config');
const express = require('express');
const app = express();


const port = process.env.PORT || 3000;

connection.connect((err) => {
  if (err) {
    console.error('error connecting: ' + err.stack);
  } else {
    console.log('connected as id ' + connection.threadId);
  }
});

app.use(express.json())

//GET METHOD

app.get('/api/movies', (req, res) => {
  connection.query('SELECT * FROM movies', (err, result) => {
    if (err) {
      res.status(500).send('Error retrieving data from database');
    } else {
      res.json(result);
    }
  });
});


app.get('/api/users', (req, res) => {
  connection.query('SELECT * FROM users', (err, result) => {
    if (err) {
      res.status(500).send('Error retrieving data from database');
    } else {
      res.json(result);
    }
  });
});


//POST METHOD

app.post('/api/movies', (req, res) => {
  const { title, director, year, color, duration } = req.body;
  connection.query(
    'INSERT INTO movies(title, director, year, color, duration) VALUES (?, ?, ?, ?, ?)',
    [title, director, year, color, duration],
    (err, result) => {
      if (err) {
        res.status(500).send('Error saving the movie');
      } else {
        res.status(201).send('Movie successfully saved');
      }
    }
  );
});

app.post('/api/users', (req, res) => {
  const { firstname, lastname, email} = req.body;
  connection.query(
    'INSERT INTO users (firstname, lastname, email) VALUES (?, ?, ?)',
    [firstname, lastname, email],
    (err, result) => {
      if (err) {
        res.status(500).send('Error saving the user');
      } else {
        res.status(201).send('User successfully saved');
      }
    }
  );
});

//PUT METHOD

app.put('/api/users/:id', (req, res) => {
  // We get the ID from the url path :
  const userId = req.params.id;
  // We get the new attribute values for the user from req.body
  const userPropsToUpdate = req.body;
  // We send a UPDATE query to the DB
  connection.query(
    'UPDATE users SET ? WHERE id = ?',
    [userPropsToUpdate, userId],
    (err) => {
      // Once the DB operation is over, we can respond to the HTTP request
      if (err) {
        console.log(err);
        res.status(500).send('Error updating a user');
      } else {
        res.status(200).send('User updated successfully 🎉');
      }
    }
  );
});



app.put('/api/movies/:id', (req, res) => {
  
  const movieId = req.params.id;
  const moviePropsToUpdate = req.body;

  connection.query(
    'UPDATE movies SET ? WHERE id = ?',
    [moviePropsToUpdate, movieId],
    (err) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error updating a movie');
      } else {
        res.status(200).send('Movie updated successfully 🎉');
      }
    }
  );
});



app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
