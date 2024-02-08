// sb = side bar

import { defineStore } from "pinia"
import { useBoardStore } from "./board"


interface CommonStore {
  sbSelectedProjectId: string
  sbSelectedProjectName: string
  sbSelectedTeamId: string
  sbSelectedTeamName: string
}

export const useCommonStore = defineStore('common', {
  state: (): CommonStore => ({
    sbSelectedProjectId: '',
    sbSelectedProjectName: '',
    sbSelectedTeamId: '',
    sbSelectedTeamName: '',
  }),
  getters: {
    getSbSelectedProjectId: (state) => {
      return state.sbSelectedProjectId
    },
    getSbSelectedProjectName: (state) => {
      return state.sbSelectedProjectName
    },
    getSbSelectedTeamId: (state) => {
      return state.sbSelectedTeamId
    },
    getSbSelectedTeamName: (state) => {
      return state.sbSelectedTeamName
    }
  },
  actions: {
    async changeTeamSelected(teamId: string, teamName: string, projectId: string, projectName: string) {
      try {
      this.sbSelectedTeamId = teamId
      this.sbSelectedTeamName = teamName
      this.sbSelectedProjectId = projectId
      this.sbSelectedProjectName = projectName

      // 보드 목록 조회
      await useBoardStore().changeBoardList(teamId)
      
      // 로컬스토리지에 선택된 팀 정보 저장 (페이지 새로고침시에도 유지)
      localStorage.setItem('sbSelectedTeamId', teamId)
      localStorage.setItem('sbSelectedTeamName', teamName)
      localStorage.setItem('sbSelectedProjectId', projectId)
      localStorage.setItem('sbSelectedProjectName', projectName)
      }catch (error) {
        console.log(error)
      }
    }
  }
})


