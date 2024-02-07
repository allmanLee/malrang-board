import API from "@/apis";
import { socket } from "@/socket";
import type { Board, Card } from "@/types/kanban.type";
import { defineStore } from "pinia";

interface BoardStore {
  boards: Board[],
  cards: Card[],
}

export const useBoardStore = defineStore('board', {
  state: (): BoardStore => ({
    boards: [],
    cards: [],
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
    },

    // socket 이벤트로 보드 목록 갱신
    bindEvent() {
      // 소켓 연결
      socket.on("connect", () => {
        console.log('socket connect')
      })

      // socket.on("cards:created", (cards: Card) => {
      //   console.log('cards:created', cards)
      //   cards.push(card)
      // })

      // socket.on("cards:moved", (cards) => {
      //   console.log('cards:moved', cards)
        

      //   // boardId 변경
      //   const cardIndex = cards.findIndex((item: Card) => item._id === card._id)
      //   if(cardIndex === -1) return
      //   cards[cardIndex] = card
      // })
    },
  }
})