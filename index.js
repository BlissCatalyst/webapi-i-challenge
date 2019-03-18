// implement your API here
const express = require('express');

const db = require('./data/db.js');

const server = express();

server.use(express.json()); // add this to make POST and PUT work

server.get('/', (req, res) => {
  res.send('Home api "/"');
});

// CREATE *******************************
server.post('/api/users', (req, res) => {
  const dbInfo = req.body;

  db.insert(dbInfo).then(id => {
    if(id) {
      res.status(201).json(id);
    } else {
      res.status(500).json({ error: "There was an error while saving the user to the database" });
    }
  })
  .catch(err => {
    res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
  });
});

// READ *********************************
server.get('/api/users', (req, res) => {
  db.find().then(users => {
    res.status(200).json(users);
  })
  .catch(err => {
    res.status(500).json({ error: "the users information could not be retrieved." });
  });
});

server.get('/api/users/:id', (req, res) => {
  const id = req.params.id;

  db.findById(id).then(user => {
    if(user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "The user with the specified ID does not exist." });
    }
  })
  .catch(err => {
    res.status(500).json({ error: "The user information could not be retrieved" });
  });
})

// DELETE ********************************
server.delete('/api/users/:id', (req, res) => {
  const id = req.params.id;

  db.remove(id).then(wasSuccessful => {
    if(wasSuccessful) {
      res.status(200).end();
    } else {
      res.status(404).json({ message: "The user with the specified ID does not exist." });
    }
  })
  .catch(err => {
    res.status(500).json({ error: "The user could not be removed" });
  });
})

// UPDATE ********************************
server.put('/api/users/:id', (req, res) => {
  const id = req.params.id;
  const changes = req.body;

  db.update(id, changes).then(updated => {
    if(updated) {
      res.status(200).json({ message: "The user was updated." });
    } else {
      res.status(404).json({ message: "The user with the specified ID does not exist." });
    }
  })
  .catch(err => {
    res.status(500).json({ error: "The user information could not be modified." });
  });
})

// watch for connections on port 5000
server.listen(5000, () => 
  console.log('Server running on http://localhost:5000')
);