const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const app=require('../index');
const mongoose = require('mongoose');
const {describe, it, beforeEach} = require('mocha');
const {locationSchema, chargingPointSchema} =require('../infrastructureSchema');
const Location = mongoose.model('Location', locationSchema);
const ChargingPoint = mongoose.model('ChargingPoint', chargingPointSchema);
const {dropDB}=require('./mongoDbMemory');

describe('POST request location', () => {
  beforeEach(async function() {
    await dropDB();
  });
  it('should create a new location', async () => {
    const newLocation = {
      address: '123',
      stationName: 'My Charging Station',
      amenities: [12, 'Wifi'],
      coordinates: [-74.0060, 40.7128],
    };

    const response = await request(app)
        .post('/locations')
        .send(newLocation)
        .expect(201);

    expect(response.body.address).to.deep.equal(newLocation.address);
    expect(response.body.stationName).to.deep.equal(newLocation.stationName);
    expect(response.body.amenities).to.be.an('array');
    expect(response.body.amenities[0]).to.be.a('string');
    expect(response.body.coordinates).to.be.an('array').with.lengthOf(2);
    expect(response.body.coordinates[0]).to.be.a('number');
    expect(response.body.coordinates[1]).to.be.a('number');
  });

  it('should return a 400 error for creating a location with missing address fields', async () => {
    const invalidLocation = {
      stationName: 'My Charging Station',
      amenities: ['Restroom', 'Wifi'],
    };

    const response = await request(app)
        .post('/locations')
        .send(invalidLocation)
        .expect(400);
    expect(response.body.errors).to.exist;
  });
});


describe('POST request charging Point', ()=>{
  beforeEach(async function() {
    await dropDB();
  });
  it('should create a new charging point with a valid location ID', async () => {
    const location = await new Location({address: 'Test1'}).save();
    const chargePointData = {
      manufacturer: 'abb',
      isAvailableChargingPoint: true,
    };
    const response = await request(app)
        .post(`/locations/${location._id}/chargePoints`)
        .send(chargePointData)
        .expect(201);

    expect(response.body.manufacturer).to.deep.equal(chargePointData.manufacturer);
    expect(response.body.isAvailableChargingPoint).to.deep
        .equal(chargePointData.isAvailableChargingPoint);
    expect(response.body.locationId).to.equal(location._id.toString());
  });

  it('should return an 400 for creating a chargingPoint with invalid Id', async () => {
    const newChargePoint = {
      manufacturer: 'abbTest',
      isAvailableChargingPoint: true,
    };
    const invalidId=['65de084c2682eb4883cc8e25', 12345];
    for (let i=0; i<invalidId.length; i++) {
      await request(app)
          .post(`/locations/${invalidId[i]}/chargePoints`)
          .send(newChargePoint)
          .expect(400);
    }
  });
});

describe('POST request connector ', ()=>{
  beforeEach(async function() {
    await dropDB();
  });

  it('should create a new connector', async () => {
    const location = await new Location({address: 'Test1', coordinates: [70, 40]}).save();
    const chargingPoint=await new ChargingPoint({manufacturer: 'abb'}).save();
    const connectorData = {
      connectorType: 'DC',
      wattage: 7,
      manufacturer: 'abb',
      isAvailableConnector: true,
      maxSessionDuration: 2,
      costPerKWh: 2,

    };

    const response = await request(app)
        .post(`/locations/${location._id}/chargePoints/${chargingPoint._id}/connectors`)
        .send(connectorData)
        .expect(201);

    const find= await Location.find({_id: response.body.locationId});
    expect(find[0].address).to.equal(location.address);// show we can use find with inputid string

    expect(response.body.locationId).to.equal(location._id.toString());
    expect(response.body.chargingPointId).to.equal(chargingPoint._id.toString());
    expect(response.body.connectorType).to.deep.equal(connectorData.connectorType);
    expect(response.body.wattage).to.deep.equal(connectorData.wattage);
    expect(response.body.manufacturer).to.deep.equal(connectorData.manufacturer);
    expect(response.body.isAvailableConnector).to.deep.equal(connectorData.isAvailableConnector);
    expect(response.body.maxSessionDuration).to.deep.equal(connectorData.maxSessionDuration);
    expect(response.body.costPerKWh).to.deep.equal(connectorData.costPerKWh);
    expect(response.body.coordinates).to.deep.equal(location.coordinates);
  });
  it('should return an 400 for creating a connector with invalid Id', async () => {
    const connectorData = {
      connectorType: 'Ac',
      wattage: 11,
      manufacturer: 'abb',
      isAvailableConnector: false,
      maxSessionDuration: 3,
      costPerKWh: 4,
    };
    const invalidIdLocation=['65de084c2682eb4883cc8e25', 12345];
    const invalidIdCP=['4365634', 12345];

    for (let i=0; i<invalidIdCP.length; i++) {
      await request(app)
          .post(`/locations/${invalidIdLocation[i]}/chargePoints/${invalidIdCP[i]}/connectors`)
          .send(connectorData)
          .expect(400);
    }
  });
});


