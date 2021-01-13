import express from "express";
import socket from "socket.io";
import http from "http";

const app = express();
const server = new http.Server(app);
const io = socket(server);
const port = 3000;
const path = require("path");
const DEBUG = true;

app.set("view engine", "ejs");
// app.use(express.static("/public"));
app.use("/static", express.static(path.join(__dirname, "static")));

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

interface RoomData {
    roomId: String;
    userId: Number;
}

// Socket
io.on("connection", (socket: any) => {
    socket.on("join-room", (roomData: RoomData) => {
        // joining current socker to room
        socket.join(roomData.roomId);

        if (DEBUG)
            console.log(
                `user-connected called with roomData: ${roomData.roomId}`
            );
        // tells everyone in room "I have connected, this is my id"
        socket.to(roomData.roomId).broadcast.emit("user-connected", roomData);

        socket.on("disconnect", () => {
            socket
                .to(roomData.roomId)
                .broadcast.emit("user-disconnected", roomData.userId); // User hhas connected: GOTO: script.js
        });
    });
});

// Listen
server.listen(port, () => {
    console.log(`Server is listening on port ${port}.`);
});
