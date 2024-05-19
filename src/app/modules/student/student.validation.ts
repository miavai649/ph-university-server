import { z } from 'zod';

// Define the UserName schema
const userNameValidationSchema = z.object({
  firstName: z
    .string()
    .max(20, "First name can't be more than 20 characters")
    .refine(
      (value) => {
        const firstNameStr =
          value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        return firstNameStr === value;
      },
      { message: 'First name is not in capitalize format' },
    ),
  middleName: z.string().optional(),
  lastName: z.string().refine((value) => /^[A-Za-z]+$/.test(value), {
    message: 'Last name is not valid',
  }),
});

// Define the Guardian schema
const guardianValidationSchema = z.object({
  fatherName: z.string(),
  fatherOccupation: z.string(),
  fatherContactNo: z.string(),
  motherName: z.string(),
  motherOccupation: z.string(),
  motherContactNo: z.string(),
});

// Define the LocalGuardian schema
const localGuardianValidationSchema = z.object({
  name: z.string(),
  occupation: z.string(),
  contactNo: z.string(),
  address: z.string(),
});

// Define the Student schema
const studentValidationSchema = z.object({
  id: z.string(),
  name: userNameValidationSchema,
  gender: z.enum(['male', 'female', 'other']),
  dateOfBirth: z.string(),
  email: z.string().email({ message: 'Email is not a valid email address' }),
  contactNo: z.string(),
  emergencyContactNo: z.string(),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
  presentAddress: z.string(),
  permanentAddress: z.string(),
  guardian: guardianValidationSchema,
  localGuardian: localGuardianValidationSchema,
  profileImg: z.string().optional(),
  isActive: z.enum(['active', 'block']).default('active'),
});

export default studentValidationSchema;
