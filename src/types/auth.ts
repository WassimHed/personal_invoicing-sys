import { ResponseUserDto } from './user';

export interface SigninPayload {
  usernameOrEmail: string;
  password: string;
}

export interface SignupPayload {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date | string;
  profilePictureId?: number;
  phone?: string;
  cin?: string;
  bio?: string;
  gender?: string;
  isPrivate?: boolean;
}

export interface ResponseSigninDto {
  user: ResponseUserDto;
  access_token: string;
  refresh_token: string;
}

export interface ResponseSignupDto {
  user: ResponseUserDto;
}

export interface SigninPayload {
  usernameOrEmail: string;
  password: string;
}


