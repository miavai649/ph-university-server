import express from 'express';
import { AcademicSemesterControllers } from './academicSemester.controller';
import validateRequest from '../../middleware/validateRequest';
import { academicSemesterValidation } from './academicSemester.validation';

const router = express.Router();

router.post(
  '/create-academic-semester',
  validateRequest(
    academicSemesterValidation.createAcademicSemesterValidationSchema,
  ),
  AcademicSemesterControllers.createAcademicSemester,
);
router.get(
  '/create-academic-semester',
  AcademicSemesterControllers.getAllAcademicSemester,
);
router.get(
  '/create-academic-semester/:academicSemesterID',
  AcademicSemesterControllers.getSingleAcademicSemester,
);
router.patch(
  '/create-academic-semester/:academicSemesterID',
  validateRequest(
    academicSemesterValidation.updateAcademicSemesterValidationSchema,
  ),
  AcademicSemesterControllers.updateAcademicSemester,
);

export const AcademicSemesterRoutes = router;
