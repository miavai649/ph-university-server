/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import config from '../../config';
import AppError from '../../errors/AppError';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import {
  generateAdminId,
  generateFacultyId,
  generateStudentId,
} from './user.utils';
import mongoose, { Error } from 'mongoose';
import { TFaculty } from '../faculty/faculty.interface';
import { Faculty } from '../faculty/faculty.model';
import { TAdmin } from '../admin/admin.interface';
import { Admin } from '../admin/admin.model';
import jwt, { JwtPayload, verify } from 'jsonwebtoken';
import { verifyToken } from '../Auth/Auth.utils';
import { USER_ROLE } from './user.constant';

const createStudentIntoDB = async (password: string, payload: TStudent) => {
  // create a user object
  const userData: Partial<TUser> = {};

  // if password is not given, use default password
  userData.password = password || config.default_password;

  // set student role
  userData.role = 'student';

  // find academic semester info
  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester,
  );

  if (!admissionSemester) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid admission semester id');
  }

  //set student generated id
  userData.id = await generateStudentId(admissionSemester);

  // set student email
  userData.email = payload.email;

  const session = await mongoose.startSession();

  try {
    await session.startTransaction();

    const newUser = await User.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create new user');
    }

    // setting user id and user reference id in the student collection
    payload.id = newUser[0]?.id;
    payload.user = newUser[0]?._id;

    // create student
    const newStudent = await Student.create([payload], { session });

    if (!newStudent.length) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to create new student',
      );
    }

    await session.commitTransaction();
    await session.endSession();

    return newStudent;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};

const createFacultyIntoDb = async (password: string, payload: TFaculty) => {
  const userData: Partial<TUser> = {};

  // setting user data
  userData.password = password || config.default_password;
  userData.role = 'faculty';
  userData.id = await generateFacultyId();
  userData.email = payload.email;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const newUser = await User.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create new user');
    }

    // setting user id and user reference id in the faculty collection
    payload.id = newUser[0]?.id;
    payload.user = newUser[0]?._id;

    const newFaculty = await Faculty.create([payload], { session });

    if (!newFaculty.length) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to create new faculty',
      );
    }

    await session.commitTransaction();
    await session.endSession();

    return newFaculty;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};

const createAdminIntoDb = async (password: string, payload: TAdmin) => {
  const userData: Partial<TUser> = {};

  // setting user data
  userData.password = password || config.default_password;
  userData.role = 'admin';
  userData.id = await generateAdminId();
  userData.email = payload.email;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const newUser = await User.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create a new user');
    }

    payload.id = newUser[0]?.id;
    payload.user = newUser[0]?._id;

    const newAdmin = await Admin.create([payload], { session });

    if (!newAdmin.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create new admin');
    }

    await session.commitTransaction();
    await session.endSession();

    return newAdmin;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};

const getMe = async (token: string) => {
  console.log('🚀 ~ getMe ~ token:', token);
  // check if the token is valid or not
  const decoded = verifyToken(token);

  const { userId, role } = decoded;

  let result = null;

  if (role === USER_ROLE.admin) {
    result = await Admin.findOne({ id: userId });
  }
  if (role === USER_ROLE.faculty) {
    result = await Faculty.findOne({ id: userId });
  }
  if (role === USER_ROLE.student) {
    result = await Student.findOne({ id: userId });
  }

  return result;
};

export const UserServices = {
  createStudentIntoDB,
  createFacultyIntoDb,
  createAdminIntoDb,
  getMe,
};
