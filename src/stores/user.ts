import { defineStore } from 'pinia'

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
  }),
  getters: {
    getUsers:(state) => {

      return state.users
    },
    getMockUsers:(state) => {
      console.log('state.mockUsers', state.mockUsers)
      return  state.mockUsers
    },
  },
  actions: {
    fetchUsers() {
      this.users = this.mockUsers
    },
    addUser(user: User) {
      this.users.push(user)
    }
  }
})
