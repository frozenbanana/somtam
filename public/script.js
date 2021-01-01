console.log("test");
const socket = io("/");
socket.emit("join-room", ROOM_ID, 10);
console.log(ROOM_ID);
