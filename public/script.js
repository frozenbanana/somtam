const socket = io("/");
const myPeer = new Peer({
    host: location.hostname,
    port: 3001 || (location.protocol === "https:" ? 443 : 80),
    path: "/",
});

const PEERS = {};

myPeer.on("open", (userId) => {
    const localRoomData = {
        roomId: ROOM_ID,
        userId: userId,
    };

    // Receive messages
    myPeer.on("connection", function (conn) {
        conn.on("data", function (data) {
            console.log("Received", data);
        });
    });

    socket.emit("join-room", localRoomData);
});

const videoGrid = document.getElementById("video-grid");
const chatForm = document.getElementById("chat-form");

chatForm.onsubmit = function (event) {
    event.preventDefault();
    const message = event.target.prompt.value;
    const chatLog = document.getElementById("chat-log");

    // Send via peer
    for (const [peerId, call] of Object.entries(PEERS)) {
        console.log("attempting to send to ", peerId, " message: ", message);
        myPeer.connect(peerId).send(message);
    }

    // add it locally if successful
    const newMessageElement = document.createElement("li");
    newMessageElement.classList.add("chat-message", "my-message");
    newMessageElement.textContent = message;
    chatLog.insertBefore(newMessageElement, chatLog.childNodes[0]);

    // Reset message prompt
    event.target.prompt.value = "";
};

navigator.mediaDevices
    .enumerateDevices()
    .then(gotDevices)
    .then(getStream)
    .catch(() => console.log("error."));

function gotDevices(deviceInfos) {
    const devicePair = { audio: false, video: false };
    deviceInfos.forEach((deviceInfo) => {
        if (deviceInfo.kind === "audioinput") {
            devicePair.audio = true;
        }
        if (deviceInfo.kind === "videoinput") {
            devicePair.video = true;
        }
    });

    return devicePair;
}

socket.on("user-disconnect", (userId) => {
    if (PEERS[userId]) {
        console.log(`User ${userId} has disconncted`);
        PEERS[userId].call.close();
    }
});

function getStream(devicePair) {
    const constraints = {
        audio: devicePair.audio,
        video: devicePair.video,
    };

    navigator.mediaDevices
        .getUserMedia(constraints)
        .then((myStream) => {
            console.log(
                `Constraints | audio: ${constraints.audio}, video: ${constraints.video}`
            );
            console.log("Calling my own stream");
            const myVideo = document.createElement("video");
            myVideo.muted = true;
            addStream(myVideo, myStream);

            myPeer.on("call", (call) => {
                call.answer(myStream);
                const video = document.createElement("video");
                call.on("stream", (userVideoStream) => {
                    addStream(video, userVideoStream);
                });
            });

            socket.on("user-connected", (roomData) => {
                console.log(
                    `User ${roomData.userId} connected to room ${roomData.roomId}`
                );
                setupStreamToNewUser(roomData.userId, myStream);
            });
        })
        .catch((err) =>
            console.log("We got an errooooooor! -i.e time to rest")
        );
}

function addStream(videoEle, stream) {
    videoEle.srcObject = stream;
    videoEle.addEventListener("loadedmetadata", () => {
        videoEle.play();
    });

    videoGrid.append(videoEle);
}

function setupStreamToNewUser(userId, stream) {
    // When local user has fetched their stream
    // they want to send it to any new user coming to room
    const call = myPeer.call(userId, stream);
    console.log("calling", userId);
    const video = document.createElement("video");

    // When other user is calling myPeer.call(..)
    call.on("stream", (userStream) => {
        console.log("If this is logged I should have other stream");
        addStream(video, userStream);
    });

    // when other user is closing call remove video element
    call.on("close", () => {
        console.log("Video is closing!");
        video.remove();
    });

    console.log("should be printed before, .. to get other stream");
    PEERS[userId] = call;
}
