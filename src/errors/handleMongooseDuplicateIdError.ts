import mongoose from "mongoose";
import { TErrorSources, TGenericErrorResponse } from "../interface/error";

interface MongooseDuplicateKeyError extends mongoose.Error {
  code: number;
  keyPattern: Record<string, unknown>;
  keyValue: Record<string, unknown>;
}

const handleMongooseDuplicateIdError = (
  error: MongooseDuplicateKeyError
): TGenericErrorResponse => {
  const match = error?.message?.match(/"([^"]*)"/);
  const extractedMessage = match && match[1];

  const statusCode = 400;
  const errorSources: TErrorSources = [
    {
      path: Object.keys(error?.keyPattern)[
        Object.keys(error?.keyPattern).length - 1
      ],
      message: `${extractedMessage} is already exists`,
    },
  ];

  return {
    statusCode,
    message: "Duplicate Entry",
    errorSources,
  };
};

export default handleMongooseDuplicateIdError;
