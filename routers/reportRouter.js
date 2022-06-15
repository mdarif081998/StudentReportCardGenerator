const express = require('express')
const report = require('../models/report.js')
const router = new express.Router()



router.get('/report/avg/:studentId', (req, res) => {
    report.printAverageResult(req.params.studentId).then((avg)=>{
        res.send(avg)
    }).catch((e) => {
        res.status(404).send(e)
    })
})


router.get('/report/:studentId', (req, res) => {
    report.printReport(req.params.studentId).then((printedReport)=>{
        res.send(printedReport)
    }).catch((e) => {
        res.status(404).send(e)
    })
})


router.get('/report/:studentId/:fileName', (req, res) => {
    report.printReportCardinFile(req.params.studentId, req.params.fileName).then((printedReport)=>{
        res.send(printedReport)
    }).catch((e) => {
        res.status(404).send(e)
    })
})



router.get('/reports', (req, res) => {
    report.generateReportCardForAll().then((printedReports)=>{
        res.send(printedReports)
    }).catch((e) => {
        res.status(404).send(e)
    })
})


router.get('/reportsinfile', (req, res) => {
    report.generateReportCardForAllinFile().then((printedReports)=>{
        res.send(printedReports)
    }).catch((e) => {
        res.status(404).send(e)
    })
})

module.exports = router