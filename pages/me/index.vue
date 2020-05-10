<template>
	<view class="me">
		
		<!-- 导航栏 -->
		<cu-custom class="menavbar" bgColor="bg-gradual-orange" isBack>
			<block slot="content">{{i18n.nav.me}}</block>
		</cu-custom>
		
		<!-- 头部区域 -->
		<view class="headerview padding-sm margin-sm bg-gradual-orange radius shadow-blur flex align-center justify-between" @tap.stop="jumptopersondetail">
			
			<!-- 左侧内容区域 包含头像和个人资料 -->
			<view class="flex align-center">
				
				<!-- 头像 -->
				<template class="avatarview">
					<view v-if="user && user.avatar" class="cu-avatar xl round margin-right" :style="{backgroundImage: 'url('+imgUrl+user.avatar+')'}"></view>
					<view v-else class="cu-avatar xl round margin-right"><text class="cuIcon-people"></text></view>
				</template>
				
				<!-- 个人资料 包含昵称和标签以及个人简介 -->
				<view class="contentview">
					
					<!-- 上面视图 包含昵称和标签 -->
					<view class="flex align-center margin-bottom-sm">
						
						<!-- 昵称 -->
						<view class="username text-white text-bold text-xl margin-right-sm">
							{{ iflogin ? user && user.userName ? user.userName : i18n.tip.defaultusername : i18n.tip.pleaselogin }}
						</view>
						<!-- 标签 -->
						<view v-if="iflogin" class="usertag">
							<view class="usertag cu-tag radius margin-right-sm" :class="[user.type === 0 ? 'bg-blue' : 'bg-cyan' ]">
								{{ user.type === 0 ? i18n.base.admin : i18n.base.normaladmin }}
							</view>
						</view>
						
					</view>
					
					<!-- 下面视图 包含个人简介 -->
					<view class="text-white text-xs text-cut" style="width: 400upx;">{{ user && user.signature ? user.signature : '' }}</view>
					
					
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
			let panelList = [
				
					{
						cuIcon: 'qr_code',
						color: 'blue',
						badge: 0,
						name: this.i18n.me.panel.proqrcode,
						url: '/pages/me/buildqrcode'
					},
					{
						id: 'myupload',
						cuIcon: 'lightfill',
						color: 'orange',
						badge: 126,
						name: this.i18n.me.panel.myupload
					},
					{
						id: 'myoperation',
						cuIcon: 'repairfill',
						color: 'yellow',
						badge: 0,
						name: this.i18n.me.panel.myoperation
					},
					{
						cuIcon: 'settingsfill',
						color: 'brown',
						badge: 0,
						name: this.i18n.nav.resetpwd,
						url: '/pages/me/resetpwd'
					},
					{
						cuIcon: 'markfill',
						color: 'purple',
						badge: 0,
						name: this.i18n.me.panel.feedback
					},
					{
						cuIcon: 'favorfill',
						color: 'cyan',
						badge: 0,
						name: this.i18n.me.panel.more
					},
				
			]
				
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
				_this.$api.userapi.getuserdetail().then(response => {
					// 加载个人信息成功
					let user = response.data.user
					// 更新本地的用户信息
					_this.$store.dispatch('user/updateuserdetail', user).then(() => {
						// 更新成功
					}).catch(error => {
						// 更新失败
						uni.showToast({
							title: _this.i18n.error.networkerror,
							icon: 'none'
						});
					})
				}).catch(error => {
					// 加载失败
					uni.showToast({
						title: _this.i18n.error.networkerror,
						icon: 'none'
					});
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
			
			// 点击面板操作按钮
			clickpanel(panelitem) {
				// 如果有跳转链接则跳转至目标页
				if(panelitem.url) {
					uni.navigateTo({
						url: panelitem.url
					});
				}
				else{
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
