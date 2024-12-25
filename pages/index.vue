<template>
  <div>
    <StarBackground />
    <MusicBox/>
    <ClientOnly>
      <MainContainer :users="data.allUsers" :drawing="drawing" :entered="entered" :luckyUsers="data.luckyUsers"/>
    </ClientOnly>
    <PrizeList :prizes="data.prizes" :current="data.prize.id"/>

    <div class="menu">
      <div class="lotteryBar" v-if="entered">
        <button class="lottery" v-if="drawing == 0" @click="drawing = 1">开始抽奖</button>
        <button class="lottery" v-if="drawing == 1" @click="lottery()">停止</button>
        <button class="lottery" v-if="drawing == 2" @click="saveLuckyUsers()">确认结果</button>
        <button class="reLottery" v-if="drawing == 2" @click="reLottery()" >重新抽奖</button>
        <div class="fixed-bar">
          <button class="save fixed-btn" @click.stop.prevent="downloadResult">导出抽奖结果</button>
          <button class="reset fixed-btn" @click="resetAll">重置</button>
        </div>
      </div>
      <button class="enter" @click="entered = true"  v-else>进入抽奖</button>
    </div>
  </div>
</template>
<script setup lang="ts">
const entered = ref(false)
const drawing = ref(0)
// const { params } = useRoute();
const { actions, data } = usePrizeData()
const id = '1'
const reload = () => {
  actions.syncPrizes(id);
  actions.syncPrize(id);
  actions.syncAllUsers(id);
}
let once = false
const lottery = async () => {
  if (drawing.value != 1) {
    return;
  }
  try{
    drawing.value = 3
    await actions.lottery(id)
    drawing.value = 2
  } catch (e) {
    drawing.value = 0
  }
  once = false
}
const reLottery = () => {
  drawing.value = 1
  data.luckyUsers = []
}
const saveLuckyUsers = async () => {
  await actions.saveLuckyUsers(id)
  reload()
  drawing.value = 0
}
const downloadResult = () => {
  actions.download(id);
}
const resetAll = () => {
  actions.reset(id);
  drawing.value = 0;
  reload()
}
reload();
</script>
<style scoped>


.menu {
  z-index: 4;
  margin-left: 15vh;
}

#info {
  position: absolute;
  width: 100%;
  color: #ffffff;
  padding: 5px;
  font-family: Monospace;
  font-size: 13px;
  font-weight: bold;
  text-align: center;
  z-index: 1;
}

.menu {
  position: absolute;
  bottom: 2vh;
  width: 100%;
  text-align: center;
}

.element {
  width: 12vh;
  height: 16vh;
  box-shadow: 0 0 12px rgba(0, 255, 255, 0.5);
  border: 1px solid rgba(127, 255, 255, 0.25);
  text-align: center;
  cursor: default;
  transition: background-color 0.3s ease-in;
}

.element:hover {
  box-shadow: 0 0 12px rgba(0, 255, 255, 0.75);
  border: 1px solid rgba(127, 255, 255, 0.75);
}

.element .company {
  position: absolute;
  top: 1.2vh;
  right: 0;
  width: 100%;
  font-size: 2vh;
  color: rgba(127, 255, 255, 0.75);
}

.element .name {
  position: absolute;
  top: 4.6vh;
  left: 0;
  right: 0;
  font-size: 2.9vh;
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

button {
  color: rgba(127, 255, 255, 0.75);
  background: transparent;
  outline: 1px solid rgba(127, 255, 255, 0.75);
  border: 0;
  padding: 1.6vh 4vh;
  margin: 0 4.6vh;
  font-size: 2vh;
  font-weight: bold;
  cursor: pointer;
}

button:hover {
  background-color: rgba(0, 255, 255, 0.5);
}

button:active {
  color: #000000;
  background-color: rgba(0, 255, 255, 0.75);
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

.prize .company,
.prize .details,
.prize .name,
.highlight .company,
.highlight .name,
.highlight .details {
  color: rgba(255, 255, 255, 0.85);
}

.dan-mu {
  visibility: hidden;
  position: fixed;
  z-index: -1;
  font-size: 12px;
  top: 1vh;
  left: 0;
  padding: 0 1.2vh;
  height: 2.2vh;
  line-height: 2.2vh;
  border-radius: 1vh;
  box-sizing: border-box;
  background-color: rgba(0, 127, 127, 0.37);
  box-shadow: 0 0 4px rgba(0, 255, 255, 0.5);
  border: 1px solid rgba(127, 255, 255, 0.25);
  color: rgba(127, 255, 255, 0.75);
}

.dan-mu.active {
  visibility: visible;
}

@-webkit-keyframes animate-positive {
  0% {
    width: 0;
  }
}

@keyframes animate-positive {
  0% {
    width: 0;
  }
}

@-webkit-keyframes progress-bar-stripes {
  from {
    background-position: 8px 0;
  }

  to {
    background-position: 0 0;
  }
}

@-o-keyframes progress-bar-stripes {
  from {
    background-position: 8px 0;
  }

  to {
    background-position: 0 0;
  }
}

@keyframes progress-bar-stripes {
  from {
    background-position: 8px 0;
  }

  to {
    background-position: 0 0;
  }
}

.prize-count-left {
  position: absolute;
  color: #fff;
  right: 9px;
  font-size: 1.8vh;
  line-height: 1.6vh;
  top: 50%;
  transform: translateY(-50%);
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

.qipao-container {
  position: fixed;
  right: 0;
  top: 10vh;
  bottom: 1vh;
  width: 24vh;
  z-index: 2;
}

.qipao {
  width: 100%;
  padding: 1.8vh 1.4vh;
  line-height: 1.414;
  margin: 4px 0;
  box-sizing: border-box;
  font-size: 14px;
  background-color: rgba(127, 255, 255, 0.25);
  color: rgba(127, 255, 255, 0.75);
}

.rotate-active {
  animation: rotate 4s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(360deg);
  }
}

.margin-l-40 {
  margin-left: 40px;
}

.fixed-bar {
  position: fixed;
  bottom: 20px;
  right: 20px;
}

.fixed-btn {
  margin: 20px 0 0;
  width: 200px;
  text-align: center;
  display: block;
}

#lottery {
  animation: breath 1.6s linear infinite;
  box-shadow: 0px 0px 15px rgb(127 255 255 / 75%);
}

@keyframes breath {
  0% {
    transform: scale(0.9);
    opacity: 0.8;
  }

  50% {
    transform: scale(1.1);
    opacity: 1;
  }

  100% {
    transform: scale(0.9);
    opacity: 0.8;
  }
}
</style>