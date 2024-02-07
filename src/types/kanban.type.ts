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
  userIdx: number;
  userName: string;
  teamId: string;
  boardId: string;
  tags: Tag[];
  commit: Commit[];
}

// 태그 배열 타입
export interface Tag {
  id: string;
  title: string;
  color: string;
}

// 커밋 배열 타입
export interface Commit {
  id: string;
  title: string;
  created_date: string;
  userIdx: number;
  card_idx: number;
}