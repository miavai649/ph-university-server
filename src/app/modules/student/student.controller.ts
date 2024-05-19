import { Request, Response } from 'express';
import { StudentServices } from './student.service';
import studentValidationSchema from './student.validation';

const createStudent = async (req: Request, res: Response) => {
  try {
    // creating a schema validation using zod

    const { student: studentData } = req.body;

    // Validate the student data using Joi
    // const { error, value } = studentValidationSchema.validate(studentData);

    // if (error) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Something went wrong',
    //     error: error.details,
    //   });
    // }

    const zodParsedData = studentValidationSchema.parse(studentData);
    console.log('🚀 ~ createStudent ~ zodParsedData:', zodParsedData);

    const result = await StudentServices.createStudentIntoDB(zodParsedData);

    res.status(200).json({
      success: true,
      message: 'Student created successfully',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error,
    });
  }
};

const getAllStudents = async (req: Request, res: Response) => {
  try {
    const result = await StudentServices.getAllStudentsFromDB();

    res.status(200).json({
      success: true,
      message: 'Students data retrieved successfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};

const getStudent = async (req: Request, res: Response) => {
  try {
    const { studentID } = req.params;

    const result = await StudentServices.getStudentFromDB(studentID);

    res.status(200).json({
      success: true,
      message: 'Student data retrieved successfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};

export const StudentControllers = {
  createStudent,
  getAllStudents,
  getStudent,
};
