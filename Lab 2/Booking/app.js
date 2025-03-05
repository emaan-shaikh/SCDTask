const express = require('express');
const app = express();
const axios = require('axios');
const port = 3000;

app.use(express.json());

let bookings = [];

app.post('/bookings', async (req, res) => {
    const { bookingId, userId, carId, startDate, endDate, status} = req.body;

    if (!userId || !carId || !status) {
        return res.status(400).send('Failed to add booking');
    }

    const userRes = await axios.get(`http://localhost:3002/users/${userId}`);
    const user = userRes.data;

    const carRes = await axios.get(`http://localhost:3001/cars/${carId}`);
    const car = carRes.data;

    if (user.activeBookings >= user.maxBookings) {
        return res.status(400).send('Booking limit reached');
    }

    if (car.isAvailable !== true) {
        return res.status(400).send('Car is not available');
    }

    const booking = { bookingId: bookings.length + 1, userId, carId, startDate, endDate, status };
    bookings.push(booking);

    await axios.put(`http://localhost:3002/users/${userId}`, {activeBookings: user.activeBookings++});
    await axios.put(`http://localhost:3001/cars/${userId}`, {isAvailable: false});

    res.status(201).json(booking);
});


app.get('/bookings/:userid', (req, res) => {
    const userID = parseInt(req.params.userid);

    const bookingsForUser = bookings.filter(booking => booking.userId === userID);

    if (!bookingsForUser) {
        return res.status(404).send('Restaurant not found');
    }
    res.json(bookingsForUser);
});

app.delete('/bookings/:bookingid', async (req, res) => {
    const bookingId = parseInt(req.params.bookingid);
    const booking = bookings.find(b => b.bookingId === bookingId);
    if (!booking) {
        return res.status(404).send('Booking not found');
    }

    const userRes = await axios.get(`http://localhost:3002/users/${userId}`);
    const user = userRes.data;

    const carRes = await axios.get(`http://localhost:3001/cars/${carId}`);
    const car = carRes.data;

    await axios.put(`http://localhost:3002/users/${userId}`, {activeBookings: user.activeBookings--});
    await axios.put(`http://localhost:3001/cars/${userId}`, {isAvailable: true});

    
    booking.status = "Cancelled";
    res.json({message: 'booking deleted successfully' });
    
       
})

app.listen(port, () => {
    console.log(`bookings Microservice listening on port ${port}`);
});





