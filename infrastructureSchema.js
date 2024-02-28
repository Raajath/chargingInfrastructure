const mongoose = require('mongoose');
const locationSchema = new mongoose.Schema({
  address: {type: String,
    required: true},
  stationName: String,
  amenities: [String],
});

const chargingPointSchema = new mongoose.Schema({
  locationId: String, // passed as string as while testing it allows as string
  manufacturer: String,
  isAvailableChargingPoint: Boolean,

});

const connectorSchema = new mongoose.Schema({
  chargingPointId: String,
  locationId: String, // if location and chargingPoint Exists in DB is tested in createRequest
  connectorType: String,
  wattage: Number,
  manufacturer: String,
  isAvailableConnector: Boolean,
  maxSessionDuration: Number,
  costPerKWh: Number,
});

// convert locationId chargingId to string and pass as input
module.exports={locationSchema, chargingPointSchema, connectorSchema};

