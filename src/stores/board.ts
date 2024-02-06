import API from "@/apis";
import type { Board } from "@/types/kanban.type";
import { defineStore } from "pinia";

interface BoardStore {
  boards: Board[]
}

export const useBoardStore = defineStore('board', {
  state: (): BoardStore => ({
    boards: [],
  }),
  getters: {
    // 보드 목록 조회
    getBoards: (state) => {
      return state.boards
    },
  },
  actions: {
    async changeBoardList(teamId: string) {
      try  {
        // API 호출
        const result = await API.getBoards({teamId})

        // 보드 목록 저장
        this.boards = result
      } catch (error) {
        console.log(error)
      }
      
    }
  }
})