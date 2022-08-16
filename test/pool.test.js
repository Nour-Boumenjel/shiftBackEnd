// 
const chai = require("chai");
const sinonChai = require("sinon-chai");
const request = require("supertest");
const expect = chai.expect;
const app = require("../server");
chai.use(sinonChai);

describe("pools Test", () => {
  let id;
 
  it("ADD pool", async () => {
    const res = await request(app)
      .post("/pool")
      .set("content-type", "application/json")
      .send(
        {
            name: "pool dev",
           
        }
      );
    expect(res.body).to.be.a("object");
    expect(res.body).to.have.property("id");
    expect(res.body.id).to.be.a("number");
    expect(res.body).to.have.property("name");
    expect(res.body.name).to.be.a("string");
    id = res.body.id;
  });
 
  //   find by id
  it("GET ALL Pools", async () => {
    const res = await request(app)
      .get("/Pools")
      .set("content-type", "application/json");
    expect(res.body).to.be.an("array");
    res.body.forEach((elem) => {
      expect(elem).to.have.property("id");
      expect(elem.id).to.be.a("number");
      expect(elem).to.have.property("name");
      expect(elem.name).to.be.a("string");
      
      
    });
  });


  it("UPDATE pools", async () => {
    const res = await request(app)
      .put("/pool/" + id)
      .set("content-type", "application/json")
      .send(
        {
            name: "Sap pool",
           
        }
      );
    expect(res.body).to.be.a("object");
    expect(res.body.pool).to.have.property("id");
    expect(res.body.pool.id).to.be.a("number");
    expect(res.body.pool).to.have.property("name");
    expect(res.body.pool.name).to.be.a("string");
  });
 
it("DELETE pools", async () => {
    const res = await request(app)
      .delete("/pool/" + id)
      .set("content-type", "application/json");
      expect(res.status).to.be.equal(204);
  });

 
});