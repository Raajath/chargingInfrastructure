const mongoose=require('mongoose');
const {chargingPointSchema, locationSchema, connectorSchema} =require('../infrastructureSchema');
const Location = mongoose.model('Location', locationSchema);

const Connector = mongoose.model('Connector', connectorSchema);

const ChargingPoint = mongoose.model('ChargingPoint', chargingPointSchema);


async function checkIfIdExists(Model, id, errorMessage) {
  const documentExists = await Model.findOne({_id: id});
  if (!documentExists) {
    throw new Error(errorMessage);
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

    await checkIfIdExists(Location, locationId, 'locationId does not exist ');


    const chargingPoint = new ChargingPoint(
        {
          locationId: locationId,
          manufacturer: chargePointData.manufacturer,
          isAvailableChargingPoint: chargePointData.isAvailableChargingPoint,
        },
    );
    await chargingPoint.save();
    res.status(201).send(chargingPoint);
  } catch (error) {
    res.status(400).send(error);
  }
};

const createConnector= async (req, res) => {
  try {
    const connectorData=req.body;
    const locationId = req.params.locationId;
    const chargingPointId = req.params.chargingPointId;
    await checkIfIdExists(Location, locationId, 'locationId does not exist ');
    await checkIfIdExists(ChargingPoint, chargingPointId, 'chargingPointId does not exist');
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
          // automatically assign coordinates from location while inserting
        },
    );
    await connector.save();
    res.status(201).send(connector);
  } catch (insertError) {
    res.status(400).send(insertError);
  }
};

module.exports={createLocation, createChargePoint, createConnector};
