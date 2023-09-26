const express = require('express');
const queries = require('../utilities/queries')

const router = express.Router();


// Define the API endpoint
router.get('/mea_plugs', async (req, res) => {
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
        const meaFilterColumns = ["country", "voltage", "frequency", "plug_type"];
        const meaFilterDataTypes = ["character varying", "text", "text", "text"];
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
