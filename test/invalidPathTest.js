const {describe, it} = require('mocha');
const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const app=require('../index');

describe('Wrong Endpoint request', ()=>{
  it('should give 404 error when  wrong endpoint is entered', async ()=>{
    const res=await request(app)
        .post('/')
        .expect(404);
    expect(res.body.error).equals('Not found');
  });
});
