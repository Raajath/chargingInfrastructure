const mongoose = require('mongoose');
const locationSchema = new mongoose.Schema({
  address: String,
  stationName: String,
  amenities: [String],
});

const chargingPointSchema = new mongoose.Schema({
  locationId: {type: mongoose.Schema.Types.ObjectId, ref: 'Location'},
  manufacturer: String,
  isAvailableChargingPoint: Boolean,

});

const connectorSchema = new mongoose.Schema({
  chargingPointId: {type: mongoose.Schema.Types.ObjectId, ref: 'ChargingPoint'},
  locationId: {type: mongoose.Schema.Types.ObjectId, ref: 'Location'},
  connectorType: String,
  wattage: Number,
  manufacturer: String,
  isAvailableConnector: Boolean,
  maxSessionDuration: Number,
  costPerKWh: Number,
});


const Location = mongoose.model('Location', locationSchema);
const ChargingPoint = mongoose.model('ChargingPoint', chargingPointSchema);
const Connector = mongoose.model('Connector', connectorSchema);
module.exports = {Location, ChargingPoint, Connector};
