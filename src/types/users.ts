export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
}

export interface UserState {
  id: number;
  name: string;
  email: string;
  team: Team;
  projects: Project[];
}

export interface Team {
  id: number;
  name: string;
  members: User[];
}

export interface Project {
  id: number;
  name: string;
  team: Team;
}

export type UserId = string; // number | string;