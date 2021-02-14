import { useState } from "react";
import { useBox } from "use-cannon";
import { useFrame } from "react-three-fiber";

function Box(props) {
    // This reference will give us direct access to the mesh
    const [ref, api] = useBox(() => ({ mass: 1, position: [0, 2, 0] }));

    // Set up state for the hovered and active state
    const [hovered, setHover] = useState(false);
    const [active, setActive] = useState(false);

    // Rotate mesh every frame, this is outside of React without overhead
    useFrame(() => {
        // mesh.current.rotation.y += 0.01;
    });

    const color = hovered ? "hotpink" : "orange";
    return (
        <mesh
            {...props}
            ref={ref}
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

export default Box;
