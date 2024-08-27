const filePath = "server/src/newsDB.json"
let FILEPATH = "./server/src/newsDBSample.json"
const {DateTime} = require('luxon')
const test = require('dotenv').config({path: './server/src/.env'})
const rt_key = process.env.STOCKS_API_KEY
const hist_key = process.env.HIST_DATA_KEY
const fs = require('fs').promises;
const express = require('express');
const cors = require('cors'); // Enable CORS
const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json());

const axios = require('axios')
// Gets appropriate time for NYSE (9:30am to 4pm)
console.log(DateTime.now().setZone("America/New_York").toISO())
// console.log(key)

// first, if its the weekend then just display preexisting data
// from friday

let curr = DateTime.now().setZone("America/New_York").weekday
const symb = "AAPL"
var url = ``
if (curr == 6  || curr == 7) {

    const apiUrl = `https://api.polygon.io/v2/aggs/ticker/AAPL/range/1/day/2023-01-09/2023-02-10?adjusted=true&sort=asc&apiKey=${hist_key}`;

    new Promise((resolve, reject) => {
        fetch(apiUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => resolve(data))
            .catch((error) => reject(error));
    })
    .then((data) => {
        let dataArray = []

        // close, high, low, open, timestamp, volume
        // c, h, l, o, t, v/vw
        for(let i = data.results.length-1; i>=0; i--) {
            // console.log(data.results[i])
            let obj = {}
            obj.close = data.results[i].c
            obj.high = data.results[i].h
            obj.low = data.results[i].l
            obj.open = data.results[i].o
            obj.timestamp = data.results[i].t
            obj.volume = data.results[i].vw
            dataArray.push(obj)
        }
        window.onload = function () {
            var chart = klinecharts.init('chart')
            chart.applyNewData(dataArray)
        }
        // console.log('Data fetched successfully:', data);
    })
    .catch((error) => {
        console.error('Error fetching data:', error);
    });
}

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
