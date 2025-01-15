<template>
  <div class="prizeBar">
    <div class="prize-mess" v-if="currentPrize">
      正在抽取
      <label id="prizeType" class="prize-shine">{{currentPrize.name}}</label>
      <label id="prizeText" class="prize-shine">{{currentPrize.description}}</label>
      ，剩余
      <label id="prizeLeft" class="prize-shine">{{currentPrize.left}}</label>
      个
    </div>
    <ul class="prize-list">
      <template v-for="(prize, i) in prizes">
      <li  v-if="prize" :key="i" :class="{shine: prize === currentPrize}" class="prize-item" >
      <span></span><span></span><span></span><span></span>
      <div class="prize-img">
        <img :alt="prize.title" :src="prize.image">
      </div>
      <div class="prize-text">
        <h5 class="prize-title">
          {{prize.name}}
          {{ prize.description }}
        </h5>
        <div class="prize-count">
          <div class="progress">
            <div :style="{width:getWidth(prize)}" class="progress-bar progress-bar-danger progress-bar-striped active">
            </div>
          </div>
          <div  class="prize-count-left">
            {{prize.left}} / {{prize.max}}
          </div>
        </div>
      </div>
      </li>
      </template>
    </ul>
  </div>
</template>
<script setup>
const props = defineProps({
  prizes: {
    type: Array,
    required: true
  },
  current: {
    type: Number,
    default: 0
  }
})
const currentPrize = computed(() => {
  let i = 0, prize;
  if (typeof props.current !== 0) {
    for (; i < props.prizes.length; i++) {
      prize = props.prizes[i]
      if (prize.id === props.current) {
        return prize
      }
    }
  }
  for (; i < props.prizes.length; i++) {
    prize = props.prizes[i]
    if (prize.status > 1) {
      return prize
    }
  }
  return prize
})
const getWidth = (prize) => {
  return Math.round((prize.left * 100)/prize.max) + "%";
}
</script>
<style scoped>

.prizeBar {
  position: fixed;
  left: 0;
  padding-left: 1.2vh;
  top: 1.2vh;
  z-index: 2;
}

.prize-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.prize-item {
  padding: 9px;
  margin: 6px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  flex-wrap: nowrap;
  background-color: rgba(0, 127, 127, 0.37);
  border: 1px solid rgba(127, 255, 255, 0.25);
  color: rgba(127, 255, 255, 0.75);
  width: 32vh;
  height: 10vh;
  box-sizing: border-box;
  transition: transform 1s ease-in;
}

.prize-item .prize-img {
  width: 8vh;
  height: 8vh;
  margin-right: 1.2vh;
  border-radius: 50%;
  background-color: #fff;
  text-shadow: 0 0 1vh rgba(0, 255, 255, 0.95);
  overflow: hidden;
}

.prize-img img {
  width: 90%;
  height: 90%;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.prize-text {
  flex: 1;
}

.prize-title {
  margin: 4px 0;
  font-size: 1.8vh;
}

.prize-count {
  padding: 4px 0;
  position: relative;
}

.prize-count .progress {
  height: 1.8vh;
  background: rgba(0, 0, 0, 0.5);
  padding: 1px;
  overflow: visible;
  border-radius: 1vh;
}

.progress .progress-bar {
  border-radius: 1.8vh;
  position: relative;
  animation: animate-positive 2s;
  background-color: #d9534f;
  height: 1.8vh;
  -webkit-transition: width 0.6s ease;
  -o-transition: width 0.6s ease;
  transition: width 0.6s ease;
}

.progress-bar.active {
  animation: reverse progress-bar-stripes 0.4s linear infinite,
  animate-positive 2s;
}

.progress-bar-striped {
  background-image: -webkit-linear-gradient(45deg,
  rgba(255, 255, 255, 0.15) 25%,
  transparent 25%,
  transparent 50%,
  rgba(255, 255, 255, 0.15) 50%,
  rgba(255, 255, 255, 0.15) 75%,
  transparent 75%,
  transparent);
  background-image: -o-linear-gradient(45deg,
  rgba(255, 255, 255, 0.15) 25%,
  transparent 25%,
  transparent 50%,
  rgba(255, 255, 255, 0.15) 50%,
  rgba(255, 255, 255, 0.15) 75%,
  transparent 75%,
  transparent);
  background-image: linear-gradient(45deg,
  rgba(255, 255, 255, 0.15) 25%,
  transparent 25%,
  transparent 50%,
  rgba(255, 255, 255, 0.15) 50%,
  rgba(255, 255, 255, 0.15) 75%,
  transparent 75%,
  transparent);
  -webkit-background-size: 8px 8px;
  background-size: 8px 8px;
}

.shine {
  box-shadow: 0 0 15px 0 rgba(0, 255, 255, 0.5);
  transform: scale(1.2);
  transform-origin: left center;
  position: relative;
  overflow: hidden;
}

.done {
  position: relative;
}

.done:after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  cursor: not-allowed;
}


.shine span {
  position: absolute;
  display: block
}

.shine span:nth-child(1) {
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #03e9f4);
  animation: animate1 1s linear infinite
}

@keyframes animate1 {
  0% {
    left: -100%
  }

  50%,
  100% {
    left: 100%
  }
}

.shine span:nth-child(2) {
  top: -100%;
  right: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(180deg, transparent, #03e9f4);
  animation: animate2 1s linear infinite;
  animation-delay: .25s
}

@keyframes animate2 {
  0% {
    top: -100%
  }

  50%,
  100% {
    top: 100%
  }
}

.shine span:nth-child(3) {
  bottom: 0;
  right: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(270deg, transparent, #03e9f4);
  animation: animate3 1s linear infinite;
  animation-delay: .50s
}

@keyframes animate3 {
  0% {
    right: -100%
  }

  50%,
  100% {
    right: 100%
  }
}

.shine span:nth-child(4) {
  bottom: -100%;
  left: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(360deg, transparent, #03e9f4);
  animation: animate4 1s linear infinite;
  animation-delay: .75s
}

@keyframes animate4 {
  0% {
    bottom: -100%
  }

  50%,
  100% {
    bottom: 100%
  }
}


.shine.prize-item {
  /* width: 24vh; */
  margin: 1.8vh 0;
}

.prize-mess {
  color: #fff;
  line-height: 5vh;
  font-size: 1.6vh;
  margin: 2.4vh 0;
}

.prize-shine {
  font-size: 5vh;
  font-weight: bold;
  color: #db5c58;
  vertical-align: middle;
  padding: 0 6px;
}

</style>