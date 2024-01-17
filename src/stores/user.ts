import { defineStore } from 'pinia'
import { type UserState } from '../types/users.type'
import { type User } from '../types/users.type'
import type {  Project, ProjectId } from '../types/projects.type'
import type { ProjectRequestDto, TeamRequestDto } from '@/types/dto/project.dto.type'
import router from '../router'
import API from '../apis'
interface UserStore {
  users: User[],
  userState: UserState | null,
  mockUsers: User[],
}


export const useUserStore = defineStore('user', {
  state: (): UserStore => ({
    users: [],
    mockUsers: [
      {
        id: '',
        name: '',
        email: '',
      },
    ],
    userState: null, // null 이면 로그인 안한 상태
  }),
  getters: {
    getUsers:(state) => {
      return state.users
    },
    getMockUsers:(state) => {
      console.log('state.mockUsers', state.mockUsers)
      return  state.mockUsers
    },
    isLogin: (state) => {
      return state.userState !== null
    },
    getUserState: (state) => {
      return state.userState
    },
  },
  actions: {
    fetchUsers() {
      // TODO: 팀 맴버만 불로오도록 API 개발 필요
      // const response = await API.get('/users')

      this.users = this.mockUsers
    },
    addUser(user: User) {
      this.users.push(user)
    },
    findUserNameById(id: string) {
      return this.users.find((user) => user.id === id)?.name
    },
    /** @function 유저 정보 패치
     * @param {User} user
     * @returns {void}
     * @description 유저 정보를 패치하고, 유저 상태를 업데이트 합니다. 최신의 팀 정보와 프로젝트 정보를 패치합니다.
     */
    async fetchUser(user: User) {
      const projects = await API.getProjects({groupId: user.groupId}).catch((err) => { console.log(err) })
      let _userState: UserState = null

      const teams = projects?.map((project: Project) => project.teams).flat() || []

      

      _userState = {
        id: user.id,
        name: user.name,
        email: user.email,
        groupName: user.groupName || null,
        groupId: user.groupId || null,
        teams: teams || [],
        projects: projects || [],
      }
      this.userState = _userState
      localStorage.setItem('userState', JSON.stringify(this.userState))
    },
    async createProject(projectData: ProjectRequestDto) {
      const result = await API.createProject(projectData)
      
      this.userState?.projects.push(result)
      localStorage.setItem('userState', JSON.stringify(this.userState))
      return result
    },

    async deleteProject(projectId: ProjectId) {
      const result = await API.deleteProject(projectId)
      if(!this.userState) return
      this.userState.projects = this.userState?.projects.filter((project) => project._id !== projectId)
      console.log('this.userState.projects', this.userState.projects)
      localStorage.setItem('userState', JSON.stringify(this.userState))
      return result
    },

    async createTeam(teamData: TeamRequestDto) {
      const result = await API.createTeam(teamData)

      const project = this.userState?.projects.find((project) => project._id === teamData.projectId)
      if(!project) return

      if(project?.teams === undefined)  project.teams = []

      project.teams.push(result)
      this.userState?.teams.push(result)
      localStorage.setItem('userState', JSON.stringify(this.userState))
      return result
    },

    logout() {
      localStorage.removeItem('userState')
      this.userState = null
      router.push({ name: 'Login' })
    }
  }
})

