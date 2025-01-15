import type {CSS3DObject} from "three/addons";
import {Easing, Tween} from "@tweenjs/tween.js";

export const useLuckyTweens = () => {
    const Resolution = useResolution()
    return (objects: CSS3DObject[], duration: number) => {
        // ElMessage.success(`恭喜${text.join("、")}获得${currentPrize.title}, 新的一年必定旺旺旺。`)
        const width = 125,
            height = 165,
            ySize = Math.ceil(objects.length / 5),
            xSize = objects.length > 5 ? 5 : objects.length,
            xStart = -(xSize - 1) / 2,
            yStart = -(ySize - 1) / 2,
            tweens: Tween[] = [];
        for (let y = 0; y < ySize; y++) {
            for (let x = 0; x < xSize; x++) {
                const i = y*xSize + x
                const object = objects[i];
                if (!object) {
                    break;
                }
                tweens.push(new Tween(object.position)
                    .to(
                        {
                            x: (x + xStart) * width * Resolution,
                            y: (y + yStart) * height * Resolution,
                            z: 2500
                        },
                        Math.random() * duration + duration
                    )
                    .easing(Easing.Exponential.InOut)
                    .start());
                tweens.push(new Tween(object.rotation)
                    .to(
                        {
                            x: 0,
                            y: 0,
                            z: 0
                        },
                        Math.random() * duration + duration
                    )
                    .easing(Easing.Exponential.InOut)
                    .start())
            }
        }
        return tweens
    }
}