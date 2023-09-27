const express = require('express');
const queries = require('../utilities/queries')
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: TR Mapping
 *   description: API endpoints for fetching a list of TR Mapping data
 */

/**
 * @swagger
 * /tr-mapping:
 *   get:
 *     summary: Fetch TR Mapping Data
 *     description: Fetch a list of TR Mapping data with optional filtering and pagination.
 *     tags: [TR Mapping]
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
 *         name: category
 *         description: Filter by category (optional).
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: List of TR Mapping data fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   // Define the properties of each TR Mapping object here
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


// Define the API route for tr_mapping
router.get('/tr-mapping', async (req, res) => {
  try {
    const { pageNumber, pageSize, country, category } = req.query;

    // Check if pageNumber and pageSize are provided in the query parameters
    if (!pageNumber || !pageSize) {
      return res.status(400).json({ error: 'pageNumber and pageSize are required in query parameters' });
    }


    // Parse pageNumber and pageSize as integers
    const pageNumberInt = parseInt(pageNumber);
    const pageSizeInt = parseInt(pageSize);

    // Define the filter columns and data types for the "tr_mapping" table
    const trMappingFilterColumns = ["country", "category"];
    const trMappingFilterDataTypes = ["character varying", "character varying"];
    const filterValues = [country, category];

    // Use the generateQuery function to create the query for "tr_mapping"
    const query = await queries.generateQuery("tr_mapping", trMappingFilterColumns, trMappingFilterDataTypes, filterValues, pageNumberInt, pageSizeInt);

    // Call the function from the model to fetch data with dynamic filtering and pagination
    const trMappingList = await queries.getListWithFilters(query);

    // Send the fetched data as a response
    res.status(200).json(trMappingList);
  } catch (error) {
    // Handle any errors
    console.error("Error fetching tr_mapping list:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;





