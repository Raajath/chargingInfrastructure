const mongoose= require('mongoose');
const axios =require('axios');
const {connectorSchema} =require('./infrastructureSchema');

const Connector = mongoose.model('Connector', connectorSchema);


const connectorDataWithId= async (req, res)=>{
  try {
    const {soc, batteryCapacity}=req.body;
    const connectorId=req.params.connectorId;
    const connectorData= await Connector.findOne({_id: connectorId});

    const estimationData={
      soc: soc,
      batteryCapacity: batteryCapacity,
      connectorPower: connectorData.connectorPower,
    };
    const estimationResponse = await axios.post('http://localhost:8080/estimate', estimationData);
    const responseData = {
      connectorType: connectorData.connectorType,
      available: connectorData.isAvailableConnector,
      manufacturer: connectorData.manufacturer,
      costPerKWh: connectorData.costPerKWh,
      estimateChargingTime: estimationResponse.data.expectedTime,
    };
    res.status(201).send(responseData);
  } catch (error) {
    res.status(400).send({error: 'invalid connectorId'});
  }
};

module.exports={connectorDataWithId};
