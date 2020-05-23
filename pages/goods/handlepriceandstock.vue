<template>
	<view class="handlepriceandstockview">
		
		<!-- 自定义导航栏 -->
		<cu-custom bgColor="bg-gradual-blue" isBack isBackConfirm>
			<block slot="content">{{i18n.nav.handlerpriceandstock}}</block>
		</cu-custom>
		
		<!-- 商品名称 -->
		<view v-if="product" class="margin text-xxl text-center text-bold text-black">{{ product.title }}</view>
		
		<!-- 商品规格table -->
		<goodspectable v-if="attributeList && attributeList.length > 0 && specs && specs.length > 0" class="goodstable padding" type="price" :attributeList="attributeList" :specs="specs" @getnewspecs="getnewspecs"></goodspectable>
		
		<!-- 保存按钮 -->
		<view class="bottombtnsview padding flex align-center">
			
			<!-- 确定按钮 -->
			<button class="flex-sub cu-btn round bg-blue lg" @tap.stop="confirm" :loading="ifshowloading">
				<text class="text-white">{{i18n.base.confirm}}</text>
			</button>
			
		</view>
		
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
				newspecs: [], // 商品最新的规格数据(用于数据上送时使用)
				tableData: [], // 当前的tabledata数据
				
				ifshowloading: false, // 是否显示正在加载动画
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
			
			// 获取goodspectable组件传来的最新的specs数据
			getnewspecs(newspecs) {
				this.newspecs = newspecs
			},
			
			// 确定事件
			confirm() {
				// 根据当前的tabledata获取最新的specs数据
				_this.ifshowloading = true
				
				// 开始修改价格信息
				let data = {
					pid: _this.pid,
					specs: _this.newspecs
				}
				_this.$api.goodsapi.fixgoodsprice(data).then(response => {
					// 修改成功
					_this.ifshowloading = false
					uni.$emit('updateprodetail') // 发送更新事件
					uni.showToast({
						title: _this.i18n.tip.fixsuccess,
						icon: 'none',
						duration: 1500
					});
					
					setTimeout(function() {
						uni.navigateBack();
					}, 1500);
					
				}).catch(error => {
					_this.ifshowloading = false
					uni.showToast({
						title: _this.i18n.error.fixerror,
						icon: 'none',
						duration: 1500
					});
				})
				
			},
		},
		
		
		
		
	}
</script>

<style lang="scss" scoped>
	
	page{
		width: 100%;
		height: 100vh;
		background-color: #FFFFFF;
	}
	
	.handlepriceandstockview{
		height: 100%;
		
		
	}
	
</style>
