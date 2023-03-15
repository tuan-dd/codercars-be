const utilsHelper = {};

utilsHelper.sendResponse = function (
   res,
   status,
   success,
   data,
   errors,
   message,
) {
   const response = {};
   if (success) response.success = success;
   if (data) response.result = { ...data };
   if (errors) response.errors = errors;
   if (message) response.message = message;
   return res.status(status).json(response);
};
// utilsHelper.AppError.Error
class AppError extends Error {
   constructor(statusCode, message, errorType) {
      super(message);
      this.statusCode = statusCode;
      this.errorType = errorType;
      // all errors using this class are operational errors.
      this.isOperational = true;
      // create a stack trace for debugging (Error obj, void obj to avoid stack pollution)
      Error.captureStackTrace(this, this.constructor);
   }
}
utilsHelper.AppError = AppError;

module.exports = utilsHelper;
