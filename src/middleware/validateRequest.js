const Joi = require("joi");
const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");

/**
 * Generic validation middleware using Joi.
 * Automatically handles async errors using catchAsync.
 *
 * @param {Joi.Schema} schema - Joi validation schema
 * @param {"body"|"params"|"query"} [property="body"]
 */
const validateRequest = (schema, property = "body") =>
  catchAsync(async (req, res, next) => {
    const { error } = schema.validate(req[property], {
      abortEarly: false, // collect all errors
      stripUnknown: true, // remove extra fields not in schema
    });

    if (error) {
      const message = error.details.map((d) => d.message).join(", ");
      return next(new appError(`Validation Error: ${message}`, 400));
    }

    // ✅ Replace request data with sanitized version
    req[property] = schema.validate(req[property], { stripUnknown: true }).value;

    next();
  });

module.exports = validateRequest;