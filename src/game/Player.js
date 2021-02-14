import React, { useCallback, useRef, useState, useEffect } from "react";
import { useThree, useFrame } from "react-three-fiber";
import { Vector3 } from "three";
import useKey from "../hooks/useKey";

function Player(props) {
    const mesh = useRef();
    const [playerPosition, setPlayerPosition] = useState(
        new Vector3(...props.position)
    );
    const speed = 0.0001;
    if (useKey("a")) {
        mesh.current.position.x -= 0.1;
    }
    if (useKey("d")) {
        mesh.current.position.x += 0.1;
    }
    if (useKey("w")) {
        mesh.current.position.z -= 0.1;
    }
    if (useKey("s")) {
        mesh.current.position.z += 0.1;
    }

    // useFrame(() => {
    //     console.log(mesh.current.position, playerPosition, mesh.current);
    //     if (moved) {
    //         mesh.current.position.set(
    //             playerPosition.x,
    //             playerPosition.y,
    //             playerPosition.z
    //         );
    //     }
    // });

    return (
        <>
            <mesh {...props} ref={mesh} receiveShadow>
                <sphereBufferGeometry args={[1, 32, 32]} />
                <meshStandardMaterial attach="material" color={"blue"} />
            </mesh>
        </>
    );
}

export default Player;
