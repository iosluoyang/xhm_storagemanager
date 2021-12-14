<template>
	<view class="home">
		
		<!-- 当前用户头像区域 -->
		<view class="userview">
			
			<!-- 用户登录时显示用户头像昵称和标签 -->
			<view v-if="user" class="flex align-center" @tap.stop="jumpToPersonal">
				
				<view class="cu-avatar lg round" :style="{backgroundImage: `url(${user.avatar})`}"></view>
				
				<view class="flex flex-direction margin-left-sm">
					
					<view class="text-lg text-white text-bold text-cut" :style="{maxWidth: '400rpx'}">
						{{ user.nickname }}
					</view>
					
					<view class="usertag flex align-center margin-top-sm">
						<view class="usertag cu-tag radius margin-right-sm" :class="[ $basejs.getrolenameandcolor(user.role).bgColor ]">
							{{ $basejs.getrolenameandcolor(user.role).title }}
						</view>
					</view>
					
				</view>
				
			</view>
			
			<!-- 当用户未登录时显示未登录的默认头像 -->
			<view v-else class="cu-avatar round lg" @tap.stop="login">
				<text class="cuIcon-people"></text>
			</view>
			
		</view>
		
		<!-- 切换语言按钮 -->
		<button class="languagebtn xl cu-btn radius bg-white text-black" @tap.stop="ifshowmodal=true">{{ `语言/Lang` }}</button>
		
		<!-- 菜单列表 -->
		<scroll-view scroll-y class="page">
			
			<!-- 头部背景图片 -->
			<image src="/static/bgimgs/bg-sky.png" mode="widthFix" class="response"></image>
			
			<!-- 操作区域 -->
			<view class="nav-list">
				
				<block v-for="(item,index) in elements" :key="index">
					
					<!-- :style="[{animation: 'show ' + ((index+1)*0.2+1) + 's 1'}]" -->
					<view class="jumpitem nav-li" 
						:class="'bg-'+item.color"
						@tap.stop="clickitem(item)"
					>
						<view class="nav-title">{{item.title}}</view>
						<view class="nav-name">{{item.name}}</view>
						<text :class="'cuIcon-' + item.cuIcon"></text>
					</view>
					
				</block>
				
			</view>
			
		</scroll-view>
		
		<!-- 切换语言单选框弹出框 -->
		<view class="cu-modal" :class="ifshowmodal?'show':''" @tap.stop="ifshowmodal=false">
			<view class="cu-dialog" @tap.stop="">
				<radio-group class="block" @change="changelanguage">
					<view class="cu-list menu text-left">
						<view class="cu-item" v-for="(language,index) in languageArr" :key="index">
							<label class="flex justify-between align-center flex-sub">
								<view class="flex-sub">{{language.name}}</view>
								<radio class="round" :class=" currentlanguage === language.id ? 'checked' : '' " :checked=" currentlanguage === language.id "
								 :value="language.id"></radio>
							</label>
						</view>
					</view>
				</radio-group>
			</view>
		</view>
		
		<!-- 公告弹框 -->
		<u-popup class="popupview" v-model="showModal" mode="center" width="80%" z-index="600" :mask-close-able="true">
			
			<view v-if="homenotice" class="popcontentview padding radius" :class="[ homenotice.title || homenotice.content ? 'bg-white' : '' ]">
				
				<view v-if="homenotice.title" class="titleview t_center text-bold text-black text-lg">
					{{ homenotice.title }}
				</view>
				
				<!--  :style="{maxHeight: '600rpx'}" -->
				<scroll-view v-if="homenotice.content || homenotice.image" class="contentview margin-top" scroll-y>
					
					<view v-if="homenotice.content" class="text-df">
						{{ homenotice.content }}
					</view>
					
					<image v-if="homenotice.image" class="margin-top" :src="homenotice.image.split(',')[0]" :style="{width: '100%'}" mode="widthFix"></image>
					
				</scroll-view>
				
				
				
			</view>
			
			<view class="closebtn t_center margin-top">
				<text class="cuIcon cuIcon-roundclosefill text-white" :style="{fontSize: '40px'}" @click="showModal = false"></text>
			</view>
			
		</u-popup>
		
	</view>
