<template>
	<view class="pagecontent">
		
		<!-- 自定义导航栏 -->
		<cu-custom bgColor="bg-gradual-orange">
			<block slot="content">{{i18n.nav.shipping}}</block>
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
				
			}
		},
		
		// 页面加载后
		onLoad() {
			_this = this
			
			//
		},
		
		methods: {
			
			//
			
		}
	}
</script>

<style lang="scss" scoped>
	
	.pagecontent {
		
	}
	
</style>
