/**
 * Global error handler middleware.
 * Ensures consistent JSON responses and never leaks stack traces or database internals.
 */
export function errorHandler(err, req, res, next) {
  console.error(`[Server Error] ${req.method} ${req.originalUrl}:`, err.message);

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || "An unexpected internal server error occurred.";

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors).map(val => val.message).join(", ");
  }

  if (err.code === 11000) {
    statusCode = 400;
    message = "An account with this email address already exists.";
  }

  res.status(statusCode).json({
    success: false,
    message,
    status: statusCode
  });
}
