
const chalk = require('chalk');
const student = require('../models/student.js')
const marksjs = require('../models/marks.js');
const fs = require('fs');


const students = student.students;
const marks = marksjs.marks;
let avgResult;
let report ="";
const studentsforallreports=students;
let average;


const printAverageResult = async (studentId) => {
  
    if(marks.length>0){
      const averageResult = await calculateAverageResult(studentId);
      console.log(chalk.green.inverse('The Average Result of Given Student is ' +avgResult + ' percentage.'));
     // resolve(averageResult);
     return 'The Average Result of Given Student is ' +avgResult + ' percentage.';
    }else{
      await marksjs.readStudentsMarksList();
      const averageResult = await calculateAverageResult(studentId);
      console.log(chalk.green.inverse('The Average Result of Given Student is ' +avgResult + ' percentage.'));
    //  resolve(averageResult);
    return 'The Average Result of Given Student is ' +avgResult + ' percentage.';
    }
 
}



const calculateAverageResult = (studentId) => {
return new Promise((resolve, reject, error) => {
    if(error){
        reject(chalk.red.inverse(error));
    }else{
          const avgmarks = marks.filter((mark) => mark.studentId == studentId);
          if(avgmarks.length==0){
            console.log(chalk.red.inverse('Student Marks Not Found or it needs to be updated'));
            reject('Student Marks Not Found or it needs to be updated')
          }
          let sum = 0;
          avgmarks.forEach(avgmark => {
          sum = sum + +avgmark.marksObtained;
          });
           avgResult=sum/4;
          resolve(avgResult);

     }
      })    
}


const printReport = async (studentId)=>{
  report='';
  if(students.length>0 && marks.length>0){
    avgResult= await calculateAverageResult(studentId);
    printReportCard(studentId);
      return report;
  
    
  }else{
    const studentlist = await student.readStudentsList();
    const marksList = await marksjs.readStudentsMarksList();
    avgResult= await calculateAverageResult(studentId);
   printReportCard(studentId);
      return report;
  
  }
}

const printReportCard = (studentId) => {
  //return new Promise((resolve, reject, error) => {
  //  if (error){
   //   reject(error);
   // }
    stud = students.find((student) => student.studentId == studentId)
    if(!stud){
    console.log(chalk.red.inverse('Student with id '+studentId+' Not Found'));
    }
    let heading = '\t\t\t\t REPORT CARD \n\n\n';
    let studentDetails = 'Student Id: '+stud.studentId+'\t First Name: '+stud.firstName+'\t\t Last Name: '+ stud.lastName+'\n';
    studentDetails += 'Birth Date: '+stud.birthDate+ '\t Email: '+ stud.email +'\t Contact Number: '+stud.contactNo+'\n\n\n';
              
  // let totalPercentage= '';
  
  const avgmarks = marks.filter((mark) => mark.studentId == studentId)
  if(!avgmarks){
      return console.log(chalk.red.inverse('Marks details needs to be updated'));
      }
  let marksDetails = '';
  avgmarks.forEach(avgmark => {
    marksDetails += 'Subject Id: '+avgmark.subjectId+'\t Subject Name: '+ avgmark.subjectName;
    marksDetails += '\t Max. Marks: '+avgmark.maxMarks+ '\t Min. Marks: '+avgmark.minMarks+ '\t Marks Obtained: '+avgmark.marksObtained+'\n';
      });
  
  totalPercentage = '\n\n \t Final Grade\/Percentage: ' + avgResult + '%.';
  
  report += heading + studentDetails + marksDetails + totalPercentage+ '\n\n';

  return report;
  //resolve(report);
  //})
  }



  const printReportCardinFile = async (studentId, fileName)=>{
    report='';
    if(students.length>0 && marks.length>0){
      avgResult= await calculateAverageResult(studentId);
      const rep = printReportCard(studentId);
      const place= await outputReportCard(fileName);
      const output = rep + '\n' +place;
        return output;
    
      
    }else{
      const studentlist = await student.readStudentsList();
      const marksList = await marksjs.readStudentsMarksList();
      avgResult= await calculateAverageResult(studentId);
      const rep = printReportCard(studentId);
      const place= await outputReportCard(fileName);
      const output = rep + '\n' +place;
        return output;
    
    }
  }



  const outputReportCard = (filename) => {
    return new Promise((resolve, reject, error) => {
      let filepath = 'output/'+filename+'.txt';
      if(!error){
        fs.writeFile(filepath, report, function (err) {
          if (err) {
            console.log(chalk.red.inverse(err));
            reject(err);
          }
          console.log(chalk.green.inverse('report has been saved in '+ filename+ '.txt inside output folder of project'));
          resolve('report has been saved in '+ filename+ '.txt inside output folder of project')
        });
      }
    });
  }


const generateReportCardForAll = () => {
  report='';
  return new Promise((resolve, reject, error) => {
    if(error){
      reject(error);
    }
    allReports().then(()=>{
      //console.log(report);
      resolve(report)
    })
})
};

const allReports = async() => {
  
      if(students.length>0 && marks.length>0){
        students.forEach((student) => {
          calculateAverageResult(student.studentId).then( () => {
           printReportCard(student.studentId);
           
          });
          
       });
      }else{
        await student.readStudentsList();
        await marksjs.readStudentsMarksList();
          students.forEach((student) => {
            calculateAverageResult(student.studentId).then( () => {
             printReportCard(student.studentId);
            });
        })
      }
    }



    const generateReportCardForAllinFile = () => {
      report='';
      return new Promise((resolve, reject, error) => {
        if(error){
          reject(error);
        }
        allReportsinSeperateFiles().then(()=>{
          //console.log(report);
          resolve('All Reports are outputted Successfully')
        })
    })
    };

  
    const allReportsinSeperateFiles = async() => {
        
      if(students.length>0 && marks.length>0){
        students.forEach((student) => {
          
          calculateAverageResult(student.studentId).then( () => {
            report='';
           printReportCard(student.studentId);
           const fileName = student.studentId+'reportCard';
           outputReportCard(fileName);
           
          });
          
       });
      }else{
        await student.readStudentsList();
        await marksjs.readStudentsMarksList();
          students.forEach((student) => {
           
            calculateAverageResult(student.studentId).then( () => {
              report='';
             printReportCard(student.studentId);
             const fileName = student.studentId+'reportCard';
             outputReportCard(fileName);
            });
        })
      }
    }
  

module.exports = {
    printAverageResult: printAverageResult,
    printReportCardinFile: printReportCardinFile,
    printReport: printReport,
    generateReportCardForAll: generateReportCardForAll,
    generateReportCardForAllinFile: generateReportCardForAllinFile
  }