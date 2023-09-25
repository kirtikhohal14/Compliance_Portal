const express = require('express');
const queries = require('../utilities/queries')
const router = express.Router();

/**
 * @swagger
 * /certification-list:
 *   get:
 *     summary: Retrieve a list of certifications with filtering and pagination
 *     description: |
 *       Retrieve a list of certifications with the option to filter the results based on various parameters and paginate through the records.
 *     tags:
 *       - Certification
 *     parameters:
 *       - name: pageNumber
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *         description: The page number for pagination.
 *       - name: pageSize
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *         description: The number of items per page.
 *       - name: Certification
 *         in: query
 *         schema:
 *           type: string
 *         description: Filter by Certification.
 *       - name: Category
 *         in: query
 *         schema:
 *           type: string
 *         description: Filter by Category.
 *       - name: Status
 *         in: query
 *         schema:
 *           type: string
 *         description: Filter by Status.
 *       - name: BusinessType
 *         in: query
 *         schema:
 *           type: string
 *         description: Filter by Business Type.
 *       - name: Destination
 *         in: query
 *         schema:
 *           type: string
 *         description: Filter by Destination.
 *       - name: ModelNumber
 *         in: query
 *         schema:
 *           type: string
 *         description: Filter by Model Number.
 *       - name: x-access-token
 *         in: header
 *         required: true
 *         schema:
 *           type: string
 *         description: Access token for authentication.
 *     responses:
 *       '200':
 *         description: Successful,i.e, Returns the list of certifications based on the provided filters and pagination parameters.
 *         content:
 *           application/json:
 *             example:
 *               - Certificate#: "12345"
 *                 Category: "Electronics"
 *                 Status: "Approved"
 *                 Bus.Type: "Retail"
 *                 Destination: "USA"
 *                 ModelNo: "ABC123"
 *               # ... more certification records
 *       '400':
 *         description: Bad request(Occurs if `pageNumber` or `pageSize` is missing in the query parameters)
 *         content:
 *           application/json:
 *             example:
 *               error: "pageNumber and pageSize are required in query parameters"
 *       '500':
 *         description: Internal server error(Occurs if there's an issue with the server)
 *       '404':
 *         description: Not Found(Occurs if no certifications match the provided filters)
 */


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
        // const query = {
        //     text: `
        //         SELECT * FROM "certification_list"
        //         WHERE
        //             ($1::text IS NULL OR "Certificate#" = $1::text)
        //             AND ($2::character varying IS NULL OR "Category" = $2::character varying)
        //             AND ($3::character varying IS NULL OR "Status" = $3::character varying)
        //             AND ($4::character varying IS NULL OR "Bus.Type" = $4::character varying)
        //             AND ($5::character varying IS NULL OR "Destination" = $5::character varying)
        //             AND ($6::character varying IS NULL OR "ModelNo" = $6::character varying)
        //         LIMIT $7 OFFSET $8
        //     `,
        //     values: [Certification, Category, Status, BusinessType, Destination, ModelNumber, pageSizeInt, (pageNumberInt - 1) * pageSizeInt],
        // };


        // Define the filter columns and data types for the "certification_list" table
        const certificationFilterColumns = ["Certificate#", "Category", "Status", "Bus.Type", "Destination", "ModelNo"];
        const certificationFilterDataTypes = ["text", "character varying", "character varying", "character varying", "character varying", "character varying"];
        const filterValues = [Certification, Category, Status, BusinessType, Destination, ModelNumber]
        // Use the generateQuery function to create the query
        const query = await queries.generateQuery("certification_list", certificationFilterColumns, certificationFilterDataTypes, filterValues, pageNumberInt, pageSizeInt);


        // Call the function from the model to fetch data with dynamic filtering and pagination
        const certificationList = await queries.getListWithFilters(query);

        // Send the fetched data as a response
        res.status(200).json(certificationList);
    } catch (error) {
        // Handle any errors
        console.error("Error fetching certification list:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
