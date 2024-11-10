const express = require('express');
const app = express();
const port = 3001;

// Import Sequelize instance and models
const { sequelize, User } = require('./sequelize'); // Adjust path if needed

// Middleware to parse JSON (if you plan to accept POST requests)
app.use(express.json());

// Test Sequelize connection
sequelize.authenticate()
  .then(() => console.log("Database connected..."))
  .catch(err => console.error("Database connection failed:", err));

// Define routes, including a route that uses Sequelize
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching users' });
  }
});

app.get('/api/time', (req, res) => {
    const currentTime = new Date().toISOString();
    res.json({ time: currentTime });
});

app.get('/', (req, res) => {
    res.send('Welcome to the Time API! Go to /api/time to get the current time.');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
