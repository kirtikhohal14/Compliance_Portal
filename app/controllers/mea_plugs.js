const express = require('express');
const queries = require('../utilities/queries')

const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: MEA Plugs
 *   description: API endpoints for fetching a list of MEA Plugs
 */

/**
 * @swagger
 * /mea-plugs:
 *   get:
 *     summary: Fetch a list of MEA Plugs
 *     description: Fetch a list of MEA Plugs with optional filtering and pagination.
 *     tags: [MEA Plugs]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         description: Access token
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: pageNumber
 *         description: Page number for pagination.
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: pageSize
 *         description: Number of items per page.
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: country
 *         description: Filter by country (optional).
 *         schema:
 *           type: string
 *       - in: query
 *         name: voltage
 *         description: Filter by voltage (optional).
 *         schema:
 *           type: string
 *       - in: query
 *         name: frequency
 *         description: Filter by frequency (optional).
 *         schema:
 *           type: string
 *       - in: query
 *         name: plug_type
 *         description: Filter by plug type (optional).
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: List of mea plugs fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   // Define the properties of each mea plugs object here
 *       '400':
 *         description: Bad request or missing required parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */


// Define the API endpoint
router.get('/mea-plugs', async (req, res) => {
    try {
        const { pageNumber, pageSize, country, voltage, frequency, plug_type } = req.query;
        // Check if pageNumber and pageSize are provided in the query parameters
        if (!pageNumber || !pageSize) {
            return res.status(400).json({ error: 'pageNumber and pageSize are required in query parameters' });
        }

        // Parse pageNumber and pageSize as integers
        const pageNumberInt = parseInt(pageNumber);
        const pageSizeInt = parseInt(pageSize);

        // Define the filter columns and data types for the "mea plugs" table
        const meaFilterColumns = ["country", "voltage", "frequency", "plugtype"];
        const meaFilterDataTypes = ["character varying", "text", "text", "text[]"];
        const filterValues = [country, voltage, frequency, plug_type]
        console.log(filterValues);

        // Use the generateQuery function to create the query
        const query = await queries.generateQuery("mea_plugs", meaFilterColumns, meaFilterDataTypes, filterValues, pageNumberInt, pageSizeInt);
        console.log("Query: ", query)

        // Call the function from the model to fetch data with dynamic filtering and pagination
        const mea_plugs = await queries.getListWithFilters(query);

        // Send the fetched data as a response
        res.status(200).json(mea_plugs);
    } catch (error) {
        // Handle any errors
        console.error("Error fetching mea plugs:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
