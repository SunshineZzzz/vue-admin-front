<script lang="ts" setup>
	import SvgIcon from '@/components/svgicon.vue'
  const props = defineProps<{
    items: Array<{ name: string; path?: string }>
  }>()
</script>

<template>
  <div class="bread-crumb">
    <SvgIcon icon-name="location" class="bread-crumb-icon" />
    <el-breadcrumb separator="/">
      <el-breadcrumb-item 
        v-for="(item, index) in props.items" 
        :key="index"
        :class="{ 'last-item': index === props.items.length - 1 }"
      >
        <!-- 如果是可点击的链接 -->
        <router-link v-if="item.path && index !== props.items.length - 1" :to="item.path">
          {{ item.name }}
        </router-link>
        <!-- 最后一层不可点击 -->
        <span v-else>{{ item.name }}</span>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<style lang="scss" scoped>
	.bread-crumb {
		height: 30px;
		padding: 0 20px;
		display: flex;
		align-items: center;
	}
	
	.bread-crumb-icon {
		margin-right: 4px;
	}
	
	:deep(.el-breadcrumb__item) {
		height: 30px;
		font-size: 14px;
		line-height: 30px;
	}

	:deep(.el-breadcrumb__inner) {
		font-weight: 500;
	}
</style>