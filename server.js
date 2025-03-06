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

app.get('/api/vorgaenger', async (req, res) => {
    const archivierungsobjekt = req.query.archivierungsobjekt;

    try {
        const result = await Data.aggregate([
            { $match: { Archivierungsobjekt: archivierungsobjekt } },
            {
                $graphLookup: {
                    from: 'ARCH_NET', // Replace with your collection name if different
                    startWith: '$Vorgaenger',
                    connectFromField: 'Vorgaenger',
                    connectToField: 'Archivierungsobjekt',
                    as: 'vorgaengerHierarchy',
                    maxDepth: 10, // Adjust the depth as needed
                    depthField: 'level'
                }
            },
            {
                $project: {
                    _id: 1,
                    Archivierungsobjekt: 1,
                    O_EN: 1,
                    O_DE: 1,
                    vorgaengerHierarchy: 1
                }
            }
                ]);
                res.json(result);
            } catch (err) {
                res.status(500).send(err);
            }
        });
        
        app.get('/api/graphlookus', async (req, res) => {
            const archivierungsobjekt = req.query.archivierungsobjekt;
        
            try {
                const result = await Data.aggregate([
                    { $match: { Archivierungsobjekt: archivierungsobjekt } },
                    {
                        $graphLookup: {
                            from: 'ARCH_NET',
                            startWith: '$Vorgaenger',
                            connectFromField: 'Vorgaenger',
                            connectToField: 'Archivierungsobjekt',
                            as: 'vorgaengerHierarchy',
                            maxDepth: 10,
                            depthField: 'level'
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            Archivierungsobjekt: 1,
                            Vorgaenger:1,
                            vorgaengerHierarchy: 1
                        }
                    }
                ]);
        
                if (result.length === 0) {
                    return res.json([]);
                }
        
                const nodes = new Set();
                const edges = [];
                const graphData = [];
        
                // Add the initial node
                nodes.add(result[0].Archivierungsobjekt);
                graphData.push({ data: { id: result[0].Archivierungsobjekt } });
        
                result[0].vorgaengerHierarchy.forEach(item => {
                    nodes.add(item.Archivierungsobjekt);
                    nodes.add(item.Vorgaenger);
                    edges.push({ source: item.Vorgaenger, target: item.Archivierungsobjekt });
                });
        
                nodes.forEach(node => {
                    graphData.push({ data: { id: node } });
                });
        
                edges.forEach(edge => {
                    graphData.push({ data: { source: edge.source, target: edge.target } });
                });
        
                res.json(graphData);
            } catch (err) {
                res.status(500).send(err);
            }
        });
        
        const port = process.env.PORT || 3000;
        app.listen(port, () => console.log(`Server running on port ${port}`));
        
        module.exports = app;