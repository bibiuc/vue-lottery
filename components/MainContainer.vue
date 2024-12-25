<template>
  <div class="container" ref="containerRef" >
      <div class="none">
        <div v-for="([y, x, i, highlight, blue], key) in matrix" :key="key" ref="elementsRef">
          <template v-if="getUser(i, users)">
            <div class="element"  :class="{lightitem: highlight, highlight: (highlight && !entered)|| (entered && luckyIndexes[getUser(i, users).id] == key)}" :style="highlight && !entered? '': `background-color: rgba(0,127,127,${blue}`">
                <img class="avatar" :src="'http://sh.rbsoft.cn' + getUser(i, users).avatar" alt="">
                <div class="name">{{getUser(i, users).nickname}}</div>
                <div class="details">{{getUser(i, users).mobile}}</div>
            </div>
          </template>
        </div>
      </div>
  </div>
</template>
<script setup lang="ts">
import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import {isEqual} from 'lodash'
import {CSS3DObject, CSS3DRenderer} from 'three/examples/jsm/renderers/CSS3DRenderer'
import {TrackballControls} from 'three/examples/jsm/controls/TrackballControls.js'

const props = defineProps({
  luckyUsers: {
    type: Array,
    default() {
      return []
    }
  },
  users: {
    type: Array,
    default() {
      return []
    }
  },
  drawing: {
    type: Number,
    default: 0
  },
  entered: {
    type: Boolean,
    default: false
  },
})
const containerRef= ref(null)
const elementsRef = ref(null)
const luckyIds = computed(() => {
  return [].concat(
      props.users.filter(({prize_id}) => prize_id > 0).map(({id}) => id),
      props.luckyUsers.map(({id}) => id),
  ).sort()
})
const luckyIndexes = ref({});
const addLuckyIndex = (id, index) => luckyIndexes.value = {...luckyIndexes.value, [id]: index}
watch(luckyIds, (a, b) => {
  if (isEqual(a, b)) {
    return;
  }
  luckyIndexes.value = {}
})
const { matrix, position, shine } = useMainMatrix(([y, x, i], index) => {
  const user = getUser(i, props.users)
  if (!user) {
    return false
  }
  const savedIndex = luckyIndexes.value[user.id]
  if (luckyIds.value.includes(user.id)) {
    if (typeof savedIndex == 'number') {
      return savedIndex == index
    }
    addLuckyIndex(user.id, index)
    return true
  }
  return false
});
const matrixSize = matrix.value.length;
const Resolution = 1;
const renderBus = useEventBus<string>('render')
const switchBus = useEventBus<[boolean, number]>('switch')
const luckyBus = useEventBus<any[]>('lucky')
const rotateBus = useEventBus<boolean>('rotate')

const getUser = (i: number, users: any[]) => {
  if (!users || users.length < 0) {
    return null
  }
  return users[i % users.length]
}

