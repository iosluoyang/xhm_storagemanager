<template>
	<view class="me">
		
		<!-- 导航栏 -->
		<cu-custom bgColor="bg-gradual-orange">
			<block slot="content">{{i18n.nav.me}}</block>
		</cu-custom>
		
		<!-- 头部区域 -->
		<view class="headerview padding-sm margin-sm bg-gradual-orange radius shadow-blur flex align-center justify-between" @tap.stop="jumptopersondetail">
			
			<!-- 左侧内容区域 包含头像和个人资料 -->
			<view class="flex align-center">
				
				<!-- 头像 -->
				<view class="avatarview" style="flex-shrink: 0;">
					<view v-if="user && user.avatar" class="cu-avatar xl round margin-right" :style="{backgroundImage: 'url('+user.avatar+')'}"></view>
					<view v-else class="cu-avatar xl round margin-right"><text class="cuIcon-people"></text></view>
				</view>
				
				<!-- 个人资料 包含昵称和标签以及个人简介 -->
				<view class="contentview">
					
					<view class="topview flex align-center">
						
						<view class="username text-white text-cut text-bold text-xl margin-right-sm" :style="{maxWidth: '200rpx'}">
							{{ iflogin ? user && user.nickname ? user.nickname : i18n.base.defaultusername : i18n.tip.pleaselogin }}
						</view>
						
						<!-- 标签 -->
						<view v-if="iflogin" class="usertag cu-tag radius" :class="[ $basejs.getrolenameandcolor(user.role).bgColor ]">
							{{ $basejs.getrolenameandcolor(user.role).title }}
						</view>
						
					</view>
					
					<!-- 下面视图 包含个人简介 -->
					<view class="text-white text-cut margin-top-sm" style="width: 400rpx;">{{ user && user.comment ? user.comment : '' }}</view>
					
				</view>
				
			</view>
			
			<!-- 右侧箭头 -->
			<text class="cuIcon-right"></text>
			
		</view>
		
		<!-- 任务面板 -->
		<view class="cu-list grid col-3 no-border">
			<view class="cu-item pos-relative" :class="['text-' + item.color]" v-for="(item,index) in panelList" :key="index" @tap="clickpanel(item)">
				
				<view :class="['cuIcon-' + item.cuIcon,'text-' + item.color]">
					<view class="cu-tag badge" v-if="item.badge!=0">
						<block v-if="item.badge!=1">{{item.badge>99?'99+':item.badge}}</block>
					</view>
				</view>
				<text>{{item.name}}</text>
				
				<!-- #ifdef MP-WEIXIN -->
				<!-- 反馈按钮 -->
				<button v-if="item.id == 'feedback'" class="opentypebtn pos-absolute" :style="{top: 0, bottom: 0, right: 0, left: 0, background: 'transparent'}" open-type="feedback"></button>
				<!-- #endif -->
				
			</view>
		</view>
		
		<!-- 列表 -->
		<view class="cu-list menu sm-border card-menu margin-top">
			
			<!-- 当前版本 -->
			<view class="cu-item" v-if="configData">
				<view class="content">
					<image class="round sm" :src="configData.appLogo" mode="aspectFit"></image>
					<text class="text-black">{{i18n.me.appversion}}</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{configData.appVersion}}</text>
				</view>
			</view>
			
			<!-- 退出登录 -->
			<view v-if="iflogin" class="cu-item arrow" @tap.stop="exit">
				<view class="content">
					<text class="cuIcon-circlefill text-grey"></text>
					<text class="text-black">{{i18n.me.exit}}</text>
				</view>
			</view>
			
		</view>
		
	</view>
</template>

