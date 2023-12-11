// 칸반보드 타입 정의

// 보드 배열 타입
// (보드 상태 : todo, doing, done)

// 보드 상태 정의
export type BoardStatus = 'todo' | 'doing' | 'pending' | 'done';

export interface Board {
  id: number;
  status: BoardStatus;
  title: string;
  user_idx: number;
}


// 카드 배열 타입
export interface Card {
  id: number;
  title: string;
  description: string;
  created_date: string;
  user_idx: number;
  board_idx: number;
  tags: Tag[];
  commit: Commit[];
}

// 태그 배열 타입
export interface Tag {
  id: number;
  title: string;
  color: string;
}

// 커밋 배열 타입
export interface Commit {
  id: number;
  title: string;
  created_date: string;
  user_idx: number;
  card_idx: number;
}