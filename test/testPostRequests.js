const {describe, it, beforeEach, before, after} = require('mocha');
const {locationSchema, chargingPointSchema} =require('../infrastructureSchema');
const chai = require('chai');
const expect = chai.expect;
const {MongoMemoryServer} = require('mongodb-memory-server');
const mongoose = require('mongoose');
const request = require('supertest');
const app=require('../index');
const Location = mongoose.model('Location', locationSchema);
const ChargingPoint = mongoose.model('ChargingPoint', chargingPointSchema);


let mongoServer;
before(async ()=>{
  mongoServer = await MongoMemoryServer.create();
  const uri = await mongoServer.getUri();
  await mongoose.connect(uri);
  console.log('connected');
});


after(async ()=>{
  await mongoose.disconnect();
  await mongoServer.stop();
});


function dropDbBeforeEach() {
  beforeEach(async function() {
    await mongoose.connection.db.dropDatabase();
  });
}

describe('Location is properly created', () => {
  dropDbBeforeEach();
  it('should create a new location', async () => {
    const newLocation = {
      address: '123',
      stationName: 'My Charging Station',
      amenities: [12, 'Wifi'],
    };

    const response = await request(app)
        .post('/locations')
        .send(newLocation)
        .expect(201);

    expect(response.body.address).to.deep.equal(newLocation.address);
    expect(response.body.stationName).to.deep.equal(newLocation.stationName);
    expect(response.body.amenities).to.be.an('array');
    expect(response.body.amenities[0]).to.be.a('string');
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


describe('Charging point creation test', async ()=>{
  dropDbBeforeEach();
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

describe('connector creation test', async ()=>{
  dropDbBeforeEach();
  it('should create a new connector', async () => {
    const location = await new Location({address: 'Test1'}).save();
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

describe('Wrong Endpoint', async ()=>{
  it('should give 404 error when it enters wrong endpoint', async ()=>{
    const res=await request(app)
        .post('/')
        .expect(404);
    expect(res.body.error).equals('Not found');
  });
});
