const fs = require('fs');
const chalk = require('chalk');
const csv = require('csv-parser');


const students = [];

const readStudentsList = () => {
  students.length=0;
    return new Promise(function(resolve, reject, error){
      if(!error){
        fs.createReadStream('data/students.csv')
        .pipe(csv())
        .on('data', function (row) {
          
          const student = {
              studentId: row.studentId,
              firstName: row.firstName,
              lastName: row.lastName,
              birthDate: row.birthDate,
              email: row.email,
              contactNo: row.contactNo
          }
          students.push(student)
        })
        .on('end', function () {
            //console.table(students)
            if(students.length>0){
               // console.log(chalk.green.inverse('Student details loaded successfully'));
                resolve(students);
            }else{
             // console.log(chalk.red.inverse('the students database is empty'));
              
                reject('the students database is empty');
              }
            
          })
      }
    });
  }

  const readStudentDetails = (studentId) => {
    return new Promise((resolve, reject, error)=>{
      if(error){
        reject(error);
      }
      if(!students.length>0){
        readStudentsList().then(()=>{
          const student = readStudent(studentId);
          resolve(student);
        })
            
      }else{
        const student = readStudent(studentId);
        resolve(student);
        }
      })
    }
      
      const readStudent = (studentId) =>{

        return new Promise((resolve, reject, error) =>{
          if(error){
            reject(error);
          }
          const studentDetails= students.find((student) => student.studentId === studentId);
          if(studentDetails){
       
           //console.table(studentDetails);
          // console.log(chalk.green.inverse('Student Details displayed Succesfully'));
           resolve (studentDetails);
           
       }else{
            reject('There is no student exists with the given Student Id');
           console.log(chalk.red.inverse('There is no student exists with the given Student Id'));
       }
        } )   
         
       }
       
      
      const addStudent = (student) => {
        return new Promise((resolve, reject, error) => {
          if (error){
            reject(error);
          }
          if(!students.length>0){
                readStudentsList().then(() =>{
                  const response = addingStudent(student);
                  resolve(response);
          })}else{
            const response = addingStudent(student);
            resolve(response);
          }
        }) 
    }

    const addingStudent = (stud)=>{
      return new Promise((resolve, reject, error) => {
        if(error){
          reject(error);
        }
        const duplicatestudentDetails= students.find((student) => student.studentId == stud.studentId);
            if (!duplicatestudentDetails) {
              students.push({
                  studentId: stud.studentId,
                  firstName: stud.firstName,
                  lastName: stud.lastName,
                  birthDate: stud.birthDate,
                  email: stud.email,
                  contactNo: stud.contactNo
              })
              saveStudents(students)
             // console.log(chalk.green.inverse('New Student added '))
              resolve(stud);
          } else {
             // console.log(chalk.red.inverse('There is a Student with given Student Id. Please Provide the unique Id.'))
              reject('There is a Student with given Student Id. Please Provide the unique Id.')
          }

      })
    }


    const removeStudent = (studentId) => {
      return new Promise((resolve, reject, error) => {
        if(error){
          reject(error);
        }
        if(!students.length>0){
          readStudentsList().then(() =>{
           const resstate = removingStudent(studentId);
            resolve(resstate);
        })}else{
          const resstate = removingStudent(studentId);
            resolve(resstate);
        }
      })
        
    }
    const removingStudent = (studentId)=> {
      return new Promise((resolve, reject, error) => {
        if(error){
          reject(error);
        }
        const studentsToKeep= students.filter((student) => student.studentId !== studentId);

             if (students.length > studentsToKeep.length) {
              saveStudents(studentsToKeep);
              readStudentsList().then(()=> {
               // console.log(chalk.green.inverse('student removed!'));
              resolve('student removed Successfully');
              })
              
          } else {
             // console.log(chalk.red.inverse('No student found!'));
              reject('No student found!');
          }    
      })
    }

    const findByIdAndUpdate= (studentId,stud)=>{
      return new Promise((resolve, reject, error)=>{
        if(error){
          reject(error);
        }
        if(!students.length>0){
          readStudentsList().then(()=>{
            students.forEach((student) => {
              if(student.studentId === studentId){
                if(stud.email){
                  student.email=stud.email;
                }
                if(stud.contactNo){
                  student.contactNo=stud.contactNo;
                }
                saveStudents(students);
                resolve(student);
              }
          })
          reject('Student Not Found');
        })
      }else{
        students.forEach((student) => {
          if(student.studentId === studentId){
            if(stud.email){
              student.email=stud.email;
            }
            if(stud.contactNo){
              student.contactNo=stud.contactNo;
            }
           
            
            saveStudents(students);
            resolve(student);
          }
          
      })
      reject('Student Not Found');
      }
      

    })
  }

  


const saveStudents = (students) => {
        fs.writeFile('./data/students.csv', extractAsCSV(students), err => {
          if (err) {
           // console.log(chalk.red.inverse('Error writing to csv file', err));
           return err;
          } else {
            //console.log(chalk.green.inverse(` successfully`));
            return 'successful';
          }
        });
      }
      
      function extractAsCSV(students) {
        const header = ["studentId,firstName,lastName,birthDate,email,contactNo"];
        const rows = students.map(student =>
           `${student.studentId},${student.firstName},${student.lastName},${student.birthDate},${student.email},${student.contactNo}`
        );
        return header.concat(rows).join("\n");
      }

      

  module.exports = {
    students: students,
    readStudentsList: readStudentsList,
    readStudentDetails: readStudentDetails,
    addStudent: addStudent,
    findByIdAndUpdate: findByIdAndUpdate,
    removeStudent: removeStudent
  }