const {describe, it, afterEach, before, after} = require('mocha');
const {connectorSchema, locationSchema, chargingPointSchema} =require('../infrastructureSchema');
const chai = require('chai');
const expect = chai.expect;
const mongoose = require('mongoose');
const request = require('supertest');
const app=require('../index');
const Connector = mongoose.model('Connector', connectorSchema);
const Location = mongoose.model('Location', locationSchema);
const ChargingPoint = mongoose.model('ChargingPoint', chargingPointSchema);
const {getUrl, stopMongoServer, dropDB}=require('./mongoDbMemory');


before(async ()=>{
  const uri= await getUrl();
  await mongoose.connect(uri);
  console.log('connected');
});


after(async ()=>{
  await mongoose.disconnect();
  await stopMongoServer();
});


describe('GET request connectors  ', ()=>{
  afterEach(async function() {
    await dropDB();
  });
  it('should return connectors  of specified coordinates and of the specified type', async () => {
    const location = await Location.create({
      stationName: 'st1',
      amenities: ['wifi'],
      address: 'mangalore',
    });
    const chargePoint = await ChargingPoint.create({
      manufacturer: 'abb',
    });

    const sampleConnectors = [
      {
        locationId: location._id,
        chargingPointId: chargePoint._id,
        coordinates: [0, 0],
        connectorType: 'TypeA',
        isAvailableConnector: false,
      },
      {
        locationId: location._id,
        chargingPointId: chargePoint._id,
        coordinates: [0.01, 0.01],
        connectorType: 'TypeA',
        isAvailableConnector: true,
      },
    ];

    await Connector.create(sampleConnectors);

    const longitude = 0;
    const latitude = 0;
    const connectorType = 'TypeA';

    const res = await request(app)
        .get('/connectors/getConnectors')
        .send({longitude, latitude, connectorType})
        .expect(200);

    expect(res.body).to.be.an('array');
    expect(res.body).to.have.lengthOf(1);
    expect(res.body[0].connectorType).to.equal('TypeA');
    expect(res.body[0].chargingPointId.manufacturer).to.equal(chargePoint.manufacturer);
    expect(res.body[0].locationId.amenities).to.deep.equal(location.amenities);
  });

  it('should return 400 when data is empty', async () => {
    const sampleConnectors = [
      {
        coordinates: [0.1, 0],
        connectorType: 'TypeB',
        isAvailableConnector: false,
      },

    ];

    await Connector.create(sampleConnectors);

    const longitude = null;
    const latitude = null;
    const connectorType = null;
    await request(app)
        .get('/connectors/getConnectors')
        .send({longitude, latitude, connectorType})
        .expect(400);
  });
});