</template>

<script>
	import moment from 'moment'
	var _this
	
	export default {
		
		data() {
			return {
				needtochecktoken: true, // 是否检测用户token信息
				elements: [],
				languageArr: [], // 当前语言数组
				ifshowmodal: false, // 是否显示单选切换弹框  默认为否
				
				homenotice: null, // 首页公告对象
				showModal: false, // 是否显示公告弹框  默认为否
				
			}
		},
		
		onLoad() {
			
			_this = this
			
			
			// 设置语言包
			this.setlanguage()
			
			// 设置主操作区域
			this.setmainoption()
			
			// 获取首页公告
			this.gethomenotice()
			
		},
		
		computed: {
			
			currentlanguage() {
				let currentlanguage = this._i18n.locale
				let momentlanguage = currentlanguage == 'zh' ? 'zh-cn' : currentlanguage
				moment.locale(momentlanguage) // 设置moment的国际化
				return currentlanguage
			},
			
		},
		
		methods: {
			
			// 设置语言数组
			setlanguage() {
				
				let languageArr = [
					{
						name: '中文',
						id: 'zh',
					},
					{
						name: 'English',
						id: 'en',
					},
					{
						name: 'ภาษาไทย',
						id: 'th',
					}
				]
				this.languageArr = languageArr
				
			},
			
			// 设置主操作区域
			setmainoption() {
				
				// 加载完成之后开始设置数据源
				
				// 扫描功能
				let scanitem = {
					title: this.i18n.nav.scan,
					id: 'scan',
					name: 'Scan the QR',
					color: 'cyan',
					cuIcon: 'scan'
				}
				
				// 物流管理功能
				let logisticitem = {
					title: this.i18n.nav.logistic,
					id: 'logistic',
					name: 'Logistic',
					color: 'pink',
					cuIcon: 'deliver',
					url: '/pages/logistic/index'
				}
				
				// 心愿单功能
				let wishlistitem = {
					title: this.i18n.nav.wish,
					id: 'wishlist',
					name: 'Wishlist',
					color: 'mauve',
					cuIcon: 'like',
				}
				
				// 个人中心功能
				let personalitem = {
					title: this.i18n.nav.me,
					id: 'me',
					name: 'Personal',
					color: 'orange',
					cuIcon: 'people',
					url: '/pages/base/me'
				}
				
				let elements = []
				
				elements = [wishlistitem, personalitem]
				
				this.elements = elements
				
			},
			
			// 跳转操作
			clickitem(item) {
				
				// 检查登录状态
				_this.$basejs.checklogin().then(() => {
					// 有跳转链接存在
					if(item.url) {
						uni.navigateTo({
							url: item.url
						});
					}
					// 无链接跳转存在 根据id选择处理事件
					else{
						switch (item.id){
							// 扫一扫
							case 'scan':
							{
								// 开始扫一扫
								_this.$basejs.scanQR().then(vaildcontent => {
									
									// 扫描成功
									uni.showModal({
										content: vaildcontent,
										showCancel: true,
										cancelText: _this.i18n.base.cancel,
										confirmText: _this.i18n.base.copy,
										success: res => {
											if(res.confirm) {
												_this.$basejs.copytoclipboard(vaildcontent)
											}
										}
									});
									
									
								}).catch((othercontent) => {
									uni.showModal({
										content: othercontent,
										showCancel: false,
										confirmText: _this.i18n.base.confirm
									});
								})
							}
								break;
							// 心愿单
							case 'wishlist':
							{
								let jumpurl = _this.user && _this.user.role && _this.user.role == _this.$basejs.roleEnum.productAgent ? '/pages/wishlist/list' : '/pages/wishlist/index'
								uni.navigateTo({
									url: jumpurl
								});
							}
								break;
							default:
								break;
						}
					}

				})
				
			},
			
			// 切换语言
			changelanguage(e) {
				let selectlanguage = e.detail.value
				console.log(`当前选中的语言为:${JSON.stringify(selectlanguage)}`);
				let tempi18n = this._i18n
				tempi18n.locale = selectlanguage
				uni.setStorageSync('lang', selectlanguage)
				this.ifshowmodal = false
				this.setmainoption()
			},
			
			// 跳转个人页面
			jumpToPersonal() {
				uni.navigateTo({
					url: '/pages/base/me'
				});
			},
			
			// 登录
			login() {
				uni.navigateTo({
					url: '/pages/base/login'
				});
			},
			
			// 获取首页公告
			gethomenotice() {
				
				const db = uniCloud.database();
				db.collection('notice').orderBy('creatDate desc').get({getOne: true})
				.then(response => {
					if(response.result.code == 0) {
						let noticeinfo = response.result.data
						this.homenotice = noticeinfo
						
						// 判断本地是否已经有了该公告 如果已经有了则不显示
						let previousnoticeid = uni.getStorageSync('homepagenoticeid')
						// 已经显示过同样的公告了 此时不显示该公告
						if(noticeinfo && previousnoticeid && previousnoticeid === noticeinfo._id) {
							
						}
						// 没有显示过该公告  此时要显示该公告 然后将该公告id存在本地
						else if(noticeinfo){
							this.showModal = true
							// 将当前的公告id存在本地  用于下一次的比较
							uni.setStorageSync('homepagenoticeid', noticeinfo._id)
						}
						
					}
					else {
						// 获取公告失败
						uni.showToast({
							title: this.i18n.error.loaderror,
							icon: 'none'
						});
					}
				})
				.catch(error => {
					// 获取公告失败
					uni.showToast({
						title: this.i18n.error.loaderror,
						icon: 'none'
					});
				})
				
			},
			
			//
		}
	
	}
