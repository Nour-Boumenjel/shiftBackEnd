
const chai = require("chai");
const sinonChai = require("sinon-chai");
const request = require("supertest");
const expect = chai.expect;
const app = require("../server");
chai.use(sinonChai);

describe("groupSkills Test", () => {
  let id;

  it("ADD groupSkills", async () => {
    const res = await request(app)
      .post("/groupSkills")
      .set("content-type", "application/json")
      .send(
        {
            name: "frontEnd2",
           
        }
      );
    expect(res.body).to.be.a("object");
    expect(res.body).to.have.property("id");
    expect(res.body.id).to.be.a("number");
    expect(res.body).to.have.property("name");
    expect(res.body.name).to.be.a("string");
    id = res.body.id;
  });
 

  it("GET ALL groupSkills", async () => {
    const res = await request(app)
      .get("/groupSkills")
      .set("content-type", "application/json");
    expect(res.body).to.be.an("array");
    // expect(res.totalItems).to.be.an("array");
    res.body.forEach((elem) => {
      expect(elem).to.have.property("id");
      expect(elem.id).to.be.a("number");
      expect(elem).to.have.property("name");
      expect(elem.name).to.be.a("string");
          
    });
  });


  it("UPDATE groupSkills", async () => {
    const res = await request(app)
      .put("/groupSkills/" + id)
      .set("content-type", "application/json")
      .send(
        {
            name: "fullstack",
           
        }
      );
    expect(res.body).to.be.a("object");
    expect(res.body.groupSkill).to.have.property("id");
    expect(res.body.groupSkill.id).to.be.a("number");
    expect(res.body.groupSkill).to.have.property("name");
    expect(res.body.groupSkill.name).to.be.a("string");

  });
 
it("DELETE groupskill", async () => {
    const res = await request(app)
      .delete("/groupSkills/" + id)
      .set("content-type", "application/json");
      expect(res.status).to.be.equal(204);
  });

 
});