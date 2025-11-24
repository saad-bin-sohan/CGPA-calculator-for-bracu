import { User } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

const request = async (path: string, options: RequestInit = {}) => {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Request failed');
  }
  return res.json();
};

export const api = {
  getDepartments: () => request('/departments'),
  getCourses: (query = '') => request(`/courses/search?query=${encodeURIComponent(query)}`),
  getGradeScale: () => request('/grade-scale'),
  getSettings: () => request('/settings'),
  register: (payload: any) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload: any) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  updateProfile: (payload: any) =>
    request('/auth/profile', { method: 'PUT', body: JSON.stringify(payload) }),
  adminLogin: (payload: any) =>
    request('/admin/login', { method: 'POST', body: JSON.stringify(payload) }),
  me: async (): Promise<User> => {
    const data = await request('/auth/me');
    return data.user as User;
  },
  semesters: {
    list: () => request('/semesters'),
    create: (payload: any) =>
      request('/semesters', { method: 'POST', body: JSON.stringify(payload) }),
    update: (id: string, payload: any) =>
      request(`/semesters/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
    delete: (id: string) => request(`/semesters/${id}`, { method: 'DELETE' })
  },
  admin: {
    students: () => request('/students'),
    studentProfile: (id: string) => request(`/students/${id}`),
    gradeScale: {
      create: (payload: any) =>
        request('/grade-scale', { method: 'POST', body: JSON.stringify(payload) }),
      update: (id: string, payload: any) =>
        request(`/grade-scale/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
      remove: (id: string) => request(`/grade-scale/${id}`, { method: 'DELETE' })
    },
    departments: {
      create: (payload: any) =>
        request('/departments', { method: 'POST', body: JSON.stringify(payload) }),
      update: (id: string, payload: any) =>
        request(`/departments/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
      remove: (id: string) => request(`/departments/${id}`, { method: 'DELETE' })
    },
    courses: {
      create: (payload: any) => request('/courses', { method: 'POST', body: JSON.stringify(payload) }),
      update: (id: string, payload: any) =>
        request(`/courses/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
      remove: (id: string) => request(`/courses/${id}`, { method: 'DELETE' })
    },
    settings: (payload: any) => request('/settings', { method: 'PUT', body: JSON.stringify(payload) })
  }
};
