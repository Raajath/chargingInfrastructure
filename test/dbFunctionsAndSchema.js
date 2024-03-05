const {MongoMemoryServer} = require('mongodb-memory-server');
const mongoose=require('mongoose');
const {Location, Connector, ChargingPoint} =require('../infrastructureSchema');

let mongoServer;
async function getUrl() {
  mongoServer = await MongoMemoryServer.create();
  return await mongoServer.getUri();
}


async function dropDB() {
  await mongoose.connection.db.dropDatabase();
}

async function connectDB() {
  const uri= await getUrl();
  await mongoose.connect(uri);
}

async function closeConnectionDB() {
  await mongoose.disconnect();
}


module.exports={dropDB, Location, Connector, ChargingPoint,
  connectDB, closeConnectionDB};
