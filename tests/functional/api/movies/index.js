import chai from "chai";
import request from "supertest";
import api from "../../../../index";  // Express API application 

const expect = chai.expect;

let movie; // NEW LINE

describe('Movies endpoint',  () => {

    // FIRST TEST
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

      //2ND TEST
      describe("GET /api/movies/:id", () => {
        before(() => {
          movie = {
            id: 527774,
            title: "Raya and the Last Dragon",
          };
        });
        describe("when the id is valid", () => {
          it("returns the matching movie", () => {
            return request(api)
              .get(`/api/movies/${movie.id}`)
              .set("Accept", "application/json")
              .expect("Content-Type", /json/)
              .expect(200)
              .then((res) => {
                expect(res.body).to.have.property("title", movie.title);
              });
          });
        });

        //3RD TEST
        describe("when the id is invalid", () => {
          it("returns the NOT found error message", () => {
            return request(api)
              .get("/api/movies/9999")
              .set("Accept", "application/json")
              .expect("Content-Type", /json/)
              .expect({
                message: "The resource you requested could not be found.",
                status_code: 404,
              });
          });
        });
      });
});