const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

const db = new sqlite3.Database('./hotel.db');

const allowedTables = ['books', 'building', 'customers', 'employees', 'extracharge', 'hotel', 'payments', 'room_type', 'rooms'];

app.get('/table/:table_name', (req, res) => {
    const tableName = req.params.table_name;

    if (!allowedTables.includes(tableName)) {
        return res.status(400).json({ error: 'Invalid table name' });
    }

    const column = req.query.column;
    const value = req.query.value;

    let query = `SELECT * FROM ${tableName}`;
    const params = [];

    if (column && value) {
        query += ` WHERE ${column} = ?`;
        params.push(value);
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.get('/queryQ1', (req, res) => {
    const queryQ1 = 
        `SELECT 
            strftime('%m', check_in_date) AS month, 
            COUNT(*) AS total_bookings
        FROM 
            books
        GROUP BY 
            month
        ORDER BY 
            total_bookings DESC`;
    db.all(queryQ1, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.get('/queryQ2', (req, res) => {
    const queryQ2 = 
       `SELECT 
            rt.name AS room_type, 
            COUNT(b.book_id) AS total_bookings
        FROM 
            books b
        JOIN 
            rooms r ON b.room_id = r.room_id
        JOIN 
            room_type rt ON r.room_type_id = rt.room_type_id
        GROUP BY 
            rt.name
        ORDER BY 
            total_bookings DESC`;
    db.all(queryQ2, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.get('/queryQ3', (req, res) => {
    const queryQ3 = 
       `SELECT 
            CASE 
                WHEN age BETWEEN 0 AND 4 THEN '0-4'
                WHEN age BETWEEN 5 AND 9 THEN '5-9'
                WHEN age BETWEEN 10 AND 14 THEN '10-14'
                WHEN age BETWEEN 15 AND 19 THEN '15-19'
                WHEN age BETWEEN 20 AND 24 THEN '20-24'
                WHEN age BETWEEN 25 AND 29 THEN '25-29'
                WHEN age BETWEEN 30 AND 34 THEN '30-34'
                WHEN age BETWEEN 35 AND 39 THEN '35-39'
                WHEN age BETWEEN 40 AND 44 THEN '40-44'
                WHEN age BETWEEN 45 AND 49 THEN '45-49'
                WHEN age >= 50 THEN '50+'
            END AS age_group,
            COUNT(*) AS customer_count
        FROM (
            SELECT 
                strftime('%Y', 'now') - strftime('%Y', birth_date) AS age
            FROM 
                customers
        )
        GROUP BY 
            age_group
        ORDER BY 
            age_group`;
    db.all(queryQ3, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'hotel_about.html'));
});
