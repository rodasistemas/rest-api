const mongoose = require("../../database");
const bcryptjs = require("bcryptjs");
const TaskSchema = mongoose.Schema({
    title:{
        type: String,
        require:true,
    },
    project:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        require: true
    },
    assignedTo:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    completed:{
        type:"Boolean",
        default:false,
        require:true

    },
    createAt:{
        type: Date,
        default: Date.now,
    },
});


const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;