<template>
  <div class="container" ref="containerRef" >
      <div class="none">
        <div v-for="([y, x, i, highlight, blue], key) in matrix" :key="key" ref="elementsRef">
          <template v-if="getters.user(i, users)">
            <div class="element"  :class="{lightitem: highlight, highlight: (highlight && !entered)|| (entered && luckyIndexes[getters.user(i, users).id] == key)}" :style="highlight && !entered? '': `background-color: rgba(0,127,127,${blue}`">
                <img class="avatar" :src="getters.avatar(i, users)" alt="">
                <div class="name">{{getters.user(i, users).nickname}}</div>
                <div class="details">{{getters.user(i, users).mobile}}</div>
            </div>
          </template>
        </div>
      </div>
  </div>
</template>
<script setup lang="ts">
import * as THREE from 'three'
import {CSS3DObject, CSS3DRenderer} from 'three/examples/jsm/Addons'
import {TrackballControls} from 'three/examples/jsm/Addons'
import {useLuckyIndexes} from "~/composables/useLuckyIndexes";
import {use3DSurfaces} from "~/composables/use3DSurfaces";
import {useLuckyTweens} from "~/composables/useLuckyTween";

const {getters} = usePrizeData();
const emit = defineEmits(['sync']);
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
      props.users.filter(({prize_id}) => prize_id > 0),
      props.luckyUsers,
  ).map(({id}) => id).sort()
})
const {indexes: luckyIndexes, isInIndexes: isLuckyIndex, current: currentLuckyIndexes} = useLuckyIndexes(luckyIds, () => props.luckyUsers)
const { matrix, shine } = useMainMatrix(([y, x, i], index) => {
  const user = getters.user(i, props.users)
  if (!user) {
    return false
  }
  return isLuckyIndex(user.id, index)
});
const {animate, getRotate} = useTweens();
const renderBus = useEventBus<string>('render')
const switchBus = useEventBus<[boolean, number]>('switch')
const luckyBus = useEventBus<any[]>('lucky')
const rotateBus = useEventBus<boolean>('rotate')
const getSurfaceTweens = use3DSurfaces(matrix.value)
const getSphereTweens = use3DSpheres(matrix.value)
const getLuckyTweens = useLuckyTweens()
const sync = useIntervalFn(() => {
  emit('sync')
}, 3000);
console.log(sync)

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
      camera.position.z = 3500;
      const scene = new THREE.Scene();
      const cssObjects = matrix.value.map((_, i) => {
        const object = new CSS3DObject(elements[i])
        object.position.x = Math.random() * 4000 - 2000;
        object.position.y = Math.random() * 4000 - 2000;
        object.position.z = Math.random() * 4000 - 2000;
        scene.add(object);
        return object
      });
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
        const tweens = v ? getSphereTweens(cssObjects, duration) : getSurfaceTweens(cssObjects, duration)
        animate(tweens, duration, () => renderBus.emit())
      })
      const rotate = getRotate(scene, () => renderBus.emit())
      rotateBus.on((v) => {
        if (!props.entered || !v) {
          rotate.stop()
          sync.resume();
          shine.resume()
          return
        }
        shine.pause();
        sync.pause();
        rotate.start();
      })

      luckyBus.on((indexes: any[]) => {
        if (indexes.length <= 0) {
          switchBus.emit([true, 300])
          return;
        }
        rotateBus.emit(true)
        setTimeout(() => {
          rotateBus.emit(false)
        }, 1000)
        const tweens = getLuckyTweens(cssObjects.filter((_, index) => indexes.includes(index)), 600)
        animate(tweens, 600, () => renderBus.emit())
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
    luckyBus.emit(currentLuckyIndexes.value)
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
  margin: 0 10vh;
}
.none{
  display: none;
}
</style>
<style>

.element {
  width: 120px;
  height: 160px;
  box-shadow: 0 0 12px rgba(0, 255, 255, 0.5);
  border: 1px solid rgba(127, 255, 255, 0.25);
  text-align: center;
  cursor: default;
  transition: background-color 0.3s ease-in;
  overflow: hidden;
}

.element .avatar {
  width: 80px;
  margin: 0 auto;
  border-radius: 40px 40px;
  margin-top: 10px;
  margin-bottom: 5px;
}

.element:hover {
  box-shadow: 0 0 12px rgba(0, 255, 255, 0.75);
  border: 1px solid rgba(127, 255, 255, 0.75);
}

.element .name {
  position: absolute;
  top: 95px;
  left: 0;
  right: 0;
  font-size: 25px;
  white-space: nowrap;
  overflow: hidden;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.75);
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.95);
}

.element .details {
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  font-size: 18px;
  color: rgba(127, 255, 255, 0.75);
  text-align: center;
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