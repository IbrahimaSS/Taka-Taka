import { apiClient } from './apiClient';
import { API_ROUTES } from './apiRoutes';

// Wrapper API Trajets
export const tripService = {
  list: (params) => apiClient.get(API_ROUTES.trips.list, { params }),
  details: (id) => apiClient.get(API_ROUTES.trips.details(id)),
  create: (payload) => apiClient.post(API_ROUTES.trips.create, payload),
  accept: (id) => apiClient.post(API_ROUTES.trips.accept(id)),
  reject: (id, payload) => apiClient.post(API_ROUTES.trips.reject(id), payload),
  arrive: (id) => apiClient.post(API_ROUTES.trips.arrive(id)),
  start: (id) => apiClient.post(API_ROUTES.trips.start(id)),
  complete: (id) => apiClient.post(API_ROUTES.trips.complete(id)),
  cancel: (id, payload) => apiClient.post(API_ROUTES.trips.cancel(id), payload),
  rate: (id, payload) => apiClient.post(API_ROUTES.trips.rate(id), payload),
};
