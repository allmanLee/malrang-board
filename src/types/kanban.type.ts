// 칸반보드 타입 정의

// 보드 배열 타입
// (보드 상태 : todo, doing, done)

// 보드 상태 정의
export type BoardStatus = 'todo' | 'doing' | 'pending' | 'done';

export interface Board {
  id: string;
  status: BoardStatus;
  title: string;
  kanbanId: string;
  teamId: string;
  permission: string;
  order: number;
}

 
// 카드 배열 타입
export interface Card {
  _id: string;
  title: string; 
  description: string;
  created_date: string;
  userId: string;
  userName: string;
  teamId: string;
  projectCardId?: number;
  projectId: string;
  boardId: string;
  avatar: string;
  tags: Tag[];
  order: number;
  commit: Commit[];
  optionalData: {};
}

// 태그 배열 타입
export interface Tag {
  id: string;
  label: string;
  color: string;
}

// 커밋 배열 타입
export interface Commit {
  id: string;
  title: string;
  created_date: string;
  card_idx: number;
}