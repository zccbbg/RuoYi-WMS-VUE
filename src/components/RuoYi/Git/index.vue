<template>
  <div>
    <svg-icon icon-class="github" @click="goto" />
  </div>
</template>

<script setup>
const url = ref('https://gitee.com/zccbbg/ruoyi-wms-service');

function goto() {
  window.open(url.value)
}
</script>
