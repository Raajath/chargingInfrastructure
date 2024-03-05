const mongoose=require('mongoose');
const {chargingPointSchema, locationSchema, connectorSchema} =require('./infrastructureSchema');
const ChargingPoint=mongoose.model('ChargingPoint', chargingPointSchema);
const Location=mongoose.model('Location', locationSchema);
const Connector=mongoose.model('Connector', connectorSchema);


async function checkIfIdExists(Model, id) {
  const documentExists= await Model.findOne({_id: id});
  if (!documentExists) {
    throw new Error();
  }
}


const createLocation=async (req, res) => {
  try {
    const location = new Location(req.body);
    await location.save();
    res.status(201).send(location);
  } catch (error) {
    res.status(400).send(error);
  }
};

const createChargePoint = async (req, res) => {
  try {
    const locationId=req.params.locationId;
    const chargePointData=req.body;

    await checkIfIdExists(Location, locationId);


    const chargingPoint = new ChargingPoint(
        {
          locationId: locationId,
          manufacturer: chargePointData.manufacturer,
          isAvailableChargingPoint: chargePointData.isAvailableChargingPoint,
        },
    );
    await chargingPoint.save();
    res.status(201).send(chargingPoint);
  } catch {
    res.status(400).send({error: 'invalid id chargePoint insertion'});
  }
};

const createConnector= async (req, res) => {
  try {
    const connectorData=req.body;
    const locationId = req.params.locationId;
    const chargingPointId = req.params.chargingPointId;
    await checkIfIdExists(Location, locationId);
    await checkIfIdExists(ChargingPoint, chargingPointId);
    const location=await Location.findOne({_id: locationId});

    const connector = new Connector(
        {
          chargingPointId: chargingPointId,
          locationId: locationId,
          connectorType: connectorData.connectorType,
          wattage: connectorData.wattage,
          manufacturer: connectorData.manufacturer,
          isAvailableConnector: connectorData.isAvailableConnector,
          maxSessionDuration: connectorData.maxSessionDuration,
          costPerKWh: connectorData.costPerKWh,
          coordinates: location.coordinates,
          connectorPower: connectorData.connectorPower,
          // automatically assign coordinates from location while inserting
        },
    );
    await connector.save();
    res.status(201).send(connector);
  } catch {
    res.status(400).send({error: 'invalid id connector insertion'});
  }
};

module.exports={createLocation, createChargePoint, createConnector};
