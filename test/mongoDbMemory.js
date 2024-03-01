const {MongoMemoryServer} = require('mongodb-memory-server');
let mongoServer;
async function getUrl() {
  mongoServer = await MongoMemoryServer.create();
  return await mongoServer.getUri();
}

async function stopMongoServer() {
  await mongoServer.stop();
}

module.exports={getUrl, stopMongoServer};
