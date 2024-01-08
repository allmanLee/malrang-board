import axios, { type AxiosResponse } from 'axios';
import { type User,  type UserId } from '../types/users';

const API_URL = 'http://localhost:8000'; // Replace with your API URL

// Define your API endpoints here
const apiEndpoints = {
  users: '/users',
  user: (userId: string) => `/users/${userId}`,
  userPermissions: (userId: string) => `/users/${userId}/permissions`,
};

// Create an instance of Axios with the base URL
const api = axios.create({
  baseURL: API_URL,
});

// Define your API methods here (get, post, put, delete, etc)
const get = async <T>(url: string): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await api.get(url);
    return response.data;
  } catch (error) {
    console.error(error)
    throw error;
  }
};

const post = async <T>(url: string, data: any): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await api.post(url, data);
    return response.data;
  } catch (error) {
    console.error(error)
    throw error;
  }
};

const put = async <T>(url: string, data: any): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await api.put(url, data);
    return response.data;
  } catch (error) {
    console.error(error)
    throw error;
  }
};

const del = async <T>(url: string): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await api.delete(url);
    return response.data;
  } catch (error) {
    console.error(error)
    throw error;
  }
};

const userApi = {

  // 사용자 (CRUD) 및 로그인
  getUsers: () => get<User[]>(apiEndpoints.users),
  getUser: (userId: UserId) => get<User>(apiEndpoints.user(userId)),
  createUser: (userData: User) => post<User>(apiEndpoints.users, userData),
  updateUser: (userId: UserId, userData: User) => put<User>(apiEndpoints.user(userId), userData),
  deleteUser: (userId: UserId) => del<User>(apiEndpoints.user(userId)),
  login: (userData: {email: string, password: string}) => post(`${apiEndpoints.users}/login`, userData),

  // 사용자 퍼미션 (RU)
  getUserPermissions: (userId: UserId) => get<string[]>(apiEndpoints.userPermissions(userId)),
  updateUserPermissions: (userId: UserId, permissions: string[]) => put<string[]>(apiEndpoints.userPermissions(userId), permissions)
};

// 모듈 
export const API = {
  ...userApi
};

export default API
