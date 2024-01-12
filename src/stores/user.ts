import { defineStore } from 'pinia'
import { type UserState } from '../types/users.type'
import { type User } from '../types/users.type'
import { type Team, type Project } from '../types/projects.type'

import API from '../apis'
interface UserStore {
  users: User[],
  userState: UserState,
  mockUsers: User[],
}


export const useUserStore = defineStore('user', {
  state: (): UserStore => ({
    users: [],
    mockUsers: [
      {
        id: 1,
        name: 'Alice',
        email: '',
      },
    ],
    userState: {
      id: 0,
      name: 'Alice',
      email: '',
      teams: [],
      groupName: '',
      projects: []
    }
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
      return state.userState.id !== 0
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
    findUserNameById(id: number) {
      return this.users.find((user) => user.id === id)?.name
    },
    async fetchUser(user: User) {
      const teams: Team[] = await API.getTeams(user.id)
      const projects: Project[] = await API.getProjects(user.id)

      const _userState: UserState = {
        id: user.id,
        name: user.name,
        email: user.email,
        groupName: user.groupName || null,
        teams: teams || [],
        projects: projects || [],
      }
      this.userState = _userState
    },
    logout() {
      this.userState = {
        id: 0,
        name: 'Alice',
        email: '',
        teams: [],
        projects: [],
        groupName: '',
      }
    }
  }
})
