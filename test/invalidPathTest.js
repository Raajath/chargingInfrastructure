const chai = require('chai');
const {describe, it} = require('mocha');
const request = require('supertest');
const {app}=require('../index');
const expect = chai.expect;
describe('Wrong Endpoint request', ()=>{
  it('should give 404 error when  wrong endpoint is entered', async ()=>{
    const res=await request(app)
        .post('/')
        .expect(404);
    expect(res.body.error).equals('Not found asset server');
  });
});
