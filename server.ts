import express from "express";
import socket from "socket.io";
import http from "http";
import { v4 as uuidv4 } from "uuid";

const app = express();
const server = new http.Server(app);
const io = socket(server);
const port = 3000;
const path = require("path");
const DEBUG = true;

const users = [];
const connnections = [];

app.set("view engine", "ejs");
// app.use(express.static("/public"));
app.use("/static", express.static(path.join(__dirname, "static")));
app.use(
    "/build/",
    express.static(path.join(__dirname, "node_modules/three/build"))
);
app.use(
    "/jsm/",
    express.static(path.join(__dirname, "node_modules/three/examples/jsm"))
);
app.use(
    "/three-orbit-controls/",
    express.static(path.join(__dirname, "node_modules/three-orbit-controls"))
);

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
    response.redirect(`/rooms/${uuidv4()}`);
});

app.get("/rooms/:id", (request, response) => {
    const videoColors = ["pink", "purple", "blue", "red", "green", "teal"];
    const index = Math.floor(Math.random() * videoColors.length);

    response.render("room", {
        roomId: request.params.id,
        userId: RandomUserName(),
        videoColor: videoColors[index],
    });
});

interface RoomData {
    roomId: String;
    userId: Number;
}

function RandomUserName(): string {
    const a = ["Small", "Blue", "Ugly"];
    const b = ["Bear", "Dog", "Banana"];

    const rA = Math.floor(Math.random() * a.length);
    const rB = Math.floor(Math.random() * b.length);
    return a[rA] + b[rB];
}

// Socket
io.on("connection", (socket: any) => {
    console.log("New user connected");
    //add the new socket to the connections array
    connnections.push(socket);
    socket.username = RandomUserName();
    socket.on("join-room", (roomData: RoomData) => {
        // joining current socker to room
        socket.join(roomData.roomId);

        if (DEBUG)
            console.log(
                `user-connected called with roomData: ${roomData.roomId}`
            );
        // tells everyone in room "I have connected, this is my id"
        socket.to(roomData.roomId).broadcast.emit("user-connected", roomData);

        //listen on new_message
        socket.on(
            "new_message",
            (data: { sender: String; message: String }) => {
                //broadcast the new message
                io.sockets.emit("new_message", data);
            }
        );

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
