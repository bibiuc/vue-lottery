<template>
  <div class="music" :class="{animating}">
    <audio ref="musicRef" :src="mp3" class="music-item" autoplay loop @pause="animating = false" @playing="animating = true"></audio>
    <div class="music-box" title="播放/暂停背景音乐" @click="toggle" >Music</div>
  </div>
</template>
<script lang="ts" setup>
import mp3 from '@/assets/music.mp3'
const musicRef = ref<HTMLAudioElement>(undefined)
const animating = ref(true)
const toggle = () => {
  if (musicRef.value) {
    const music = musicRef.value
    if (music.paused) {
      music.play()
    } else {
      music.pause();
    }
  }
}
</script>
<style scoped>

.music {
  position: fixed;
  top: 3vh;
  right: 4vh;
  z-index: 5;
}

.music-item {
  display: block !important;
  opacity: 0;
}

.music-box {
  width: 5vh;
  height: 5vh;
  border-radius: 50%;
  text-align: center;
  line-height: 5vh;
  font-size: 1.4vh;
  color: #fff;
  cursor: pointer;
  background-color: rgba(253, 105, 0, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.music.animating .music-box{
  animation-play-state: running;
}
.music .music-box{
  animation-name: rotate;
  animation-duration: 4s;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-play-state: paused;
}
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>