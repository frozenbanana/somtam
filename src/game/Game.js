import React, { useCallback, useRef, useState } from "react";
import { Canvas, useFrame } from "react-three-fiber";
import { OrbitControls } from "@react-three/drei";
import Webcam from "react-webcam";
import { VideoTexture } from "three";
import Player from "./Player";

function Plane({ ...props }) {
    return (
        <mesh {...props} receiveShadow>
            <planeBufferGeometry args={[500, 500, 1, 1]} />
            {props.texture ? (
                <meshStandardMaterial map={props.texture} />
            ) : (
                <shadowMaterial transparent opacity={0.2} />
            )}
        </mesh>
    );
}

function Box(props) {
    // This reference will give us direct access to the mesh
    const mesh = useRef();

    // Set up state for the hovered and active state
    const [hovered, setHover] = useState(false);
    const [active, setActive] = useState(false);

    // Rotate mesh every frame, this is outside of React without overhead
    useFrame(() => {
        mesh.current.rotation.y += 0.01;
    });

    const color = hovered ? "hotpink" : "orange";
    return (
        <mesh
            {...props}
            ref={mesh}
            scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
            onClick={(event) => setActive(!active)}
            onPointerOver={(event) => setHover(true)}
            onPointerOut={(event) => setHover(false)}
        >
            <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />

            {props.texture ? (
                <meshStandardMaterial
                    attachArray="material"
                    repeat={[1, 1]}
                    map={props.texture}
                />
            ) : (
                <meshStandardMaterial attachArray="material" color={color} />
            )}

            <meshStandardMaterial attachArray="material" color={color} />
            <meshStandardMaterial attachArray="material" color={color} />
            <meshStandardMaterial attachArray="material" color={color} />
            <meshStandardMaterial attachArray="material" color={color} />
            <meshStandardMaterial attachArray="material" color={color} />
        </mesh>
    );
}

function Game() {
    const webcamRef = React.useRef(null);
    const [streamTexture, setStreamTexture] = useState(null);

    const onWebcamRefChange = useCallback(
        async (newWebcamRef) => {
            webcamRef.current = newWebcamRef;
            console.log("onWebcamRefChange called!", webcamRef);
            if (webcamRef?.current?.video) {
                console.log(
                    "setStreamTexture called!",
                    webcamRef?.current?.video
                );

                setStreamTexture(new VideoTexture(webcamRef.current.video));
            }
        },
        [webcamRef]
    );

    const d = 8.25;

    return (
        <>
            <div
                style={{ position: "absolute", right: 10, top: 150, zIndex: 1 }}
            >
                <Webcam
                    width="200"
                    height="113"
                    mirrored
                    id="webcam"
                    audio={false}
                    ref={onWebcamRefChange}
                    screenshotFormat="image/jpeg"
                />
            </div>
            <Canvas
                style={{
                    height: "100vh",
                    background: "#dfdfdf",
                }}
                shadowMap
            >
                <OrbitControls />
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
                <Plane
                    rotation={[-0.5 * Math.PI, 0, 0]}
                    position={[0, -2, 0]}
                />
                <Box
                    texture={streamTexture}
                    position={[-2, 1, 0]}
                    receiveShadow
                    castShadow
                />
                <Box position={[2, 1, 0]} receiveShadow castShadow />
                <Player position={[1, 1, 0]}></Player>
            </Canvas>
        </>
    );
}

export default Game;
