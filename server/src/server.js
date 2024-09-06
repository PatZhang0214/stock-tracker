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



// Read NewsAPI docs on time |/|
// Test NewsAPI time parameters |/|
// Add cache |/|

// Show Mikey how to use Github |/|

// Connect to Vercel | |
// READY FOR DEPLOYMENT, STAND BACK! | |

const getNews = require('./functions/NewsFetch')
const getCharts = require('./functions/TopGraphFetch')

    // GET endpoint for users
app.get('/api/users', (req, res) => {
    getNews().then(data => {
        console.log("Data Recieved Successfully: ", data);
        res.json(data);
    }).catch(error => {
        console.error("Failed to fetch data: ", error);
    });
});

app.get('/api/chart', async (req, res) => {
    try {
        const data = await getCharts();
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
