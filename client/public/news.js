const test = require('dotenv').config({path: './server/src/.env'})
const key = process.env.NEWS_API_KEY
const fs = require("fs");

async function fetchUsers() {
  try {
      const response = await fetch('http://localhost:3000/api/users');
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const users = await response.json();
      const userList = document.getElementById('userList');
      console.log(users)

      const D = users.data
      D.forEach(article => {
          const li = document.createElement('li');
          li.textContent = `${article.title}: ${article.description}`;
          userList.appendChild(li);
      });
  } catch (error) {
      console.error('Fetch error:', error);
  }
}

fetchUsers();