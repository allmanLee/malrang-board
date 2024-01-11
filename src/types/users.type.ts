import { type Team, type Project } from './projects.type';

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  group?: Group;
}

export type userRequestDto = {
  name: string;
  email: string;
  password: string;
  groupName: string;
}

export interface UserState {
  id: number;
  name: string;
  email: string;
  teams: Team[];
  projects: Project[];
}

export interface Group {
  id: number;
  name: string;
  domain?: string;
}

export type UserId = string; // number | string;