import chai from "chai";
import request from "supertest";
import api from "../../../../index";  // Express API application 

const expect = chai.expect;

let movie; // NEW LINE
let numReviews; // NEW LINE

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

    //4TH TEST REVIEW
    describe("GET /api/movies/:id/reviews", () => {

        before(() => {
            movie = {
                id: 527774,
                title: "Raya and the Last Dragon",
            };
        });

        // Nested describe block for when the id is valid
        describe("when the id is valid", () => {
            
            // Test for successful retrieval of reviews
            it("returns reviews for the specified movie", (done) => {
                request(api)
                    .get(`/api/movies/${movie.id}/reviews`)
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.results).to.be.a("array");
                        done();
                    });
                });
            });
    });

    describe("when the id is invalid", () => {
            
        // Test for handling an invalid id
        it("returns the NOT found error message", (done) => {
            request(api)
                .get("/api/movies/9999/reviews")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect({
                    message: "The resource you requested could not be found.",
                    status_code: 404,
                })
            .end(done);
        });
    });

    describe("POST /api/movies/:id/reviews ", () => {

        before(() => {
          movie = {
            id: 527774,
          };
          return request(api)
            .get(`/api/movies/${movie.id}/reviews`)
            .set("Accept", "application/json")
            .then((res) => {
              numReviews = res.body.results.length;
            });
        });

        
        describe("For a valid movie id ", () => {
          it("should return a 201 status and the newly added review", () => {
            let review = {
              author: "joebloggs",
              content: "In a magical land known as Kumandra....",
            };
            return request(api)
              .post(`/api/movies/${movie.id}/reviews`)
              .send(review)
              .expect(201)
              .then((res) => {
                expect(res.body).to.have.keys([
                  "author",
                  "content",
                  "id",
                  "created_at",
                  "updated_at",
                ]);
                expect(res.body).to.have.property("author", review.author);
              });
          });
          after(() => {
            return request(api)
              .get(`/api/movies/${movie.id}/reviews`)
              .set("Accept", "application/json")
              .then((res) => {
                expect(res.body.results.length).equals(numReviews + 1);
              });
          });
        });


        describe("For an invalid movie id ", () => {
          it("should return a 404 status and the corresponding error message", () => {
            return request(api)
              .post(`/api/movies/99999/reviews`)
              .send({})
              .expect(404)
              .expect({
                message: "The resource you requested could not be found.",
                status_code: 404,
              });
          });
        });
      });
});