const mongoose= require('mongoose');
const {connectorSchema} =require('../infrastructureSchema');
const Connector = mongoose.model('Connector', connectorSchema);


const getConnectors = async (req, res)=>{
  try {
    const {longitude, latitude, connectorType}=req.body;

    const connectors = await Connector.find({
      coordinates: {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: 100000,
        },
      },
      connectorType: connectorType,
      isAvailableConnector: true,
    });
    res.status(200).send(connectors);
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports={getConnectors};
