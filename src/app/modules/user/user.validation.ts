import { z } from 'zod';

const userValidationSchema = z.object({
  password: z
    .string()
    .max(20, 'Password can not be more then 20 characters')
    .optional(),
});

export const UserValidation = {
  userValidationSchema,
};
