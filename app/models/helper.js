const clientRedis = require('../config/redis.config')

// Function to store the QR code in Redis cache
const storeInRedisCache = (key, value, tll) => {
    return new Promise(async (resolve, reject) => {
        try {
            await clientRedis.set(key, value, { EX: tll });

            resolve('Data stored in Redis cache successfully!');
        } catch (error) {
            reject('Error storing data in Redis cache: ' + error);
        }
    })
};


const getValueFromCache = (key) => {
    return new Promise(async (resolve, reject) => {
        try {

            clientRedis.on("error", (err) => {
                console.error(err);
                reject(err);
            })

            const value = await clientRedis.get(key);
            resolve(value);
        }
        catch (err) {
            reject(err)
        }


    })
}

module.exports = { getValueFromCache, storeInRedisCache }