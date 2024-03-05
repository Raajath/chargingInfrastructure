const request = require('supertest');
const app=require('../index');
const chai = require('chai');
const expect = chai.expect;

const {describe, it, afterEach, before, after} = require('mocha');
const {dropDB, connectDB, closeConnectionDB,
  Location, Connector, ChargingPoint}=require('./dbFunctionsAndSchema');


before(async ()=>{
  connectDB();
});


after(async ()=>{
  closeConnectionDB();
});


describe('GET nearby connectors  ', ()=>{
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

    const nearbyConnectors = await request(app)
        .get('/connectors')
        .send({longitude, latitude, connectorType})
        .expect(200);

    expect(nearbyConnectors.body).to.be.an('array');
    expect(nearbyConnectors.body).to.have.lengthOf(1);
    expect(nearbyConnectors.body[0].connectorType).to.equal('TypeA');
    expect(nearbyConnectors.body[0].chargingPointId.manufacturer)
        .to.equal(chargePoint.manufacturer);
    expect(nearbyConnectors.body[0].locationId.amenities).to.deep.equal(location.amenities);
  });

  it('should return 400 when data is empty or invalid type', async () => {
    const sampleConnectors = [
      {
        coordinates: [0.1, 0],
        connectorType: 'TypeB',
        isAvailableConnector: false,
      },

    ];
    await Connector.create(sampleConnectors);
    const longitude = 'wrong';
    const latitude = null;
    const connectorType = null;


    const invalidResult= await request(app)
        .get('/connectors')
        .send({longitude, latitude, connectorType})
        .expect(400);
    expect(invalidResult.body.error).to.equals('invalid request');
  });
});


