/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { TErrorSources } from '../interface/error';
import handleZodError from '../errors/handleZodError';
import config from '../config';
import AppError from '../errors/AppError';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // settings default values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong';
  let errorSources: TErrorSources = [
    {
      path: '',
      message: 'Something went wrong',
    },
  ];

  if (err instanceof ZodError) {
    const modifiedError = handleZodError(err);
    statusCode = modifiedError.statusCode;
    message = modifiedError.message;
    errorSources = modifiedError.errorSources;
  }

  // ultimate return
  return res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: config.NODE_ENV === 'development' ? err?.stack : null,
  });
};

export default globalErrorHandler;

// pattern
/*
success 
message
errorSources: [
  {
    path: '',
    message: ''
  }
]
stack 
*/