</script>

<style scoped lang="scss">
	
	.home {
		
		height: 100vh;
		
		.nav-list {
			display: flex;
			flex-wrap: wrap;
			padding: 0px 40upx 0px;
			justify-content: space-between;
			
			.nav-li {
				padding: 30upx;
				border-radius: 12upx;
				width: 45%;
				margin: 0 2.5% 40upx;
				background-size: cover;
				background-position: center;
				position: relative;
				z-index: 1;
				
				&::after{
					
					content: "";
					position: absolute;
					z-index: -1;
					background-color: inherit;
					width: 100%;
					height: 100%;
					left: 0;
					bottom: -10%;
					border-radius: 10upx;
					opacity: 0.2;
					transform: scale(0.9, 0.9);
					
				}
				
				&.cur{
					
					color: #fff;
					background: rgb(94, 185, 94);
					box-shadow: 4upx 4upx 6upx rgba(94, 185, 94, 0.4);
					
				}
				
				.nav-title {
					font-size: 32upx;
					font-weight: 300;
					
					&::first-letter{
						
						font-size: 40upx;
						margin-right: 4upx;
						
					}
					
				}
				
				.nav-name {
					font-size: 28upx;
					text-transform: Capitalize;
					margin-top: 20upx;
					position: relative;
					
					&::before{
						
						content: "";
						position: absolute;
						display: block;
						width: 40upx;
						height: 6upx;
						background: #fff;
						bottom: 0;
						right: 0;
						opacity: 0.5;
						
					}
					
					&::after{
						
						content: "";
						position: absolute;
						display: block;
						width: 100upx;
						height: 1px;
						background: #fff;
						bottom: 0;
						right: 40upx;
						opacity: 0.3;
						
					}
					
					&::first-letter{
						
						font-weight: bold;
						font-size: 36upx;
						margin-right: 1px;
						
					}
					
				}
				
				text{
					position: absolute;
					right: 30upx;
					top: 30upx;
					font-size: 52upx;
					width: 60upx;
					height: 60upx;
					text-align: center;
					line-height: 60upx;
				}
				
			}
			
		}
		
		.userview{
			position: fixed;
			top: 180rpx;
			left: 20rpx;
			z-index: 200;
		}
		
		.languagebtn{
			position: fixed;
			top: 200rpx;
			right: 20rpx;
			z-index: 200;
		}
		
		/deep/.popupview{
			.u-mode-center-box{
				background-color: transparent !important;
			}
		}
		
	}
	
</style>
