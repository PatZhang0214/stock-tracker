const test = require('dotenv').config({path: './server/src/.env'})
const key = process.env.NEWS_API_KEY
const fs = require("fs");
var json = require('./newsDB.json'); //with path
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
// Incorporate into main js file |/|
// Incorporate into HTML file |/|



// Read NewsAPI docs on time | |
// Test NewsAPI time parameters | |
// Add cache | |



// Connect to Vercel | |
// READY FOR DEPLOYMENT, STAND BACK! | |


const fetchPromise = async() => {
    console.log(json)
    const currTime = new Date();

const year = currTime.getFullYear();
const month = currTime.getMonth() + 1;
const day = currTime.getDate();
let hours = currTime.getHours() - 10;
let minutes = currTime.getMinutes();
const filePath = "server/src/newsDB.json"
// Format the time as a string
    let jsonArray = [];
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }

        // Check if the file is empty
        if (data.trim()) {
            // Parse existing data
            try {
                jsonArray = JSON.parse(data);
            } catch (parseErr) {
                console.error('Error parsing JSON:', parseErr);
                return;
            }
        }
    });
    if (jsonArray.length != 0) {
        let obj1 = [jsonArray[0], jsonArray[1], jsonArray[2]]
        console.log("Using Previous Data")
        console.log(obj1)
        return obj1
    } else {
        const timeString = `${year.toString()}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T${hours.toString().padStart(2, '0')}`;
        const link = `https://api.thenewsapi.com/v1/news/all?&api_token=${key}&categories=business&locale=us&language=en`
        try {
                const response = await fetch(link);
                if (!response.ok) {
                    console.log(`Error Fetching Data: Status: ${response.status}`)
                    throw new Error(`HTTP ERROR: Status: ${response.status}`)
                }
                const obj = await response.json();
                obj.data.forEach(element => {
                    console.log(element)
                    jsonArray.push(element)
                });
                fs.writeFile(filePath, JSON.stringify(jsonArray, null, 2), (err) => {
                    if (err) {
                        console.error('Error writing file:', err);
                        return;
                    }
                    console.log('Data successfully appended!');
                });
                return obj
                } catch (error){
                console.error("Error Fetching Data: ", error)
                throw error;
            }
    }
};
fetchPromise();
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
