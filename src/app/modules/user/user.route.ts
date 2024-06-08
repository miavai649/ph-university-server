import express from 'express';
import { UserControllers } from './user.controller';
import validateRequest from '../../middleware/validateRequest';
import { studentValidations } from '../student/student.validation';
import { facultyValidation } from '../faculty/faculty.validation';

const router = express.Router();

router.post(
  '/create-student',
  validateRequest(studentValidations.createStudentValidationSchema),
  UserControllers.createStudent,
);

router.post(
  '/create-faculty',
  validateRequest(facultyValidation.createFacultyValidationSchema),
  UserControllers.createFaculty,
);

export const UserRoutes = router;
