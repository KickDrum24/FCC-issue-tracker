const mongoose = require("mongoose");
const { Schema } = mongoose;

//create issueSchema
const issueSchema = new Schema({
    issue_title : {type : String , required: true},
    issue_text: {type : String , required: true},
    created_on: Date,
    updated_on: Date,
    created_by: {type : String , required: true} ,
    assigned_to: String,
    open: Boolean,
    status_text: String
});

//create projectSchema
const projectSchema = new Schema({
    name: {type : String , required: true},
    issues: [issueSchema]
});

// create Issue model
const Issue = mongoose.model('Issue', issueSchema);

// create Project model
const Project = mongoose.model('Project', projectSchema);

exports.Issue = Issue;
exports.Project = Project;