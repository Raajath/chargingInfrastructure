const request = require('supertest');
const nock = require('nock');
const {Connector, dropDB}=require('./dbFunctionsAndSchema');
const {app}=require('../index');
const {describe, it, beforeEach} = require('mocha');
const chai = require('chai');
const expect = chai.expect;

async function makeRequest(id, userBatteryData, statusCode) {
  const result = await request(app)
      .get(`/connectors/${id}`)
      .send(userBatteryData)
      .expect(statusCode);
  return result;
}


describe('GET information and get expected charging time from estimation server', () => {
  beforeEach(async function() {
    await dropDB();
  });
  it('should return connector data with estimated charging time', async () => {
    const estimationResponse = {expectedTimeHours: 2};
    nock('http://localhost:5000')
        .post('/estimate')
        .reply(201, estimationResponse);

    const connectorData = {
      connectorType: 'Type A',
      isAvailableConnector: true,
      manufacturer: 'abb',
      costPerKWh: 0.1,
      connectorPowerKWH: 10,
    };
    const connector=await Connector.create(connectorData);
    const userBatteryData={
      soc: 50,
      batteryCapacity: 40,

    };

    const connectorResult = await makeRequest(connector._id, userBatteryData, 200);
    expect(connectorResult.body.estimateChargingTimeHours).to.equals(2);
  });

  it('should return 500 when axios request not made ', async () => {
    const connectorData = {
      connectorType: 'Type A',
    };
    const connector=await Connector.create(connectorData);
    const userBatteryData={soc: 60,
      batteryCapacity: 60};
    const connectorResultFail = await makeRequest(connector._id, userBatteryData, 500);
    expect(connectorResultFail.body.error).to.equals('Estimation server error');
  });


  it('should return 400 when ivalid connectorId is given (got 400 estimationServer) ', async () => {
    const userBatteryData={
      soc: 10,
      batteryCapacity: 20,

    };
    const invalidId='634vs435356tgb';
    const wrongResponse = await makeRequest(invalidId, userBatteryData, 400);
    expect(wrongResponse.body.error).to.equals('invalid connectorId or bad request');
  });
});

