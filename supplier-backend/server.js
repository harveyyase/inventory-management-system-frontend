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

let users = [];
let userCounter = 1;

// Routes

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Suppliers, Purchase Orders, and Users API!');
});

// --- Suppliers API ---

app.get('/api/suppliers', (req, res) => {
    res.json(suppliers);
});

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

app.delete('/api/suppliers/:id', (req, res) => {
    const id = parseInt(req.params.id);
    suppliers = suppliers.filter(s => s.id !== id);
    res.status(204).send();
});

// --- Purchase Orders API ---

app.get('/api/purchaseOrders', (req, res) => {
    res.json(purchaseOrders);
});

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

// Update purchase order by ID
app.put('/api/purchaseOrders/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = purchaseOrders.findIndex(o => o.id === id);

    if (index !== -1) {
        purchaseOrders[index] = {
            ...purchaseOrders[index],
            ...req.body,
            updatedAt: new Date().toISOString()
        };
        res.json(purchaseOrders[index]);
    } else {
        res.status(404).json({ error: 'Purchase order not found' });
    }
});

// --- Users API ---

app.get('/api/users', (req, res) => {
    res.json(users);
});

app.post('/api/users', (req, res) => {
    const user = {
        id: userCounter++,
        ...req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    users.push(user);
    res.status(201).json(user);
});

app.put('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
        users[index] = {
            ...users[index],
            ...req.body,
            updatedAt: new Date().toISOString()
        };
        res.json(users[index]);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

app.delete('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    users = users.filter(u => u.id !== id);
    res.status(204).send();
});

// Start server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
