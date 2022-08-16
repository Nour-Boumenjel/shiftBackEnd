
const chai = require("chai");
const sinonChai = require("sinon-chai");
const request = require("supertest");
const expect = chai.expect;
const app = require("../server");
chai.use(sinonChai);

describe("Skills Test", () => {
  let id;
 
  it("ADD skills", async () => {
    const res = await request(app)
      .post("/skills")
      .set("content-type", "application/json")
      .send(
        {
            name: "java",
           
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
  it("GET ALL Skills", async () => {
    const res = await request(app)
      .get("/Skills")
      .set("content-type", "application/json");
    expect(res.body).to.be.an("array");
    res.body.forEach((elem) => {
      expect(elem).to.have.property("id");
      expect(elem.id).to.be.a("number");
      expect(elem).to.have.property("name");
      expect(elem.name).to.be.a("string");
      
      
    });
  });


  it("UPDATE skills", async () => {
    const res = await request(app)
      .put("/skills/" + id)
      .set("content-type", "application/json")
      .send(
        {
            name: "php",
           
        }
      );
    expect(res.body).to.be.a("object");
    expect(res.body.skill).to.have.property("id");
    expect(res.body.skill.id).to.be.a("number");
    expect(res.body.skill).to.have.property("name");
    expect(res.body.skill.name).to.be.a("string");
  });
 
it("DELETE skills", async () => {
    const res = await request(app)
      .delete("/skills/" + id)
      .set("content-type", "application/json");
      expect(res.status).to.be.equal(204);
  });

 
});