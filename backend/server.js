const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;

// password and encryption key
const ADMIN_PASSWORD = "password";
const SECRET_KEY = "secret";

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize SQLite database
const db = new sqlite3.Database(path.join(__dirname, 'participants.db'), (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the SQLite database.');
    // Create tables for each event if they don't exist
    db.run(`CREATE TABLE IF NOT EXISTS participants_3x3 (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      solves TEXT NOT NULL
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS participants_4x4 (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      solves TEXT NOT NULL
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS participants_2x2 (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      solves TEXT NOT NULL
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS participants_3x3oh(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      solves TEXT NOT NULL
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS participants_pyra(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      solves TEXT NOT NULL
    )`);
  }
});

// Function to get the table name based on the event
const getTableName = (event) => {
  console.log('Received event:', event);
  switch (event) {
    case '3x3':
      return 'participants_3x3';
    case '4x4':
      return 'participants_4x4';
    case '2x2':
      return 'participants_2x2';
    case '3x3oh':
      return 'participants_3x3oh';
    case 'pyra':
      return 'participants_pyra';
    default:
      throw new Error(`Invalid event type ${event}`);
  }
};

// Endpoint to get participants for a specific event


app.get('/participants', (req, res) => {
  const event = req.query.event; // Get the event from the query parameters
  const tableName = getTableName(event); // Get the table name for the event

  db.all(`SELECT * FROM ${tableName}`, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows.map(row => ({
        id: row.id,
        name: row.name,
        solves: JSON.parse(row.solves) // Convert string back to array
      })));
    }
  });
});

// Endpoint to delete a participant for a specific event
app.post('/delete', (req,res) => {
  const event = req.query.event;
  const id = req.body.id;
  const tableName = getTableName(event);

  db.run(`DELETE FROM ${tableName} WHERE id=?`, [id], (err) => {
    if(err){
      res.status(500).json({ deleted:false, error: err.message });
      console.error('Database error:', err.message);
    }else{
      res.json({ deleted: true, id: id });
    }
  })
});

// Endpoint to update a participant for a specific event
app.post('/update', (req,res)=>{
  const event = req.query.event;
  const { id, name, solves } = req.body;
  const tableName = getTableName(event);

  db.run(`UPDATE ${tableName} SET name=?, solves=? WHERE id=?`, [name, JSON.stringify(solves) ,  id], (err) => {
    if(err){
      res.status(500).json({ updated:false, error: err.message });
      console.error('Database error:', err.message);
    }else{
      res.json({ updated: true, id: id });
    }
  })
});

// Endpoint to add a participant for a specific event
app.post('/participants', (req, res) => {
  const event = req.query.event; // Get the event from the query parameters
  const { name, solves } = req.body;
  const tableName = getTableName(event); // Get the table name for the event

  db.run(`INSERT INTO ${tableName} (name, solves) VALUES (?, ?)`, [name, JSON.stringify(solves)], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      console.error('Database error:', err.message);
    } else {
      res.json({ id: this.lastID, name, solves });
    }
  });
});

// Endpoint for admin authentication
app.post("/adminLogin", (req,res)=>{
  const pwd = req.body.password;
  if (pwd == ADMIN_PASSWORD) {
    const token = jwt.sign({password: pwd}, SECRET_KEY);
    return res.json({ status:"ok", authenticated: true, passwordToken:token  })
  }else{
    return res.json({ status:404, authenticated: false  })
  }
})

app.get("/api/adminLogin", (req,res)=>{
  try{
    const token = req.headers['password-token'];
    const decoded = jwt.decode(token);
    if (decoded.password == ADMIN_PASSWORD) {
      return res.json({ status:"ok", authenticated: true  })
    }else{
      return res.json({ status:404, authenticated: false  })
    }
  }catch{
    return res.json({ status:404, authenticated: false  })
  }
})

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
