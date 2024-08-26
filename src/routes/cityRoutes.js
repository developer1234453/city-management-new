const express = require('express');
const router = express.Router();
const City = require('../models/City');

// Add City API
router.post('/add', async (req, res) => {
    try {
        const { name, population, country, latitude, longitude } = req.body;
        const city = new City({ name, population, country, latitude, longitude });
        await city.save();
        res.status(201).json({ message: 'City added successfully', city });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update City API
router.put('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedCity = await City.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedCity) return res.status(404).json({ message: 'City not found' });
        res.json({ message: 'City updated successfully', city: updatedCity });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete City API
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCity = await City.findByIdAndDelete(id);
        if (!deletedCity) return res.status(404).json({ message: 'City not found' });
        res.json({ message: 'City deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get Cities API
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, filter = '{}', sort = 'name', search = '', projection = '' } = req.query;
        const filterObject = JSON.parse(filter);
        const sortObject = {};
        sortObject[sort] = 1;
        
        const cities = await City.find(filterObject)
            .sort(sortObject)
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .select(projection)
            .exec();
        
        res.json(cities);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
