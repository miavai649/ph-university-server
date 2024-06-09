import express from 'express';
import { AdminControllers } from './admin.controller';
import validateRequest from '../../middleware/validateRequest';
import { adminValidations } from './admin.validation';

const router = express.Router();

router.get('/', AdminControllers.getAllAdmin);
router.get('/:id', AdminControllers.getSingleAdmin);
router.patch(
  '/:id',
  validateRequest(adminValidations.updateAdminValidationSchema),
  AdminControllers.updateAdmin,
);

router.delete('/:id', AdminControllers.deleteAdmin);

export const AdminRoutes = router;
