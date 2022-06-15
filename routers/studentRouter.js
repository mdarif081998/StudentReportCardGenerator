const express = require('express')
const student = require('../models/student.js')
const router = new express.Router()
const validator= require('validator')
const Ajv = require("ajv")
const ajv = new Ajv() // options can be passed, e.g. {allErrors: true}
require("ajv-formats")(ajv);


const schema = {
  type: "object",
  properties: {
    studentId: {type: "string"},
    firstName: {type: "string", minLength: 2},
    lastName: {type: "string"},
    birthDate: {type: "string", format: "date", formatMinimum: "2000-02-06", formatExclusiveMaximum: "2010-12-27"},
    email: {type: "string", format: "email"},
    contactNo: {type: "number", minimum: 10}
  },
  additionalProperties: false
}

const validate = ajv.compile(schema)


router.get('/students', (req, res) => {
    student.readStudentsList().then((students)=>{
        res.send(students)
    }).catch((e) => {
        res.status(500).send(e)
    })
})


router.get('/student/:studentId', (req, res) => {
    const studentId = req.params.studentId;

    student.readStudentDetails(studentId).then((student) => {
        if (!student) {
            return res.status(404).send("There is no student exists with the given Student Id")
        }

        res.send(student)
    }).catch((e) => {
        res.status(500).send(e)
    })
})


router.post('/student', (req, res) => {
    const stud = req.body;
    //if (!validator.isEmail(stud.email)) {
      //  res.status(500).send('Email is invalid');
      //  throw new Error('Email is invalid')
    //}

    const valid = validate(stud)
    if(valid){
        student.addStudent(stud).then((retstud) => {
            res.status(201).send(retstud)
        }).catch((e) => {
            res.status(400).send(e)
        })
    }else{
        console.log(validate.errors);
        res.status(400).send(validate.errors)
    }

    
})

router.delete('/student/:studentId', (req, res) => {
    const studentId = req.params.studentId;

    student.removeStudent(studentId).then((removedStud)=>{
        res.send(removedStud);
    }).catch((e) =>{
        res.status(404).send(e);
    })
})

router.patch('/student/:studentId', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = [ 'email', 'contactNo']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!  Only Email Id and Contact Number can be updated' })
    }

    try {
        const updatedStudent = await student.findByIdAndUpdate(req.params.studentId, req.body);

        if (!updatedStudent) {
            return res.status(404).send()
        }

        res.send(updatedStudent)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router