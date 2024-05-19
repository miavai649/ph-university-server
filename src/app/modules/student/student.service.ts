import { TStudent } from './student.interface';
import { Student } from './student.model';

const createStudentIntoDB = async (studentData: TStudent) => {
  // const result = await Student.create(studentData); // built-in static method

  // -------------- INSTANCE ----------------------//

  const student = new Student(studentData); //create an instance

  // creating a custom instance method
  if (await student.isUserExists(studentData.id)) {
    throw new Error('User already exists!');
  }

  const result = await student.save(); // built-in instance method

  // ------------------- INSTANCE ------------------------------ //

  return result;
};

const getAllStudentsFromDB = async () => {
  const result = await Student.find();
  return result;
};

const getStudentFromDB = async (id: string) => {
  const result = await Student.findOne({ id });

  return result;
};

export const StudentServices = {
  createStudentIntoDB,
  getAllStudentsFromDB,
  getStudentFromDB,
};
