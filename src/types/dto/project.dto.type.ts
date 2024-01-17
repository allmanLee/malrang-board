export type ProjectRequestDto = {
  name: string;
  createUserId: string;
  groupId: string;
}

export type TeamRequestDto = {
  name: string;
  createUserId: string;
  projectId: string;
}
