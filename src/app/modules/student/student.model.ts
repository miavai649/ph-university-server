import { Schema, model } from 'mongoose';
import {
  TGuardian,
  TLocalGuardian,
  TStudent,
  StudentModel,
  TUserName,
} from './student.interface';
import bcrypt from 'bcrypt';
import config from '../../config';

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    // required: [true, 'First name required'],
    // trim: true,
    // maxlength: [20, "First name can't be more then 20 characters"],
    // validate: {
    //   validator: function (value: string) {
    //     const firstNameStr =
    //       value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

    //     return firstNameStr === value;
    //   },
    //   message: '{VALUE} is not in capitalize format',
    // },
  },
  middleName: {
    type: String,
    // trim: true,
  },
  lastName: {
    type: String,
    // trim: true,
    // required: [true, 'Last name required'],
    // validate: {
    //   validator: (value: string) => validator.isAlpha(value),
    //   message: '{VALUE} is not valid',
    // },
  },
});

const guardianSchema = new Schema<TGuardian>({
  fatherName: {
    type: String,
    // required: [true, 'Father name required'],
  },
  fatherOccupation: {
    type: String,
    // required: [true, 'Father occupation required'],
  },
  fatherContactNo: {
    type: String,
    // required: [true, 'Father contact number required'],
  },
  motherName: {
    type: String,
    // required: [true, 'Mother name required'],
  },
  motherOccupation: {
    type: String,
    // required: [true, 'Mother occupation required'],
  },
  motherContactNo: {
    type: String,
    // required: [true, 'Mother contact number required'],
  },
});

const localGuardianSchema = new Schema<TLocalGuardian>({
  name: {
    type: String,
    // required: [true, 'Local guardian name required'],
  },
  occupation: {
    type: String,
    // required: [true, 'Local guardian occupation required'],
  },
  contactNo: {
    type: String,
    // required: [true, 'Local guardian contact number required'],
  },
  address: {
    type: String,
    // required: [true, 'Local guardian address required'],
  },
});

const studentSchema = new Schema<TStudent, StudentModel>({
  id: {
    type: String,
    // required: true,
    // unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    maxlength: [20, 'Password can not be more then 20 character'],
  },
  name: {
    type: userNameSchema,
    // required: [true, 'Name is require'],
  },
  gender: {
    type: String,
    // enum: {
    //   values: ['male', 'female', 'other'],
    //   message: '{VALUE} is not valid',
    // },
    // required: [true, 'Gender field is required'],
  },
  dateOfBirth: {
    type: String,
    // required: [true, 'Date of birth is required'],
  },
  email: {
    type: String,
    // required: [true, 'Email is required'],
    // unique: true,
    // validate: {
    //   validator: (value: string) => validator.isEmail(value),
    //   message: '{VALUE} is not a valid email address',
    // },
  },
  contactNo: {
    type: String,
    // required: [true, 'Contact number is required'],
  },
  emergencyContactNo: {
    type: String,
    // required: [true, 'Emergency contact number is required'],
  },
  bloodGroup: {
    type: String,
    // enum: {
    //   values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    //   message: '{VALUE} is not valid',
    // },
    // required: [true, 'Blood group is required'],
  },
  presentAddress: {
    type: String,
    // required: [true, 'Present address is required'],
  },
  permanentAddress: {
    type: String,
    // required: [true, 'Permanent address is required'],
  },
  guardian: {
    type: guardianSchema,
    // required: [true, 'Guardian details is required'],
  },
  localGuardian: {
    type: localGuardianSchema,
    // required: [true, 'Local Guardian details is required'],
  },
  profileImg: {
    type: String,
  },
  isActive: {
    type: String,
    // enum: ['active', 'block'],
    // default: 'active',
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

// ------------------------ Document middleware start ----------------------------- //

// pre save middleware / hook : will work on create() or save()
studentSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

// post save middleware / hook : will work on create() or save()
studentSchema.post('save', function (doc, next) {
  doc.password = ' ';

  next();
});

// ------------------------ Document middleware end ----------------------------- //

// ------------------------ Query middleware start --------------------------------- //

studentSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });

  next();
});

studentSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });

  next();
});

// ------------------------- Query middleware end ---------------------------------- //

// -------------------------- aggregation middleware start --------------------------- \\

studentSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

// -------------------------- aggregation middleware end ------------------------------ \\

// ------------ for static function ---------------- //
studentSchema.static('isUserExists', async function isUserExists(id: string) {
  const existingUser = await Student.findOne({ id });
  return existingUser;
});

// ----------- for instance methods -------------- //

// studentSchema.methods.isUserExists = async function (id: string) {
//   const existingUser = await Student.findOne({ id });
//   return existingUser;
// };

export const Student = model<TStudent, StudentModel>('Student', studentSchema);
