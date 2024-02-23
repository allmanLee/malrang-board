import axios, { type AxiosResponse } from 'axios';
import type { UserId, User } from '../types/users.type';
import type { Project, ProjectId, Team, TeamId } from '../types/projects.type';
import type { ProjectRequestDto, TeamRequestDto } from '../types/dto/project.dto.type';
import type { UserRequestDto } from '../types/users.type';
import type { Board } from '../types/kanban.type';
const API_URL = 'http://localhost:8000'; // Replace with your API URL

// Define your API endpoints here
const apiEndpoints = {
  users: '/users',
  user: (userId: string) => `/users/${userId}`,
  userPermissions: (userId: string) => `/users/${userId}/permissions`,

  projects: '/projects',
  project: (projectId: string) => `/projects/${projectId}`,

  teams: '/projects/teams',
  team: (teamId: string) => `/teams/${teamId}`,

  boards: '/kanban/boards',
  board: (boardId: string) => `/kanban/boards/${boardId}`,

  cards: '/kanban/cards',
  card: (boardId: string) => `/kanban/boards/${boardId}/card`,
  cardMo: (boardId: string, cardId: string) => `/kanban/boards/${boardId}/card/${cardId}`,

};

// Create an instance of Axios with the base URL
const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  // Add your interceptors here
  console.log('Request was sent', config);
  return config;
}
);

// Define your API methods here (get, post, put, delete, etc)
const get = async <T>(url: string, params?: any): Promise<T> => {
  try {
    console.log('get', url, params)
    const response: AxiosResponse<T> = await api.get(url, {params});
    return response.data;
  } catch (error: any) {
    console.error(error)
    const response: AxiosResponse<T> = error.response;
    throw response.data;
  }
};

const post = async <T>(url: string, data: any): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await api.post(url, data);
    return response.data;
  } catch (error: any) {
    console.error(error)
    const response: AxiosResponse<T> = error.response;
    throw response.data;
  }
};

const put = async <T>(url: string, data: any): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await api.put(url, data);
    return response.data;
  } catch (error: any) {
    console.error(error)
    const response: AxiosResponse<T> = error.response;
    throw response.data;
  }
};

const del = async <T>(url: string): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await api.delete(url);
    return response.data;
  } catch (error: any) {
    console.error(error)
    const response: AxiosResponse<T> = error.response;
    throw response.data;
  }
};

const patch = async <T>(url: string, data: any): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await api.patch(url, data);
    return response.data;
  } catch (error: any) {
    console.error(error)
    const response: AxiosResponse<T> = error.response;
    throw response.data;
  }
}

const userApi = {

  // 사용자 (CRUD) 및 로그인
  getUsers: <T>(params: T): Promise<User[]> => get(`${apiEndpoints.users}`, params),
  getUser: (userId: UserId) => get(apiEndpoints.user(userId)),
  createUser: (userData: UserRequestDto): Promise <User> => post(apiEndpoints.users, userData),
  updateUser: (userId: UserId, userData: UserRequestDto) => put(apiEndpoints.user(userId), userData),
  deleteUser: (userId: UserId) => del(apiEndpoints.user(userId)),
  login: (userData: {email: string, password: string}): Promise<User> => post(`${apiEndpoints.users}/login`, userData),

  // 그룹 (CRUD)
  getGroups: () => get(apiEndpoints.users),
  getGroup: (groupId: UserId) => get(apiEndpoints.user(groupId)),
  createGroup: (groupData: UserRequestDto) => post(apiEndpoints.users, groupData),
  updateGroup: (groupId: UserId, groupData: UserRequestDto) => put(apiEndpoints.user(groupId), groupData),


  // 프로젝트 (CRUD)
  getProjects: <T>(params: T): Promise<Project[]> => get(`${apiEndpoints.projects}`, params),
  getProject: (projectId: ProjectId) => get(apiEndpoints.user(projectId)),
  createProject: (projectData: ProjectRequestDto): Promise<Project> => post(apiEndpoints.projects, projectData),
  updateProject: (projectId: ProjectId, projectData: ProjectRequestDto) => put(apiEndpoints.user(projectId), projectData),
  deleteProject: (projectId: ProjectId) => del(apiEndpoints.project(projectId)),

  // 팀 (CRUD)
  getTeams: <T>(params: T):Promise<Team[]> => get(`${apiEndpoints.teams}/?${params}`),
  getTeam: (teamId: UserId) => get(apiEndpoints.user(teamId)),
  createTeam: (teamData: TeamRequestDto):Promise<Team> => post(apiEndpoints.teams, teamData),
  deleteTeam: (projectId: ProjectId, teamId: TeamId) :Promise<Team> => del(`${apiEndpoints.projects}/${projectId}/teams/${teamId}`),
  addMember: (params:{projectId: ProjectId, teamId: TeamId, userId: UserId}, req: any):Promise<User> => post(`${apiEndpoints.projects}/${params.projectId}/teams/${params.teamId}/members/${params.userId}`, req),
  deleteMember: (params:{projectId: ProjectId, teamId: TeamId, userId: UserId}):Promise<User> => del(`${apiEndpoints.projects}/${params.projectId}/teams/${params.teamId}/members/${params.userId}`),

  // 사용자 퍼미션 (RU)
  getUserPermissions: (userId: UserId) => get<string[]>(apiEndpoints.userPermissions(userId)),
  updateUserPermissions: (userId: UserId, permissions: string[]) => put<string[]>(apiEndpoints.userPermissions(userId), permissions),

  // 보드 (CRUD)
  getBoards: (params: any) : Promise<Board[]> => get(`${apiEndpoints.boards}`, params),

  // 카드 (CRUD)
  getCards: (params: any) => get(`${apiEndpoints.cards}`, params),
  deleteCard: (cardId: string) => del(`${apiEndpoints.cards}/${cardId}`),

  createCard: (cardData: any) => post(apiEndpoints.card(cardData.boardId), cardData),
  updateCard: (cardData: any) => put(apiEndpoints.cardMo(cardData.boardId, cardData.cardId), cardData),
  moveCard: (cardData: any) => patch(apiEndpoints.cardMo(cardData.boardId, cardData.cardId),{order: cardData.order}),

  // 정보 컬럼 (CRUD)
  // getInfoColumns: (params: any): Promise<any> => get(`${apiEndpoints.infomationColumns}`, params),
  // createInfoColumn: (columnData: any) => post(apiEndpoints.infomationColumns, columnData),
  // updateInfoColumn: (columnData: any) => put(`${apiEndpoints.infomationColumns}/${columnData.id}`, columnData),
  // deleteInfoColumn: (columnId: string) => del(`${apiEndpoints.infomationColumns}/${columnId}`),
};

// 모듈 
export const API = {
  ...userApi
};

export default API
