<template>
  <div>
    <NuxtPage />
    <QrCodeModal></QrCodeModal>
  </div>
</template>
<style>
html,
body {
  height: 100%;
}

body {
  background: linear-gradient(to bottom, #131313 0%, #02101c 100%);
  margin: 0;
  font-family: Helvetica, sans-serif;
  overflow: hidden;
}

a {
  color: #ffffff;
}

.none {
  display: none;
}
</style>