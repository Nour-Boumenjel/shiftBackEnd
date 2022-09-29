// // 
const chai = require("chai");
const sinonChai = require("sinon-chai");
const request = require("supertest");
const expect = chai.expect;
const app = require("../server");
chai.use(sinonChai);

describe("shifts Test", () => {
  let id;
 
  it("GET ALL Shifts", async () => {
    const res = await request(app)
      .get("/Shifts")
      .set("content-type", "application/json");
    expect(res.body).to.be.an("array");
    res.body.forEach((elem) => {
      expect(elem).to.have.property("id");
      expect(elem.id).to.be.a("number");
      expect(elem).to.have.property("startDate");
      expect(elem.startDate).to.be.a("date");
      expect(elem).to.have.property("endDate");
      expect(elem.endDate).to.be.a("date");
      expect(elem).to.have.property("typeId");
      expect(elem.typeId).to.be.a("number");
      
      
    });
  });
 

 
});