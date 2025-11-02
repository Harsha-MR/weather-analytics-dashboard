import { STATUS_CODES } from '../config/constants.js';

/**
 * Standard success response
 */
export const successResponse = (res, data, message = 'Success', statusCode = STATUS_CODES.OK) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Standard error response
 */
export const errorResponse = (res, message = 'Error', statusCode = STATUS_CODES.INTERNAL_SERVER_ERROR, errors = null) => {
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString(),
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

/**
 * Paginated response
 */
export const paginatedResponse = (res, data, page, limit, total, message = 'Success') => {
  return res.status(STATUS_CODES.OK).json({
    success: true,
    message,
    data,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    },
    timestamp: new Date().toISOString(),
  });
};

export default {
  successResponse,
  errorResponse,
  paginatedResponse,
};
