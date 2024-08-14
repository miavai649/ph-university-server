import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export type TUser = {
  id: string;
  email: string;
  password: string;
  passwordChangedAt?: Date;
  needsPasswordChange: boolean;
  role: 'admin' | 'faculty' | 'student';
  status: 'in-progress' | 'blocked';
  isDeleted: boolean;
};

export type TUserRole = keyof typeof USER_ROLE;

export interface UserModel extends Model<TUser> {
  isUserExistsByCustomId(id: string): Promise<TUser | null>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
  isJwtIssuedBeforePasswordChange(
    passwordChangedAt: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}
