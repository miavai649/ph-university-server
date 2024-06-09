import express from 'express';
import { FacultyControllers } from './faculty.controller';
import validateRequest from '../../middleware/validateRequest';
import { facultyValidation } from './faculty.validation';

const router = express.Router();

router.get('/', FacultyControllers.getAllFaculty);
router.get('/:id', FacultyControllers.getSingleFaculty);
router.patch(
  '/:id',
  validateRequest(facultyValidation.updateFacultyValidationSchema),
  FacultyControllers.updateFaculty,
);

export const FacultyRoutes = router;
