const mongoose = require('mongoose');
const locationSchema = new mongoose.Schema({
  address: {type: String,
    required: true},
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


module.exports={locationSchema, chargingPointSchema, connectorSchema};

