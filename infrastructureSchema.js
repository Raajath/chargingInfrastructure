const mongoose = require('mongoose');

const connectorSchema = new mongoose.Schema({
  type: String,
  wattage: Number,
  manufacturer: String,
});

const chargePointSchema = new mongoose.Schema({
  connectors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Connector',
  }],
});

const locationSchema = new mongoose.Schema({
  locationName: String,
  chargingStationName: String,
  chargePoints: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChargePoint',
  }],
});

const Connector = mongoose.model('Connector', connectorSchema);
const ChargePoint = mongoose.model('ChargePoint', chargePointSchema);
const Location = mongoose.model('Location', locationSchema);

module.exports = { Connector, ChargePoint, Location };
