<template>
	<view class="handlepriceandstockview">
		
		<!-- 自定义导航栏 -->
		<cu-custom bgColor="bg-gradual-blue" isBack>
			<block slot="content">{{i18n.nav.handlerpriceandstock}}</block>
		</cu-custom>
		
		<!-- 商品名称 -->
		<view v-if="product" class="margin text-xxl text-center text-bold text-black">{{ product.title }}</view>
		
		<!-- 商品规格库存table -->
		<goodspectable class="goodstable padding" :attributeList="attributeList" :specs="specs"></goodspectable>
		
	</view>
</template>

<script>
	
	var _this
	import goodspectable from '@/components/base/goodspectable.vue'
	
	export default {
		data() {
			return {
				pid: null, // 默认商品id
				
				product: null, // 商品数据
				
				attributeList: [], // 商品属性数据
				specs: [], // 商品规格数据
			};
		},
		
		components: {
			goodspectable
		},
		
		onLoad(option) {
			
			_this = this
			let pid = option.pid
			this.pid = pid
			
			// 加载详情页数据
			_this.loaddetaildata()
			
		},
		
		methods: {
			
			// 加载商详信息
			loaddetaildata() {
				_this.$api.goodsapi.getgoodsdetail({pid: _this.pid}).then(response => {
					// 获取详情成功
					let product = response.data.product
					_this.product = product
					
					// 获取属性列表和规格列表
					let attributeList = product.attributeList
					let specs = product.specs
					_this.attributeList = attributeList
					_this.specs = specs
					
				}).catch(error => {
					// 获取详情失败
					uni.showToast({
						title: _this.i18n.error.loaderror,
						icon: 'none'
					});
				})
				
			},
			
		},
		
		
		
		
	}
</script>

<style lang="scss" scoped>
	
	page{
		width: 100%;
		height: 100%;
		background-color: #FFFFFF;
	}
	
	.handlepriceandstockview{
		height: 100%;
		
		
	}
	
</style>
