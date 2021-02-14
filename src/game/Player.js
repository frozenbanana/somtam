import React, { useCallback, useRef, useState, useEffect } from "react";
import { useThree, useFrame } from "react-three-fiber";
import { Vector3 } from "three";
import { useSphere } from "use-cannon";
import { OrbitControls } from "@react-three/drei";

import { useKeyboardControls } from "../hooks/useKeyboardControls";

const SPEED = 4;

function Player(props) {
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

            <mesh ref={ref}>
                <sphereBufferGeometry args={[1, 32, 32]} />
                <meshStandardMaterial color="purple" />
            </mesh>
        </>
    );
}

export default Player;
