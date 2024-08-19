const test = require('dotenv').config({path: './server/src/.env'})
const key = process.env.NEWS_API_KEY
const fs = require("fs");
console.log(key)
// server.js
const express = require('express');
const cors = require('cors'); // Enable CORS
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Checklist:

// Make sure can get proper information from API |/|
// Understand await, promises, etc |/|
// Make function based off await, promises |/|
// Test server to see if it can at least display information |/| IT WORKS!!!!
// Incorporate into main js file | |
// Incorporate into HTML file | |
// Connect to Vercel | |
// READY FOR DEPLOYMENT, STAND BACK! | |


const fetchPromise = async() => {
    const link = `https://api.thenewsapi.com/v1/news/top?&api_token=${key}&categories=business&locale=ca`
    try {
        const response = await fetch(link);
        if (!response.ok) {
            console.log(`Error Fetching Data: Status: ${response.status}`)
            throw new Error(`HTTP ERROR: Status: ${response.status}`)
        }
        const obj = await response.json();
        return obj
        } catch (error){
        console.error("Error Fetching Data: ", error)
        throw error;
    }
};

// GET endpoint for users
app.get('/api/users', (req, res) => {
    fetchPromise().then(data => {
        console.log("Data Recieved Successfully: ", data);
        res.json(data);
    }).catch(error => {
        console.error("Failed to fetch data: ", error);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});