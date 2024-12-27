import type {CSS3DObject} from "three/examples/jsm/renderers/CSS3DRenderer";
import * as TWEEN from "@tweenjs/tween.js";

export const use3DSurfaces = (matrix: [y: number, x: number][]) => {
    const ROW_COUNT = 7,
        COLUMN_COUNT = 17,
        position = {
            x: (140 * COLUMN_COUNT - 20) / 2,
            y: (180 * ROW_COUNT - 20) / 2
        };
    const positions = matrix.map(([y, x]) => {
        return {
            x: x * 140 - position.x,
            y: -(y * 180) + position.y,
            z: 0
        }
    })
    return (objects: CSS3DObject[], duration: number) => {
        return objects.map((object, i) => {
            let target = positions[i];

            return new TWEEN.Tween(object.position)
                .to(
                    {
                        x: target.x,
                        y: target.y,
                        z: target.z
                    },
                    Math.random() * duration + duration
                )
                .easing(TWEEN.Easing.Exponential.InOut)
                .start();
        })
    }
}