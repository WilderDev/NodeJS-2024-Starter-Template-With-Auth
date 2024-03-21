// * IMPORTS
const mongoose = require('mongoose');

// * METHODS
function connectToMongo(dbConnectionString) {
  try {
    const dbConnection = mongoose.connect(dbConnectionString);

    const MONGO_DB_NAME = dbConnectionString
      .split('mongodb.net/')[1]
      .split('?')[0];

    console.log(`Connected to the Mongo Database Named: "${MONGO_DB_NAME}"`);

    return dbConnection;
  } catch (err) {
    console.log('ERROR CONNECTING TO DB:', err);
  }
}

// * EXPORTS
module.exports = connectToMongo;
