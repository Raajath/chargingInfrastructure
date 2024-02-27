const {Location, ChargingPoint, Connector}=require('../infrastructureSchema');


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
    const chargingPoint = new ChargingPoint(req.body);
    await chargingPoint.save();
    res.status(201).send(chargingPoint);
  } catch (error) {
    res.status(400).send(error);
  }
};

const createConnector= async (req, res) => {
  try {
    const connector = new Connector(req.body);
    await connector.save();
    res.status(201).send(connector);
  } catch (error) {
    res.status(400).send(error);
  }
};
const getChargingPointsByLocationId = async (req, res) =>{
  try {
    const id=req.params.locationId;
    const chargingPoints=await ChargingPoint.find({locationId: id});
    res.status(200).send(chargingPoints);
  } catch (e) {
    res.status(400).send(e);
  }
};
module.exports={createLocation, createChargePoint, createConnector, getChargingPointsByLocationId};
