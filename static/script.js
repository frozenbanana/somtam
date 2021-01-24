const DEBUG = true;
const PEERS = {};
let CONNECTION = undefined;
const chatLog = document.getElementById("chat-log");
let myPeer = {};
// When the DOM is ready
document.addEventListener(
    "DOMContentLoaded",
    function (event) {
        const socket = io("/");
        myPeer = new Peer({
            host: location.hostname,
            port: 3001 || (location.protocol === "https:" ? 443 : 80),
            path: "/",
            debug: true,
        });

        // on open will be launch when you successfully connect to PeerServer
        myPeer.on("open", (userId) => {
            const localRoomData = {
                roomId: ROOM_ID,
                userId: userId,
            };
            if (DEBUG) console.log(`My local userid: ${localRoomData.userId}`);
            socket.emit("join-room", localRoomData);
        });

        const videoGrid = document.getElementById("video-grid");
        const chatForm = document.getElementById("chat-form");

        chatForm.onsubmit = function (event) {
            if (DEBUG) console.log("Submit event called!");

            event.preventDefault();
            const message = event.target.prompt.value;

            // Send new message
            socket.emit("new_message", {
                sender: myPeer.id,
                message: message,
            });

            // add it locally if successful
            const newMessageElement = document.createElement("li");
            newMessageElement.classList.add("chat-message", "my-message");
            newMessageElement.textContent = message;
            chatLog.insertBefore(newMessageElement, chatLog.childNodes[0]);

            // Reset message prompt
            event.target.prompt.value = "";
        };

        // Listen for responses
        socket.on("new_message", (data) => {
            if (data.sender !== myPeer.id) {
                if (DEBUG) console.log(`${data.sender} - ${myPeer.id}`);
                if (DEBUG) console.log(data);
                const newMessageElement = document.createElement("li");
                newMessageElement.classList.add(
                    "chat-message",
                    "other-message"
                );
                newMessageElement.textContent = data.message;
                chatLog.insertBefore(newMessageElement, chatLog.childNodes[0]);
            }
        });

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

        socket.on("user-disconnected", (userId) => {
            if (DEBUG) {
                console.log(Object.keys(PEERS));
                console.log(
                    `One of them are leaving. User ${userId} has disconnected.`
                );
            }

            if (PEERS[userId]) {
                if (DEBUG) {
                    console.log(`closing call for user ${userId}..`);
                }

                PEERS[userId].close();
                delete PEERS[userId];
            }
        });

        function getStream(devicePair) {
            const constraints = {
                audio: devicePair.audio,
                video: devicePair.video,
            };

            // Setup media stream for my own
            // Setup events
            navigator.mediaDevices
                .getUserMedia(constraints)
                .then((myStream) => {
                    console.log(
                        `Constraints | audio: ${constraints.audio}, video: ${constraints.video}`
                    );
                    if (DEBUG) {
                        console.log("Calling my own stream");
                    }

                    const myVideo = document.createElement("video");
                    myVideo.muted = true;
                    addStream(myVideo, myStream);
                    if (DEBUG) {
                        console.log(`Listening for calls`);
                    }

                    // Listening for calls
                    myPeer.on("call", (call) => {
                        if (DEBUG) {
                            console.log(`Call recieved! Saving caller`);
                        }
                        // Answer the call with your own video/audio stream
                        call.answer(myStream);
                        const video = document.createElement("video");

                        // Receive data
                        call.on("stream", (userVideoStream) => {
                            addStream(video, userVideoStream);
                        });
                        PEERS[call.peer] = call;
                    });

                    // User has connected time to setup streams
                    socket.on("user-connected", (roomData) => {
                        // From server.ts emit
                        if (DEBUG) {
                            console.log(
                                `User ${roomData.userId} connected to room ${roomData.roomId}`
                            );
                        }
                        if (DEBUG)
                            console.log(`calling setupStreamToNewUser..`);
                        // Sending local stream (mySteam) to the new user
                        setupStreamToNewUser(roomData.userId, myStream);
                    });
                })
                .catch((err) => console.log("We got an errooooooor!"));
        }

        function addStream(videoEle, stream) {
            videoEle.srcObject = stream;
            videoEle.addEventListener("loadedmetadata", () => {
                videoEle.play();
            });

            videoGrid.append(videoEle);
        }

        function setupStreamToNewUser(userId, localStream) {
            // When local user has fetched their localStream
            // they want to send it to any new user coming to room
            const call = myPeer.call(userId, localStream);
            const video = document.createElement("video");

            // When other user is calling myPeer.call(..)
            call.on("stream", (userStream) => {
                console.log("User Stream Received!");
                addStream(video, userStream);
            });

            // when other user is closing call remove video element
            call.on("close", () => {
                if (DEBUG) {
                    console.log("Video is closing!");
                }

                video.remove();
            });

            if (DEBUG) console.log(`Adding ${userId} to PEERS`);
            PEERS[userId] = call;
        }
    },
    false
);
