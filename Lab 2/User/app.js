const express = require('express');
const app = express();
const port = 3002;

app.use(express.json());

let users = [];

app.post('/users', (req, res) => {
    const { id, name, email, maxBookings, activeBookings } = req.body;

    if (!name || !email) {
        return res.status(400).send('Failed to register user');
    }

    const existing = users.find(u => u.email === email);
    if (existing) {
        return res.status(409).send('user already exists');
    }

    const user = { id: users.length + 1, name, email, maxBookings: 3, activeBookings: 0 };
    users.push(user);
    res.status(201).json(user);
});

app.get('/users/:id', (req, res) => {
    const Id = parseInt(req.params.id);

    const user = users.find(u => u.id === Id);
    if (!user) {
        return res.status(404).send('user not found');
    }
    res.json(user);
});



app.put("/users/:id", (req, res) => {
    const { id } = req.params;
    const { activeBookings } = req.body;

    if (!activeBookings) {
        return res.status(400).json({ message: "missing" });
    }

    const user = users.find(u => u.id === parseInt(id));
    if (!user) {
        return res.status(404).json({ message: "not found." });
    }

    user.activeBookings = activeBookings;

    res.status(200).json(user);
});



app.listen(port, () => {
    console.log(`users Microservice listening on port ${port}`);
});