<script>
	
	var _this
	
	export default {
		
		data() {
			return {
				panelList: [], // 个人中心任务面板内容
			};
		},
		
		onLoad() {
			
			_this = this
			
			// 登录状态下 加载个人信息
			if(this.iflogin) {
				this.loadpersondetail()
			}
			
			// 设置个人中心任务面板内容
			this.setpaneldata()
			
		},
		
		methods: {
			
			// 设置面板信息
			setpaneldata() {
				
				// 地址管理  仅商家管理员有
				let addressitem = {
					id: 'addressmanage',
					cuIcon: 'addressbook',
					color: 'blue',
					badge: 0,
					name: this.i18n.nav.addressmanage,
					url: '/pages/me/addresslist'
				}
				
				// 店铺管理  仅商家管理员有
				let storemanageitem = {
					id: 'storemanage',
					cuIcon: 'shopfill',
					color: 'purple',
					badge: 0,
					name: this.i18n.nav.storemanage,
					url: '/pages/merchant/storemanage'
				}
				
				// 仓库代码 仅商家管理员有
				let shippingitem = {
					id: 'shippingcode',
					cuIcon: 'deliver_fill',
					color: 'orange',
					badge: 0,
					name: this.i18n.nav.shipping,
					url: '/pages/shippingcompany/shippingmanage'
				}
				
				// 公告管理 仅超级管理员有
				let noticeitem = {
					id: 'notice',
					cuIcon: 'notificationfill',
					color: 'cyan',
					badge: 0,
					name: this.i18n.nav.notice,
					url: '/pages/admin/notice/index'
				}
				
				// 我的钱包 仅商家管理员有
				let walletitem = {
					id: 'wallet',
					cuIcon: 'rechargefill',
					color: 'red',
					badge: 0,
					name: this.i18n.nav.wallet,
					url: '/pages/me/wallet'
				}
				
				// 财务管理 仅超级管理员有
				let financialmanageitem = {
					id: 'financialmanage',
					cuIcon: 'rechargefill',
					color: 'red',
					badge: 0,
					name: this.i18n.nav.financialmanage,
					url: '/pages/admin/financialmanage/index'
				}
				
				// 收藏商品
				let favorproitem = {
					id: 'favorpro',
					cuIcon: 'favorfill',
					color: 'orange',
					badge: 0,
					name: this.i18n.nav.profavor,
					url: '/pages/product/favorlist'
				}
				
				// 重置密码
				let resetpwditem = {
					id: 'resetpwd',
					cuIcon: 'settingsfill',
					color: 'brown',
					badge: 0,
					name: this.i18n.nav.resetpwd,
					url: '/pages/me/resetpwd'
				}
				
				// 反馈
				let feedbackitem = {
					id: 'feedback',
					cuIcon: 'markfill',
					color: 'grey',
					badge: 0,
					name: this.i18n.me.panel.feedback
				}
				
				// 更多
				let moreitem = {
					id: 'more',
					cuIcon: 'favorfill',
					color: 'grey',
					badge: 0,
					name: this.i18n.me.panel.more
				}
				
				let panelList = []
				
				// 登录状态下 根据身份获取不同的操作区域
				if(this.iflogin) {
					
					// 如果是超级管理员角色
					if(this.user.role == this.$basejs.roleEnum.admin) {
						
						panelList.push(financialmanageitem) // 财务管理
						panelList.push(noticeitem) // 公告管理
						panelList.push(favorproitem) // 商品收藏
						panelList.push(resetpwditem) // 重置密码
					}
					
					// 如果是商家角色
					else if(this.user.role == this.$basejs.roleEnum.merchantAdmin) {
						
						panelList.push(walletitem) // 我的钱包
						panelList.push(favorproitem) // 商品收藏
						panelList.push(addressitem) // 地址管理
						panelList.push(resetpwditem) // 重置密码
						panelList.push(storemanageitem) // 店铺管理
						
					}
					
					// 如果是代理角色
					else if(this.user.role == this.$basejs.roleEnum.productAgent) {
						panelList.push(favorproitem) // 商品收藏
						panelList.push(resetpwditem) // 重置密码
					}
					
					// 如果是物流公司角色
					else if(this.user.role == this.$basejs.roleEnum.shippingAdmin) {
						panelList.push(favorproitem) // 商品收藏
						panelList.push(resetpwditem) // 重置密码
						panelList.push(shippingitem) // 添加仓库代码选项
					}
					
				}
				
				// #ifdef MP-WEIXIN
				panelList.push(feedbackitem) // 反馈
				// #endif
				panelList.push(moreitem) // 更多
				
				this.panelList = panelList
				
				// 如果是超级管理员角色则获取当前未处理的到账申请
				if(this.user && this.user.role == this.$basejs.roleEnum.admin) {
					const db = uniCloud.database();
					// status 0待确认 1已确认  type 0支出 1充值
					db.collection('bill')
					.where(`status == 0 && type == 1`)
					.count()
					.then(response => {
						if(response.result.code == 0) {
							// 设置当前未处理的财务角标数量
							let unhandlebillnum = response.result.total
							let financialmanageitem = _this.panelList.find(item => (item.id == 'financialmanage'))
							if(financialmanageitem) {
								financialmanageitem.badge = unhandlebillnum
							}
						}
					})
					.catch(error => {
						console.log(`获取未处理账单数量失败`);
						console.log(error);
					})
				}
				
			},
			
			// 加载个人信息
			loadpersondetail() {
				_this.$store.dispatch('user/getuserdetail').then(response => {
					// 获取个人信息成功
					console.log(`获取个人信息成功`);
					console.log(response);
				}).catch(error => {
					console.log(`获取个人信息失败`);
					console.log(error);
				})
			},
			
			// 跳转个人详情页
			jumptopersondetail() {
				
				// 如果是登录状态则跳转个人详情页 如果是未登录状态则跳转登录页
				let jumpurl = this.iflogin ? '/pages/me/persondetail' : '/pages/base/login'
				uni.navigateTo({
					url: jumpurl
				});
				
			},
			
			// 跳转收藏商品页面
			jumpToProFavor() {
				uni.navigateTo({
					url: '/pages/product/favorlist'
				});
			},
			
			// 点击面板操作按钮
			clickpanel(panelitem) {
				// 如果有跳转链接则跳转至目标页
				if(panelitem.url) {
					uni.navigateTo({
						url: panelitem.url
					});
				}
				else if(panelitem.id !== 'feedback'){
					
					uni.showToast({
						title: this.i18n.base.needtowait,
						icon: 'none'
					});
				}
			},
			
			// 退出登录
			exit() {
				const _this = this
				uni.showModal({
					content: _this.i18n.tip.exitconfirm,
					showCancel: true,
					cancelText: _this.i18n.base.cancel,
					confirmText: _this.i18n.base.confirm,
					success: res => {
						if(res.confirm) {
							// 确定退出
							_this.$store.dispatch('user/logout').then(() => {
								
								// 重置到首页
								uni.reLaunch({
									url: '/pages/home/index'
								})
								
								setTimeout(function() {
									// 登出成功
									uni.showToast({
										title:  _this.i18n.tip.logoutsuccess,
										icon: 'none',
									});
								}, 300);
								
							}).catch(error => {
								// 登出失败(提示为登出成功)
								uni.showToast({
									title:  _this.i18n.tip.logoutsuccess,
									icon: 'none',
								});
							})
						}
					}
				});
				
			},
			
			//
		},
	}
</script>

<style lang="scss" scoped>
	.me{
		background: #ededed;
		height: 100vh;
		
		.cu-list{
			.opentypebtn{
				&::after{
					border: none !important;
				}
			}
		}
		
	}
</style>
