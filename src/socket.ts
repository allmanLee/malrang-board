import { reactive } from "vue";
import { io } from "socket.io-client";

export const state = reactive({
  connected: false,
  moveEvents: [] as { boardId: string; cardId: string }[],
  // barEvents: []
});

// "undefined" means the URL will be computed from the `window.location` object
const URL : string | undefined
 = process.env.NODE_ENV === "production" ? undefined : "http://localhost:4001";



export const socket = io(URL);

socket.on("connect", () => {
  console.log("connected", socket.id);
  state.connected = true;
});

// socket.on("disconnect", () => {
//   state.connected = false;
// });

// socket.on("moveCard", (...args) => {
//   state.moveEvents.push(args);
// });

// socket.on("bar", (...args) => {
//   state.barEvents.push(args);
// });