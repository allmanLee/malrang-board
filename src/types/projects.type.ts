
import { type User } from './users.type';

export interface Project {
  id?: number | null;
  name: string;
  teams: Team[];
  groupId: string;
  createUserId: string;
	isDeleted: boolean;
}

export interface Team {
  id?: number | null;
  name: string;
  members: User[];
  createUserId: string;
	isDeleted: boolean;
}
