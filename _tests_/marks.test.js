
const app = require("../server");
const supertest = require("supertest");

jest.mock('../models/marks.js');
const marks = require('../models/marks.js');
const { response } = require("../server");

const mockData = [{
  studentId: "1C001",
  subjectId: 1,
  subjectName: "English",
  maxMarks: 100,
  minMarks: 40,
  marksObtained: 99
},{
  studentId: "1C001",
  subjectId: 2,
  subjectName: "Physics",
  maxMarks: 100,
  minMarks: 40,
  marksObtained: 97
}];

marks.readStudentsMarksList.mockResolvedValue(mockData)

describe('marks api test cases', () => {

  test("GET /marks", async () => {
    
    await supertest(app).get("/marks")
    .then((response) => {
      //console.log(response.body);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.status).toBe(200);

      expect(response.body[0].studentId).toBe('1C001');
      expect(response.body[0].subjectId).toBe(1);
      expect(response.body[0].subjectName).toBe('English');
    })
  });

 
  test("POST /marks", async () => {
    const studentMarks = {
      studentId: "1C002",
      subjectId: 1,
      subjectName: "English",
      maxMarks: 100,
      minMarks: 40,
      marksObtained: 95
    };

    marks.addStudentMarks.mockImplementation(() => {
      mockData.push(studentMarks);
    });
    
    const res = await supertest(app)
      .post('/marks')
      .send(studentMarks)
     // console.log(res.body);
   expect(mockData).toContain(studentMarks);

  })

   


  test("GET /marks/1C001", async () => {
    let result;
    marks.readStudentMarksDetails.mockImplementation( () => {
       result = mockData.find((stud) => stud.studentId === '1C001');
    })
    const res = {
      studentId: "1C001",
      subjectId: 1,
      subjectName: "English",
      maxMarks: 100,
      minMarks: 40,
      marksObtained: 99
    };

    const response = await supertest(app).get("/marks/1C001");
      expect(result).toBeDefined();
  });


  test("Patch /marks/1C001/1", async () => {
    marks.findByIdAndUpdate.mockImplementation( () => {
       mockData.forEach((stud) => {
         if(stud.studentId==='1C001' && stud.subjectId===1){
           stud.marksObtained=100;
         }
       })
       //console.log(mockData[1].marksObtained)

    })

    await supertest(app).patch("/marks/1C009/1")
    .send({
        marksObtained: 100
    })
    .then((response) => {
      expect(response.body).toBeDefined();
     expect(mockData[0].marksObtained).toBe(100);
      
    })
  });

  
  

  test("Delete /marks/1C009/2", async () => {
    marks.removeStudentMarksData.mockImplementation( () => {
      mockData[1]=null;
     
      //console.log(mockData[1].marksObtained)

   })

    await supertest(app).delete("/marks/1C009/2")
    .then((response) => {
      expect(mockData[1]).toBeNull();
      
    })
  });

});