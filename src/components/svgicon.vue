<script setup lang="ts">
  // SVG图标组件
  import { computed } from 'vue';
  // 接收父组件传递过来的数据
  const props = defineProps({
    iconName: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: ''
    },
    size: {
      type: [Number, String],
      default: 16
    }
  })
  // 计算属性，生成对应的symbolId
  const symbolId = computed(() => `#icon-${props.iconName}`);
</script>

<template>
  <svg aria-hidden="true" :style="{ width: size + 'px', height: size + 'px' }">
    <use :xlink:href="symbolId" :fill="color" />
  </svg>
</template>

<style scoped>
  .svg-icon {
    fill: currentColor;
    vertical-align: middle;
  }
</style>