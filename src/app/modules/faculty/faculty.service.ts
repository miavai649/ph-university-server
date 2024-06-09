import QueryBuilder from '../../builder/QueryBuilder';
import { FacultySearchableFields } from './faculty.constant';
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

export const FacultyServices = {
  getAllFacultyFromDb,
  getSingleFacultyFromDb,
};
