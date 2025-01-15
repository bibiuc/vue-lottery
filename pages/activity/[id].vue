<template>
  <div>
    <el-image :src="background" class="ui-fullscreen" fit="cover"></el-image>
    <div class="ui-bottom-buttons">
      <el-button type="primary" class="ui-shadow" @click="router.push(`/activity/${id}/lottery`)">抽奖活动</el-button>
      <el-button type="primary" class="ui-shadow" @click="showQrCodeModal = true">签到二维码</el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
const router = useRouter();
const { params } = useRoute();
const id = params ? (params.id ||1) : 1
const background = '';
const { show: showQrCodeModal } = useQrCodeModal();
</script>
<style scoped>
.ui-fullscreen{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}
.ui-bottom-buttons{
  position: fixed;
  z-index: 1;
  left: 20%;
  width: 60%;
  bottom: 100px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
}
.ui-shadow {
  box-shadow: #666 4px 4px 6px 1px;
}
</style>