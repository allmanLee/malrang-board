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
      }catch (error) {
        console.log(error)
      }
    }
  }
})


