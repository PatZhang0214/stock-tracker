const test = require('dotenv').config({path: './server/src/.env'})
const key = process.env.NEWS_API_KEY
const fs = require("fs").promises;
const express = require('express');
const cors = require('cors'); // Enable CORS
const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json());
const currTime = new Date();
const year = currTime.getFullYear();
const month = (currTime.getMonth() + 1).toString();
const day = currTime.getDate().toString();
const now = new Date(); // Get the current date and time
let hours = (currTime.getHours() - 10).toString();
let minutes = currTime.getMinutes().toString();
const FILEPATH = "./server/src/newsDB.json"
const hist_key = process.env.HIST_DATA_KEY
const {DateTime} = require('luxon')

// Checklist:

// Make sure can get proper information from API |/|
// Understand await, promises, etc |/|
// Make function based off await, promises |/|
// Test server to see if it can at least display information |/| IT WORKS!!!!
// Incorporate into main js file |/|
// Incorporate into HTML file |/|



// Read NewsAPI docs on time |/|
// Test NewsAPI time parameters |/|
// Add cache |/|



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

async function getNewData(TIME) {
    let link = `https://api.thenewsapi.com/v1/news/all?&api_token=${key}&categories=business&locale=us&language=en&published_after=${TIME}`
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
    let time = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T12`
    let s = "2024-08-23T02"


    // first read the file
    info = await readData(FILEPATH)
    if (info.length < 3) {
        isEmpty = true
    }

    // if file doesnt have elements, add elements then return those elements
    if (isEmpty) {
        getNewData(time).then(newData => {
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
        // we want to update the list at 12pm and 12am, twice a day
        let lastElement = info[0]
        const todayAtNoon = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0);
        let compareDate = lastElement.published_at
        const dateObject = new Date(compareDate);
        if (dateObject < todayAtNoon) {
            getNewData(time).then(newData => {
                info2 = newData.data
                const combinedArray = [...info2, ...info];
                writeNewData(FILEPATH, combinedArray).then(console.log("Update Wrote Successfully")).catch(err => {
                    console.error(err)
                })
                return info2
            }).catch(err => {
                console.error(err)
            })
        } else {
            console.log(info.slice(0,3))
            console.log("File Retrieved Successfully")
            return info.slice(0, 3)
        }
    }
}
fetchPromise();

const getChart = async() => {
    let curr = DateTime.now().setZone("America/New_York").weekday
    const symb = "AAPL"
    if (true) {

        const apiUrl = `https://api.polygon.io/v2/aggs/ticker/AAPL/range/1/day/2023-01-09/2023-02-10?adjusted=true&sort=asc&apiKey=${hist_key}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            let dataArray = [];

            for (let i = 0; i < data.results.length; i++) {
                let obj = {
                    close: data.results[i].c,
                    high: data.results[i].h,
                    low: data.results[i].l,
                    open: data.results[i].o,
                    timestamp: data.results[i].t,
                    volume: data.results[i].vw
                };
                dataArray.push(obj);
            }
            console.log('Data fetched successfully:', dataArray);
            return dataArray;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error; // Rethrow to be caught in the route
        }
    }
    return []; // Return an empty array if the condition is not met
}
getChart();
    // GET endpoint for users
app.get('/api/users', (req, res) => {
    fetchPromise().then(data => {
        console.log("Data Recieved Successfully: ", data);
        res.json(data);
    }).catch(error => {
        console.error("Failed to fetch data: ", error);
    });
});

app.get('/api/chart', async (req, res) => {
    try {
        const data = await getChart();
        console.log("Chart Data Received Successfully: ", data);
        res.json(data);
    } catch (error) {
        console.error("Failed to fetch data: ", error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
})

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
