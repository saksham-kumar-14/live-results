const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 5000;

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

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://10.102.71.103:${PORT}`);
});
