const test = require('dotenv').config({path: './server/src/.env'})
const key = process.env.NEWS_API_KEY
const fs = require("fs").promises;

const currTime = new Date();
const year = currTime.getFullYear();
const month = (currTime.getMonth() + 1).toString();
const day = currTime.getDate().toString();
const now = new Date(); // Get the current date and time
const FILEPATH = "./server/src/newsDB.json"

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

const getNews = async() => {
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

// console.log(fetchPromise());
module.exports = getNews;