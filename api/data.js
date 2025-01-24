require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection URI
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://fabriziolantieri:Herrenhausen1868@netzplan.ekaiu.mongodb.net/Netzgrafik?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Define a schema for the data
const DataSchema = new mongoose.Schema({
    Archivierungsobjekt: String,
    O_EN: String,
    O_DE: String,
    Vorgaenger: String,
    V_EN: String,
    V_DE: String
}, { collection: 'ARCH_NET' });

const Data = mongoose.model('Data', DataSchema);

// API endpoint to get data with optional filter
app.get('/api/data', async (req, res) => {
    const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
    try {
        const data = await Data.find(filter);
        res.json(data);
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = app;