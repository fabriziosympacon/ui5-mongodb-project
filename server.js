js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
});

const DataSchema = new mongoose.Schema({
    Archivierungsobjekt: String,
    O_EN: String,
    O_DE: String,
    Vorgaenger: String,
    V_EN: String,
    V_DE: String
}, { collection: 'ARCH_NET' });

const Data = mongoose.model('Data', DataSchema);

app.get('/api/data', async (req, res) => {
    try {
        const data = await Data.find();
        res.json(data);
    } catch (err) {
        console.error('API Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({ error: error.message });
});

module.exports = app;

// Start server only if not running on Vercel
if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Server running on port ${port}`));
}