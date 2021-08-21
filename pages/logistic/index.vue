<template>
	<view class="logistic">
		
		<!-- 导航栏 -->
		<cu-custom bgColor="bg-gradual-pink">
			<block slot="content">{{i18n.nav.logistic}}</block>
		</cu-custom>
		
		<button class="cu-btn round cuIcon-deliver_fill bg-gradual-pink" style="margin: 50rpx;" @tap.stop="checklogistic">查询物流</button>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		
		methods: {
			
			// 查询物流轨迹
			checklogistic() {
				uni.navigateTo({
					url: `/pages/logistic/checklogisticresult`
				});
			},
			
			//
		},
	}
</script>

<style lang="scss" scoped>

</style>
