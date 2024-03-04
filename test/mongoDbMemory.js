const {MongoMemoryServer} = require('mongodb-memory-server');
const mongoose=require('mongoose');
let mongoServer;
async function getUrl() {
  mongoServer = await MongoMemoryServer.create();
  return await mongoServer.getUri();
}

async function stopMongoServer() {
  await mongoServer.stop();
}

async function dropDB() {
  await mongoose.connection.db.dropDatabase();
}


module.exports={getUrl, stopMongoServer, dropDB};
