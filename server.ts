import express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const port = 3000;

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

let gUserIdCounter = 0;

// Define routes
app.get("/friends/:id", (request, response) => {
    const quoteOfTheday = "Carpe Diem";
    response.render("hello", { quote: quoteOfTheday });
});

app.get("/annons", (request, response) => {
    response.send("Hello foo!");
});

app.get("/rooms/:id", (request, response) => {
    response.render("room", {
        roomId: request.params.id,
        userId: gUserIdCounter++,
    });
});

// Socket
io.on("connection", (socket: any) => {
    socket.on("join-room", (roomId: String, userId: Number) => {
        // joining current socker to room
        socket.join(roomId);
        // tells everyone in room "I have connected this is my id"
        socket.to(roomId).broadcast.emit("user-connected", userId);
    });
});

// Listen
server.listen(port, () => {
    console.log(`Server is listening on port ${port}.`);
});
