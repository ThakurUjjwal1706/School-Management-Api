const db = require('../models/db');
const { calculateDistance } = require('../utils/distance');

// Add School
const addSchool = async (req, res, next) => {
    try {
        const { name, address, latitude, longitude } = req.body;

        // Validation
        if (!name || typeof name !== 'string' || name.trim() === '') {
            return res.status(400).json({ success: false, error: 'Invalid or missing name' });
        }
        if (!address || typeof address !== 'string' || address.trim() === '') {
            return res.status(400).json({ success: false, error: 'Invalid or missing address' });
        }
        if (latitude === undefined || typeof latitude !== 'number') {
            return res.status(400).json({ success: false, error: 'Invalid or missing latitude (must be a number)' });
        }
        if (longitude === undefined || typeof longitude !== 'number') {
            return res.status(400).json({ success: false, error: 'Invalid or missing longitude (must be a number)' });
        }

        // Insert into database
        const query = `INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)`;
        const [result] = await db.query(query, [name.trim(), address.trim(), latitude, longitude]);

        res.status(201).json({
            success: true,
            message: 'School added successfully',
            schoolId: result.insertId
        });
    } catch (error) {
        next(error);
    }
};

// List Schools
const listSchools = async (req, res, next) => {
    try {
        const { latitude, longitude } = req.query;

        // Validation
        if (!latitude || !longitude) {
            return res.status(400).json({ success: false, error: 'Latitude and longitude are required' });
        }

        const userLat = parseFloat(latitude);
        const userLon = parseFloat(longitude);

        if (isNaN(userLat) || isNaN(userLon)) {
            return res.status(400).json({ success: false, error: 'Latitude and longitude must be valid numbers' });
        }

        // Fetch all schools
        const [schools] = await db.query(`SELECT * FROM schools`);

        // Calculate distance and sort
        const schoolsWithDistance = schools.map(school => {
            const distance = calculateDistance(userLat, userLon, school.latitude, school.longitude);
            return {
                ...school,
                distance
            };
        });

        // Sort by nearest first
        schoolsWithDistance.sort((a, b) => a.distance - b.distance);

        res.status(200).json({
            success: true,
            data: schoolsWithDistance
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addSchool,
    listSchools
};
