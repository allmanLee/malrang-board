import axios, { type AxiosResponse } from 'axios';
import type { UserId,ProjectId,  } from '../types/users.type';
import type { Project } from '../types/projects.type';
import type { ProjectRequestDto } from '../types/dto/project.dto.type';
import type { UserRequestDto } from '../types/users.type';
const API_URL = 'http://localhost:8000'; // Replace with your API URL

// Define your API endpoints here
const apiEndpoints = {
  users: '/users',
  user: (userId: string) => `/users/${userId}`,
  userPermissions: (userId: string) => `/users/${userId}/permissions`,

  projects: '/projects',
  project: (projectId: string) => `/projects/${projectId}`,

  teams: '/teams',
  team: (teamId: string) => `/teams/${teamId}`,
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
  getUsers: <T>(params: T) => get(`${apiEndpoints.users}/?${params}`),
  getUser: (userId: UserId) => get(apiEndpoints.user(userId)),
  createUser: (userData: UserRequestDto) => post(apiEndpoints.users, userData),
  updateUser: (userId: UserId, userData: UserRequestDto) => put(apiEndpoints.user(userId), userData),
  deleteUser: (userId: UserId) => del(apiEndpoints.user(userId)),
  login: (userData: {email: string, password: string}) => post(`${apiEndpoints.users}/login`, userData),

  // 그룹 (CRUD)
  getGroups: () => get(apiEndpoints.users),
  getGroup: (groupId: UserId) => get(apiEndpoints.user(groupId)),
  createGroup: (groupData: UserRequestDto) => post(apiEndpoints.users, groupData),
  updateGroup: (groupId: UserId, groupData: UserRequestDto) => put(apiEndpoints.user(groupId), groupData),


  // 프로젝트 (CRUD)
  getProjects: <T>(params: T): Promise<Project[]> => get(`${apiEndpoints.projects}/?${params}`),
  getProject: (projectId: ProjectId) => get(apiEndpoints.user(projectId)),
  createProject: (projectData: ProjectRequestDto) => post(apiEndpoints.users, projectData),
  updateProject: (projectId: ProjectId, projectData: ProjectRequestDto) => put(apiEndpoints.user(projectId), projectData),
  deleteProject: (projectId: ProjectId) => del(apiEndpoints.user(projectId)),

  // 팀 (CRUD)
  getTeams: <T>(params: T) => get(`${apiEndpoints.teams}/?${params}`),

  // 사용자 퍼미션 (RU)
  getUserPermissions: (userId: UserId) => get<string[]>(apiEndpoints.userPermissions(userId)),
  updateUserPermissions: (userId: UserId, permissions: string[]) => put<string[]>(apiEndpoints.userPermissions(userId), permissions)
};

// 모듈 
export const API = {
  ...userApi
};

export default API
