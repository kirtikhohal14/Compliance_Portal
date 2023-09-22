const express = require('express');
const certificationModel = require('../models/certification'); // Import the certification model

const router = express.Router();

// Define the API endpoint
router.get('/certification-list', async (req, res) => {
    try {
        const { pageNumber, pageSize, Certification, Category, Status, BusinessType, Destination, ModelNumber } = req.query;
        // Check if pageNumber and pageSize are provided in the query parameters
        if (!pageNumber || !pageSize) {
            return res.status(400).json({ error: 'pageNumber and pageSize are required in query parameters' });
        }

        // Parse pageNumber and pageSize as integers
        const pageNumberInt = parseInt(pageNumber);
        const pageSizeInt = parseInt(pageSize);

        // Construct a dynamic SQL query with filtering conditions based on filter parameters
        const query = {
            text: `
                SELECT * FROM "certification_list"
                WHERE
                    ($1::text IS NULL OR "Certificate#" = $1::text)
                    AND ($2::character varying IS NULL OR "Category" = $2::character varying)
                    AND ($3::character varying IS NULL OR "Status" = $3::character varying)
                    AND ($4::character varying IS NULL OR "Bus.Type" = $4::character varying)
                    AND ($5::character varying IS NULL OR "Destination" = $5::character varying)
                    AND ($6::character varying IS NULL OR "ModelNo" = $6::character varying)
                LIMIT $7 OFFSET $8
            `,
            values: [Certification, Category, Status, BusinessType, Destination, ModelNumber, pageSizeInt, (pageNumberInt - 1) * pageSizeInt],
        };
        

        // Call the function from the model to fetch data with dynamic filtering and pagination
        const certificationList = await certificationModel.getCertificationListWithFilters(query);

        // Send the fetched data as a response
        res.status(200).json(certificationList);
    } catch (error) {
        // Handle any errors
        console.error("Error fetching certification list:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
