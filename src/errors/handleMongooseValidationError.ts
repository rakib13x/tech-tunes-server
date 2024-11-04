import mongoose from "mongoose";
import { TGenericErrorResponse } from "../interface/error";

const handleMongooseValidationError = (
  error: mongoose.Error.ValidationError,
): TGenericErrorResponse => {
  const errorSources = Object.values(error.errors).map(
    (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: val.path,
        message: val.message,
      };
    },
  );

  const keywords = ["already", "exists"];
  const errorMessage = Object.values(error.errors).toString().toLowerCase();

  const statusCode = keywords.some((keyword) => errorMessage.includes(keyword))
    ? 409
    : 400;

  return {
    statusCode,
    message: "Validation Error",
    errorSources,
  };
};

export default handleMongooseValidationError;
