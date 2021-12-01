<template>
	<view class="content loginview">
		
		<!-- 自定义导航栏 -->
		<cu-custom v-if="!ifforbidback" bgColor="transparent"></cu-custom>
		
		<!-- 登录注册主页面 -->
		<view class="maincontent flex flex-direction align-center padding-xl">
			
			<!-- 头部logo -->
			<view class="header flex flex-direction align-center">
				<image class="img" mode="aspectFill" :src=" configData && configData.appLogo ? configData.appLogo : '/static/publicicon/logo.png' "></image>
				<!-- <text class="text-bold text-xl text-center margin-top text-pink">{{ configData.appName }}</text> -->
			</view>
			
			<!-- 输入内容区域 -->
			<view class="eachareaview inputview margin-top">
				
				<!-- 账号 -->
				<uni-easyinput v-model="account" :placeholder="i18n.placeholder.login.account" trim prefixIcon="person-filled" />
				
				<!-- 密码 -->
				<uni-easyinput type="password" v-model="password" :placeholder="i18n.placeholder.login.password" trim prefixIcon="locked-filled" />
				
				<!-- 确认密码 -->
				<uni-easyinput v-if="type == 'register'" type="password" v-model="confirmpassword" :placeholder="i18n.placeholder.login.passwordagain" trim prefixIcon="locked-filled"></uni-easyinput>
				
				<!-- 选择注册角色 -->
				<uni-collapse class="margin-top" v-if="type == 'register'">
					<uni-collapse-item :title="i18n.placeholder.login.selectrole" open showAnimation>
						
						<view class="cu-list grid no-border col-3">
							<view class="cu-item" :class="[role == item.value ? 'bg-yellow light animation-scale-up' : '']" v-for="(item,index) in roleList" :key="index" @click="role=item.value">
								<view :class="[item.icon,item.color]"></view>
								<text>{{item.title}}</text>
							</view>
						</view>
						
						<!-- 一段文字的简介 -->
						<view class="text-xs padding text-cut">{{ i18n.role[role]['des'] }}</view>
						
					</uni-collapse-item>
				</uni-collapse>
				
			</view>
			
			<!-- 其他操作区域 -->
			<view class="eachareaview otherview flex align-center justify-between margin-top">
				
				<text class="text-lg text-pink" @tap.stop=" type = type == 'login' ? 'register' : 'login' ">{{ type == 'login' ? i18n.base.register : i18n.base.login }}</text>
				
				<text class="text-lg text-black cuIcon cuIcon-questionfill" @tap.stop="havequestion">{{ i18n.base.havequestion }}</text>
				
			</view>
			
			<!-- 登录按钮 -->
			<button class="loginbtn cu-btn round lg margin-top-xl" :class="type=='login' ? 'bg-gradual-pink' : 'bg-gradual-orange'" :disabled="isLoading" :loading="isLoading" @tap.stop=" confirm ">
				{{ type == 'login' ? i18n.base.login : i18n.base.register }}
			</button>
			
			<!-- 其他登录 -->
			<view class="other_loginview width100 margin-top-xl flex align-center justify-center padding-top">
				
				<!-- #ifdef MP -->
				<!-- 微信登录按钮 -->
				<u-icon name='weixin-fill' size="100" color="#83DC42" @click="clickWxlogin"></u-icon>
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
				role: this.$basejs.roleEnum.merchantAdmin, // 默认的角色为商家角色
				roleList: [], // 角色列表
				
				invitecode: '', // 邀请码
				isLoading: false, //是否正在加载
				isFocus: false ,// 是否聚焦
				
			};
		},
		
		components:{
			
		},
		
		onLoad(option) {
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
			
			// 设置角色列表
			let roleList = [
				{
					icon: 'cuIcon-shopfill',
					color: 'text-pink',
					title: this.i18n.role.merchant_admin,
					value: this.$basejs.roleEnum.merchantAdmin,
				},
				{
					icon: 'cuIcon-peoplefill',
					color: 'text-orange',
					title: this.i18n.role.product_agent,
					value: this.$basejs.roleEnum.productAgent,
				},
				{
					icon: 'cuIcon-deliver_fill',
					color: 'text-green',
					title: this.i18n.role.shipping_admin,
					value: this.$basejs.roleEnum.shippingAdmin,
				}
			] // 角色列表
			this.roleList = roleList
			
		},
		
		methods: {
			
			// 选择角色
			selectrole(e) {
				let role = e.detail.value
				this.role = role
			},
			
			// 检测店铺名称
			checkStoreName() {
				let storeName = this.store.storeName
				console.log(storeName);
			},
			
			// 检测物流公司名称
			checkShippingName() {
				let shippingName = this.shipping.shippingName
				console.log(shippingName);
			},
			
			// 登录或注册
		    confirm(){
				
				// 校验规则
				if (_this.account == "") {
				     uni.showToast({
				        title: _this.i18n.placeholder.login.account,
						icon: 'none'
				    });
				    return;
				}
				else if (_this.password == '') {
				    uni.showToast({
				        title: _this.i18n.placeholder.login.password,
						icon: 'none',
				    });
				    return;
				}
				
				// 如果是注册则多增加一次确认密码的判断
				if(this.type == 'register') {
					
					if(this.password != this.confirmpassword) {
						uni.showToast({
							title: _this.i18n.login.typenewagainpwd,
							icon: 'none'
						});
						return
					}
					
				}
				
				// 开始登录操作
				if(this.type == 'login') {
					
					let data = {
						account: _this.account,
						password: _this.password,
					}
					
					uni.showLoading()
					
					_this.$store.dispatch('user/login', data).then(res => {
						console.log(`登录成功`);
						uni.hideLoading()
						
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
						uni.showLoading()
						
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
										uni.hideLoading()
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
														content: _this.i18n.login.bindwxalready,
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
																	title: _this.i18n.tip.loginsuccess,
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
													content: _this.i18n.login.accountunbindwx,
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
									},
									fail() {
										uni.hideLoading()
									}
								})
							},
							fail() {
								uni.hideLoading()
								uni.navigateBack();
							}
						})
					
						// #endif
						
					}).catch(err => {
						console.log(`登录失败`);
						uni.hideLoading()
						// 用户不存在
						if(err.code == 10002) {
							uni.showModal({
								title: _this.i18n.base.tip,
								content: _this.i18n.tip.needtoregister,
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
					})
					
				}
				// 开始注册操作
				else if(this.type == 'register') {
					
					// 进行注册
					let data = {
						account: _this.account,
						password: _this.password,
						invitecode: _this.invitecode,
						role: [_this.role],
						store: _this.store,
						shipping: _this.shipping
					}
					_this.$store.dispatch('user/register', data).then(res => {
						// 注册成功
						uni.showToast({
							title: _this.i18n.login.registerandlogin,
							icon: 'success'
						});
						
						// 注册成功后将店铺或者物流公司的管理员与该用户进行绑定
						// const db = uniCloud.database();
						// db.collection('store')
						
						// 进行自动登录
						setTimeout(function() {
							_this.type = 'login'
							_this.confirm()
						}, 1500);
						
					}).catch(err => {
						uni.showModal({
							content: err.message || err.errMsg,
							showCancel: false,
						});
					})
					
				}
				
		    },
			
			// 遇到问题
			havequestion() {
				// 预览大图客服二维码
				let serviceImg = this.$store.getters.configData.serviceImg
				uni.previewImage({
					urls: [serviceImg],
					current:0
				})
			},
			
			// 绑定微信
			bindwx() {
				
				// 开始绑定微信
				uni.login({
					provider: 'weixin',
					success(res) {
						let code = res.code
						// 开始绑定
						uni.showLoading()
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
									uni.showToast({
										title: _this.i18n.tip.loginsuccess,
										icon: 'none'
									});
								}
								// 绑定失败
								else {
									uni.showToast({
										title: `${res.result.message}`,
										icon: 'none'
									});
								}
							},
							complete() {
								uni.hideLoading()
								setTimeout(function() {
									uni.navigateBack();
								}, 1500);
							}
						})
					}
				})
				
			},
			
			//微信登录
			clickWxlogin() {
				
				// 获取微信openId
				
				// 获取当前微信账号的openid进行对比
				uni.showLoading()
				
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
								uni.hideLoading()
								// 获取成功
								if(res.result.code == 0) {
									let openid = res.result.openid
									console.log(`获取到的微信openid为${openid}`);
									console.log(`查看是否存在该openid的用户`);
									
									// 根据此openid看该微信用户是否之前已经登录过
									// 如果有对应的用户信息则直接登录
									// 如果没有对应的用户信息则代表未曾登录过,此时提示使用账号密码登录
									
									const db = uniCloud.database();
									const dbCmd = db.command
									db.collection('uni-id-users')
									.where({
										'wx_openid': {
											'mp-weixin': openid
										}
									})
									.field('wx_openid') // 注意password权限问题
									// .where(`wx_openid && wx_openid['mp-weixin'] == '${openid}'`)
									.get({getOne: true})
									.then(res => {
										// 获取成功
										if(res.result.code == 0) {
											let existuser = res.result.data
											// console.log(`找到该openid对应的用户为`);
											// console.log(existuser);
											
											// 找到有存在的用户 说明该微信用户已经登陆绑定过账号密码
											if(existuser) {
												// 直接进行微信登录操作
												_this.wxMiniLogin()
											}
											// 未找到该openid对应的用户 此时提示用户首先进行注册
											else {
												uni.showModal({
													content: _this.i18n.login.wxunbindaccount,
													showCancel: false,
													confirmText: _this.i18n.base.confirm,
													success: res => {
														
													}
												});
											}
										}
									})
									.catch(error => {
										console.log(error);
										uni.showToast({
											title: error.message,
											icon: 'none'
										});
									})
									
								}
								// 获取失败
								else {
									uni.showToast({
										title: res.result.message,
										icon: 'none'
									});
								}
							},
							fail(err) {
								uni.hideLoading()
								uni.showToast({
									title: err.message,
									icon: 'none'
								});
							}
						})
					},
					fail(err) {
						// 登录失败
						uni.hideLoading()
						uni.showToast({
							title: JSON.stringify(err),
							icon: 'none'
						});
					}
				})
				
			},
			
			// 微信小程序登录
			wxMiniLogin() {
				
				// let data = {invitecode: _this.invitecode, role: _this.role}
				let data = {}
				uni.showLoading()
				_this.$store.dispatch('user/wxlogin', data).then(res => {
					// 登录成功
					uni.hideLoading()
					uni.navigateBack();
					uni.showToast({
						title: _this.i18n.tip.loginsuccess,
						icon: 'none'
					});
				}).catch(err => {
					uni.hideLoading()
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
			
			/deep/.uni-collapse{
				
				.uni-collapse-cell--open{
					background-color: #FFFFFF;
				}
				
			}
			
		}
		
		.loginbtn{
			width: 60%;
		}
	}
</style>
