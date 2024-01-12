export type UserRequestDto = {
    name: string;
    email: string;
    password: string;
    groupName: string | null;
    groupId: string | null;
};