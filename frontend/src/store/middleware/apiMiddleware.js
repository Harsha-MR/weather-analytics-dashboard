/**
 * API Middleware
 * Handles async API calls with loading states
 */

import { setLoading, setError } from '../slices/weatherSlice';

const apiMiddleware = (store) => (next) => (action) => {
  // Pass through actions that don't have api metadata
  if (!action.meta?.api) {
    return next(action);
  }

  const { dispatch } = store;
  const { endpoint, method = 'GET', data, onSuccess, onError } = action.meta.api;

  // Set loading state
  dispatch(setLoading(true));

  // Make API call
  fetch(endpoint, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: data ? JSON.stringify(data) : undefined,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      return response.json();
    })
    .then((responseData) => {
      // Call success handler
      if (onSuccess) {
        dispatch(onSuccess(responseData));
      }
    })
    .catch((error) => {
      // Call error handler
      dispatch(setError(error.message));
      if (onError) {
        dispatch(onError(error));
      }
    });

  return next(action);
};

export default apiMiddleware;
