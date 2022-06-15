const express = require('express')
const marks = require('../models/marks.js')
const router = new express.Router()
const Ajv = require("ajv")
const student = require('../models/student.js')
const ajv = new Ajv() // options can be passed, e.g. {allErrors: true}
require("ajv-formats")(ajv);


const schema = {
  type: "object",
  properties: {
    studentId: {type: "string"},
    subjectId: {type: "integer", minimum:1, maximum:4},
    subjectName: {type: "string"},
    maxMarks: {type: "integer", default: 100},
    minMarks: {type: "integer", default:40},
    marksObtained: {type: "integer", maximum: 100}
  },
  additionalProperties: false

}

const validate = ajv.compile(schema)


router.get('/marks', (req, res) => {
    marks.readStudentsMarksList().then((studentmarks)=>{
        res.send(studentmarks)
    }).catch((e) => {
        res.status(500).send(e)
    })
})


router.get('/marks/:studentId', (req, res) => {
    const studentId = req.params.studentId;

    marks.readStudentMarksDetails(studentId).then((studentMarks) => {
        if (!studentMarks) {
            return res.status(404).send("There is no student marks data exists with the given Student Id")
        }

        res.send(studentMarks)
    }).catch((e) => {
        res.status(500).send(e)
    })
})


router.post('/marks', (req, res) => {
    const studentMarks = req.body

    const valid = validate(studentMarks)
    if(valid){
        marks.addStudentMarks(studentMarks).then((addedMarks) => {
            res.status(201).send(addedMarks)
        }).catch((e) => {
            res.status(400).send(e)
        })
    }else{
        console.log(validate.errors);
        res.status(400).send(validate.errors)
    }
})



router.delete('/marks/:studentId/:subjectId', (req, res) => {
    const studentId = req.params.studentId;
    const subjectId =req.params.subjectId;

    marks.removeStudentMarksData(studentId,subjectId).then((removedStudMarks)=>{
        res.send(removedStudMarks);
    }).catch((e) =>{
        res.status(404).send(e);
    })
})

router.patch('/marks/:studentId/:subjectId', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = [ 'marksObtained']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!  Only marks Obtained can be updated' })
    }

    try {
       

        const updatedStudentMarks = await marks.findByIdAndUpdate(req.params.studentId, req.params.subjectId, req.body.marksObtained);
       // console.log(req.params.studentId+req.params.subjectId+req.body.marksObtained+'from router');
        if (!updatedStudentMarks) {
            return res.status(404).send()
        }

        res.send(updatedStudentMarks)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router