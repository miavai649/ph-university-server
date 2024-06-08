// import { TStudent } from './student.interface';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Student } from './student.model';
import mongoose from 'mongoose';
import { User } from '../user/user.model';
import { TStudent } from './student.interface';
import QueryBuilder from '../../builder/QueryBuilder';
import { studentSearchableFields } from './student.constant';

// const createStudentIntoDB = async (studentData: TStudent) => {
// static function
//   if (await Student.isUserExists(studentData.id)) {
//     throw new Error('User already exists');
//   }

// const result = await Student.create(studentData); // built-in static method

// -------------- INSTANCE ----------------------//

// const student = new Student(studentData); //create an instance

// instance method
// if (await student.isUserExists(studentData.id)) {
//   throw new Error('User already exists!');
// }

// const result = await student.save(); // built-in instance method

// ------------------- INSTANCE ------------------------------ //

//   return result;
// };

const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
  /*
  {email: {$regex: query.searchTerm, options: 'i'}}
  {'name.firstName': {$regex: query.searchTerm, options: 'i'}} 
  {presentAddress: {$regex: query.searchTerm, options: 'i'}} 
  */

  // console.log('base query', query);

  // const queryObj = { ...query }; // copy

  // let searchTerm = '';

  // if (query?.searchTerm) {
  //   searchTerm = query?.searchTerm as string;
  // }

  // // query partial searching
  // const searchQuery = Student.find({
  //   $or: studentSearchableFields.map((field) => ({
  //     [field]: { $regex: searchTerm, $options: 'i' },
  //   })),
  // });

  // const excludedFields = ['searchTerm', 'sort', 'limit', 'page', 'field'];

  // excludedFields.forEach((field) => delete queryObj[field]);

  // const filterQuery = searchQuery
  //   .find(queryObj)
  //   .populate('admissionSemester')
  //   .populate({
  //     path: 'admissionDepartment',
  //     populate: {
  //       path: 'academicFaculty',
  //     },
  //   });

  // let sort = '-createdAt';

  // if (query.sort) {
  //   sort = query.sort as string;
  // }

  // const sortQuery = filterQuery.sort(sort);

  // let limit = 1;
  // let page = 1;
  // let skip = 0;

  // if (query.limit) {
  //   limit = Number(query.limit);
  // }

  // if (query.page) {
  //   page = Number(query.page);
  //   skip = (page - 1) * limit;
  // }

  // const paginateQuery = sortQuery.skip(skip);

  // const limitQuery = paginateQuery.limit(limit);

  // let fields = '-__v';

  // if (query.field) {
  //   fields = (query.field as string).split(',').join(' ');
  //   console.log('🚀 ~ getAllStudentsFromDB ~ fields:', fields);
  // }

  // const fieldQuery = await limitQuery.select(fields);

  // return fieldQuery;

  const studentQuery = new QueryBuilder(
    Student.find()
      .populate('admissionSemester')
      .populate({
        path: 'admissionDepartment',
        populate: {
          path: 'academicFaculty',
        },
      }),
    query,
  )
    .search(studentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await studentQuery.modelQuery;

  return result;
};

const getSingleStudentFromDB = async (id: string) => {
  const result = await Student.findOne({ id })
    .populate('admissionSemester')
    .populate({
      path: 'admissionDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });

  return result;
};

const updateStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {
  const { name, guardian, localGuardian, ...remainingStudentData } = payload;

  const modifiedStudentData: Record<string, unknown> = {
    ...remainingStudentData,
  };

  /*
  name: {
    firstName: 'Noor'    payload data
  }

  modified data
  name.firstName: 'Noor'

  */

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedStudentData[`name.${key}`] = value;
    }
  }

  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedStudentData[`guardian.${key}`] = value;
    }
  }

  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedStudentData[`localGuardian.${key}`] = value;
    }
  }

  const result = await Student.findOneAndUpdate({ id }, modifiedStudentData, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deleteStudentFromDB = async (id: string) => {
  if (!(await Student.isUserExists(id))) {
    throw new AppError(httpStatus.NOT_FOUND, 'this student not exists');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deletedUser = await User.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user');
    }

    const deletedStudent = await Student.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student');
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedStudent;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error('Failed to delete student');
  }
};

export const StudentServices = {
  // createStudentIntoDB,
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
  updateStudentIntoDB,
};
