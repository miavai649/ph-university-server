import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { AuthValidation } from './Auth.validation';
import { AuthControllers } from './Auth.controller';

const router = express.Router();

router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.loginUser,
);

export const AuthRoutes = router;
