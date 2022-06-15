const express = require('express');
const studentRouter = require('./routers/studentRouter.js');
const marksRouter = require('./routers/marksRouter.js');
const reportRouter = require('./routers/reportRouter.js')


const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(studentRouter);
app.use(marksRouter);
app.use(reportRouter);

module.exports = app