const test = require('dotenv').config({path: './server/src/.env'})
const fs = require("fs").promises;
const currTime = new Date();
const hist_key = process.env.HIST_DATA_KEY
const {DateTime} = require('luxon')

const getCharts = async() => {
    let curr = DateTime.now().setZone("America/New_York").weekday
    if (true) {

        let symbolList = ['AAPL', 'MSFT', 'NVDA']

        let objList = []

        for(let index = 0; index < symbolList.length; index++){
            let symb = symbolList[index]
            let apiUrl = `https://api.polygon.io/v2/aggs/ticker/${symb}/range/30/minute/2024-08-29/2024-08-30?adjusted=true&sort=asc&apiKey=${hist_key}`;
            try {
                let response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                let data = await response.json();
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
                console.log(`Data for ${symbolList[index]} fetched successfully:`, dataArray);
                objList.push(dataArray);
            } catch (error) {
                console.error('Error fetching data:', error);
                throw error; // Rethrow to be caught in the route
            }
        }
        return objList;
    }
    return []; // Return an empty array if the condition is not met
}

// example:
// getCharts().then(data => {
//     console.log('Fetched data:', data);
// }).catch(error => {
//     console.error('Error:', error);
// });

module.exports = getCharts;