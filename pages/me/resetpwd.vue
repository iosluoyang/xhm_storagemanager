<template>
	<view class="content">
		
		<!-- 自定义导航栏 -->
		<cu-custom bgColor="bg-gradual-orange" isBack>
			<block slot="content">{{i18n.nav.resetpwd}}</block>
		</cu-custom>
		
		<!-- 表单 -->
		<form>
			
			<view class="cu-form-group margin-top">
				<view class="title">{{i18n.me.resetpwd.oldpwd}}</view>
				<input type="text" :password="!oldpwdshow" v-model="oldpwd" />
				<text :class="[oldpwdshow ? 'cuIcon-attentionfill text-brown' : 'cuIcon-attention text-gray' ]" @tap.stop="oldpwdshow=!oldpwdshow"></text>
			</view>
			
			<view class="cu-form-group margin-top">
				<view class="title">{{i18n.me.resetpwd.newpwd}}</view>
				<input type="text" :password="!newpwdshow" v-model="newpwd" />
				<text :class="[newpwdshow ? 'cuIcon-attentionfill text-brown' : 'cuIcon-attention text-gray' ]" @tap.stop="newpwdshow=!newpwdshow"></text>
			</view>
			
			<view class="cu-form-group margin-top">
				<view class="title">{{i18n.me.resetpwd.newpwdagain}}</view>
				<input type="text" :password="!newpwdagainshow" v-model="newpwdagain" />
				<text :class="[newpwdagainshow ? 'cuIcon-attentionfill text-brown' : 'cuIcon-attention text-gray' ]" @tap.stop="newpwdagainshow=!newpwdagainshow"></text>
			</view>
			
		</form>
		
		<!-- 确定按钮 -->
		<view class="confirmbtn padding flex flex-direction">
			<button class="cu-btn bg-gradual-orange round shadow lg"
					:class="[btnanimationname ? 'animation-' + btnanimationname :'']"
					:data-class="btnanimationname ? btnanimationname : '' " @tap.stop="confirm">{{i18n.base.confirm}}</button>
		</view>
		
	</view>
</template>

<script>
	import md5 from 'js-md5'
	
	export default {
		data() {
			return {
				
				oldpwd: '',
				oldpwdshow: false,
				newpwd: '',
				newpwdshow: false,
				newpwdagain: '',
				newpwdagainshow: false,
				
				btnanimationname: null, // 按钮动画  默认为null
				
			};
		},
		
		methods: {
			
			// 开始按钮动画
			startbtnanimation() {
				const _this = this
				this.btnanimationname = 'shake'
				setTimeout(function() {
					_this.btnanimationname = null
				}, 1000);
			},
			
			// 确认修改密码
			confirm() {
				
				// 校验数据
				
				if(this.oldpwd === '') {
					uni.showToast({
						title: this.i18n.error.oldpwd,
						icon: 'none'
					});
					this.startbtnanimation() // 开始按钮动画
					return
				}
				else if(this.newpwd === '') {
					uni.showToast({
						title: this.i18n.error.newpwd,
						icon: 'none'
					});
					this.startbtnanimation() // 开始按钮动画
					return
				}
				else if(this.newpwdagain === '' || this.newpwd !== this.newpwdagain) {
					uni.showToast({
						title: this.i18n.error.newpwdagain,
						icon: 'none'
					});
					this.startbtnanimation() // 开始按钮动画
					return
				}
				
				// 校验完毕 开始重置
				let data = {
					oldPwd: md5(this.oldpwd),
					newPwd: md5(this.newpwd)
				}
				const _this = this
				this.$api.userapi.modifypwd(data).then(response => {
					// 重置成功
					uni.showToast({
						title: this.i18n.tip.fixsuccess,
						icon: 'none',
						duration: 1500
					});
					
					setTimeout(function() {
						// 退出之后跳重置到登录页
						_this.$store.dispatch('user/logout').then(() => {
							// 退出成功
							uni.reLaunch({
								url: '/pages/base/login'
							})
						})
					}, 1500);
					
				}).catch(error => {
					// 重置失败
					uni.showToast({
						title: this.i18n.error.fixerror,
						icon: 'none'
					});
					this.startbtnanimation() // 开始按钮动画
				})
				
			}
		},
	}
</script>

<style lang="scss">

</style>
