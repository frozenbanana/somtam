import { useState, useEffect } from "react";

function actionByKey(key) {
    const keys = {
        KeyW: "moveForward",
        KeyA: "moveLeft",
        KeyS: "moveBack",
        KeyD: "moveRight",
        Space: "jump",
    };
    return keys[key];
}

export const useKeyboardControls = () => {
    const [movement, setMovement] = useState({
        moveForward: false,
        moveLeft: false,
        moveBack: false,
        moveRight: false,
        jump: false,
    });

    // Check movment keys
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (actionByKey(e.code)) {
                setMovement((state) => ({
                    ...state,
                    [actionByKey(e.code)]: true,
                }));
            }
        };

        const handleKeyUp = (e) => {
            if (actionByKey(e.code)) {
                setMovement((state) => ({
                    ...state,
                    [actionByKey(e.code)]: false,
                }));
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("keyup", handleKeyUp);

        // useEffect needs to be cleaned up.
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("keyup", handleKeyUp);
        };
    });

    return movement;
};
