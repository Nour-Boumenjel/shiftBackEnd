// // // 
// const chai = require("chai");
// const sinonChai = require("sinon-chai");
// const request = require("supertest");
// const expect = chai.expect;
// const app = require("../server");
// chai.use(sinonChai);

// describe("shifts Test", () => {
//   let id;
 
//   it("ADD shift", async () => {
//     const res = await request(app)
//       .post("/shift")
//       .set("content-type", "application/json")
//       .send(
//         {
//             // name: "pool dev",
           
//         }
//       );
//     expect(res.body).to.be.a("object");
//     // expect(res.body).to.have.property("id");
//     // expect(res.body.id).to.be.a("number");
//     expect(res.body).to.have.property("startDate");
//     expect(res.body.startDate).to.be.a("date");
//     id = res.body.id;
//   });
 
// //   //   find by id
// //   it("GET ALL Shifts", async () => {
// //     const res = await request(app)
// //       .get("/shifts")
// //       .set("content-type", "application/json");
// //     expect(res.body).to.be.an("array");
// //     res.body.forEach((elem) => {
// //       expect(elem).to.have.property("id");
// //       expect(elem.id).to.be.a("number");
// //       expect(elem).to.have.property("name");
// //       expect(elem.name).to.be.a("string");
      
      
// //     });
// //   });


// //   it("UPDATE shifts", async () => {
// //     const res = await request(app)
// //       .put("/shift/" + id)
// //       .set("content-type", "application/json")
// //       .send(
// //         {
// //             // name: "Sap pool",
           
// //         }
// //       );
// //     expect(res.body).to.be.a("object");
// //     expect(res.body.pool).to.have.property("id");
// //     expect(res.body.pool.id).to.be.a("number");
// //     expect(res.body.pool).to.have.property("name");
// //     expect(res.body.pool.name).to.be.a("string");
// //   });
 
// // it("DELETE shifts", async () => {
// //     const res = await request(app)
// //       .delete("/shift/" + id)
// //       .set("content-type", "application/json");
// //       expect(res.status).to.be.equal(204);
// //   });

 
// });