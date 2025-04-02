import { ValidationError } from "class-validator";

export interface CustomErrorResponse {
  error: {
    message: string;
    statusCode: number;
    validationErrors?: ValidationError[]
  }
}