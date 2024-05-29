import { Schema, model } from 'mongoose';
import { TAcademicSemester } from './academicSemester.interface';

const academicSemesterSchema = new Schema({
  name: {
    type: String,
    enum: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    required: true,
  },
  code: {
    type: String,
    enum: ['01', '02', '03'],
    required: true,
  },
  year: {
    type: Date,
    required: true,
  },
  startMonth: {
    type: String,
    required: true,
  },
  endMonth: {
    type: String,
    required: true,
  },
});

export const AcademicSemester = model<TAcademicSemester>(
  'AcademicSemester',
  academicSemesterSchema,
);
