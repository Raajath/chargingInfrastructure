const chai = require('chai');
const request = require('supertest');
const expect = chai.expect;
const {describe, it, afterEach, after} = require('mocha');
const {dropDB, closeConnectionDB, setPortAndConnect,
  Location, Connector, ChargingPoint}=require('./dbFunctionsAndSchema');
const {app}=require('../index');

before(async ()=>{
  setPortAndConnect();
});
after(async ()=>{
  closeConnectionDB();
});


async function makeGetRequestAndCheckStatus(URL, data, status) {
  const result=await request(app)
      .get(URL)
      .send(data)
      .expect(status);
  return result;
}

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

    const URL='/connectors';
    const nearbyConnectors =await makeGetRequestAndCheckStatus(URL,
        {longitude, latitude, connectorType}, 200);
    expect(nearbyConnectors.body).to.be.an('array');
    expect(nearbyConnectors.body).to.have.lengthOf(1);
    expect(nearbyConnectors.body[0].connectorType).to.equal('TypeA');
    expect(nearbyConnectors.body[0].chargingPointId.manufacturer)
        .to.equal(chargePoint.manufacturer);
    expect(nearbyConnectors.body[0].locationId.amenities).to.deep.equal(location.amenities);
  });

  it('should return 400 when client data is empty or invalid type', async () => {
    const wrongLatitude = 'wrong';
    const nullLongitude = null;
    const nullConnectorType = null;

    const url='/connectors';
    const invalidResult= await makeGetRequestAndCheckStatus(url,
        {nullLongitude, wrongLatitude, nullConnectorType}, 400);
    expect(invalidResult.body.error).to.equals('invalid request');
  });
});


