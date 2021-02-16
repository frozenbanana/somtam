import React, { useEffect } from "react";
import socketIOClient from "socket.io-client";
import { Canvas } from "react-three-fiber";
import { Stars } from "@react-three/drei";
import { Physics, usePlane } from "use-cannon";
import Player from "./Player";

const ENDPOINT = "http://localhost:5000/";

function Plane({ ...props }) {
    const [ref] = usePlane(() => ({
        rotation: props.rotation,
        ...props,
    }));

    return (
        <mesh ref={ref} receiveShadow>
            <planeBufferGeometry attach="geometry" args={[30, 30, 1, 1]} />

            <meshStandardMaterial color="green" />
            {/* <shadowMaterial attachArray="material" transparent opacity={0.2} /> */}

            {/* {props.texture ? (
                <meshStandardMaterial
                    attachArray="material"
                    map={props.texture}
                />
            ) : (
                <meshStandardMaterial attachArray="material" color="brown" />
            )} */}
        </mesh>
    );
}

function Circle({ ...props }) {
    return (
        <mesh {...props}>
            <circleBufferGeometry args={[4, 64]} />
            <meshBasicMaterial color={props.color} />
        </mesh>
    );
}

function Game() {
    const d = 8.25;

    useEffect(() => {
        const socket = socketIOClient(ENDPOINT, { transports: ["websocket"] });
        socket.on("FromAPI", (data) => {
            console.log("SOCKET", data);
        });

        // NEXT STEP: Create a game state and a reference to scene
        //On connection server sends the client his ID
        // socket.on('introduction', (_id, _clientNum, _ids)=>{

        //     for(let i = 0; i < _ids.length; i++){
        //     if(_ids[i] != _id){
        //         clients[_ids[i]] = {
        //         mesh: new THREE.Mesh(
        //             new THREE.BoxGeometry(1,1,1),
        //             new THREE.MeshNormalMaterial()
        //         )
        //         }

        //         //Add initial users to the scene
        //         glScene.scene.add(clients[_ids[i]].mesh);
        //     }
        //     }

        //     console.log(clients);

        //     id = _id;
        //     console.log('My ID is: ' + id);

        // });

        return () => socket.disconnect();
    }, []);

    return (
        <>
            <Canvas
                style={{
                    height: "100vh",
                    background: "#0a0a0a", //"#dfdfdf",
                }}
                shadowMap
            >
                <Stars />
                <hemisphereLight
                    skyColor={"black"}
                    groundColor={0xffffff}
                    intensity={0.5}
                    position={[0, 50, 0]}
                />
                <directionalLight
                    position={[-8, 20, 5]}
                    shadow-camera-left={d * -1}
                    shadow-camera-bottom={d * -1}
                    shadow-camera-right={d}
                    shadow-camera-top={d}
                    shadow-camera-near={0.5}
                    shadow-camera-far={500}
                    castShadow
                />
                <mesh position={[0, 5, -10]}>
                    <circleBufferGeometry args={[4, 64]} />
                    <meshBasicMaterial color="lightblue" />
                </mesh>
                <Physics>
                    <Plane
                        rotation={[-0.5 * Math.PI, 0, 0]}
                        position={[0, -2, -5]}
                    />
                    <Player position={[0, 1, 0]} castShadow></Player>
                </Physics>
            </Canvas>
        </>
    );
}

export default Game;
