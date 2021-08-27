
const mongoose = require("mongoose");
const issueModel = require("../mongels.js").Issue;
const projectModel = require("../mongels.js").Project;


module.exports = function (app) {

  app.route('/api/issues/:project')
    // View issues on a project: GET request to /api/issues/{project}
    .get(function (req, res) {
      let project = req.params.project;
      //check database for preexisting project
      projectModel.findOne({ name: project }, (err, data) => {
        //if project not found, respond with appropriate message
        if (!data) {
          res.json({});
          return;
        } else {
          res.json(data.issues)
        }
      })
    })
    //post new issue
    .post(function (req, res) {
      //pull project name from url
      let project = req.params.project;
      //get issue info from index.html form
      const {
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
      } = req.body;
      //verify all required fields are present
      if (!issue_title || !issue_text || !created_by) {
        res.json({ error: "required field(s) missing" });
        return;
      }
      //create new issue
      const newIssue = new issueModel({
        issue_title: issue_title || "",
        issue_text: issue_text || "",
        created_by: created_by || "",
        assigned_to: assigned_to || "",
        status_text: status_text || "",
      })
      //check database for preexisting project
      projectModel.findOne({ name: project }, (err, data) => {
        //if project not found, push issue to newly created project and save
        if (!data) {
          const newProject = projectModel({ name: project });
          newProject.issues.push(newIssue);
          newProject.save((err, dta) => {
            if (err || !dta) {
              res.send("Error saving issue")
            } else {
              res.json(newIssue)
            }
          })
          //if project is found, push new issue to project issues array and save
        } else {
          data.issues.push(newIssue);
          data.save((err, dta) => {
            if (err || !dta) {
              res.send("Error saving issue")
            } else {
              res.json(newIssue)
            }
          })
        }
      })
    })

    .put(function (req, res) {
      // Update one field on an issue: PUT request to /api/issues/{project}
      console.log("put request made")
      //find user by its id, update its post with what's in req.body
      projectModel.findOne({ name: req.params.project }, (err, result) => {
        if (!err) {
          if (!result) {
            res.status(404).send('Project was not found');
          }
          else {
            if (!req.body._id || !result.issues.id(req.body._id)){
              res.json({ error: 'missing _id' })
              return;
            }
            if (!req.body.issue_title && !req.body.issue_text && !req.body.created_by &&
              !req.body.assigned_to && !req.body.status_text){
                res.json({ error: 'no update field(s) sent', '_id': req.body._id })
                return;
              }
            if (req.body.issue_title){
              result.issues.id(req.body._id).issue_title = req.body.issue_title;
            }
            if (req.body.issue_text){
              result.issues.id(req.body._id).issue_text = req.body.issue_text;
            }
            if(req.body.created_by){
              result.issues.id(req.body._id).created_by = req.body.created_by;
            }
            if(req.body.assigned_to){
              result.issues.id(req.body._id).assigned_to = req.body.assigned_to;
            }
            if(req.body.status_text){
              result.issues.id(req.body._id).status_text = req.body.status_text;
            }
            result.issues.id(req.body._id).updated_on = Date();
            // result.issues.id(req.body._id).issue_title = req.body.issue_title;
            // result.issues.id(req.body._id).issue_text = req.body.issue_text;
            // result.issues.id(req.body._id).created_by = req.body.created_by;
            // result.issues.id(req.body._id).assigned_to = req.body.assigned_to;
            // result.issues.id(req.body._id).status_text = req.body.status_text;
            result.markModified('issues');
            result.save(function (saveerr, saveresult) {
              if (!saveerr) {
                // res.status(200).send(saveresult);
                res.json({  "result" : 'successfully updated', '_id': req.body._id })
              } else {
                res.json({ error: 'could not update', '_id': req.body._id })
                // res.status(400).send(saveerr.message);
              }
            });
          }
        } else {
          res.status(400).send(err.message);
        }
      });


    })
    // Delete an issue: DELETE request to /api/issues/{project}
    .delete(function (req, res) {
      //Look for project 
      projectModel.findOne({ name: req.params.project }, (err, result) => {
        if (!err) {
          if (!result) {
            res.status(404).send('project was not found');
          } 
          //look for and remove issue
          else {
            if (!req.body._id){
              res.json({ error: 'missing _id' })
              return;
            }
            result.issues.id(req.body._id).remove((removeerr, removresult) => {
              if (removeerr) {
                res.status(400).send(removeerr.message);
              }
            });
            result.markModified('issues');
            result.save(function (saveerr, saveresult) {
              if (!saveerr) {
                console.log(req.body._id + " deleted")
                // res.json({ result: 'successfully deleted', '_id': req.body._id})
                res.json({ result: 'successfully deleted', '_id': req.body._id});
              } else {
                res.json({ error: 'could not delete', '_id': req.body._id })
                
                // res.status(400).send(saveerr.message);
              }
            });
          }
        } else {
          res.json({ error: 'could not delete', '_id': req.body._id })
          // res.status(400).send(err.message);
        }
      });
    });
};
