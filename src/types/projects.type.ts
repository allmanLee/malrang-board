
import { type User } from './users.type';

export interface Project {
  id: number;
  name: string;
  teams: Team[];
  group_id: string;
}

export interface Team {
  id: number;
  name: string;
  members: User[];
}
