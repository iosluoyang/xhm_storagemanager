<template>
	<view class="pagecontent">
		
		<!-- 自定义导航栏 -->
		<cu-custom bgColor="bg-gradual-pink" isBackConfirm>
			<block slot="content">{{i18n.nav.wishdraft}}</block>
		</cu-custom>
		
		<!-- 其他的内容视图 -->
		<form class="fillcontentform">
			
			<!-- 商品别名 -->
			<view class="cu-form-group">
				<view class="title">{{i18n.wishlist.common.aliasname}} :</view>
				<view class="content flex-sub flex align-center">
					<input class="text-right" :auto-focus=" type == 'add' " type="text" placeholder-class=" text-sm text-grey " v-model="aliasName" :placeholder="i18n.placeholder.handlewish.aliasname" />
				</view>
			</view>
			
		</form>
		
		
		
	</view>
</template>

<script>
	
	var _this
	
	export default {
		
		components: {
			
		},
		
		data() {
			return {
				
				type: 'add', // 页面状态 add新增 edit编辑 copy 拷贝
				
				aliasName: '', // 别名
				
				
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
