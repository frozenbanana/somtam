import React, { useCallback, useRef, forwardRef, useState } from "react";
import { Canvas, useFrame } from "react-three-fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Physics, usePlane, useBox } from "use-cannon";
import Webcam from "react-webcam";
import { VideoTexture } from "three";
import Player from "./Player";
import Box from "./Box";

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
