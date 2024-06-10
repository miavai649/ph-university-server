import express from 'express';
import { CourseControllers } from './course.controller';
import validateRequest from '../../middleware/validateRequest';
import { CourseValidation } from './course.validation';

const router = express.Router();

router.post(
  '/create-course',
  validateRequest(CourseValidation.createCourseValidationSchema),
  CourseControllers.createCourse,
);
router.get('/', CourseControllers.getAllCourse);
router.get('/:id', CourseControllers.getSingleCourse);
router.patch('/:id', CourseControllers.updateCourse);
router.delete('/:id', CourseControllers.deleteCourse);
router.put(
  '/:courseId/assign-faculty',
  CourseControllers.assignFacultyWithCourse,
);

export const CourseRoutes = router;
