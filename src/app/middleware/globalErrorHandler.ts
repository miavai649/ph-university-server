/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { TErrorSources } from '../interface/error';
import handleZodError from '../errors/handleZodError';
import config from '../config';
import handleValidationError from '../errors/handleValidationError';
import handleCastError from '../errors/handleCastError';
import handleDuplicateError from '../errors/handleDuplicateError';
import AppError from '../errors/AppError';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // settings default values
  let statusCode = 500;
  let message = 'Something went wrong';
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
  } else if (err?.name === 'ValidationError') {
    const modifiedError = handleValidationError(err);
    statusCode = modifiedError.statusCode;
    message = modifiedError.message;
    errorSources = modifiedError.errorSources;
  } else if (err?.name === 'CastError') {
    const modifiedError = handleCastError(err);
    statusCode = modifiedError.statusCode;
    message = modifiedError.message;
    errorSources = modifiedError.errorSources;
  } else if (err?.code === 11000) {
    const modifiedError = handleDuplicateError(err);
    statusCode = modifiedError.statusCode;
    message = modifiedError.message;
    errorSources = modifiedError.errorSources;
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorSources = [
      {
        path: '',
        message: err.message,
      },
    ];
  } else if (err instanceof Error) {
    message = err.message;
    errorSources = [
      {
        path: '',
        message: err.message,
      },
    ];
  }

  // ultimate return
  return res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    err,
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
