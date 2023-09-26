const express = require('express');
const queries = require('../utilities/queries')

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Regulation List
 *   description: API endpoints for fetching a list of regulations
 */

/**
 * @swagger
 * /regulation-list:
 *   get:
 *     summary: Fetch a list of regulations
 *     description: Fetch a list of regulations with optional filtering and pagination.
 *     tags: [Regulation List]
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
 *         name: category
 *         description: Filter by category (optional).
 *         schema:
 *           type: string
 *       - in: query
 *         name: country
 *         description: Filter by country (optional).
 *         schema:
 *           type: string
 *       - in: query
 *         name: regulation_number
 *         description: Filter by regulation number (optional).
 *         schema:
 *           type: string
 *       - in: query
 *         name: regulation_name
 *         description: Filter by regulation name (optional).
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: List of regulations fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   // Define the properties of each regulation object here
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
router.get('/regulation-list', async (req, res) => {
    try {
        const { pageNumber, pageSize, category, country, regulation_number, regulation_name } = req.query;
        // Check if pageNumber and pageSize are provided in the query parameters
        if (!pageNumber || !pageSize) {
            return res.status(400).json({ error: 'pageNumber and pageSize are required in query parameters' });
        }

        // Parse pageNumber and pageSize as integers
        const pageNumberInt = parseInt(pageNumber);
        const pageSizeInt = parseInt(pageSize);

        // Define the filter columns and data types for the "regulation_list" table
        const regulationFilterColumns = ["category", "country", "doc_no.", "regulation"];
        const regulationFilterDataTypes = ["text", "character varying", "character varying", "text"];
        const filterValues = [category, country, regulation_number, regulation_name]
        console.log(filterValues);

        // Use the generateQuery function to create the query
        const query = await queries.generateQuery("regulation_list", regulationFilterColumns, regulationFilterDataTypes, filterValues, pageNumberInt, pageSizeInt);
        console.log("Query: ", query)

        // Call the function from the model to fetch data with dynamic filtering and pagination
        const regulationList = await queries.getListWithFilters(query);

        // Send the fetched data as a response
        res.status(200).json(regulationList);
    } catch (error) {
        // Handle any errors
        console.error("Error fetching regulation list:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
