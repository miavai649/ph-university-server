import { NextFunction, Request, Response } from 'express';
import { StudentServices } from './student.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
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

const getAllStudents = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await StudentServices.getAllStudentsFromDB();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Students data retrieved successfully',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { studentID } = req.params;

    const result = await StudentServices.getStudentFromDB(studentID);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student data retrieved successfully',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const deleteStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { studentID } = req.params;

    const result = await StudentServices.deleteStudentFromDB(studentID);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student deleted successfully',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const StudentControllers = {
  // createStudent,
  getAllStudents,
  getStudent,
  deleteStudent,
};
