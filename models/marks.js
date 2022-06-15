const fs = require('fs');
const chalk = require('chalk');
const csv = require('csv-parser');
const student = require('../models/student.js')


const marks = [];
const students = student.students;




const readStudentsMarksList = () =>{
  marks.length=0;
    return new Promise(function(resolve, reject, error) {
      if(!error){
        fs.createReadStream('data/marks.csv')
        .pipe(csv()).on('data', function (row){
          const subjectMarks ={
            studentId: row.studentId,
            subjectId: row.subjectId,
            subjectName: row.subjectName,
            maxMarks: row.maxMarks,
            minMarks: row.minMarks,
            marksObtained: row.marksObtained
          }
          marks.push(subjectMarks)
        })
        .on('end', function() {
        
           if(marks.length>0){
          //  console.log(chalk.green.inverse('Student Marks details loaded successfully'));
            resolve(marks);
        }else{
            reject('the students marks does not exist in database');
              //console.log(chalk.red.inverse('the students marks does not exist in database')));
          }
    });
  }
})};



    
const readStudentMarksDetails = (studentId) => {
  return new Promise((resolve, reject, error) =>{
    if(error){
      reject(error);
    }
    if(!marks.length>0){
      readStudentsMarksList().then(() =>{
        const studentMarks = readStudentMarks(studentId);
        resolve(studentMarks);
        })
    }else{
      const studentMarks = readStudentMarks(studentId);
        resolve(studentMarks);
  }
  })
  }


  const readStudentMarks = (studentId)=>{
    return new Promise((resolve, reject, error)=>{
      if(error){
        reject(error);
      }
      const studentMarksDetails= marks.filter((mark) => mark.studentId === studentId);
         if(studentMarksDetails.length>0){
      
          //console.table(studentMarksDetails);
          //console.log(chalk.green.inverse('Student marks Details displayed Succesfully'));
          resolve(studentMarksDetails)
          
      }else{
         // console.log(chalk.red.inverse('There are no marks details in the database for the given Student Id'));
          reject('There are no marks details in the database for the given Student Id');
      }
    })
  }




    const addStudentMarks =  (addMarks) => {
      return new Promise((resolve, reject, error) =>{
        if(error){
          reject(error);
        }
        const confirmValid = validatePresence(addMarks);
       
        if(confirmValid){
          if(!marks.length>0){
            readStudentsMarksList().then(() =>{
              const marksAdded= addingMarks(addMarks);
              resolve(marksAdded);
            })
          }else{
            const marksAdded= addingMarks(addMarks);
              resolve(marksAdded);
          }
        }else{
          //console.log(chalk.red.inverse('There are no details present inside the students database for the given student Id'));
          reject('There are no details present inside the students database for the given student Id')
        }
       
      })
    }

    const validatePresence = async (addMarks) => {
      if(students.length>0){
        const studentPresence = students.find((stud) =>  stud.studentId === addMarks.studentId);
        if(studentPresence){
          return true;
      }else{
        return false;
      }
    }else{
      await student.readStudentsList()//.then( () => {
        const studentPresence = students.find((stud) =>  stud.studentId === addMarks.studentId);
        if(studentPresence){
          return true;
      }else{
        return false;
      }
   // });
  }
}
    

      const addingMarks = (addMarks)=>{
        return new Promise((resolve, reject, error) => {
          if(error){
            reject(error);
          }
          const duplicatestudentMarksDetails= marks.find((mark) => mark.studentId === addMarks.studentId && mark.subjectId === addMarks.subjectId);
                if (!duplicatestudentMarksDetails) {
                  marks.push({
                    studentId: addMarks.studentId,
                    subjectId: addMarks.subjectId,
                    subjectName: addMarks.subjectName,
                    maxMarks: addMarks.maxMarks,
                    minMarks: addMarks.minMarks,
                    marksObtained: addMarks.marksObtained
                })
                saveStudentMarks(marks)
                //console.log(chalk.green.inverse('New Student marks added!'))
                resolve(addMarks)
              } else {
               // console.log(chalk.red.inverse('There are marks Entered for the subject of given student id.'));
                reject('There are marks Entered for the subject of given student id.');
              }
        })
      }




  const removeStudentMarksData = (studentId, subjectId) => {
    return new Promise((resolve, reject, error) =>{
      if(error){
        reject(error);
      }
      if(!marks.length>0){
        readStudentsMarksList().then(() =>{
          const removedMarks = removingMarks(studentId, subjectId);
          resolve(removedMarks);
      })
      }else{
        const removedMarks = removingMarks(studentId, subjectId);
          resolve(removedMarks);
      }
    })} 
    

    const removingMarks = (studentId, subjectId) =>{
      return new Promise((resolve, reject, error) => {
        if(error){
          reject(error);
        }
        const studentsMarksToKeep = marks.filter((mark) => mark.studentId !== studentId || mark.subjectId !== subjectId);
           if (marks.length > studentsMarksToKeep.length) {
            saveStudentMarks(studentsMarksToKeep);
            readStudentsMarksList().then(() => {
          //    console.log(chalk.green.inverse('student marks removed!'));
            resolve('student marks removed Successfully');
            })
            
        } else {
          //  console.log(chalk.red.inverse('No Marks found for the given subject Id and student Id!'));
            reject('No Marks found for the given subject Id and student Id!');
        } 
      })
    }




    const findByIdAndUpdate = (studentId, subjectId, studentMarks) => {
      return new Promise((resolve, reject, error)=>{
        if(error){
          reject(error);
        }
        if(!marks.length>0){
          readStudentsMarksList().then(()=>{
            marks.forEach((mark) => {
              if(mark.studentId === studentId && mark.subjectId === subjectId){
                
                  mark.marksObtained = studentMarks;
                
                saveStudentMarks(marks);
                resolve(mark);
              }
          })
          reject('Subject marks Not Found for the given student');
        })
      }else{
        marks.forEach((mark) => {
          if(mark.studentId == studentId && mark.subjectId==subjectId){
            
              mark.marksObtained=studentMarks;
            
            saveStudentMarks(marks);
            resolve(mark);
          }
      })
      reject('Subject marks Not Found for the given student');
    }
    })
  }



const saveStudentMarks = (marks) => {
      fs.writeFile('./data/marks.csv', extractAsCSV(marks), err => {
        if (err) {
          return err;
         // console.log(chalk.red.inverse('Error writing to csv file', err));
        } else {
         // console.log(chalk.green.inverse(` successfully`));
         
        }
      });
    }
    
    function extractAsCSV(marks) {
      const header = ["studentId,subjectId,subjectName,maxMarks,minMarks,marksObtained"];
      const rows = marks.map(mark =>
         `${mark.studentId},${mark.subjectId},${mark.subjectName},${mark.maxMarks},${mark.minMarks},${mark.marksObtained}`
      );
      return header.concat(rows).join("\n");
    }



  module.exports = {
    marks: marks,
    findByIdAndUpdate: findByIdAndUpdate,
    readStudentsMarksList: readStudentsMarksList,
    readStudentMarksDetails: readStudentMarksDetails,
    addStudentMarks: addStudentMarks,
    removeStudentMarksData: removeStudentMarksData
  }