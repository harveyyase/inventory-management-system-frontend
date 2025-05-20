const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory storage (replace with a real DB later)
let suppliers = [];
let supplierCounter = 1;

let purchaseOrders = [];
let purchaseOrderCounter = 1;

// Routes

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Suppliers and Purchase Orders API!');
});

// --- Suppliers API ---

// GET all suppliers
app.get('/api/suppliers', (req, res) => {
    res.json(suppliers);
});

// POST new supplier
app.post('/api/suppliers', (req, res) => {
    const supplier = {
        id: supplierCounter++,
        ...req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    suppliers.push(supplier);
    res.status(201).json(supplier);
});

// PUT (update) supplier
app.put('/api/suppliers/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = suppliers.findIndex(s => s.id === id);
    if (index !== -1) {
        suppliers[index] = {
            ...suppliers[index],
            ...req.body,
            updatedAt: new Date().toISOString()
        };
        res.json(suppliers[index]);
    } else {
        res.status(404).json({ error: 'Supplier not found' });
    }
});

// DELETE supplier
app.delete('/api/suppliers/:id', (req, res) => {
    const id = parseInt(req.params.id);
    suppliers = suppliers.filter(s => s.id !== id);
    res.status(204).send();
});

// --- Purchase Orders API ---

// GET all purchase orders
app.get('/api/purchaseOrders', (req, res) => {
    res.json(purchaseOrders);
});

// POST new purchase order
app.post('/api/purchaseOrders', (req, res) => {
    const order = {
        id: purchaseOrderCounter++,
        ...req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    purchaseOrders.push(order);
    res.status(201).json(order);
});

// Start server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
