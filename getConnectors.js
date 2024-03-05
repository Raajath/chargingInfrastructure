const {Connector} =require('./infrastructureSchema');

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
    }).populate({path: 'locationId', select: 'stationName amenities address'})
        .populate({path: 'chargingPointId', select: 'manufacturer'});
    res.status(200).send(gotConnectors);
  } catch {
    res.status(400).send({error: 'invalid request'});
  }
};

module.exports={getConnectors};
