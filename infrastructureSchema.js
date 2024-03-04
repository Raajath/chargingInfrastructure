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

// convert locationId chargingId to string and pass as input
module.exports={locationSchema, chargingPointSchema, connectorSchema};

