import express from 'express';
import { FacultyControllers } from './faculty.controller';
import validateRequest from '../../middleware/validateRequest';
import { facultyValidation } from './faculty.validation';
import auth from '../../middleware/auth';

const router = express.Router();

router.get('/', auth(), FacultyControllers.getAllFaculty);
router.get('/:id', FacultyControllers.getSingleFaculty);
router.patch(
  '/:id',
  validateRequest(facultyValidation.updateFacultyValidationSchema),
  FacultyControllers.updateFaculty,
);
router.delete('/:id', FacultyControllers.deleteFaculty);

export const FacultyRoutes = router;
