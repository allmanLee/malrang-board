import { defineStore } from 'pinia'
import { type UserState } from '../types/users.type'

interface User {
  id: number
  name: string
}
interface UserStore {
  users: User[],
  userState: UserState,
  mockUsers: User[],
}


export const useUserStore = defineStore('user', {
  state: (): UserStore => ({
    users: [],
    mockUsers: [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Charlie' },
    ],
    userState: {
      id: 0,
      name: 'Alice',
      email: '',
      teams: [{
        id: 1,
        name: 'team1',
        members: [],
        createUser_Id: '',
        isDeleted: false,
      }],

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
    async fetchUser(userState: UserState) {
      const _userState: UserState = userState
      this.userState = _userState
    },
    logout() {
      this.userState = {
        id: 0,
        name: 'Alice',
        email: '',
        team: {
          id: 1,
          name: 'team1',
          members: [],
        },
        projects: []
      }
    }
  }
})
