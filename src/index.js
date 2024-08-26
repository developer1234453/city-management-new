const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000; 


app.use(bodyParser.json());


let cities = [];

// Add City API - POST /api/cities
app.post('/api/cities', (req, res) => {
    const { name, population, country, latitude, longitude } = req.body;

    // Check if the city name is already in use
    const cityExists = cities.some(city => city.name === name);
    if (cityExists) {
        return res.status(400).json({ message: 'City name must be unique.' });
    }

    const newCity = { name, population, country, latitude, longitude };
    cities.push(newCity);

    res.status(201).json({
        message: 'City added successfully',
        city: newCity
    });
});
app.put('/api/cities/:name', (req, res) => {
    const cityName = req.params.name;
    const updates = req.body;

    console.log(`Attempting to update city: ${cityName}`);
    console.log(`Updates received:`, updates);

    // Find the city to update
    const cityIndex = cities.findIndex(city => city.name === cityName);
    if (cityIndex === -1) {
        console.log(`City not found: ${cityName}`);
        return res.status(404).json({ message: 'City not found.' });
    }

    // Update only the fields that are provided
    const city = cities[cityIndex];
    cities[cityIndex] = { ...city, ...updates };

    console.log(`Updated city:`, cities[cityIndex]);

    res.status(200).json({
        message: 'City updated successfully',
        city: cities[cityIndex]
    });
});



// Delete City API - DELETE /api/cities/:name
app.delete('/api/cities/:name', (req, res) => {
    const cityName = req.params.name;

    // Find the city to delete
    const cityIndex = cities.findIndex(city => city.name === cityName);
    if (cityIndex === -1) {
        return res.status(404).json({ message: 'City not found.' });
    }

    // Remove the city from the array
    const deletedCity = cities.splice(cityIndex, 1);

    res.status(200).json({
        message: 'City deleted successfully',
        city: deletedCity
    });
});

// Get Cities API - GET /api/cities
app.get('/api/cities', (req, res) => {
    // Implement pagination, filtering, sorting, searching, projection here
    res.status(200).json(cities);
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
