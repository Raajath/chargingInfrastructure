const {Router} = require('express');
const router = Router();
const {createLocation, createChargePoint,
  createConnector, getChargingPointsByLocationId}=require('./controller/createRequest');

router.post('/locations', createLocation);
router.post('/chargePoints', createChargePoint);
router.post('/connectors', createConnector);
router.get('/locations/:locationId/chargePoints', getChargingPointsByLocationId);

module.exports=router;
