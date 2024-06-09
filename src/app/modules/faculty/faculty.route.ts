import express from 'express';
import { FacultyControllers } from './faculty.controller';

const router = express.Router();

router.get('/', FacultyControllers.getAllFaculty);

export const FacultyRoutes = router;
