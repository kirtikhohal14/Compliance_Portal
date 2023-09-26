// utilities/queries.js
const pool = require('../config/postgres.config');

// Function to generate a dynamic SQL query with filters for any table
async function generateQuery(tableName, filterColumns, filterDataTypes, filterValues, pageNumber, pageSize) {
    try {
        const filterConditions = [];

        // Create filter conditions based on filter columns and data types
        for (let i = 0; i < filterColumns.length; i++) {

            filterConditions.push(`($${i + 1}::${filterDataTypes[i]} IS NULL OR "${filterColumns[i]}" ILIKE $${i + 1}::${filterDataTypes[i]})`);
            //filterValues[i] = `%${filterValues[i]}%`; // Add % wildcards for partial matching

        }


        // Construct the SQL query
        const query = {
            text: `
                SELECT * FROM "${tableName}"
                WHERE
                    ${filterConditions.join(' AND ')}
                LIMIT $${filterColumns.length + 1} OFFSET $${filterColumns.length + 2}
            `,
            values: [...filterValues, pageSize, (pageNumber - 1) * pageSize],
        };

        return query;
    } catch (error) {
        console.error('Error generating query:', error);
        throw error;
    }
}


async function getListWithFilters(query) {
    try {
        const client = await pool.connect();
        const result = await client.query(query);
        const list = result.rows;

        // Release the client back to the pool
        client.release();

        return list;
    } catch (error) {
        console.error('Error in getListWithFilters:', error);
        throw error;
    }
}


module.exports = { generateQuery, getListWithFilters };
