const chai = require("chai");
const sinonChai = require("sinon-chai");
const request = require("supertest");
const expect = chai.expect;
const app = require("../server");
chai.use(sinonChai);

describe("Types Test", () => {
  let id;
 
  it("ADD type", async () => {
    const res = await request(app)
      .post("/types")
      .set("content-type", "application/json")
      .send(
        {
            name: "intermediate shift",
            color:"purpl"
        }
      );
    expect(res.body).to.be.a("object");
    expect(res.body).to.have.property("id");
    expect(res.body.id).to.be.a("number");
    expect(res.body).to.have.property("name");
    expect(res.body.name).to.be.a("string");
    expect(res.body.color).to.be.a("string");
    id = res.body.id;
  });
 
 
  it("GET ALL Types", async () => {
    const res = await request(app)
      .get("/types")
      .set("content-type", "application/json");
    expect(res.body).to.be.an("array");
    res.body.forEach((elem) => {
      expect(elem).to.have.property("id");
      expect(elem.id).to.be.a("number");
      expect(elem).to.have.property("name");
      expect(elem.name).to.be.a("string");
      expect(elem).to.have.property("color");
      expect(elem.color).to.be.a("string")
  
      
    });
  });


  it("UPDATE type", async () => {
    const res = await request(app)
      .put("/types/" + id)
      .set("content-type", "application/json")
      .send(
        {
            name: "intermediate shift",
            color:"red"
           
        }
      );
    expect(res.body).to.be.a("object");
    expect(res.body.type).to.have.property("id");
    expect(res.body.type.id).to.be.a("number");
    expect(res.body.type).to.have.property("name");
    expect(res.body.type.name).to.be.a("string");
  });
 
it("DELETE types", async () => {
    const res = await request(app)
      .delete("/types/" + id)
      .set("content-type", "application/json");
      expect(res.status).to.be.equal(404);
  });

 
});