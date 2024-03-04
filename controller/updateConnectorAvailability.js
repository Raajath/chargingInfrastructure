const mongoose= require('mongoose');

const {connectorSchema} =require('../infrastructureSchema');
const Connector = mongoose.model('Connector', connectorSchema);
const updateWhenConnectedOrRemoved = async (req, res)=>{
  try {
    const {connected} = req.body;
    const connectorId=req.params.connectorId;
    const result = await Connector
        .updateOne(
            {_id: connectorId},
            {$set: {isAvailableConnector: connected}},
        );
    res.status(200).send(result);
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports={updateWhenConnectedOrRemoved};
