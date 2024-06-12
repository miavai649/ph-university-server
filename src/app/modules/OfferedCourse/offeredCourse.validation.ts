import { z } from 'zod';
import { Days } from './offeredCourse.constant';

const createOfferedCourseValidationSchema = z.object({
  body: z
    .object({
      semesterRegistration: z.string(),
      academicFaculty: z.string(),
      academicDepartment: z.string(),
      course: z.string(),
      faculty: z.string(),
      maxCapacity: z.number(),
      section: z.number(),
      days: z.array(z.enum([...Days] as [string, ...string[]])),
      startTime: z.string().refine(
        (time) => {
          const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
          return regex.test(time);
        },
        {
          message: 'Invalid time format , expected "HH:MM" in 24 hours format',
        },
      ),
      endTime: z.string().refine(
        (time) => {
          const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
          return regex.test(time);
        },
        {
          message: 'Invalid time format , expected "HH:MM" in 24 hours format',
        },
      ),
    })
    .refine(
      (body) => {
        const start = new Date(`2001-08-01T${body.startTime}`);
        const end = new Date(`2001-08-01T${body.endTime}`);

        return end > start;
      },
      {
        message: 'Start time should be before End time!',
      },
    ),
});

export const OfferedCourseValidations = {
  createOfferedCourseValidationSchema,
};
