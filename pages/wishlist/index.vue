<template>
	<view class="wishlistview content">
		
		<!-- 导航栏 -->
		<cu-custom bgColor="bg-gradual-pink" isBack>
			<block slot="content">{{i18n.nav.wishlist}}</block>
		</cu-custom>
		
		<!-- 功能区域 -->
		<view class="grid col-2 padding-sm">
			
			<view class="padding-sm">
				<view class="padding radius text-center shadow-blur shadow-warp bg-pink" @tap.stop="addwish">
					<view class="text-lg cuIcon-magic text-white"></view>
					<view class="margin-top-sm text-Abc">I want</view>
				</view>
			</view>
			
			<view class="padding-sm">
				<view class="padding radius text-center shadow-blur shadow-warp bg-green" @tap.stop="checkwishlist">
					<view class="text-lg cuIcon-emojifill text-white"></view>
					<view class="margin-top-sm text-Abc">Check Wishlist</view>
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
					url: '/pages/wishlist/handlewish?type=add'
				});
			},
			
			// 查看心愿列表
			checkwishlist() {
				// uni.navigateTo({
				// 	url: '/pages/wishlist/wishlist'
				// });
				uni.navigateTo({
					url: '/pages/wishlist/newwishlist'
				});
			},
			
			//
			
		},
	}
</script>

<style lang="scss" scoped>
	
	

</style>
