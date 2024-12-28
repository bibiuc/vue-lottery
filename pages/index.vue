<template>
  <div>
    <StarBackground />
    <MusicBox/>
    <ClientOnly>
      <MainContainer :users="data.allUsers" :drawing="drawing" :entered="entered" :luckyUsers="data.luckyUsers" @sync="actions.syncAllUsers()"/>
    </ClientOnly>
    <PrizeList :prizes="data.prizes" :current="data.prize.id"/>

    <div class="menu">
      <div class="lotteryBar" v-if="entered">
        <button class="lottery" v-if="drawing == 0" @click="drawing = 1">开始抽奖</button>
        <button class="lottery" v-if="drawing == 1" @click="lottery()">停止</button>
        <button class="lottery" v-if="drawing == 2" @click="saveLuckyUsers()">确认结果</button>
        <button class="reLottery" v-if="drawing == 2" @click="reLottery()" >重新抽奖</button>
        <div class="fixed-bar">
          <div class="qrcode-text">共计 <span style="color: darkred;">{{data.allUsers.length}}</span>人参与抽奖人</div>
          <img class="qrcode" src="https://sh.rbsoft.cn/assets/img/build.png" alt=""/>
          <div class="qrcode-text">二维码</div>
          <button @click="toggle">全屏</button>
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
const { params } = useRoute();
const { actions, data } = usePrizeData()
const id = params ? ((params.id as string)||'1') : '1'
const reload = () => {
  actions.syncPrizes(id);
  actions.syncPrize(id);
  actions.syncAllUsers(id);
}
const { toggle } = useFullscreen()
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
const resetAll = async () => {
  await ElMessageBox.confirm('你确定要重新开始抽取所有奖项吗?');
  await actions.reset(id);
  drawing.value = 0;
  reload()
}
reload();
</script>
<style scoped lang="less">


.menu {
  z-index: 4;
  margin-left: 12vh;
  position: absolute;
  bottom: 15px;
  width: 100%;
  text-align: center;
  button {
    color: rgba(127, 255, 255, 0.75);
    background: transparent;
    outline: 1px solid rgba(127, 255, 255, 0.75);
    border: 0;
    padding: 12px 28px;
    margin: 0 18px;
    font-size: 27px;
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
  .fixed-bar {
    position: fixed;
    right: 30px;
    bottom: 0px;
    width: 210px;
    button{
      margin: 15px 0;
      padding: 12px 0;
      display: block;
      width: 100%;
    }
    .qrcode{
      display: block;
      outline: 1px solid rgba(127, 255, 255, 0.75);
      width: 180px;
      margin:10px auto;
    }
    .qrcode-text{
      color: rgba(127, 255, 255, 0.75);
      background: transparent;
      font-size: 27px;
      margin-bottom:50px;
    }
  }
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
</style>