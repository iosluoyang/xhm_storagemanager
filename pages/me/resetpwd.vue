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
	var _this
	
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
		
		onLoad() {
			_this = this
		},
		
		methods: {
			
			// 开始按钮动画
			startbtnanimation() {
				this.btnanimationname = 'shake'
				setTimeout(function() {
					_this.btnanimationname = null
				}, 1000);
			},
			
			// 确认修改密码
			confirm() {
				
				// 校验数据
				
				if(this.oldpwd == '') {
					uni.showToast({
						title: this.i18n.login.typeoldpwd,
						icon: 'none'
					});
					this.startbtnanimation() // 开始按钮动画
					return
				}
				else if(this.newpwd == '') {
					uni.showToast({
						title: this.i18n.login.typenewpwd,
						icon: 'none'
					});
					this.startbtnanimation() // 开始按钮动画
					return
				}
				else if(this.newpwdagain == '' || this.newpwd !== this.newpwdagain) {
					uni.showToast({
						title: this.i18n.login.typenewagainpwd,
						icon: 'none'
					});
					this.startbtnanimation() // 开始按钮动画
					return
				}
				
				// 校验完毕 开始重置
			
				uniCloud.callFunction({
					name: 'user',
					data: {
						type: 'changepwd',
						info: {
							oldPassword: _this.oldpwd,
							newPassword: _this.newpwd
						}
					}
				})
				.then(response => {
					
					console.log(response);
					// 更改成功
					if(response.result.code == 0) {
						
						// 重置成功
						uni.showToast({
							title: _this.i18n.tip.fixsuccess,
							icon: 'none',
							duration: 1500
						});
						
						setTimeout(function() {
							// 退出之后跳重置到登录页
							_this.$store.dispatch('user/resettoken').then(() => {
								// 退出成功
								uni.reLaunch({
									url: '/pages/home/index'
								})
							})
						}, 1500);
						
					}
					else {
						// 重置失败
						uni.showToast({
							title: this.i18n.error.optionerror,
							icon: 'none'
						});
						_this.startbtnanimation() // 开始按钮动画
					}
					
				}).catch(error => {
					console.log(error.message);
					// 重置失败
					uni.showToast({
						title: this.i18n.error.optionerror,
						icon: 'none'
					});
					_this.startbtnanimation() // 开始按钮动画
				})
				
				return
				
				let data = {
					oldPassword: this.oldpwd,
					newPassword: this.newpwd
				}
				
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
						title: this.i18n.error.optionerror,
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
