import type {CSS3DObject} from "three/addons"; //
import * as TWEEN from "@tweenjs/tween.js";
import * as THREE from "three";
import {useResolution} from "~/composables/useResolution";

export const use3DSpheres = (matrix: [y: number, x: number][]) => {
    const matrixSize = matrix.length;
    const Resolution = useResolution();

    const vector = new THREE.Vector3();
    const targets = matrix.map((_: any, i: number) => {
        const phi = Math.acos(-1 + (2 * i) / matrixSize);
        const theta = Math.sqrt(matrixSize * Math.PI) * phi;
        const object = new THREE.Object3D();
        object.position.setFromSphericalCoords(800 * Resolution, phi, theta);
        vector.copy(object.position).multiplyScalar(2);
        object.lookAt(vector);
        return object
    })
    return (objects: CSS3DObject[], duration: number) => {
        const tweens: TWEEN.Tween[] = []
        objects.map((object, i) => {
            let target = targets[i];

            tweens.push(
                new TWEEN.Tween(object.position)
                    .to(
                        {
                            x: target.position.x,
                            y: target.position.y,
                            z: target.position.z
                        },
                        Math.random() * duration + duration
                    )
                    .easing(TWEEN.Easing.Exponential.InOut)
                    .start()
            )
            tweens.push(
                new TWEEN.Tween(object.rotation)
                .to(
                    {
                        x: target.rotation.x,
                        y: target.rotation.y,
                        z: target.rotation.z
                    },
                    Math.random() * duration + duration
                )
                .easing(TWEEN.Easing.Exponential.InOut)
                .start())
        })
        return tweens
    }
}