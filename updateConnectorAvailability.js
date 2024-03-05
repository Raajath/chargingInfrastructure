const {Connector} =require('./infrastructureSchema');
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
  } catch {
    res.status(400).send({error: 'invalid ConnectorID'});
  }
};

module.exports={updateWhenConnectedOrRemoved};
