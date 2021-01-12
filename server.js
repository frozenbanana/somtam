"use strict";
exports.__esModule = true;
var express_1 = require("express");
var socket_io_1 = require("socket.io");
var http_1 = require("http");
var app = express_1["default"]();
var server = new http_1["default"].Server(app);
var io = socket_io_1["default"](server);
var port = 3000;
var path = require("path");
app.set("view engine", "ejs");
// app.use(express.static("/public"));
app.use("/static", express_1["default"].static(path.join(__dirname, "static")));
var gUserIdCounter = 0;
// Define routes
app.get("/", function (request, response) {
    var quoteOfTheday = "Carpe Diem";
    response.render("hello", { quote: quoteOfTheday });
});
app.get("/annons", function (request, response) {
    response.send("Hello foo!");
});
app.get("/rooms", function (request, response) {
    var randomRoomName = Math.floor(Math.random() * 1000);
    response.redirect("/rooms/" + randomRoomName);
});
app.get("/rooms/:id", function (request, response) {
    var videoColors = ["pink", "purple", "blue", "red", "green", "teal"];
    var index = Math.floor(Math.random() * videoColors.length);
    response.render("room", {
        roomId: request.params.id,
        userId: gUserIdCounter++,
        videoColor: videoColors[index]
    });
});
// Socket
io.on("connection", function (socket) {
    socket.on("join-room", function (roomData) {
        // joining current socker to room
        socket.join(roomData.roomId);
        // tells everyone in room "I have connected, this is my id"
        socket.to(roomData.roomId).broadcast.emit("user-connected", roomData);
        socket.on("disconnect", function () {
            socket
                .to(roomData.roomId)
                .broadcast.emit("user-disconnected", roomData.userId);
        });
    });
});
// Listen
server.listen(port, function () {
    console.log("Server is listening on port " + port + ".");
});
