const mongoose = require('mongoose');
const locationSchema = new mongoose.Schema({
  address: {type: String,
    required: true},
  stationName: String,
  amenities: [String],
  coordinates: {
    type: [Number],
  },
});

const chargingPointSchema = new mongoose.Schema({
  locationId: String,
  manufacturer: String,
  isAvailableChargingPoint: Boolean,

});

const connectorSchema = new mongoose.Schema({
  chargingPointId: {type: String, ref: 'ChargingPoint'},
  locationId: {type: String, ref: 'Location'},
  connectorType: String,
  connectorPower: Number,
  wattage: Number,
  manufacturer: String,
  isAvailableConnector: Boolean,
  maxSessionDuration: Number,
  costPerKWh: Number,
  coordinates: {
    type: [Number],
    index: '2dsphere',
  },
});
const ChargingPoint=mongoose.model('ChargingPoint', chargingPointSchema);
const Location=mongoose.model('Location', locationSchema);
const Connector=mongoose.model('Connector', connectorSchema);
module.exports={Connector, Location, ChargingPoint};

