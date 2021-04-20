<template>
	<view class="content loginview">
		
		<!-- 返回按钮 -->
		<cu-custom v-if="!ifforbidback" bgColor="transparent" isBack></cu-custom>
		
		<view class="maincontent flex flex-direction align-center padding-xl">
			
			<!-- 头部logo -->
			<view class="header">
				<image class="img round" mode="aspectFit" src="/static/publicicon/logo.png"></image>
			</view>
			
			<!-- 输入内容区域 -->
			<view class="inputview margin-top">
				<uni-easyinput v-model="account" :placeholder="i18n.login.account" trim prefixIcon="person-filled" />
				<uni-easyinput class="passwordinput" type="password" v-model="password" :placeholder="i18n.login.password" trim prefixIcon="locked-filled" />
			</view>
			
			<!-- 登录按钮 -->
			<button class="loginbtn cu-btn round lg margin-top-xl bg-gradual-pink" :disabled="isLoading" :loading="isLoading" @click.native="confirm">
				{{ `${i18n.login.loginstr}/${i18n.login.registerstr}` }}
			</button>
			
			<!-- 其他登录 -->
			<view class="other_loginview width100 margin-top-xl flex align-center justify-center padding-top">
				
				<!-- #ifdef MP -->
				<!-- 微信登录按钮 -->
				<u-icon name='weixin-fill' size="100" color="#83DC42" @click="wxlogin"></u-icon>
				<!-- #endif -->
				
			</view>
			
		</view>
	</view>
</template>

<script>
	let _this;
	
	export default {
		data() {
			return {
				ifforbidback: false, // 是否禁止返回 默认为否 代表有导航栏 可以返回
				account:'', //用户/电话
				password:'', //密码
				isLoading: false, //是否正在加载
				isFocus: false // 是否聚焦
			};
		},
		components:{
			
		},
		mounted(option) {
			_this= this
			
			// 根据页面参数获取是否可以后退的标识
			let forbidback = option?.forbidback
			if(forbidback && forbidback === 'true') {
				this.ifforbidback = true
			}
		},
		methods: {
			
			// 开始登录操作
		    confirm(){
				
				// 校验规则
				if (_this.account == "") {
				     uni.showToast({
				        icon: 'none',
						position: 'bottom',
				        title: _this.i18n.error.account
				    });
				    return;
				}
				else if (_this.password == '') {
				    uni.showToast({
				        icon: 'none',
						position: 'bottom',
				        title: _this.i18n.error.password
				    });
				    return;
				}
				
				// 开始登录
				
				_this.isLoading = true
				
				// 开始登录操作
				let data = {
					account: _this.account,
					password: _this.password
				}
				_this.$store.dispatch('user/login', data).then(res => {
					console.log(`登录成功`);
					console.log(res);
				}).catch(err => {
					console.log(err);
				}).finally(() => {
					_this.isLoading = false
				})
				
		    },
			
			//微信登录
			wxlogin() {
				
				uni.login({
					provider: 'weixin',
					success: function (res) {
						
						let code = res.code
						// 获取到code之后进行登录(未注册会自动进行注册)
						
						uniCloud.callFunction({
						    name: 'user',
						    data: {
								type: 'wxlogin',
								info: {
									wxcode: code
								}
						    },
						    success(res){
						        if(res.result.code === 0) {
						            // 2.8.0版本起调整为蛇形uni_id_token（调整后在一段时间内兼容驼峰uniIdToken）
						            uni.setStorageSync('uni_id_token',res.result.token)
						            uni.setStorageSync('uni_id_token_expired', res.result.tokenExpired)
						            // 其他业务代码，如跳转到首页等
									uni.showToast({
										title: `欢迎你,${res.result.openid}`,
										icon: 'none'
									});
						            
						        } else {
						            uni.showModal({
						                content: res.result.message,
						                showCancel: false
						            })
						        }
						    },
						    fail(){
						        uni.showModal({
						            content: `${i18n.tip.error}`,
						            showCancel: false
						        })
						    }
						})
						
					}
				});
				
			},
		}
	}
</script>

<style lang="scss" scoped>

	.content{
		.header{
			.img{
				width: 160rpx;
				height: 160rpx;
			}
		}
		
		.inputview{
			width: 80%;
			
			.passwordinput{
				/deep/.uni-easyinput{
					margin-top: 20px;
				}
			}
			
		}
		
		.loginbtn{
			width: 60%;
		}
	}
</style>
