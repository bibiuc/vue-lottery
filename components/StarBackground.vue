<template>
  <div class="canvas-box">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>
<script setup>
const canvasRef = ref(null);
if (!import.meta.env.SSR) {
  onMounted(() => {
    if (canvasRef.value) {
      const canvas = canvasRef.value;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const c = canvas.getContext("2d");

      const numStars = 800;
      const radius = "0." + Math.floor(Math.random() * 9) + 1;
      const focalLength = canvas.width * 2;
      let centerX, centerY;

      const stars = [];
      let star;
      let i;

      let animate = true;

      initializeStars();

      function executeFrame() {
        if (animate) requestAnimationFrame(executeFrame);
        moveStars();
        drawStars();
      }

      function initializeStars() {
        centerX = canvas.width / 2;
        centerY = canvas.height / 2;

        stars.splice(0, stars.length);
        for (i = 0; i < numStars; i++) {
          star = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            z: Math.random() * canvas.width,
            o: "0." + Math.floor(Math.random() * 99) + 1
          };
          stars.push(star);
        }
      }

      function moveStars() {
        for (i = 0; i < numStars; i++) {
          star = stars[i];
          star.z--;

          if (star.z <= 0) {
            star.z = canvas.width;
          }
        }
      }

      function drawStars() {
        let pixelX, pixelY, pixelRadius;

        // Resize to the screen
        if (
            canvas.width !== window.innerWidth ||
            canvas.width !== window.innerWidth
        ) {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          initializeStars();
        }
        c.fillStyle = "rgba(0,10,20,1)";
        c.fillRect(0, 0, canvas.width, canvas.height);
        c.fillStyle = "rgba(209, 255, 255, " + radius + ")";
        for (i = 0; i < numStars; i++) {
          star = stars[i];

          pixelX = (star.x - centerX) * (focalLength / star.z);
          pixelX += centerX;
          pixelY = (star.y - centerY) * (focalLength / star.z);
          pixelY += centerY;
          pixelRadius = 1 * (focalLength / star.z);

          c.fillRect(pixelX, pixelY, pixelRadius, pixelRadius);
          c.fillStyle = "rgba(209, 255, 255, " + star.o + ")";
          // c.fill();
        }
      }


      executeFrame();
    }
  })
}
</script>
<style scoped>

.canvas-box {
  position: fixed;
  left: 0;
  top: 0;
  z-index: -1;
}
</style>