import { StudentServices } from './student.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
// import studentValidationSchema from './student.validation';

// const createStudent = async (req: Request, res: Response) => {
//   try {
//     const { student: studentData } = req.body;

// Validate the student data using Joi
// const { error, value } = studentValidationSchema.validate(studentData);

// if (error) {
//   return res.status(400).json({
//     success: false,
//     message: 'Something went wrong',
//     error: error.details,
//   });
// }

// creating a schema validation using zod
// const zodParsedData = studentValidationSchema.parse(studentData);

// const result = await StudentServices.createStudentIntoDB(zodParsedData);

// res.status(200).json({
//   success: true,
//   message: 'Student created successfully',
//   data: result,
// });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (error: any) {
//     res.status(500).json({
//       success: false,
//       message: error.message || 'Something went wrong',
//       error: error,
//     });
//   }
// };

// create catchAsync function for not repeating the tryCatch code block

const getAllStudents = catchAsync(async (req, res) => {
  const result = await StudentServices.getAllStudentsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Students data retrieved successfully',
    data: result,
  });
});

const getSingleStudent = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await StudentServices.getSingleStudentFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student data retrieved successfully',
    data: result,
  });
});

const updateStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { student } = req.body;

  const result = await StudentServices.updateStudentIntoDB(id, student);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student data updated successfully',
    data: result,
  });
});

const deleteStudent = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await StudentServices.deleteStudentFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student deleted successfully',
    data: result,
  });
});

export const StudentControllers = {
  // createStudent,
  getAllStudents,
  getSingleStudent,
  deleteStudent,
  updateStudent,
};
