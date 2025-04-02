import { ValidationError as ExternalValidationErrorClass } from "class-validator";
import CustomError from "./CustomError";

export default class ValidationError extends CustomError {

  validationErrors: ExternalValidationErrorClass[];

  constructor({
    message,
    statusCode,
    validationErrors
  }: {
    message: string;
    statusCode: number;
    validationErrors: ExternalValidationErrorClass[]
  }) {
    super({ message, statusCode });
    this.validationErrors = validationErrors;
  }

}
