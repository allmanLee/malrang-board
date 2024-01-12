import { type Team, type Project } from './projects.type';
export type groupName = 'team1' | 'team2' | 'team3'
export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  groupName?: string;
}

export type UserRequestDto = {
  name: string;
  email: string;
  password: string;
  groupName: string | null;
}

export type GroupRequestDto = {
  name: string;
  domain: string;
}



export type TeamRequestDto = {
  name: string;
  description: string;
  projectId: number;
}

export type UserState = {
  id: number;
  name: string;
  email: string;
  teams: Team[];
  projects: Project[];
  groupName: string | null;
}

export interface Group {
  id: number;
  name: string;
  domain?: string;
}

export type UserId = string; // number | string;
export type ProjectId = string; // number | string;