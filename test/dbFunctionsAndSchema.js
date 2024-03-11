const mongoose=require('mongoose');
const {Location, Connector, ChargingPoint} =require('../infrastructureSchema');
const {MongoMemoryServer} = require('mongodb-memory-server');
const {configurations} = require('../index');

let mongoServer;
async function setUrl() {
  mongoServer = await MongoMemoryServer.create();
  return await mongoServer.getUri();
}

async function setPortAndConnect() {
  const url=await setUrl();
  configurations.setConfigurations(8080, url);
}


async function dropDB() {
  await mongoose.connection.db.dropDatabase();
}

async function closeConnectionDB() {
  await mongoose.disconnect();
}


module.exports={dropDB, Location, Connector, ChargingPoint, closeConnectionDB, setPortAndConnect};
