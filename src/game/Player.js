import React, { useCallback, useRef, useState, useEffect } from "react";
import { useThree, useFrame } from "react-three-fiber";
import { Vector3, VideoTexture } from "three";
import { useSphere } from "use-cannon";
import { OrbitControls, Html } from "@react-three/drei";
import Webcam from "react-webcam";
import { useKeyboardControls } from "../hooks/useKeyboardControls";
import Box from "./Box";
const SPEED = 4;

function Player(props) {
    const webcamRef = useRef();
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

    const controlsRef = useRef();
    const [ref, api] = useSphere(() => ({
        mass: 10,
        type: "dynamic",
        ...props,
    }));

    const {
        moveForward,
        moveBack,
        moveLeft,
        moveRight,
    } = useKeyboardControls();

    const { camera, gl } = useThree();

    useFrame(() => {
        // camera.position.copy(ref.current.position);

        if (controlsRef.current) {
            controlsRef.current.target.copy(ref.current.position);
        }

        const direction = new Vector3();
        const frontDir = moveForward ? -1 : 0 - moveBack ? 1 : 0;
        const rightDir = moveRight ? 1 : 0 - moveLeft ? -1 : 0;
        const frontVector = new Vector3(0, 0, frontDir);
        const rightVector = new Vector3(rightDir, 0, 0);
        direction
            .addVectors(frontVector, rightVector)
            .normalize()
            .multiplyScalar(SPEED)
            .applyEuler(camera.rotation);

        // console.log(direction);
        api.velocity.set(direction.x, 0, direction.z);
    });

    return (
        <>
            <OrbitControls ref={controlsRef} args={[camera, gl.domElement]} />

            <Html
                center // Adds a -50%/-50% css transform (default: false)
                zIndexRange={[10, 0]} // Z-order range (default=[16777271, 0])
            >
                <Webcam
                    width="200"
                    height="113"
                    mirrored
                    id="webcam"
                    audio={false}
                    ref={onWebcamRefChange}
                    screenshotFormat="image/jpeg"
                    hidden
                />
            </Html>

            <Box
                ref={ref}
                texture={streamTexture}
                position={[-4, 0.5, 0]}
                receiveShadow
                castShadow
            />
        </>
    );
}

export default Player;
