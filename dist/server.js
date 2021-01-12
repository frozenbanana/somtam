"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const port = 3000;
const path = require("path");
app.set("view engine", "ejs");
// app.use(express.static("/public"));
app.use("/static", express.static(path.join(__dirname, "public")));
let gUserIdCounter = 0;
// Define routes
app.get("/", (request, response) => {
    const quoteOfTheday = "Carpe Diem";
    response.render("hello", { quote: quoteOfTheday });
});
app.get("/annons", (request, response) => {
    response.send("Hello foo!");
});
app.get("/rooms", (request, response) => {
    const randomRoomName = Math.floor(Math.random() * 1000);
    response.redirect(`/rooms/${randomRoomName}`);
});
app.get("/rooms/:id", (request, response) => {
    const videoColors = ["pink", "purple", "blue", "red", "green", "teal"];
    const index = Math.floor(Math.random() * videoColors.length);
    response.render("room", {
        roomId: request.params.id,
        userId: gUserIdCounter++,
        videoColor: videoColors[index],
    });
});
// Socket
io.on("connection", (socket) => {
    socket.on("join-room", (roomData) => {
        // joining current socker to room
        socket.join(roomData.roomId);
        // tells everyone in room "I have connected, this is my id"
        socket.to(roomData.roomId).broadcast.emit("user-connected", roomData);
        socket.on("disconnect", () => {
            socket
                .to(roomData.roomId)
                .broadcast.emit("user-disconnected", roomData.userId);
        });
    });
});
// Listen
server.listen(port, () => {
    console.log(`Server is listening on port ${port}.`);
});
//# sourceMappingURL=server.js.map