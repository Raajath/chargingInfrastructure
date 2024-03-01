const {Router} = require('express');
const router = Router();
const {createLocation, createChargePoint, createConnector}=require('./controller/createRequest');
const {getConnectors}=require('./controller/getConnectors');
const {updateWhenConnectedOrRemoved}=require('./controller/updateConnectorAvailability');

router.post('/locations', createLocation);
router.post('/locations/:locationId/chargePoints', createChargePoint);
router.post('/locations/:locationId/chargePoints/:chargingPointId/connectors', createConnector);

router.get('/connectors/getConnectors', getConnectors);
router.patch('/connectors/:connectorId/connectorAvailability', updateWhenConnectedOrRemoved);


module.exports=router;
