const {describe, it, beforeEach, before, after} = require('mocha');
const chai = require('chai');
const expect = chai.expect;
const {MongoMemoryServer} = require('mongodb-memory-server');
const mongoose = require('mongoose');
const request = require('supertest');
const app=require('../index');
// const {Location, ChargingPoint, Connector} =require('../infrastructureSchema');

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

describe('Location is properly created', () => {
  beforeEach(async function() {
    await mongoose.connection.db.dropDatabase();
  });

  it('should create a new location', async () => {
    const newLocation = {
      address: '123 Main St',
      stationName: 'My Charging Station',
      amenities: ['Restroom', 'Wifi'],
    };

    const response = await request(app)
        .post('/locations')
        .send(newLocation)
        .expect(201);

    expect(response.body).toHaveProperty('_id');
    expect(response.body).toHaveProperty('address');
    expect(response.body).toHaveProperty('station');
    expect(response.body).toHaveProperty('amenities');
    expect(response.body.address).toEqual(newLocation.address);
    expect(response.body.stationName).toEqual(newLocation.stationName);
    expect(response.body.amenities).toEqual(newLocation.amenities);
  });

  it('should return a 400 error for creating a location with missing required fields', async () => {
    // Missing required field: address
    const invalidLocation = {
      addresses: '123 Main St',
      StationName: 'My Charging Station',
      Amenities: ['Restroom', 'Wifi'],
    };

    const response = await request(app)
        .post('/locations')
        .send(invalidLocation)
        .expect(400);
    expect(response.body).toHaveProperty('error');
  });
});
