const {Connector, ChargePoint, Location} = require('./infrastructureSchema');

async function createConnectors(connectorsData) {
  return await Connector.insertMany(connectorsData);
}

async function createChargePoints(connectors) {
  const chargePointConnectorArray={
    connectors: connectors.map((connector)=>{
      return connector._id;
    }),
  };
  return await ChargePoint.create(chargePointConnectorArray);
}

async function createLocation(chargePoints, locationName, chargeStationName) {
  const locationData={
    locationName: locationName,
    chargingStationName: chargeStationName,
    chargePoints: chargePoints.map((chargePoint)=>{
      return chargePoint._id;
    }),
  };
  return await Location.create(locationData);
}


async function insertAll( locationName, chargeStationName, dataInput) {
  try {
    const chargePointsArray = [];

    for (const chargePoint of dataInput) {
      const connectorsData=chargePoint.map((connector)=>{
        return connector;
      });
      const connectorsArray = await createConnectors(connectorsData);
      const createdChargePoint = await createChargePoints(connectorsArray);
      chargePointsArray.push(createdChargePoint);
    }
    const location =await createLocation(chargePointsArray, locationName, chargeStationName);
    return location;
  } catch (error) {
    console.error('Error creating location with charge points and connectors:', error);
    throw error;
  }
}
module.exports={insertAll};
