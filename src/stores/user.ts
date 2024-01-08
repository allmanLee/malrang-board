import { defineStore } from 'pinia'
import API from '../apis'
import { UserState } from '../types/users'

interface User {
  id: number
  name: string
}
interface UserStore {
  users: User[],
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
      team: {
        id: 1,
        name: 'team1',
        members: [],
      },
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
      this.users = this.mockUsers
    },
    addUser(user: User) {
      this.users.push(user)
    },
    findUserNameById(id: number) {
      return this.users.find((user) => user.id === id)?.name
    },
    async fetchUser(userState: User) {
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
