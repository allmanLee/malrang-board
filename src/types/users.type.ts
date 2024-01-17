import type { Team, Project } from './projects.type';
export type groupName = 'team1' | 'team2' | 'team3'
export interface User {
  id: string,
  name: string;
  email: string;
  password?: string;
  groupName?: string;
  groupId?: string;
}

export type UserRequestDto = {
  name: string;
  email: string;
  password: string;
  groupName: string | null,
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
  id: string,
  name: string;
  email: string;
  teams: Team[];
  projects: Project[];
  groupName: string | null;
  groupId: string | null;
} | null;

export interface Group {
  id: string;
  name: string;
  domain?: string;
}

export type UserId = string; // number | string;
