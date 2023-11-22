import chai from "chai";
import request from "supertest";
import api from "../../../../index";  // Express API application 

const expect = chai.expect;

describe('Movies endpoint',  () => {
    describe("Movies endpoint", () => {
        describe("GET /api/movies ", () => {
          it("returns all the movies and a status 200", (done) => {
            request(api)
              .get("/api/movies")
              .set("Accept", "application/json")
              .expect("Content-Type", /json/)
              .expect(200)
              .end((err, res) => {
                expect(res.body.results).to.be.a("array");
                expect(res.body.results.length).to.equal(4);
                done();
              });
          });
        });
      });
});