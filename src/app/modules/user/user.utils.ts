import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { User } from './user.model';

const findLastStudentId = async (year: string, code: string) => {
  const regex = new RegExp(`^${year}${code}`);

  const lastStudent = await User.findOne(
    { id: { $regex: regex }, role: 'student' },
    {
      id: 1,
      _id: 0,
    },
    {
      sort: { createdAt: -1 },
    },
  ).lean();
  return lastStudent?.id ? lastStudent?.id : undefined;
};

// generating student id (year + semesterCode + 4 digit number)
export const generateStudentId = async (payload: TAcademicSemester) => {
  let currentId = (0).toString();
  const currentStudentSemesterYear = payload.year;
  const currentStudentSemesterCode = payload.code;

  // 2030 01 0001
  const lastStudentId = await findLastStudentId(
    currentStudentSemesterYear,
    currentStudentSemesterCode,
  );
  const lastStudentSemesterYear = lastStudentId?.substring(0, 4);
  const lastStudentSemesterCode = lastStudentId?.substring(4, 6);

  if (
    lastStudentId &&
    lastStudentSemesterCode === currentStudentSemesterCode &&
    lastStudentSemesterYear === currentStudentSemesterYear
  ) {
    currentId = lastStudentId?.substring(6);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

  incrementId = `${payload.year}${payload.code}${incrementId}`;
  return incrementId;
};

// Faculty ID
export const findLastFacultyId = async () => {
  const lastFaculty = await User.findOne(
    {
      role: 'faculty',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastFaculty?.id ? lastFaculty.id.substring(2) : undefined;
};

export const generateFacultyId = async () => {
  let currentId = (0).toString();
  const lastFacultyId = await findLastFacultyId();

  if (lastFacultyId) {
    currentId = lastFacultyId.substring(2);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

  incrementId = `F-${incrementId}`;

  return incrementId;
};

const findLastAdminId = async () => {
  const lastAdmin = await User.findOne(
    {
      role: 'admin',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastAdmin?.id ? lastAdmin.id.substring(2) : undefined;
};

export const generateAdminId = async () => {
  let currentId = (0).toString();

  const lastAdminId = await findLastAdminId();

  if (lastAdminId) {
    currentId = lastAdminId.substring(2);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

  incrementId = `A-${incrementId}`;

  return incrementId;
};
