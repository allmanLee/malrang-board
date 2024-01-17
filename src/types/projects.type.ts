
import { type User } from './users.type';

export interface Project {
  _id?: ProjectId;
  name: string;
  teams: Team[];
  groupId: string;
  createUserId: string;
	isDeleted: boolean;
}

export interface Team {
  _id?: TeamId;
  name: string;
  members: User[];
  createUserId: string;
  projectId: ProjectId;
	isDeleted: boolean;
}

export type ProjectId = string; // number | string;
export type TeamId = string; // number | string;
