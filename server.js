require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection with error handling
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
}).then(() => {
    console.log('Connected to MongoDB Atlas');
}).catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// Optimized schema with indexes
const DataSchema = new mongoose.Schema({
    Archivierungsobjekt: { type: String, index: true },
    O_EN: String,
    O_DE: String,
    Vorgaenger: String,
    V_EN: String,
    V_DE: String
}, { collection: 'ARCH_NET' });

const Data = mongoose.model('Data', DataSchema);

// Optimized API endpoint with error handling
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

// Export for Vercel serverless function
module.exports = app;

// Start server only if not running on Vercel
if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Server running on port ${port}`));
}