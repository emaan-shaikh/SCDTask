const express = require('express');
const app = express();
const axios = require('axios');
const port = 3001;

app.use(express.json());

let cars = [];


app.post('/cars', async (req, res) => {
    const { carId, model, location, isAvailable } = req.body;

    const newCar = {
        id: cars.length + 1,
        carId, model, location, isAvailable: true
    };


    cars.push(newCar);
    res.status(201).json(newCar);



});


app.get("/cars/:id", (req, res) => {
    const { carID } = req.params;
    const car = cars.find((c) => c.carID === parseInt(carID));


    if (!car) {
        return res.status(404);
    }


    res.json({
        carID: car.carID,
        model: car.model, 
        location: car.location,
        isAvailable: car.isAvailable
    });
});


app.put("/cars/:id", (req, res) => {
    const { id } = req.params;
    const { isAvailable } = req.body;

    if (!isAvailable) {
        return res.status(400).json({ message: "missing" });
    }

    const car = cars.find(c => c.carID === parseInt(id));
    if (!car) {
        return res.status(404).json({ message: "not found." });
    }

    car.isAvailable = isAvailable;

    res.status(200).json(car);
});

app.listen(port, () => {
    console.log(`cars Microservice listening on port ${port}`);
});







