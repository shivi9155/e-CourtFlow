import axios from 'axios';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });

// Attach token to admin requests
API.interceptors.request.use((req) => {
  const admin = JSON.parse(localStorage.getItem('admin'));
  if (admin?.token) {
    req.headers.Authorization = `Bearer ${admin.token}`;
  }
  return req;
});

// Public endpoints - Cases
export const searchCases = (query) => API.get(`/public/cases/search?q=${query}`);
export const getAllCases = () => API.get('/public/cases');
export const getCaseById = (id) => API.get(`/public/cases/${id}`);

// Public endpoints - Judges
export const getAllJudges = () => API.get('/public/judges');
export const getJudgeById = (id) => API.get(`/public/judges/${id}`);
export const searchJudge = (name) => API.get(`/public/judges/search/${name}`);

// Public endpoints - Hearings
export const getPublicHearings = () => API.get('/public/hearings');
export const getHearingsByJudge = (judgeId) => API.get(`/public/hearings/judge/${judgeId}`);

// Public endpoints - Stats
export const getCaseStats = () => API.get('/public/stats/cases');
export const getJudgeStats = () => API.get('/public/stats/judges');
export const getHearingStats = () => API.get('/public/stats/hearings');

// Admin endpoints - Cases
export const fetchCases = () => API.get('/admin/cases');
export const createCase = (caseData) => API.post('/admin/cases', caseData);
export const updateCase = (id, caseData) => API.put(`/admin/cases/${id}`, caseData);
export const deleteCase = (id) => API.delete(`/admin/cases/${id}`);

// Admin endpoints - Judges
export const fetchJudges = () => API.get('/admin/judges');
export const createJudge = (judgeData) => API.post('/admin/judges', judgeData);
export const updateJudge = (id, judgeData) => API.put(`/admin/judges/${id}`, judgeData);
export const deleteJudge = (id) => API.delete(`/admin/judges/${id}`);

// Admin endpoints - Hearings
export const fetchHearings = () => API.get('/admin/hearings');
export const createHearing = (hearingData) => API.post('/admin/hearings', hearingData);
export const updateHearing = (id, hearingData) => API.put(`/admin/hearings/${id}`, hearingData);
export const deleteHearing = (id) => API.delete(`/admin/hearings/${id}`);