if (!import.meta.env.SSR) {
  onMounted(() => {
    if (containerRef.value) {
      const container = containerRef.value
      const elements = elementsRef.value
      const camera = new THREE.PerspectiveCamera(
          40,
          window.innerWidth / window.innerHeight,
          1,
          10000
      );
      camera.position.z = 3000;
      const scene = new THREE.Scene();
      const cssObjects = matrix.value.map((_, i) => {
        const object = new CSS3DObject(elements[i])
        object.position.x = Math.random() * 4000 - 2000;
        object.position.y = Math.random() * 4000 - 2000;
        object.position.z = Math.random() * 4000 - 2000;
        scene.add(object);
        return object
      });
      const surfaces = matrix.value.map(([i, j]) => {
        const object = new THREE.Object3D();
        object.position.x = j * 140 - position.x;
        object.position.y = -(i * 180) + position.y;
        return object
      })
      const vector = new THREE.Vector3();
      const spheres = cssObjects.map((_: any, i: number) => {
        const phi = Math.acos(-1 + (2 * i) / matrixSize);
        const theta = Math.sqrt(matrixSize * Math.PI) * phi;
        const object = new THREE.Object3D();
        object.position.setFromSphericalCoords(800 * Resolution, phi, theta);
        vector.copy(object.position).multiplyScalar(2);
        object.lookAt(vector);
        return object
      })
      const renderer = new CSS3DRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      container.appendChild(renderer.domElement);

      const controls = new TrackballControls(camera, renderer.domElement);
      controls.rotateSpeed = 0.5;
      controls.minDistance = 500;
      controls.maxDistance = 6000;

      controls.addEventListener("change", () => renderBus.emit());


      renderBus.on(() => {
        renderer.render(scene, camera);
      })

      switchBus.on(([v, duration]) => {
        const targets = v ? spheres : surfaces
        const ended_at = Date.now() + duration * 2
        const tweens:TWEEN.Tween[] = [];
        let tween: TWEEN.Tween;
        for (let i = 0; i < cssObjects.length; i++) {
          let object = cssObjects[i];
          let target = targets[i];

          tween = new TWEEN.Tween(object.position)
              .to(
                  {
                    x: target.position.x,
                    y: target.position.y,
                    z: target.position.z
                  },
                  Math.random() * duration + duration
              )
              .easing(TWEEN.Easing.Exponential.InOut)
              .start();
          tweens.push(tween)
          tween = new TWEEN.Tween(object.rotation)
              .to(
                  {
                    x: target.rotation.x,
                    y: target.rotation.y,
                    z: target.rotation.z
                  },
                  Math.random() * duration + duration
              )
              .easing(TWEEN.Easing.Exponential.InOut)
              .start();
          tweens.push(tween)
        }
        tween = new TWEEN.Tween({x: 0})
            .to({x: 1}, duration * 2)
            .onUpdate(() => {
              renderBus.emit()
            })
            .start();
        tweens.push(tween)
        animate()

        function animate() {
          if (Date.now() > ended_at) {
            return;
          }
          requestAnimationFrame(animate)
          tweens.map((t) => t.update())
        }
      })
      nextTick(() => {
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
            .onUpdate(() => renderBus.emit())
            .repeat(Infinity)
            .onStop(() => {
              scene.rotation.y = 0;
            })
            .onComplete(() => {
            })
        animate()

        function animate() {
          requestAnimationFrame(animate)
          if (tween.isPlaying()) {
            tween.update()
          }
        }

        rotateBus.on((v) => {
          if (!props.entered || !v) {
            tween.stop()
            shine.resume()
            return
          }
          shine.pause();
          tween.start()
        })
      })
      const showLucky = (users: any[]) => {
        const indexes = []
        users.forEach(({id}) => {
          const index = luckyIndexes.value[id]
          if (typeof index === "number") {
            indexes.push(index)
          }
        })
        if (indexes.length !== users.length) {
          setTimeout(() => showLucky(users), 500)
          return;
        }
        // ElMessage.success(`恭喜${text.join("、")}获得${currentPrize.title}, 新的一年必定旺旺旺。`)
        const duration = 600,
            width = 140,
            height = 87,
            ySize = Math.ceil(indexes.length / 5),
            xSize = indexes.length,
            xStart = -(xSize - 1) / 2,
            yStart = -(ySize - 1) / 2,
            tweens: TWEEN.Tween[] = [];
        for (let y = 0; y < ySize; y++) {
          for (let x = 0; x < xSize; x++) {
            const i = y*xSize + x
            const object = cssObjects[indexes[i]];
            tweens.push(new TWEEN.Tween(object.position)
                .to(
                    {
                      x: (x + xStart) * width * Resolution,
                      y: (y + yStart) * height * Resolution,
                      z: 2200
                    },
                    Math.random() * duration + duration
                )
                .easing(TWEEN.Easing.Exponential.InOut)
                .start());
            tweens.push(new TWEEN.Tween(object.rotation)
                .to(
                    {
                      x: 0,
                      y: 0,
                      z: 0
                    },
                    Math.random() * duration + duration
                )
                .easing(TWEEN.Easing.Exponential.InOut)
                .start())
          }
        }
        tweens.push(new TWEEN.Tween({})
            .to({}, duration * 2)
            .onUpdate(() => renderBus.emit())
            .start())
        const ended_at = Date.now() + duration * 2
        function animate() {
          if (Date.now() > ended_at) {
            return;
          }
          requestAnimationFrame(animate)
          tweens.map((t) => t.update())
        }
        animate()
      }
      luckyBus.on((users: any[]) => {
        if (users.length <= 0) {
          switchBus.emit([true, 300])
          return;
        }
        rotateBus.emit(true)
        setTimeout(() => {
          rotateBus.emit(false)
        }, 1000)
        showLucky(users)
      })
      switchBus.emit([props.entered, 2000])
      useEventListener(window, 'resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderBus.emit()
      })
    }
  })
  watchEffect(() => {
    props.users
    renderBus.emit();
  })
  watchEffect(() => {
    switchBus.emit([props.entered, 2000])
  })
  watchEffect(() => {
    luckyBus.emit(props.luckyUsers)
  })
  watchEffect(() => {
    rotateBus.emit(props.drawing == 1)
  })
}
</script>
<style scoped>
.container {
  z-index: 3;
  position: relative;
  margin: 0 15vh;
}
.none{
  display: none;
}
</style>
<style>

.element {
  width: 12vh;
  height: 16vh;
  box-shadow: 0 0 12px rgba(0, 255, 255, 0.5);
  border: 1px solid rgba(127, 255, 255, 0.25);
  text-align: center;
  cursor: default;
  transition: background-color 0.3s ease-in;
  overflow: hidden;
}

.element .avatar {
  width: 60px;
  margin: 0 auto;
  border-radius: 30px 30px;
  margin-top: 10px;
  margin-bottom: 5px;
}

.element:hover {
  box-shadow: 0 0 12px rgba(0, 255, 255, 0.75);
  border: 1px solid rgba(127, 255, 255, 0.75);
}

.element .name {
  position: absolute;
  top: 7vh;
  left: 0;
  right: 0;
  font-size: 2.2vh;
  white-space: nowrap;
  overflow: hidden;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.75);
  text-shadow: 0 0 1vh rgba(0, 255, 255, 0.95);
}

.element .details {
  position: absolute;
  bottom: 1.2vh;
  left: 0;
  right: 0;
  font-size: 1.6vh;
  color: rgba(127, 255, 255, 0.75);
}

.highlight {
  background-color: rgba(253, 105, 0, 0.95) !important;
  box-shadow: 0 0 12px rgba(253, 105, 0, 0.95);
  border: 1px solid rgba(253, 105, 0, 0.25);
}

.highlight.element .name {
  text-shadow: 0 0 16px rgba(255, 255, 255, 0.95);
}

.prize.element .name {
  text-shadow: none;
}

.prize.element {
  transition: background-color 1.5s ease-in 0.3s;
  background-color: rgba(253, 105, 0, 0.85) !important;
  box-shadow: 0 0 12px rgba(253, 105, 0, 0.95);
}
</style>