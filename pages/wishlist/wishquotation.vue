<template>
	<view class="pagecontent wishquotation">
		
		<!-- 自定义导航栏 -->
		<cu-custom bgColor="bg-gradual-pink" isBackConfirm>
			<block slot="content">{{ i18n.nav.wishdetail }}</block>
		</cu-custom>
		
		<!-- 其他的内容视图 -->
		
		
	</view>
</template>

<script>
	
	var _this
	
	export default {
		
		components: {
			
		},
		
		data() {
			return {
				wishId: null, // 心愿id
			}
		},
		
		// 页面加载后
		onLoad() {
			_this = this
			
			//
		},
		
		methods: {
			
			// 获取心愿详情
			loadWishDetail() {
				let wishId = this.wishId

			},
			//
			
		}
	}
</script>

<style lang="scss" scoped>
	
	.pagecontent {
		
	}
	
</style>
