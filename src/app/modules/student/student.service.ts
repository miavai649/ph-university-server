// import { TStudent } from './student.interface';
import { Student } from './student.model';

// const createStudentIntoDB = async (studentData: TStudent) => {
//   // static function
//   if (await Student.isUserExists(studentData.id)) {
//     throw new Error('User already exists');
//   }

// const result = await Student.create(studentData); // built-in static method

// -------------- INSTANCE ----------------------//

// const student = new Student(studentData); //create an instance

// instance method
// if (await student.isUserExists(studentData.id)) {
//   throw new Error('User already exists!');
// }

// const result = await student.save(); // built-in instance method

// ------------------- INSTANCE ------------------------------ //

//   return result;
// };

const getAllStudentsFromDB = async () => {
  const result = await Student.find()
    .populate('admissionSemester')
    .populate({
      path: 'admissionDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  return result;
};

const getSingleStudentFromDB = async (id: string) => {
  const result = await Student.findById(id)
    .populate('admissionSemester')
    .populate({
      path: 'admissionDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });

  return result;
};

const deleteStudentFromDB = async (id: string) => {
  const result = await Student.updateOne({ id }, { isDeleted: true });
  return result;
};

export const StudentServices = {
  // createStudentIntoDB,
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
};
