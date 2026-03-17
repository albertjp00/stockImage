export interface LoginDto {
  email: string;
  password: string;
}



export interface RegisterDto {
  name: string;
  phone: number;
  email: string;
  password: string;
}



export interface VerifyOtpDto {
  email: string;
  otp: string;
}


export interface ResetPasswordDto {
  email: string;
  newPassword: string;
}

export interface AddImageDto {
  userId: string;
  titles: string[];
  files: Express.Multer.File[];
}