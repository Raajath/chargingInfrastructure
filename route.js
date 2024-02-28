const {Router} = require('express');
const router = Router();
const {createLocation, createChargePoint,
  createConnector}=require('./controller/createRequest');

router.post('/locations', createLocation);
router.post('/locations/:locationId/chargePoints', createChargePoint);
router.post('/locations/:locationId/chargePoints/:chargingPointId/connectors', createConnector);

module.exports=router;
