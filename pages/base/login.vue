<template>
	<view class="content loginview">
		
		<!-- 返回按钮 -->
		<cu-custom v-if="!ifforbidback" bgColor="transparent" isBack></cu-custom>
		
		<!-- 登录主页面 -->
		<view class="maincontent flex flex-direction align-center padding-xl">
			
			<!-- 头部logo -->
			<view class="header">
				<image class="img round" mode="aspectFit" src="/static/publicicon/logo.png"></image>
			</view>
			
			<!-- 输入内容区域 -->
			<view class="eachareaview inputview margin-top">
				
				<!-- 账号 -->
				<uni-easyinput v-model="account" :placeholder="i18n.login.account" trim prefixIcon="person-filled" />
				
				<!-- 密码 -->
				<uni-easyinput type="password" v-model="password" :placeholder="i18n.login.password" trim prefixIcon="locked-filled" />
				
				<!-- 确认密码 -->
				<uni-easyinput v-if="type == 'register'" type="password" v-model="confirmpassword" :placeholder="i18n.login.password" trim prefixIcon="locked-filled"></uni-easyinput>
				
			</view>
			
			<!-- 其他操作区域 -->
			<view class="eachareaview otherview flex align-center justify-between margin-top">
				
				<text class="text-xl text-pink" @tap.stop=" type = type == 'login' ? 'register' : 'login' ">{{ type == 'login' ? i18n.login.registerstr : i18n.login.loginstr }}</text>
				
				<text v-if="type == 'login'" class="text-xl text-black">{{ i18n.login.forgetpwd }}</text>
				
			</view>
			
			<!-- 登录按钮 -->
			<button class="loginbtn cu-btn round lg margin-top-xl" :class="type=='login' ? 'bg-gradual-pink' : 'bg-gradual-orange'" :disabled="isLoading" :loading="isLoading" @click.native=" confirm ">
				{{ type == 'login' ? i18n.login.loginstr : i18n.login.registerstr }}
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
				
				type: 'login', // 页面类型  login为登录  register为注册  默认为登录
				
				ifforbidback: false, // 是否禁止返回 默认为否 代表有导航栏 可以返回
				account:'', //用户/电话
				password:'', //密码
				confirmpassword: '', // 确认密码
				invitecode: '', // 邀请码
				isLoading: false, //是否正在加载
				isFocus: false // 是否聚焦
			};
		},
		components:{
			
		},
		mounted(option) {
			_this= this
			
			// 根据页面参数获取是否可以后退的标识
			let forbidback = option ? option.forbidback : null
			if(forbidback && forbidback === 'true') {
				this.ifforbidback = true
			}
			
			// 如果有邀请码的话则填充邀请码
			if(option && option.inviteCode) {
				this.invitecode = option.inviteCode
			}
		},
		methods: {
			
			// 登录或注册
		    confirm(){
				
				// 校验规则
				if (_this.account == "") {
				     uni.showToast({
				        title: _this.i18n.error.account,
						icon: 'none'
				    });
				    return;
				}
				else if (_this.password == '') {
				    uni.showToast({
				        title: _this.i18n.error.password,
						icon: 'none',
				    });
				    return;
				}
				
				// 如果是注册则多增加一次确认密码的判断
				if(this.type == 'register') {
					if(this.password != this.confirmpassword) {
						uni.showToast({
							title: _this.i18n.error.password,
							icon: 'none'
						});
						return
					}
				}
				
				// 开始操作
				
				_this.isLoading = true
				
				// 开始登录操作
				if(this.type == 'login') {
					
					let data = {
						account: _this.account,
						password: _this.password,
					}
					_this.$store.dispatch('user/login', data).then(res => {
						console.log(`登录成功`);
						
						// 如果非微信小程序平台则直接判定为登录成功
						// #ifndef MP-WEIXIN
						uni.showToast({
							title: _this.i18n.tip.loginsuccess,
							icon: 'success'
						});
						setTimeout(function() {
							uni.navigateBack();
						}, 1500);
						// #endif
						
						// 如果是在微信小程序环境则判断是否有绑定微信
						// #ifdef MP-WEIXIN
						let userInfo = res.userInfo
						let wxopenIdObj = userInfo['wx_openid']
						console.log(`当前登录账号对应的微信openIdObj为${JSON.stringify(wxopenIdObj)}`);
						
						// 获取当前微信账号的openid进行对比
						uni.login({
							provider: 'weixin',
							success(res) {
								let code = res.code
								// 调用云函数获取当前微信的openid
								uniCloud.callFunction({
									name: 'user',
									data: {
										type: 'getwxopenid',
										info: {
											wxcode: code
										}
									},
									success(res) {
										// 获取成功
										if(res.result.code == 0) {
											let openid = res.result.openid
											// 如果当前userInfo存在有mp-weixin则代表已经绑定过了 此时要进行判断
											if(wxopenIdObj && wxopenIdObj['mp-weixin']) {
												let bindwxopenid = wxopenIdObj['mp-weixin']
												// 判断是否相同
												if(bindwxopenid == openid) {
													uni.navigateBack();
													// 当前登录账号的openid相同 说明是同一个微信进行登录
													uni.showToast({
														title: _this.i18n.tip.loginsuccess,
														icon: 'none'
													});
												}
												// 当前登录微信的openid不同 说明该账号之前绑定过其他的微信 此时提示用户是否换绑微信
												else {
													uni.showModal({
														content: '当前账号已经绑定过微信,继续操作将解绑原微信,绑定当前微信账号',
														showCancel: true,
														cancelText: _this.i18n.base.cancel,
														confirmText: _this.i18n.base.confirm,
														success: res => {
															// 确认换绑
															if(res.confirm) {
																uniCloud.callFunction({
																	name: 'user',
																	data: {
																		type: 'unbindwx'
																	},
																	success(res) {
																		// 解绑成功
																		if(res.result.code == 0) {
																			// 开始绑定当前微信
																			_this.bindwx()
																		}
																		// 解绑失败
																		else {
																			// uni.navigateBack();
																			uni.showToast({
																				title: res.message,
																				icon: 'none'
																			});
																		}
																	}
																})
															}
															// 暂时不换绑
															else {
																uni.navigateBack();
																uni.showToast({
																	title: '暂不绑定当前微信,当前账号已经登录成功',
																	icon: 'none'
																});
															}
														}
													});
												}
											}
											// 当前账号不存在openid 说明未绑定过微信
											else {
												uni.showModal({
													content: '当前登录账号未绑定该微信,是否进行绑定?绑定后可直接通过该微信登录无需再次输入账号密码',
													showCancel: true,
													cancelText: _this.i18n.base.cancel,
													confirmText: _this.i18n.base.confirm,
													success: res => {
														// 确定绑定
														if(res.confirm) {
															// 开始绑定微信
															_this.bindwx()
														}
														// 暂不绑定
														else {
															uni.navigateBack();
															uni.showToast({
																title: _this.i18n.tip.loginsuccess,
																icon: 'none'
															});
														}
													}
												});
											}
										}
										// 获取失败(此时账号已经登录)
										else {
											uni.showToast({
												title: res.result.message,
												icon: 'none'
											});
										}
									}
								})
							}
						})
					
						// #endif
						
						
					}).catch(err => {
						// 用户不存在
						if(err.code == 10002) {

							uni.showModal({
								title: _this.i18n.base.tip,
								content: `This account doesnt exist , please do register`,
								showCancel: true,
								cancelText: _this.i18n.base.cancel,
								confirmText: _this.i18n.base.confirm,
								success: res => {
									if(res.confirm) {
										_this.type = 'register'
									}
								}
							});
						}
						else {
							uni.showModal({
								content: err.message,
								showCancel: false
							});
						}
						console.log(err);
					}).finally(() => {
						_this.isLoading = false
					})
					
				}
				// 开始注册操作
				else if(this.type == 'register') {
					
					// 进行注册
					let data = {
						account: _this.account,
						password: _this.password,
						invitecode: _this.invitecode
					}
					_this.$store.dispatch('user/register', data).then(res => {
						// 注册成功
						uni.showToast({
							title: '注册成功,正在为您自动登录',
							icon: 'success'
						});
						// 进行自动登录
						setTimeout(function() {
							_this.type = 'login'
							_this.confirm()
						}, 1500);
						
					}).catch(err => {
						uni.showModal({
							content: err.message,
							showCancel: false,
						});
					})
					
				}
				
		    },
			
			// 绑定微信
			bindwx() {
				
				// 开始绑定微信
				uni.login({
					provider: 'weixin',
					success(res) {
						let code = res.code
						// 开始绑定
						uniCloud.callFunction({
							name: 'user',
							data: {
								type: 'bindwx',
								info: {
									wxcode: code
								}
							},
							success(res) {
								if(res.result.code == 0) {
									// 绑定成功
									uni.navigateBack();
									uni.showToast({
										title: _this.i18n.tip.loginsuccess,
										icon: 'none'
									});
								}
								// 绑定失败
								else {
									uni.navigateBack();
									uni.showToast({
										title: `微信绑定失败:${res.result.message},您稍后可在个人中心进行绑定`,
										icon: 'none'
									});
								}
							}
						})
					}
				})
				
			},
			
			//微信登录
			wxlogin() {
				
				let data = {invitecode: _this.invitecode}
				_this.$store.dispatch('user/wxlogin', data).then(res => {
					// 登录成功
					uni.navigateBack();
					uni.showToast({
						title: _this.i18n.tip.loginsuccess,
						icon: 'none'
					});
				}).catch(err => {
					uni.showToast({
						title: err.msg,
						icon: 'none'
					});
				})
				
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
		
		.eachareaview{
			width: 80%;
			
			&.inputview{
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
