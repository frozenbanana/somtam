const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// console.log that your server is up and running
const server = app.listen(port, () => console.log(`Listening on port ${port}`));
// Setup socket listener
const io = require("socket.io")(server, { cors: { origin: "*" } });
// Socket setup
const state = { clients: {} };
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);

//Socket setup
io.on("connection", (client) => {
    io.sockets.emit("FromAPI", { msg: "hello from API" });

    console.log(
        "User " +
            client.id +
            " connected, there are " +
            io.engine.clientsCount +
            " clients connected"
    );

    //Add a new client indexed by his id
    state.clients[client.id] = {
        position: [0, 0, 0],
        rotation: [0, 0, 0],
    };

    //Make sure to send the client it's ID
    client.emit(
        "introduction",
        client.id,
        io.engine.clientsCount,
        Object.keys(state.clients)
    );

    //Update everyone that the number of users has changed
    io.sockets.emit(
        "newUserConnected",
        io.engine.clientsCount,
        client.id,
        Object.keys(state.clients)
    );

    client.on("move", (pos) => {
        state.clients[client.id].position = pos;
        io.sockets.emit("userPositions", clients);
    });

    //Handle the disconnection
    client.on("disconnect", () => {
        //Delete this client from the object
        delete state.clients[client.id];

        io.sockets.emit(
            "userDisconnected",
            io.engine.clientsCount,
            client.id,
            Object.keys(state.clients)
        );

        console.log(
            "User " +
                client.id +
                " dissconeted, there are " +
                io.engine.clientsCount +
                " clients connected"
        );
    });
});

// create a GET route
app.get("/express_backend", (req, res) => {
    res.send({ express: "YOUR EXPRESS BACKEND IS CONNECTED TO REACT" });
});
