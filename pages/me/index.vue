<template>
	<view class="me">
		
		<!-- 导航栏 -->
		<cu-custom bgColor="bg-gradual-orange" isBack>
			<block slot="content">{{i18n.nav.me}}</block>
		</cu-custom>
		
		<!-- 头部区域 -->
		<view class="headerview padding-sm margin-sm bg-gradual-orange radius shadow-blur flex align-center justify-between" @tap.stop="jumptopersondetail">
			
			<!-- 左侧内容区域 包含头像和个人资料 -->
			<view class="flex align-center">
				
				<!-- 头像 -->
				<template class="avatarview">
					<view v-if="user && user.avatar" class="cu-avatar xl round margin-right" :style="{backgroundImage: 'url('+user.avatar+')'}"></view>
					<view v-else class="cu-avatar xl round margin-right"><text class="cuIcon-people"></text></view>
				</template>
				
				<!-- 个人资料 包含昵称和标签以及个人简介 -->
				<view class="contentview">
					
					<!-- 上面视图 包含昵称和标签 -->
					<view class="flex align-center margin-bottom-sm">
						
						<!-- 昵称 -->
						<view class="username text-white text-bold text-xl margin-right-sm">
							{{ iflogin ? user && user.nickname ? user.nickname : i18n.tip.defaultusername : i18n.tip.pleaselogin }}
						</view>
						<!-- 标签 -->
						<view v-if="iflogin" class="usertag">
							<view class="usertag cu-tag radius margin-right-sm" :class="[user.role && user.role[0] === 'merchant' ? 'bg-blue' : 'bg-cyan' ]">
								{{ user.role && user.role[0] === 'merchant' ? i18n.base.admin : i18n.base.normaladmin }}
							</view>
						</view>
						
					</view>
					
					<!-- 下面视图 包含个人简介 -->
					<view class="text-white text-cut" style="width: 400upx;">{{ user && user.comment ? user.comment : '' }}</view>
					
					<!-- 上次登录时间 -->
					<view class="text-white text-xs margin-top-sm">
						Last Login:
						<uni-dateformat v-if="user && user.last_login_date" :date="user.last_login_date" />
					</view>
					
				</view>
				
			</view>
			
			<!-- 右侧箭头 -->
			<text class="cuIcon-right"></text>
			
		</view>
		
		
		<!-- 个人信息区域 -->
		
		<!-- 任务面板 -->
		<view class="cu-list grid col-3 no-border">
			<view class="cu-item" v-for="(item,index) in panelList" :key="index" @tap.stop="clickpanel(item)">
				<view :class="['cuIcon-' + item.cuIcon,'text-' + item.color]">
					<view class="cu-tag badge" v-if="item.badge!=0">
						<block v-if="item.badge!=1">{{item.badge>99?'99+':item.badge}}</block>
					</view>
				</view>
				<text>{{item.name}}</text>
			</view>
		</view>
		
		<!-- 列表 -->
		<view class="cu-list menu sm-border card-menu margin-top">
			
			<!-- 当前版本 -->
			<view class="cu-item">
				<view class="content">
					<image src="/static/publicicon/logo.png" class="png" mode="aspectFit"></image>
					<text class="text-grey">{{i18n.me.appversion}}</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm">{{this.$config.app_version()}}</text>
				</view>
			</view>
			
			<!-- 退出登录 -->
			<view v-if="iflogin" class="cu-item arrow" @tap.stop="exit">
				<view class="content">
					<text class="cuIcon-circlefill text-grey"></text>
					<text class="text-grey">{{i18n.me.exit}}</text>
				</view>
			</view>
			
			
		</view>
		
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				panelList: [], // 个人中心任务面板内容
			};
		},
		
		onLoad() {
			// 设置个人中心任务面板内容
			
			// 商品二维码
			let qrcodeitem = {
				id: 'qrcode',
				cuIcon: 'qr_code',
				color: 'blue',
				badge: 0,
				name: this.i18n.me.panel.proqrcode,
				url: '/pages/me/buildqrcode'
			}
			
			// 人员管理
			let memberitem = {
				id: 'member',
				cuIcon: 'lightfill',
				color: 'red',
				badge: 0,
				name: this.i18n.me.panel.managepeople,
				url: '/pages/managepeople/index'
			}
			
			// 工作时间
			let workingtimeitem = {
				id: 'workingtime',
				cuIcon: 'timefill',
				color: 'yellow',
				badge: 0,
				name: this.i18n.me.panel.workingtime,
				url: '/pages/me/workingtime'
			}
			
			// 公告管理
			let noticeitem = {
				id: 'notice',
				cuIcon: 'notificationfill',
				color: 'cyan',
				badge: 0,
				name: this.i18n.me.panel.notice,
				url: '/pages/notice/index'
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
			
			// 订阅消息
			let subscribeitem = {
				id: 'subscribe',
				cuIcon: 'timefill',
				color: 'orange',
				badge: 0,
				name: '订阅消息'
			}
			
			// 更多
			let moreitem = {
				id: 'more',
				cuIcon: 'favorfill',
				color: 'grey',
				badge: 0,
				name: this.i18n.me.panel.more
			}
			
			let panelList = [moreitem] // 默认有更多的选项
			// // 如果是超级管理员
			// if(this.user.type === 0) {
			// 	panelList = [qrcodeitem, memberitem, workingtimeitem, noticeitem, resetpwditem, subscribeitem, moreitem]
			// }
			// // 如果是普通员工则有
			// else if(this.user.type === 1) {
			// 	panelList = [resetpwditem, subscribeitem, moreitem]
			// }
			
			// 登录状态下 根据身份获取不同的操作区域
			if(this.iflogin) {
				// 如果是超级管理员或者商家的话则有公告管理
				if( this.user.role.includes('merchant') || this.user.role.includes('admin')) {
					panelList = [noticeitem, subscribeitem, moreitem]
				}
			}
			
			this.panelList = panelList
			
			// 登录状态下 加载个人信息
			if(this.iflogin) {
				this.loadpersondetail()
			}
			
		},
		
		methods: {
			
			// 加载个人信息
			loadpersondetail() {
				const _this = this
				
				_this.$store.dispatch('user/getuserdetail').then(() => {
					// 获取成功
				}).catch(error => {
					// 获取失败
					uni.showToast({
						title: _this.i18n.error.networkerror,
						icon: 'none'
					});
				})
				
				// _this.$api.userapi.getuserdetail().then(response => {
				// 	// 加载个人信息成功
				// 	let user = response.data.user
				// 	// 更新本地的用户信息
				// 	_this.$store.dispatch('user/updateuserdetail', user).then(() => {
				// 		// 更新成功
				// 	}).catch(error => {
				// 		// 更新失败
				// 		uni.showToast({
				// 			title: _this.i18n.error.networkerror,
				// 			icon: 'none'
				// 		});
				// 	})
				// }).catch(error => {
				// 	// 加载失败
				// 	uni.showToast({
				// 		title: _this.i18n.error.networkerror,
				// 		icon: 'none'
				// 	});
				// })
				
			},
			
			// 跳转个人详情页
			jumptopersondetail() {
				
				// 如果是登录状态则跳转个人详情页 如果是未登录状态则跳转登录页
				let jumpurl = this.iflogin ? '/pages/me/persondetail' : '/pages/base/login'
				uni.navigateTo({
					url: jumpurl
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
				else{
					if(panelitem.id === 'subscribe') {
						// 订阅消息
						// 增加订阅模板消息的功能
						let orderchangetmpId = 'dMO7jl3o1lgYqd3PrcgALPn_1s87YUdwZXcsorRpx5U'
						uni.requestSubscribeMessage({
							tmplIds: [orderchangetmpId],
							success(res){
								let errMsg = res.errMsg
								console.log(errMsg);
								if(errMsg == 'requestSubscribeMessage:ok') {
									console.log(res[orderchangetmpId]);
									// 用户同意订阅
									if(res[orderchangetmpId] == 'accept') {
										console.log(`用户订阅消息成功`);
									} else if(res[orderchangetmpId] == 'reject') {
										console.log(`用户拒绝订阅消息`);
									}
								}
								else {
									console.log(`订阅消息失败`);
								}
								
							}
						})
						return
					}
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
							this.$store.dispatch('user/logout').then(() => {
								// 登出成功
								uni.showToast({
									title: _this.i18n.tip.logoutsuccess,
									icon: 'none',
									duration: 1500
								});
								
								setTimeout(function() {
									// 重置到首页
									uni.reLaunch({
										url: '/pages/home/index'
									})
								}, 1500);
								
							}).catch(error => {
								// 登出失败
								uni.showToast({
									title: _this.i18n.error.logouterror,
									icon: 'none'
								});
							})
						}
					}
				});
				
			},
		},
	}
</script>

<style lang="scss">
	page{
		background: #ededed;
	}
</style>
