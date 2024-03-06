const {Router} = require('express');
const router = Router();
const {createLocation, createChargePoint, createConnector}=require('./createRequest');
const {getConnectors}=require('./getConnectors');
const {updateWhenConnectedOrRemoved}=require('./updateConnectorAvailability');
const {connectorDataWithId}=require('./estimateChargeTime');

router.post('/locations', createLocation);
router.post('/locations/:locationId/chargePoints', createChargePoint);
router.post('/locations/:locationId/chargePoints/:chargingPointId/connectors', createConnector);
router.get('/connectors', getConnectors);
router.patch('/connectors/:connectorId/connectorAvailability', updateWhenConnectedOrRemoved);
router.get('/connectors/:connectorId', connectorDataWithId);

module.exports=router;
