<template>
	<view class="login">
		<!-- 返回按钮 -->
		<cu-custom v-if="!ifforbidback" bgColor="transparent" isBack></cu-custom>
		
		<view class="content">
			<!-- 头部logo -->
			<view class="header">
				<image class="bg-gray" :src="logoImage"></image>
			</view>
			<!-- 主体表单 -->
			<view class="main">
				<wInput
					v-model="account"
					key="account"
					type="text"
					maxlength="11"
					:placeholder="i18n.login.account"
				></wInput>
				<wInput
					v-model="password"
					key="password"
					type="password"
					maxlength="11"
					:placeholder="i18n.login.password"
				></wInput>
			</view>
			<wButton 
				:text="i18n.login.loginstr"
				:rotate="isRotate" 
				@click.native="startLogin"
			></wButton>
						
		</view>
		
	</view>
</template>

<script>
	
	import wInput from '@/components/login/watch-input.vue'
	import wButton from '@/components/login/watch-button.vue'
	import md5 from 'js-md5'
	
	
	export default {
		
		components: {
			wInput,
			wButton,
		},
		
		data() {
			return {
				ifforbidback: false, // 是否禁止返回 默认为否 代表有导航栏 可以返回
				logoImage: '/static/publicicon/logo.png',
				account:'', //账号
				password:'', //密码
				isRotate: false, // 是否正在加载中
			};
		},
		
		onLoad(option) {
			// 根据页面参数获取是否可以后退的标识
			let forbidback = option.forbidback
			if(forbidback && forbidback === 'true') {
				this.ifforbidback = true
			}
		},
		
		methods: {
			
			// 开始登录操作
			startLogin() {
				
				const _this = this
				
				//登录
				if(_this.isRotate){
					//判断是否加载中，避免重复点击请求
					return false;
				}
				
				if (_this.account.length == "") {
				     uni.showToast({
				        icon: 'none',
						position: 'bottom',
				        title: _this.i18n.error.account
				    });
				    return;
				}
				if (_this.password.length < 6) {
				    uni.showToast({
				        icon: 'none',
						position: 'bottom',
				        title: _this.i18n.error.password
				    });
				    return;
				}
				
				_this.isRotate=true // 按钮开始旋转
				
				// 开始登录操作
				let data = {
					account: _this.account,
					pwd: md5(_this.password)
				}
				_this.$store.dispatch('user/login',data).then(response => {
					
					// 登录成功
					_this.isRotate = false
					
					uni.showToast({
						title: _this.i18n.tip.loginsuccess,
						icon: 'none',
						duration: 1500
					});
					
					setTimeout(function() {
						uni.reLaunch({
							url: '/pages/home/index'
						})
					}, 1500);
					
				}).catch(error => {
					// 登录失败
					_this.isRotate = false
					uni.showToast({
						title: _this.i18n.error.loginerror,
						icon: 'none'
					});
				})
			}
			
		},
	}
</script>

<style scoped>
	.content {
		display: flex;
		flex-direction: column;
		justify-content:center;
		/* margin-top: 128upx; */
	}
	
	/* 头部 logo */
	.header {
		width:161upx;
		height:161upx;
		box-shadow:0upx 0upx 60upx 0upx rgba(0,0,0,0.1);
		border-radius:50%;
		background-color: #000000; 
		margin-top: 128upx;
		margin-bottom: 72upx;
		margin-left: auto;
		margin-right: auto;
	}
	.header image{
		width:161upx;
		height:161upx;
		border-radius:50%;
	}
	
	/* 主体 */
	.main {
		display: flex;
		flex-direction: column;
		padding-left: 70upx;
		padding-right: 70upx;
	}
	.tips {
		color: #999999;
		font-size: 28upx;
		margin-top: 64upx;
		margin-left: 48upx;
	}
	
	/* 其他登录方式 */
	.other_login{
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		margin-top: 256upx;
		text-align: center;
	}
	.login_icon{
		border: none;
		font-size: 64upx;
		margin: 0 64upx 0 64upx;
		color: rgba(0,0,0,0.7)
	}
	.wechat_color{
		color: #83DC42;
	}
	.weibo_color{
		color: #F9221D;
	}
	.github_color{
		color: #24292E;
	}
	
	/* 底部 */
	.footer{
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		font-size: 28upx;
		margin-top: 64upx;
		color: rgba(0,0,0,0.7);
		text-align: center;
		height: 40upx;
		line-height: 40upx;
	}
	.footer text{
		font-size: 24upx;
		margin-left: 15upx;
		margin-right: 15upx;
	}
</style>
