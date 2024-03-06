const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const app=require('../index');
const {dropDB, Location, ChargingPoint}=require('./dbFunctionsAndSchema');


async function makePostRequestAndCheckStatus(URL, data, status) {
  const result=await request(app)
      .post(URL)
      .send(data)
      .expect(status);
  return result;
}

const {describe, it, beforeEach} = require('mocha');
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
    const URL='/locations';
    const locationResponse = await makePostRequestAndCheckStatus(URL, newLocation, 201);
    expect(locationResponse.body.address).to.deep.equal(newLocation.address);
    expect(locationResponse.body.stationName).to.deep.equal(newLocation.stationName);
    expect(locationResponse.body.amenities).to.be.an('array');
    expect(locationResponse.body.amenities[0]).to.be.a('string');
    expect(locationResponse.body.coordinates).to.be.an('array').with.lengthOf(2);
    expect(locationResponse.body.coordinates[0]).to.be.a('number');
    expect(locationResponse.body.coordinates[1]).to.be.a('number');
  });

  it('should return a 400 error for creating a location with missing address fields', async () => {
    const invalidLocation = {
      stationName: 'My Charging Station',
      amenities: ['Restroom', 'Wifi'],
    };
    const url='/locations';
    const invalidResponse = await makePostRequestAndCheckStatus(url, invalidLocation, 400);
    expect(invalidResponse.body.errors).to.exist;
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
    const URL=`/locations/${location._id}/chargePoints`;
    const CPointResponse = await makePostRequestAndCheckStatus(URL, chargePointData, 201);
    expect(CPointResponse.body.manufacturer).to.deep.equal(chargePointData.manufacturer);
    expect(CPointResponse.body.isAvailableChargingPoint).to.deep
        .equal(chargePointData.isAvailableChargingPoint);
    expect(CPointResponse.body.locationId).to.equal(location._id.toString());
  });

  it('should return an 400 for creating a chargingPoint with invalid Id', async () => {
    const newChargePoint = {
      manufacturer: 'abbTest',
      isAvailableChargingPoint: true,
    };
    const invalidId=['65de084c2682eb4883cc8e25', 12345];
    for (let i=0; i<invalidId.length; i++) {
      const url=`/locations/${invalidId[i]}/chargePoints`;
      const invalidResponse = await makePostRequestAndCheckStatus(url, newChargePoint, 400);
      expect(invalidResponse.body.error).to.equals('invalid id chargePoint insertion');
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
    const inputConnectorData = {
      connectorType: 'DC',
      wattage: 7,
      manufacturer: 'abb',
      isAvailableConnector: true,
      maxSessionDuration: 2,
      costPerKWh: 2,

    };
    const URL=`/locations/${location._id}/chargePoints/${chargingPoint._id}/connectors`;
    const connectorResponse = await makePostRequestAndCheckStatus(URL, inputConnectorData, 201);
    const find= await Location.find({_id: connectorResponse.body.locationId});
    expect(find[0].address).to.equal(location.address);// show we can use find with inputid string
    expect(connectorResponse.body.locationId).to.equal(location._id.toString());
    expect(connectorResponse.body.chargingPointId).to.equal(chargingPoint._id.toString());

    const attributes=['connectorType', 'wattage', 'manufacturer',
      'isAvailableConnector', 'maxSessionDuration'];
    const outputConnectorData=connectorResponse.body;
    attributes.forEach((attribute)=>{
      expect(outputConnectorData[attribute]).to.deep.equal(inputConnectorData[attribute]);
    });
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
      const url=`/locations/${invalidIdLocation[i]}/chargePoints/${invalidIdCP[i]}/connectors`;
      const invalidResponse= await makePostRequestAndCheckStatus(url, connectorData, 400);
      expect(invalidResponse.body.error).to.equals('invalid id connector insertion');
    }
  });
});


