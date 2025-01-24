require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Update CORS configuration
app.use(cors({
    origin: ['http://localhost:8080', 'https://ui5-mongodb-project.vercel.app'],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// MongoDB connection with error handling
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    w: 'majority' // Added the w option with 'majority' value
}).then(() => {
    console.log('Connected to MongoDB Atlas');
}).catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

const DataSchema = new mongoose.Schema({
    Archivierungsobjekt: { type: String, index: true },
    O_EN: String,
    O_DE: String,
    Vorgaenger: String,
    V_EN: String,
    V_DE: String
}, { collection: 'ARCH_NET' });

const Data = mongoose.model('Data', DataSchema);

app.get('/api/data', async (req, res) => {
    try {
        const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
        const data = await Data.aggregate([
            { $match: filter },
            { $group: { 
                _id: "$Archivierungsobjekt",
                doc: { $first: "$$ROOT" }
            }},
            { $replaceRoot: { newRoot: "$doc" } }
        ]).exec();
        
        res.json(data);
    } catch (err) {
        console.error('API Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = app;

if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Server running on port ${port}`));
}