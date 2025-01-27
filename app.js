const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const messRoutes = require('./routes/messRoutes');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Session setup
app.use(
    session({
        secret: 'mess-management-secret',
        resave: false,
        saveUninitialized: false,
    })
);

// MongoDB Connection
mongoose
    .connect('mongodb+srv://thummalanithinreddy4:niThin45@cluster0.rzh9o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

// Routes
app.use('/', messRoutes);

// Start Server
app.listen(3100, () => {
    console.log('Server running on http://localhost:3100');
});
