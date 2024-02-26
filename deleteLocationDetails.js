const { Connector, ChargePoint, Location } = require('./infrastructureSchema');

async function deleteByName(locationName) {
    try {
        const location = await Location.findOne({ locationName }).populate('chargePoints');

        if (!location) {
            console.log('Location not found');
            return;
        }

        const connectorIds = location.chargePoints.flatMap(cp => cp.connectors);

        await Connector.deleteMany({ _id: { $in: connectorIds } });
        await ChargePoint.deleteMany({ _id: { $in: location.chargePoints } });
        await location.deleteOne({locationName:locationName});

        console.log('Location charging points and connectors deleted.');
    } catch (error) {
        console.error('Error:', error);
    }
}


module.exports={deleteByName};