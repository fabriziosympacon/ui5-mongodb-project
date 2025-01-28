require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not defined in environment variables');
    process.exit(1);
}

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
    const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
    const groupByArchivierungsobjekt = req.query.groupByArchivierungsobjekt === 'true';
    
    try {
        let data;
        if (groupByArchivierungsobjekt) {
            data = await Data.aggregate([
                { $match: filter },
                { $group: { 
                    _id: "$Archivierungsobjekt", 
                    Archivierungsobjekt: { $first: "$Archivierungsobjekt" },
                    O_EN: { $first: "$O_EN" },
                    O_DE: { $first: "$O_DE" }
                }}
            ]);
        } else {
            data = await Data.find(filter);
        }
        res.json(data);
    } catch (err) {
        res.status(500).send(err);
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));

module.exports = app;