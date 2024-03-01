const {connectorSchema} =require('../infrastructureSchema');
const mongoose= require('mongoose');
const Connector = mongoose.model('Connector', connectorSchema);

const getConnectors = async (req, res)=>{
  try {
    const {longitude, latitude, connectorType}=req.body;

    const gotConnectors = await Connector.find({
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
    res.status(200).send(gotConnectors);
  } catch (err) {
    res.status(400).send(err);
  }
};

module.exports={getConnectors};
