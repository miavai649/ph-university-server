import QueryBuilder from '../../builder/QueryBuilder';
import { FacultySearchableFields } from './faculty.constant';
import { TFaculty } from './faculty.interface';
import { Faculty } from './faculty.model';

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
  const result = await Faculty.findOne({ id }).populate('academicDepartment');
  return result;
};

const updateFacultyIntoDb = async (id: string, payload: Partial<TFaculty>) => {
  console.log('🚀 ~ updateFacultyIntoDb ~ payload:', payload);
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
  console.log(
    '🚀 ~ updateFacultyIntoDb ~ modifiedFacultyData:',
    modifiedFacultyData,
  );

  const result = await Faculty.findByIdAndUpdate(id, modifiedFacultyData, {
    new: true,
    runValidators: true,
  });

  return result;
};

export const FacultyServices = {
  getAllFacultyFromDb,
  getSingleFacultyFromDb,
  updateFacultyIntoDb,
};
