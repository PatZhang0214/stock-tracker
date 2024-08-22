const test = require('dotenv').config({path: './server/src/.env'})
const key = process.env.NEWS_API_KEY
const fs = require("fs").promises;
var json = require('./newsDB.json'); //with path
const express = require('express');
const cors = require('cors'); // Enable CORS
const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json());
const currTime = new Date();
const year = currTime.getFullYear();
const month = currTime.getMonth() + 1;
const day = currTime.getDate();
let hours = currTime.getHours() - 10;
let minutes = currTime.getMinutes();
const FILEPATH = "./server/src/newsDB.json"

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

function readData(FILEPATH) {
    return fs.readFile(FILEPATH, 'utf8')
        .then(data => {
            return JSON.parse(data);
        })
        .catch(err => {
            console.error("Error reading file", err);
            throw err; // Rethrow the error
        });
}

async function getNewData() {
    let link = `https://api.thenewsapi.com/v1/news/all?&api_token=${key}&categories=business&locale=us&language=en`
    return (await fetch(link)).json()
}

async function writeNewData(FILEPATH, newData) {
    try {
        await fs.writeFile(FILEPATH, JSON.stringify(newData, null, 2), 'utf8')
    } catch(err) {
        console.error(err)
    }
}

const fetchPromise = async() => {
    let isEmpty = false;
    let info;

    // first read the file
    info = await readData(FILEPATH)
    if (info.length < 3) {
        isEmpty = true
    }

    // if file doesnt have elements, add elements then return those elements
    if (isEmpty) {
        getNewData().then(newData => {
            info = newData.data
            writeNewData(FILEPATH, info).then(console.log("File Wrote Successfully")).catch(err => {
                console.error(err)
            })
            return info
        }).catch(err => {
            console.error(err)
        })
    }
    // if file has elements, take first three and return them
    else {
        console.log(info.slice(0,3))
        console.log("File Retrieved Successfully")
        return info.slice(0, 3)
    }
}
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
