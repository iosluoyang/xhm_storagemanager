<template>
	
	<view class="hyloading cu-load load-modal" v-if="loadModal">
		<image :src="iconImg" mode="aspectFit"></image>
		<view class="gray-text">{{i18n.tip.loadingstr}}</view>
	</view>
	
</template>

<script>
	export default {
		name: "loading",
		props: {
			
			// 是否显示加载框
			loadModal: {
				type: Boolean,
				default: false
			},
			
			// 加载框中间的图片
			iconImg: {
				type: String,
				default: '/static/publicicon/logo.png'
			}
		},
	}
</script>

<style lang="scss" scoped>
	.hyloading{
		z-index: 800;
	}
</style>
