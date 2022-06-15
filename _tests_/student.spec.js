const student = require('../models/student.js')


describe("Student Model", () => {

   test("Read Students List Test", async () => {
    const Students= await student.readStudentsList();
    expect(Students).toBeDefined();
  })

  test("Read Student Details Test", async () => {
    const details = await student.readStudentDetails("2C001");
    expect(details).toEqual(expect.objectContaining({'studentId': '2C001'}));
  })

  
  test("Add Student Details Test", async() => {
    const stud = {
      "studentId": "2C002",
      "firstName": "Pn",
      "lastName": "Rao",
      "birthDate": "2007-01-15",
      "email": "pnrao@cqod.in",
      "contactNo": 9756567556
  };

  const respo= await student.addStudent(stud);
  expect(respo).toEqual(stud);
  })


   test("Update student details Test", async () => {
    const upstud = await student.findByIdAndUpdate("2C002",{'contactNo': 9095911978});
    expect(upstud).toEqual(expect.objectContaining({'contactNo': 9095911978}));
  })

   test("remove Student method Test", async ()=> {
    const delStatus = await student.removeStudent("2C002");
    expect(delStatus).not.toBeNull();
    expect(delStatus).toEqual("student removed Successfully")
  }) 
  test("remove Student method Test", async ()=> {
    const delStatus = await student.removeStudent("2C002");
    //expect(delStatus).not.toBeNull();
    //expect(delStatus).toEqual("student removed Successfully")
  }) 
})

