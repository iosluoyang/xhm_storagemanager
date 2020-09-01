<template>
	<view class="content wishdetailview">
		
		<!-- 导航栏 -->
		<cu-custom bgImage="https://image.weilanwl.com/color2.0/plugin/wdh2236.jpg" isBack>
			<block slot="content">{{i18n.nav.wishlist}}</block>
		</cu-custom>
		
		<!-- 详情区域 -->
		<view class="detailview">
			{{JSON.stringify(wishinfo)}}
		</view>
		
		<view class="padding-xl">
			<button class="cu-btn radius bg-gradual-pink block" @tap.stop="editwish">{{i18n.base.edit}}</button>
			<button class="cu-btn radius line-red block margin-top-sm" @tap.stop="deletewish">{{i18n.base.del}}</button>
		</view>
		
	</view>
</template>

<script>
	
	var _this
	
	export default {
		data() {
			return {
				id: null, // 当前心愿详情id
				wishinfo: null, // 当前心愿详情
			};
		},
		
		onLoad(option) {
			_this = this
			
			let id = option.id
			this.id = id
			
			if(this.id) {
				// 开始加载心愿详情数据
				this.loaddetaildata()
			}
			else {
				uni.showToast({
					title: _this.i18n.error.loaderror,
					icon: 'none'
				});
				setTimeout(function() {
					uni.navigateBack();
				}, 1500);
			}
			
			uni.$on('updatewishdetail', function() {
				_this.loaddetaildata()
			})
			
		},
		
		onUnload() {
			uni.$off('updatewishdetail')
		},
		
		methods: {
			
			// 获取心愿详情
			loaddetaildata() {
				
				uniCloud.callFunction({
					name: 'wishlist',
					data: {
						type: 'getdetail',
						info: {
							_id: this.id
						}
					}
				}).then(response => {
					// 获取心愿详情数据成功
					let info = response.result.data[0]
					_this.wishinfo = info
				}).catch(error => {
					uni.showToast({
						title: _this.i18n.error.loaderror,
						icon: 'none'
					});
				})
				
			},
			
			// 编辑心愿
			editwish() {
				uni.navigateTo({
					url: `/pages/wishlist/handlewish?type=edit&id=${this.id}`
				});
			},
			
			// 删除心愿
			deletewish() {
				
				uni.showModal({
					content: _this.i18n.tip.deleteconfirm,
					showCancel: true,
					cancelText: _this.i18n.base.cancel,
					confirmText: _this.i18n.base.confirm,
					success: res => {
						if(res.confirm) {
							// 开始删除
							
							uniCloud.callFunction({
								name: 'wishlist',
								data: {
									type: 'delete',
									info: {
										_id: _this.id
									}
								}
							}).then(response => {
								// 删除成功
								uni.showToast({
									title: _this.i18n.tip.deletesuccess,
									icon: 'none'
								});
								// 更新列表数据
								uni.$emit('updatewishlist')
								// 返回
								setTimeout(function() {
									uni.navigateBack();
								}, 1500);
								
							}).catch(error => {
								// 删除失败
								uni.showToast({
									title: _this.i18n.error.deleteerror,
									icon: 'none'
								});
							})
							
						}
					},
				})
				
			},
			
			
		},
	}
</script>

<style lang="scss" scoped>
	
</style>
