const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const con = mysql.createConnection({
    host: "localhost",
    user: "kgoebel",
    password: "Goebel*0043",
    database: "journal" 
});

con.connect(function(err) {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log("Connected to MySQL!");
});

app.use(express.static('public'));

// Handle form submission
app.post('/submit', (req, res) => {

    // Save form data variables from request body
    const formMood = req.body.mood;
    const formRating = req.body.rating;
    const formFavorite = req.body.joy;
    const formEmail = req.body.email;
    const currentDay = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

    // Insert or update data in Database
    const sql = `
        INSERT INTO userData (email, currentDay, mood, rating, favorite_thing)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        mood = VALUES(mood),
        rating = VALUES(rating),
        favorite_thing = VALUES(favorite_thing)
    `;

    con.query(sql, [formEmail, currentDay, formMood, formRating, formFavorite], function(err, result) {
        if (err) {
            console.error('Error inserting data into MySQL:', err);
            res.status(500).json({ error: 'Error inserting data into MySQL', details: err });
            return;
        }
        console.log("Data inserted/updated into MySQL!");
        res.send('Data inserted/updated successfully');
    });
});

// Handle delete email request
app.delete('/delete', (req, res) => {
    const email = req.body.email;

    const sql = `DELETE FROM userData WHERE email = ?`;
    
    con.query(sql, [email], function(err, result) {
        if (err) {
            console.error('Error deleting data from MySQL:', err);
            res.status(500).json({ error: 'Error deleting data from MySQL', details: err });
            return;
        }
        console.log(`Data deleted from MySQL for email: ${email}`);
        res.send(`Data deleted successfully for email: ${email}`);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

