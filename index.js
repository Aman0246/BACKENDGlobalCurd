require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorHandler = require('./utils/errorHandler');
const controllers = require('./routes/index')
const app = express();
const http = require('http');
const server = http.createServer(app); // Add this
app.use(cors());
const { PORT, API_END_POINT_V1 } = process.env;
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Test route
app.get("/test", (req, res) => res.send("sdasd"));

// Loop through the controllers and register routes
for (const [route, controller] of Object.entries(controllers)) {
    console.log(`${API_END_POINT_V1}${route}`);
    app.use(`${API_END_POINT_V1}${route}`, controller);
}


app.use(errorHandler);
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is up and running on port ${PORT}! 🚀`);
});