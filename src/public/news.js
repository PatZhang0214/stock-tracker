const test = require('dotenv').config({path: './src/public/.env'})
const key = process.env.NEWS_API_KEY
const link = `https://api.thenewsapi.com/v1/news/top?&api_token=${key}&categories=business&locale=us,ca`

async function fetchRequest() {
    const response = await fetch(link);
    const obj = await response.json();
    for (var index = 0; index < 3; index++) {
        console.log(obj.data[index].title)
    }
}

fetchRequest();