// sb = side bar

import { defineStore } from "pinia"
import { useBoardStore } from "./board"


interface CommonStore {
  sbSelectedTeamId: string
  sbSelectedTeamName: string
}

export const useCommonStore = defineStore('common', {
  state: (): CommonStore => ({
    sbSelectedTeamId: '',
    sbSelectedTeamName: '',
  }),
  getters: {
    getSbSelectedTeamId: (state) => {
      return state.sbSelectedTeamId
    },
    getSbSelectedTeamName: (state) => {
      return state.sbSelectedTeamName
    }
  },
  actions: {
    async changeTeamSelected(teamId: string, teamName: string) {
      try {
      this.sbSelectedTeamId = teamId
      this.sbSelectedTeamName = teamName

      // 보드 목록 조회
      await useBoardStore().changeBoardList(teamId)
      
      // 로컬스토리지에 선택된 팀 정보 저장 (페이지 새로고침시에도 유지)
      localStorage.setItem('sbSelectedTeamId', teamId)
      localStorage.setItem('sbSelectedTeamName', teamName)
      }catch (error) {
        console.log(error)
      }
    }
  }
})


