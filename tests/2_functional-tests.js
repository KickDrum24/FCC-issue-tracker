const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

var deleteID;
var eqID;
suite('Functional Tests', function () {

  // Create an issue with every field: POST request to /api/issues/{project}
  test("Create an issue with every field: POST", function (done) {
    chai
      .request(server)
      .post("/api/issues/project")
      .set("content-type", "application/json")
      .send({
        issue_title: "Delete Me",
        issue_text: "It's crazy like that",
        created_by: "Sigmund Freud",
        assigned_to: "Dr. Phil",
        status_text: "meds recommended",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        deleteID = res.body._id;
        assert.equal(res.body.issue_title, "Delete Me")
        assert.equal(res.body.issue_text, "It's crazy like that")
        assert.equal(res.body.created_by, "Sigmund Freud")
        assert.equal(res.body.assigned_to, "Dr. Phil")
        assert.equal(res.body.status_text, "meds recommended")

        done();
      });
  });
  // Create an issue with only required fields: POST request to /api/issues/{project}
  test("Create an issue with only required fields: POST", function (done) {
    chai
      .request(server)
      .post("/api/issues/project")
      .set("content-type", "application/json")
      .send({
        issue_title: "You can delete me after",
        issue_text: "It's just like that",
        created_by: "Kanye",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.issue_title, "You can delete me after")
        assert.equal(res.body.issue_text, "It's just like that")
        assert.equal(res.body.created_by, "Kanye")

        done();
      });
  });
  // Create an issue with missing required fields: POST request to /api/issues/{project}
  test("Create an issue with missing required fields: POST", function (done) {
    chai
      .request(server)
      .post("/api/issues/project")
      .set("content-type", "application/json")
      .send({
        issue_title: "Status Quo",
        issue_text: null,
        created_by: "Kanye",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.error, "required field(s) missing")

        done();
      });
  });
  // View issues on a project: GET request to /api/issues/{project}
  test("View issues on a project: GET", function (done) {
    chai
      .request(server)
      .get("/api/issues/project")
      .set("content-type", "application/json")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.length, 4)
        done();
      });
  });
  // View issues on a project with one filter: GET request to /api/issues/{project}
  test("View issues on a project w/one filter: GET", function (done) {
    chai
      .request(server)
      .get("/api/issues/project")
      .query({
        issue_title: "View Me",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body[0], {
          "_id":  "6136b3128e0d63892ff11df0",
          "issue_title": "View Me",
          "issue_text": "It's just that",
          "created_by": "Keith",
          "assigned_to": "",
          "status_text": "",
          "created_on": "2021-09-07T00:32:18.000Z",
          "updated_on": "2021-09-07T00:32:18.000Z",
          "open": true,
        })
        done();
      });
  });
  // View issues on a project with multiple filters: GET request to /api/issues/{project}
  test("View issues on a project w/one filter: GET", function (done) {
    chai
      .request(server)
      .get("/api/issues/project")
      .query({
        created_by: "Keith",
        issue_title: "View Me",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body[0], {
          "_id":  "6136b3128e0d63892ff11df0",
          "issue_title": "View Me",
          "issue_text": "It's just that",
          "created_by": "Keith",
          "assigned_to": "",
          "status_text": "",
          "created_on": "2021-09-07T00:32:18.000Z",
          "updated_on": "2021-09-07T00:32:18.000Z",
          "open": true,
        })
        done();
      });
  });
  // Update one field on an issue: PUT request to /api/issues/{project}
  test("Update one field on an issue: PUT", function (done) {
    chai
      .request(server)
      .put("/api/issues/project")
      .send({
        _id: "6136b4808e0d63892ff11df6",
        created_by: "Karsten",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, "successfully updated")

        done();
      });
  });
  // Update multiple fields on an issue: PUT request to /api/issues/{project}
  test("Update multiple fields on an issue: PUT", function (done) {
    chai
      .request(server)
      .put("/api/issues/project")
      .send({
        _id: "6136b4808e0d63892ff11df6",
        assigned_to: "Puffy",
        status_text: "fresh",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, "successfully updated")

        done();
      });
  });
  // Update an issue with missing _id: PUT request to /api/issues/{project}
  test("Update an issue with missing _id: PUT", function (done) {
    chai
      .request(server)
      .put("/api/issues/project")
      .send({
        _id: "",

      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "missing _id")

        done();
      });
  });
  // Update an issue with no fields to update: PUT request to /api/issues/{project}
  test("Update an issue with no fields to update: PUT", function (done) {
    chai
      .request(server)
      .put("/api/issues/project")
      .send({
        _id: "6136b4808e0d63892ff11df6",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "no update field(s) sent")

        done();
      });
  });
  // Update an issue with an invalid _id: PUT request to /api/issues/{project}
  test("Update an issue with an invalid _id: PUT", function (done) {
    chai
      .request(server)
      .put("/api/issues/project")
      .send({
        _id: "343567thisisInvalid",

      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "no update field(s) sent")

        done();
      });
  });
  // Delete an issue: DELETE request to /api/issues/{project}
  test("Delete an issue:", function (done) {
    chai
      .request(server)
      .delete("/api/issues/project")
      .send({
        _id: deleteID,
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, "successfully deleted")
        done();
      });
  });
  // Delete an issue with an invalid _id: DELETE request to /api/issues/{project}
  test("Delete an issue with an invalid _id:", function (done) {
    chai
      .request(server)
      .delete("/api/issues/project")
      .send({
        _id: "6135bf5aaaa37mfbinvalid",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "could not delete")
        done();
      });
  });
  // Delete an issue with missing _id: DELETE request to /api/issues/{project}
  test("Delete an issue with a missing _id:", function (done) {
    chai
      .request(server)
      .delete("/api/issues/project")
      .send({
        _id: "",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "missing _id")
        done();
      });
  });
});
