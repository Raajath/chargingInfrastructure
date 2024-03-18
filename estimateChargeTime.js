const axios =require('axios');
const {Connector} = require('./infrastructureSchema');

let estimateServerURL;

function setEstimateUrl(url) {
  estimateServerURL=url;
}

const connectorDataWithId= async (req, res)=>{
  try {
    const {soc, batteryCapacity}=req.body;
    const connectorId=req.params.connectorId;
    const connectorData= await Connector.findOne({_id: connectorId});

    const estimationData={
      soc: soc,
      batteryCapacity: batteryCapacity,
      connectorPowerKWH: connectorData.connectorPowerKWH,
    };
    let estimationResponse;
    try {
      estimationResponse = await axios.post(estimateServerURL, estimationData);
      const responseData = {
        connectorType: connectorData.connectorType,
        available: connectorData.isAvailableConnector,
        manufacturer: connectorData.manufacturer,
        costPerKWh: connectorData.costPerKWh,
        estimateChargingTimeHours: estimationResponse.data.expectedTimeHours,
      };
      res.status(200).send(responseData);
    } catch {
      res.status(500).send({error: 'Estimation server error'});
    }
  } catch (error) {
    res.status(400).send({error: 'invalid connectorId or bad request'});
  }
};

module.exports={connectorDataWithId, setEstimateUrl};
