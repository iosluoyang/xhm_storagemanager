<template>
	<view class="wishlistview content">
		
		<!-- 导航栏 -->
		<cu-custom bgImage="https://image.weilanwl.com/color2.0/plugin/wdh2236.jpg" isBack>
			<block slot="content">{{i18n.nav.wishlist}}</block>
		</cu-custom>
		
		<!-- 功能区域 -->
		<view class="grid col-2 padding-sm">
			
			<view class="padding-sm">
				<view class="padding radius text-center shadow-blur shadow-warp bg-pink" @tap.stop="addwish">
					<view class="text-lg">我想要</view>
					<view class="margin-top-sm text-Abc">I want</view>
				</view>
			</view>
			
			<view class="padding-sm">
				<view class="padding radius text-center shadow-blur shadow-warp bg-green">
					<view class="text-lg">已实现</view>
					<view class="margin-top-sm text-Abc">Achieved</view>
				</view>
			</view>
			
		</view>
		
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		
		methods: {
			
			// 新增心愿单
			addwish() {
				uni.navigateTo({
					url: '/pages/wishlist/addwish'
				});
			},
			
			//
			
		},
	}
</script>

<style lang="scss" scoped>
	
	

</style>
