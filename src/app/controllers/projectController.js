const express = require("express");
const authMiddleware = require("../middlewares/auth");
const Projects = require("../models/projects");
const Tasks = require("../models/tasks");
const router = express.Router();
//Autentication
router.use(authMiddleware);
//Routers 
//List all registers
router.get("/",  async (req,res)=>{
    try{
        const projects = await Projects.find().populate(['user','tasks']);
        return res.send({projects});
    }catch(err){
        if(err)
            return res.status(400).send({error:"Error on get registers, try again"});
    }
});
//List one register
router.get("/:projectId", async(req, res)=>{
    try{
        const projects = await Projects.findById(req.params.projectId).populate('user');
        return res.send({projects});
    }catch(err){
        if(err)
            return res.status(400).send({error:"Error on get register, try again"});
    }
});
// Create new register 
router.post("/", async(req, res)=>{
    try{
        const { title, description, tasks} = req.body;
        const project = await Projects.create({title, description, user: req.userId});
        await Promise.all(tasks.map(async task =>{
            const projectTask = new Tasks({...task, project: project._id});

            await projectTask.save();
            project.tasks.push(projectTask);
        }));
        await project.save();
        return res.send({project});
    }catch(err){
        if(err){
            console.log(err);
            return res.status(400).send({error:"Cannot create a product, try again"});
        }
    }
});
//Update one register
router.put("/:projectId", async(req, res)=>{
    try{
        const { title, description, tasks} = req.body;
        const project = await Projects.findByIdAndUpdate(req.params.projectId, {
            title, 
            description
        },{new:true}
    );
    project.tasks = [];
    await Tasks.remove({project: project._id});

        await Promise.all(tasks.map(async task =>{
            const projectTask = new Tasks({...task, project: project._id});

            await projectTask.save();
            project.tasks.push(projectTask);
        }));
        await project.save();
        return res.send({project});
    }catch(err){
        if(err){
            console.log(err);
            return res.status(400).send({error:"Cannot create a product, try again"});
        }
    }
});
//Delete one register
router.delete("/:projectId", async(req, res)=>{
    try{
        const project = await Projects.findByIdAndDelete(req.params.projectId);
        return res.send({success:"Register removed"});
    }catch(err){
        if(err)
            return res.status(400).send({error:"Error on remove register, try again"});
    }
});

module.exports = app => app.use("/projects",router);