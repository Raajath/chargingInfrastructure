const { Connector, ChargePoint, Location } = require('./infrastructureSchema');

async function createConnectors(connectorsData){

    return await Connector.insertMany(connectorsData);
}

async function createChargePoints(connectors){

   const chargePointConnectorArray={
        connectors:connectors.map((connector)=>{
         return connector._id;
        })
};
   return await ChargePoint.create(chargePointConnectorArray);
}

async function createLocation(chargePoints,locationName,chargeStationName){
    
    const locationData={
        locationName : locationName,
        chargingStationName:chargeStationName,
        chargePoints: chargePoints.map((chargePoint)=>{
            return chargePoint._id;
        })
    };
    return await Location.create(locationData);

}
module.exports={createChargePoints,createConnectors,createLocation};