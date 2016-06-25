// // Generated by CoffeeScript 1.5.0
// (function() {
//   var expect, request, serverPath, testHelpers;

//   process.env.NODE_ENV = "testing";

//   expect = require("chai").expect;

//   testHelpers = require("./testHelpers");

//   request = require("request");

//   serverPath = "";

//   before(function(done) {
//     this.timeout(10000);
//     return testHelpers.clearDatabase(function() {
//       return testHelpers.startServer(function(err, result) {
//         if (err) {
//           return done(err);
//         }
//         serverPath = result;
//         return done();
//       });
//     });
//   });

//   describe("API test example: POST /submit", function() {
//     describe("Perfect input", function() {
//       var response;
//       response = {};
//       before(function(done) {
//         var endpoint;
//         endpoint = serverPath + "/submit";
//         return request.post(endpoint, {
//           headers: {
//             "X-Requested-With": "XMLHttpRequest"
//           },
//           json: true,
//           form: {
//             name: "Caesar",
//             age: 13,
//             food: "sandwich"
//           }
//         }, function(err, res, body) {
//           response = body;
//           return done();
//         });
//       });
//       it("should return a JSON object", function() {
//         return expect(response).to.be.an("object");
//       });
//       it("should contain the meta data", function() {
//         return expect(response.meta).to.be.an("object");
//       });
//       it("should return status of 200", function() {
//         return expect(response.meta.status).to.be.equal(200);
//       });
//       return it("should return 'ok' message", function() {
//         return expect(response.meta.msg).to.be.equal("ok");
//       });
//     });
//     return describe("Error input", function() {
//       var response;
//       response = {};
//       before(function(done) {
//         var endpoint;
//         endpoint = serverPath + "/submit";
//         return request.post(endpoint, {
//           headers: {
//             "X-Requested-With": "XMLHttpRequest"
//           },
//           json: true,
//           form: {
//             name: "Caesar",
//             age: "donkey",
//             food: "sandwich"
//           }
//         }, function(err, res, body) {
//           response = body;
//           return done();
//         });
//       });
//       it("should return a JSON object", function() {
//         return expect(response).to.be.an("object");
//       });
//       it("should contain the meta data", function() {
//         return expect(response.meta).to.be.an("object");
//       });
//       it("should return status of 403", function() {
//         return expect(response.meta.status).to.be.equal(400);
//       });
//       return it("should return error message saying 'Age must be a number'", function() {
//         return expect(response.meta.msg).to.be.equal("Age must be a number");
//       });
//     });
//   });

//   after(function(done) {
//     return testHelpers.clearDatabase(function() {
//       return testHelpers.stopServer(serverPath, function() {
//         return done();
//       });
//     });
//   });

// }).call(this);
