const pool = require('../config/postgres.config');

async function getCertificationListWithFilters(query) {
    try {
        const client = await pool.connect();
        const result = await client.query(query);
        const certificationList = result.rows;

        // Release the client back to the pool
        client.release();

        return certificationList;
    } catch (error) {
        console.error('Error in getCertificationListWithFilters:', error);
        throw error;
    }
}

module.exports = {
    getCertificationListWithFilters,
};
