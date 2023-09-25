const express = require('express');
const queries = require('../utilities/queries')

const router = express.Router();


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
         const regulationFilterColumns = ["Category", "Country", "Doc No.", "Regulation"];
         const regulationFilterDataTypes = ["text", "character varying", "character varying", "text"];
         const filterValues = [category, country, regulation_number, regulation_name]
         // Use the generateQuery function to create the query
         const query = await queries.generateQuery("regulation_list", regulationFilterColumns, regulationFilterDataTypes, filterValues, pageNumberInt, pageSizeInt);


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
