const {describe, it, beforeEach} = require('mocha');
const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const app=require('../index');


const {dropDB, Connector}=require('./dbFunctionsAndSchema');
describe('PATCH request for connectors ', ()=>{
  beforeEach(async function() {
    await dropDB();
  });
  it('Should update boolean value isAvailableConnector ', async () => {
    const sampleConnectors = {
      isAvailableConnector: true,
    };

    const connector = await Connector.create(sampleConnectors);
    const connectorId=connector._id;
    const connected= false;
    await request(app)
        .patch(`/connectors/${connectorId}/connectorAvailability`)
        .send({connected})
        .expect(200);

    const connectorResult= await Connector.findOne({_id: connectorId});
    expect(connectorResult.isAvailableConnector).equals(false);
  });

  it('Should give 400 when wrong Id is passed in URL ', async () => {
    const connected=true;
    const invalid='1435tt343';
    const invalidResult = await request(app)
        .patch(`/connectors/${invalid}/connectorAvailability`)
        .send({connected})
        .expect(400);
    expect(invalidResult.body.error).to.equals('invalid ConnectorID');
  });
});


