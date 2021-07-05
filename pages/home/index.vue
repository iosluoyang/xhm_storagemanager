<template>
	<view class="home">
		
		<!-- 菜单列表 -->
		<scroll-view scroll-y class="page">
			
			<!-- 头部背景图片 -->
			<image src="/static/bgimgs/bg-sky.png" mode="widthFix" class="response"></image>
			
			<!-- 操作区域 -->
			<view class="nav-list">
				
				<block v-for="(item,index) in elements" :key="index">
					
					<view class="jumpitem nav-li" 
						:class="'bg-'+item.color"
						:style="[{animation: 'show ' + ((index+1)*0.2+1) + 's 1'}]"
						@tap.stop="clickitem(item)"
					>
						<view class="nav-title">{{item.title}}</view>
						<view class="nav-name">{{item.name}}</view>
						<text :class="'cuIcon-' + item.cuIcon"></text>
					</view>
					
				</block>
				
			</view>
			
		</scroll-view>
		
		<!-- 当前用户头像区域 -->
		<view class="userview">
			
			<!-- 用户登录时显示用户头像昵称和标签 -->
			<view v-if="user" class="flex align-center" @tap.stop="jumpToPersonal">
				
				<view class="cu-avatar lg round" :style="{backgroundImage: `url(${user.avatar})`}"></view>
				
				<view class="flex flex-direction margin-left-sm">
					
					<view class="text-lg text-white text-bold">
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
		<view class="cu-modal" :class="ifshownotice && homenotice && homenotice.content ? 'show' : '' ">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-center">
					<view class="content text-bold text-xl">{{ i18n.me.panel.notice }}</view>
				</view>
				<view v-if="homenotice && homenotice.content && homenotice.content.length > 0" class="padding-xl text-light">
					{{ homenotice.content }}
				</view>
				<view class="cu-bar bg-gradual-purple">
					<view class="action flex-sub" @tap.stop="ifshownotice=false">{{ i18n.base.confirm }}</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import moment from 'moment'
	var _this
	
	export default {
		data() {
			return {
				
				elements: [],
				languageArr: [], // 当前语言数组
				ifshowmodal: false, // 是否显示单选切换弹框  默认为否
				
				homenotice: null, // 首页公告对象
				ifshownotice: false, // 是否显示公告弹框  默认为否
				
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
				
				// 分类管理功能
				let typeitem = {
					title: this.i18n.nav.goodstype,
					id: 'producttype',
					name: 'Different Types',
					color: 'red',
					cuIcon: 'sort',
					url: '/pages/goodstype/index'
				}
				
				// 商品功能
				let goodsitem = {
					title: this.i18n.nav.goodslist,
					id: 'productlist',
					name: 'All the Product',
					color: 'blue',
					cuIcon: 'goodsfavor',
					url: '/pages/goods/goodslist'
				}
				
				// 客户关系功能
				let customeritem = {
					title: this.i18n.nav.customer,
					id: 'customer',
					name: "My Customer",
					color: 'purple',
					cuIcon: 'peoplelist',
					url: '/pages/customer/index'
				}
				
				// 库存管理功能
				let stockitem = {
					title: this.i18n.nav.stock,
					id: 'stockinout',
					name: 'Stock',
					color: 'green',
					cuIcon: 'order',
					url: '/pages/stock/index'
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
					title: this.i18n.nav.wishlist,
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
					url: '/pages/me/index'
				}
				
				let elements = []
				
				// 根据当前的用户标识选择部分的功能显示(因为支持游客模式 所以只有登录状态下的管理员才能展示全部功能)
				// 超级管理员
				// if(this.$basejs.ifloginflag() && this.user.type === 0){
				// 	elements = [scanitem,typeitem,goodsitem,customeritem,stockitem,personalitem,logisticitem,wishlistitem]
				// }
				// else{
				// 	elements = [scanitem,typeitem,goodsitem,customeritem,personalitem,logisticitem,wishlistitem]
				// }
				
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
									
									// 调用接口获取对应的pid
									_this.$api.goodsapi.getpidbyqrcode({barCode: vaildcontent}).then(response => {
										let pid = response.data.pid
										// 找到了对应的pid  直接跳转至商品详情页
										if(pid) {
											uni.navigateTo({
												url: `/pages/goods/goodsdetail?pid=${pid}`
											});
										}
										// 未找到pid 说明有该二维码但是没有对应的商品 提示用户
										else {
											uni.showModal({
												title: _this.i18n.base.tip,
												content: _this.i18n.error.qrcodewithoutgoods,
												showCancel: false,
												confirmText: _this.i18n.base.confirm
											});
										}
									}).catch(error => {
										uni.showModal({
											title: _this.i18n.base.tip,
											content: _this.i18n.error.scanerror,
											showCancel: false,
											confirmText: _this.i18n.base.confirm
										});
									})
									
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
								let jumpurl = _this.user && _this.user.role && _this.user.role == 'PRODUCT_AGENT' ? '/pages/wishlist/list' : '/pages/wishlist/index'
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
					url: '/pages/me/index'
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
				
				// 使用云函数获取公告
				uniCloud.callFunction({
					name: 'notification',
					data: {
						type: 'getnewest'
					}
				}).then(response => {
					// 获取公告成功
					if(response) {
						let noticeinfo = response.result.data[0]
						this.homenotice = noticeinfo
						
						// 判断本地是否已经有了该公告 如果已经有了则不显示
						let previousnoticeid = uni.getStorageSync('homepagenoticeid')
						// 已经显示过同样的公告了 此时不显示该公告
						if(noticeinfo && previousnoticeid && previousnoticeid === noticeinfo._id) {
							
						}
						// 没有显示过该公告  此时要显示该公告 然后将该公告id存在本地
						else if(noticeinfo){
							this.ifshownotice = true
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
					
				}).catch(error => {
					// 获取公告失败
					uni.showToast({
						title: this.i18n.error.loaderror,
						icon: 'none'
					});
				})
				
				// this.$api.noticeapi.gethomenotice().then(response => {
				// 	// 获取公告成功
				// 	let noticeinfo = response.data.notice
				// 	this.homenotice = noticeinfo
					
				// 	// 判断本地是否已经有了该公告 如果已经有了则不显示
				// 	let previousnoticeid = uni.getStorageSync('homepagenoticeid')
				// 	// 已经显示过同样的公告了 此时不显示该公告
				// 	if(noticeinfo && previousnoticeid && Number(previousnoticeid) === Number(noticeinfo.id)) {
						
				// 	}
				// 	// 没有显示过该公告  此时要显示该公告 然后将该公告id存在本地
				// 	else if(noticeinfo){
				// 		this.ifshownotice = true
				// 		// 将当前的公告id存在本地  用于下一次的比较
				// 		uni.setStorageSync('homepagenoticeid', noticeinfo.id)
				// 	}

				// }).catch(error => {
				// 	// 获取公告失败
				// 	uni.showToast({
				// 		title: this.i18n.error.loaderror,
				// 		icon: 'none'
				// 	});
				// })
				
			},
			
			
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
		}
		
		.languagebtn{
			position: fixed;
			top: 200rpx;
			right: 20rpx;
		}
		
		
	}
	
</style>
