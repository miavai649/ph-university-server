/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { FacultySearchableFields } from './faculty.constant';
import { TFaculty } from './faculty.interface';
import { Faculty } from './faculty.model';
import { User } from '../user/user.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const getAllFacultyFromDb = async (query: Record<string, unknown>) => {
  const facultyQuery = new QueryBuilder(
    Faculty.find().populate('academicDepartment'),
    query,
  )
    .search(FacultySearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await facultyQuery.modelQuery;
  return result;
};

const getSingleFacultyFromDb = async (id: string) => {
  const result = await Faculty.findById(id).populate('academicDepartment');
  return result;
};

const updateFacultyIntoDb = async (id: string, payload: Partial<TFaculty>) => {
  /*
  name: {
    firstName: 'Noor'    payload data
  }

  modified data
  name.firstName: 'Noor'

  */

  const { name, ...remainingFacultyData } = payload;

  const modifiedFacultyData: Record<string, unknown> = {
    ...remainingFacultyData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedFacultyData[`name.${key}`] = value;
    }
  }

  const result = await Faculty.findByIdAndUpdate(id, modifiedFacultyData, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deleteFacultyFromDb = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deleteFaculty = await Faculty.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deleteFaculty) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete faculty');
    }

    const userId = deleteFaculty?.user;

    const deleteUser = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deleteUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user');
    }

    await session.commitTransaction();
    await session.endSession();

    return deleteFaculty;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

export const FacultyServices = {
  getAllFacultyFromDb,
  getSingleFacultyFromDb,
  updateFacultyIntoDb,
  deleteFacultyFromDb,
};
