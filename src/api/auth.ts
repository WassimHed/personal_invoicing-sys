import { ResponseSigninDto, ResponseSignupDto, SigninPayload, SignupPayload } from '@/types';
import axios from './axios';

const signIn = async (payload: SigninPayload): Promise<ResponseSigninDto> => {
  const response = await axios.post<ResponseSigninDto>('/auth/sign-in', payload);
  return response.data;
};

const signUp = async (payload: SignupPayload): Promise<ResponseSignupDto> => {
  const response = await axios.post('/auth/register', {
    username: payload.username,
    email: payload.email,
    password: payload.password,
    firstName: payload.firstName,
    lastName: payload.lastName,
    dateOfBirth: payload.dateOfBirth,
    profilePictureId: payload.profilePictureId,
    phone: payload.phone,
    cin: payload.cin,
    bio: payload.bio,
    gender: payload.gender,
    isPrivate: payload.isPrivate
  });
  return response.data;
};

const resetPassword = async (token: string, password: string): Promise<{ message: string }> => {
  const response = await axios.post<{ message: string }>(`/auth/reset-password/${token}`, {
    password
  });
  return response.data;
};

const forgetPassword = async (payload: { usernameOrEmail: string }): Promise<{ message: string }> => {
  const response = await axios.post<{ message: string }>('/auth/forgot-password', payload);
  return response.data;
};

export const auth = {
  signIn,
  signUp,
  resetPassword,
  forgetPassword
};
