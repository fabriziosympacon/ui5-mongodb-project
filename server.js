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

// API endpoint to get unique data
app.get('/api/data', async (req, res) => {
    const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
    try {
        const data = await Data.aggregate([
            { $match: filter },
            { $group: { _id: "$Archivierungsobjekt", doc: { $first: "$$ROOT" } } },
            { $replaceRoot: { newRoot: "$doc" } }
        ]);
        res.json(data);
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = app;

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));