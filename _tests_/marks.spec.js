
const app = require("../server");
const supertest = require("supertest");



describe('marks api test cases', () => {

  test("GET /marks", async () => {
    await supertest(app).get("/marks")
    .then((response) => {
     // console.log(response.status);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.status).toBe(200);
    })
  });

  test("POST /marks", async () => {
    const res = await supertest(app)
      .post('/marks')
      .send({
        studentId: "1C009",
        subjectId: 1,
        subjectName: "English",
        maxMarks: 100,
        minMarks: 40,
        marksObtained: 99
      })
    expect(res.statusCode).toEqual(201)
   // expect(res.body).toHaveProperty('post')
   expect(res.body).toHaveProperty('studentId')

  })

  test("GET /marks/1C001", async () => {
    await supertest(app).get("/marks/1C001")
    .then((response) => {
     // console.log(response.body);
     expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    })
  });

  test("Patch /marks/1C001", async () => {
    await supertest(app).patch("/marks/1C009/1")
    .send({
        marksObtained: 99
    })
    .then((response) => {
     // console.log(response.body);
      expect(response.body).toBeDefined();
      expect(response.status).toBe(200);
      
    })
  });

  test("Delete /marks/1C009/1", async () => {
    await supertest(app).delete("/marks/1C009/1")
    .then((response) => {
      console.log(response.body);
      expect(response.body).toBeDefined();
      expect(response.status).toBe(200);
      
    })
  });


});