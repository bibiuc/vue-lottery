import  { Tween } from "@tweenjs/tween.js";
import * as TWEEN from "@tweenjs/tween.js";
import {Scene} from "three";

export const useTweens = () => {
    const animate = (tweens: Tween[], duration: number | (() => boolean), render?: () => void) => {
        const isStopped:() => boolean  = typeof duration === 'number' ? ((ended_at) => () => Date.now() > ended_at)(Date.now() + duration * 2) : duration
        const tween = typeof render === 'function' && typeof duration === 'number' ? new Tween({})
                .to({}, duration * 2)
                .onUpdate(render)
                .start() : null;
        const animate = () => {
            if (isStopped()) {
                return
            }
            requestAnimationFrame(animate)
            tweens.map((t) => t.update())
            tween && tween.update();
        }
        animate()
    }
    const getRotate = (scene: Scene, render: Function) => {
        const ROTATE_LOOP = 1000
        const ROTATE_TIME = 3000
        scene.rotation.y = 0;
        const tween = new TWEEN.Tween(scene.rotation);
        tween.to(
            {
                y: Math.PI * 6 * ROTATE_LOOP
            },
            ROTATE_TIME * ROTATE_LOOP
        )
            .onUpdate(render)
            .repeat(Infinity)
            .onStop(() => {
                scene.rotation.y = 0;
            })
            .onComplete(() => {
            })
        animate([tween], () => false)
        return tween;
    }
    return {
        getRotate,
        animate
    }
}