<template>
	<view class="buildproductqrcode">
		
		<cu-custom bgColor="bg-gradual-orange" isBack>
			<block slot="content">{{ i18n.me.panel.proqrcode }}</block>
		</cu-custom>
		
		<view class="cu-form-group margin-top">
			<view class="title">{{ i18n.me.buildqrcode.qrcodenum }}</view>
			<input type="number" :focus="iffocus" v-model="qrcodenum" placeholder="1~500" />
		</view>
		
		<view class="tips padding text-df margin">
			{{ i18n.me.buildqrcode.tips }}
		</view>
		
		<view class="btn-group margin">
			<button class="cu-btn lg round block bg-gradual-orange shadow-blur" :class=" ifshowbtnanimation ? 'animation-shake' : '' " @tap.stop="confirm">{{ i18n.base.confirm }}</button>
		</view>
		
	</view>
</template>

<script>
	
	var _this
	export default {
		data() {
			return {
				qrcodenum: '', // 要生成的二维码数量
				iffocus: false, // 输入框是否聚焦  默认为否
				ifshowbtnanimation: false, // 是否显示按钮动画  默认为否
			};
		},
		
		onLoad() {
			_this = this
			_this.iffocus = true
		},
		
		methods: {
			
			// 确认生成
			confirm() {
				
				// 检查数据
				if(this.qrcodenum === '' || parseInt(this.qrcodenum) < 1 || parseInt(this.qrcodenum) > 500 ) {
					this.ifshowbtnanimation = true
					setTimeout(function() {
						_this.ifshowbtnanimation = false
					}, 1500);
					return
				}
				
				// 检查邮箱
				if(!this.user || !this.user.email || this.user.email === '') {
					uni.showModal({
						title: this.i18n.base.tip,
						content: this.i18n.error.lackemail,
						showCancel: true,
						cancelText: this.i18n.base.cancel,
						confirmText: this.i18n.base.confirm,
						success: res => {
							if(res.confirm) {
								// 跳往个人中心页补充邮箱
								uni.navigateTo({
									url: '/pages/me/persondetail'
								});
							}
						}
					});
					return
				}
				
				// 开始发起申请
				let data = {
					prefix: this.$basejs.storeName() , // 二维码前缀标识  默认为商户名称
					count: parseInt(this.qrcodenum) // 生成数量
				}
				this.$api.goodsapi.buildqrcode(data).then(response => {
					// 申请成功
					uni.showToast({
						title: _this.i18n.base.success,
						duration: 1500
					});
					
					setTimeout(function() {
						uni.navigateBack();
					}, 1500);
					
				}).catch(error => {
					uni.showToast({
						title: _this.i18n.error.loaderror,
						icon: 'none'
					});
				})
				
				
			}
		},
	}
</script>

<style lang="scss">

</style>
