import { apiClient } from './apiClient';
import { API_ROUTES } from './apiRoutes';

// Wrapper API Auth
export const authService = {
  initInscription: (payload) => apiClient.post(API_ROUTES.auth.initInscription, payload),
  verifyOtp: (payload) => apiClient.post(API_ROUTES.auth.verifyOtp, payload),
  finaliserInscription: (payload) => apiClient.post(API_ROUTES.auth.finaliserInscription, payload),
  login: (payload) => apiClient.post(API_ROUTES.auth.login, payload),
};
