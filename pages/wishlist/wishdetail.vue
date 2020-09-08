<template>
	<view class="content wishdetailview">
		
		<!-- 导航栏 -->
		<cu-custom bgImage="https://image.weilanwl.com/color2.0/plugin/wdh2236.jpg" isBack>
			<block slot="content">{{i18n.nav.wishlist}}</block>
		</cu-custom>
		
		<!-- 详情区域 -->
		<view class="detailview cu-card">
			
			<!-- 基本信息区域 -->
			<view v-if="wishinfo" class="cu-item shadow bg-white">
				
				<!-- 头部区域 -->
				<view v-if="wishinfo.user" class="headerview flex justify-between padding">
					
					<view class="publisherview flex">
						
						<!-- 头像 -->
						<template>
							<image v-if="wishinfo.user.avatar" class="cu-avatar round" :src="imgUrl + wishinfo.user.avatar"></image>
							<view v-else class="cu-avatar round sm">
								<text class="cuIcon-people"></text>
							</view>
						</template>
						<!-- 昵称和时间 -->
						<view class="content flex-sub margin-left">
							<view>{{wishinfo.user.userName}}</view>
							<view class="text-gray text-sm flex justify-between">
								{{ wishinfo.creatTime }}
							</view>
						</view>
					
					</view>
					
					<view class="headerrightview flex align-center justify-end">
						
						<view class="cu-tag" :class="[ wishinfo.achieveFlag == 0 ? 'bg-pink' : 'bg-gradual-green' ]">
							{{ wishinfo.achieveFlag == 0 ? '未实现' : '已实现' }}
						</view>
						
					</view>
					
				</view>
				
				<!-- 商品图片区域 -->
				<swiper class="screen-swiper round-dot" indicator-dots circular
				 autoplay :duration="500" :interval="3000" :current="swiperCur" @change="changeSwiper" indicator-color="#8799a3"
				 indicator-active-color="#0081ff">
					<swiper-item v-for="(completeimg,index) in imgsArr" :key="index" :class="swiperCur==index?'cur':''" @tap.stop="previewImgs(index)">
						<image :src="completeimg" mode="aspectFit"></image>
					</swiper-item>
				</swiper>
				
				<!-- 商品标题和备注区域 -->
				<view class="text-content padding-sm">
					
					<view class="text-bold text-xl">
						
						<!-- 紧急程度 -->
						<text class="hurryleveltext margin-right-sm">
							<text v-for="item in wishinfo.hurryLevel" :key="item" class="cuIcon cuIcon-lightfill text-red"></text>
						</text>
						
						<!-- 商品标题 -->
						<text class="protitle">
							{{wishinfo.productTitle}}
						</text>
						
					</view>
					
					<!-- 商品价格 -->
					<view class="priceview margin-top-sm">
						<text class="text-red text-xl margin-right">{{ `${wishinfo.targetMoneyType === 'RMB' ? '¥' : wishinfo.targetMoneyType === 'THB' ? '฿' : ''}${wishinfo.targetPrice}` }}</text>
						<text class="text-gray text-df" style="text-decoration: line-through;">{{ `${wishinfo.sourceMoneyType === 'RMB' ? '¥' : wishinfo.sourceMoneyType === 'THB' ? '฿' : ''}${wishinfo.sourcePrice}` }}</text>
					</view>
					
				</view>
				
				<!-- 操作区域 -->
				<view class="flex align-center justify-between padding-sm">
					
					<view class="btnsview flex align-center">
						
						<!-- 复制源网站链接按钮 非H5平台且有源网站链接时出现-->
						<!-- #ifndef H5 -->
						<button v-if="wishinfo.sourceLink" class="cu-btn round bg-gradual-green cuIcon-link margin-right-sm" @tap.stop="copysourcelink"></button>
						<!-- #endif -->
						
						<!-- 编辑按钮 仅自己可编辑 -->
						<button v-if="wishinfo.user.uid == user.uid" class="cu-btn round line-gray cuIcon-edit margin-right-sm" @tap.stop="editwish"></button>
						
						<!-- 删除按钮 仅自己可删除 -->
						<button v-if="wishinfo.user.uid == user.uid" class="cu-btn round line-red cuIcon-delete margin-right-sm" @tap.stop="deletewish"></button>
						
					</view>
					
					<view class="staticview text-gray text-sm text-right">
						<text class="cuIcon-attentionfill margin-lr-xs"></text>{{wishinfo.previewCount || 0}}
						<text class="cuIcon-messagefill margin-lr-xs"></text> {{wishinfo.commentCount || 0}}
					</view>
					
				</view>
								
			</view>
			
		</view>
		
		<!-- 时间轴 -->
		<view v-if="timelinearrdic && Object.keys(timelinearrdic).length > 0 " class="timelineview solid-top">
			
			<view class="cu-bar bg-white">
				<view class="action">
					<text class="cuIcon-titles text-green"></text>
					<text class="text-xl text-bold">{{ i18n.wishlist.timeline.title }}</text>
				</view>
			</view>
			
			<view class="cu-timeline"  v-for="(timelinearr, timelinekey) in timelinearrdic" :key="timelinekey">
				
				<view class="cu-time">{{ $moment(timelinekey).format('DD/MM') }}</view>
				
				<view class="cu-item" v-for="(timelineitem, timelineindex) in timelinearr" :key="timelineindex">
					<view class="content">
						<view class="cu-item flex align-center">
							<image class="cu-avatar round lg margin-right-sm" :src="imgUrl + timelineitem.user.avatar" mode="aspectFill"></image>
							<view class="text-gray text-df">
								{{timelineitem.user.userName}}
							</view>
						</view>
						<view class="margin-top">
							{{timelineitem.content}}
						</view>
					</view>
				</view>
				
				<!-- <view class="cu-item">
					<view class="content">
						
						<view class="cu-list menu-avatar comment solids-top">
							
							<view class="cu-item">
								<view class="cu-avatar round" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg);"></view>
								<view class="content">
									<view class="text-grey">凯尔</view>
									<view class="text-gray text-content text-df">
										妹妹，如果不是为了飞翔，我们要这翅膀有什么用?
									</view>
									<view class="bg-grey padding-sm radius margin-top-sm  text-sm">
										<view class="flex">
											<view>莫甘娜：</view>
											<view class="flex-sub">如果不能立足于大地，要这双脚又有何用?</view>
										</view>
									</view>
									<view class="margin-top-sm flex justify-between">
										<view class="text-gray text-df">2018年12月4日</view>
										<view>
											<text class="cuIcon-appreciate text-gray"></text>
											<text class="cuIcon-messagefill text-gray margin-left-sm"></text>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
					
				</view> -->
				
			</view>
			
		</view>
		
		<!-- 添加按钮 悬浮 -->
		<view class="addbtn cu-btn round bg-gradual-purple shadow-blur cuIcon lg" @tap.stop="updatewishtimeline">
			<text class="cuIcon-add" style="font-size: 100upx;"></text>
		</view>
		
		<!-- 加载条 -->
		<loading :loadModal="ifloading"></loading>
		
	</view>
</template>

<script>
	
	var _this
	
	export default {
		data() {
			return {
				id: null, // 当前心愿详情id
				wishinfo: null, // 当前心愿详情
				timelinearrdic: {}, // 心愿时间轴数据
				swiperCur: 0, // 当前轮播图索引
				imgsArr: [], // 轮播图的图片数组索引
				
			};
		},
		
		onLoad(option) {
			_this = this
			
			let id = option.id
			id = id || `5f55a657c07b7700015e8e65`
			this.id = id
			
			if(this.id) {
				// 开始加载心愿详情数据
				this.loaddetaildata()
				
				// 加载心愿时间轴数据
				this.loadtimelinedata()
			}
			else {
				uni.showToast({
					title: _this.i18n.error.loaderror,
					icon: 'none'
				});
				setTimeout(function() {
					// uni.navigateBack();
				}, 1500);
			}
			
			uni.$on('updatewishdetail', function() {
				_this.loaddetaildata()
			})
			
			uni.$on('updatetimeline', function() {
				// 仅更新时间轴
				_this.loadtimelinedata()
			})
			
		},
		
		onUnload() {
			uni.$off('updatewishdetail')
			uni.$off('updatetimeline')
		},
		
		methods: {
			
			// 获取心愿详情
			loaddetaildata() {
				
				_this.ifloading = true // 开始缓冲动画
				
				uniCloud.callFunction({
					name: 'wishlist',
					data: {
						type: 'getdetail',
						info: {
							_id: this.id
						}
					}
				}).then(res => {
					_this.ifloading = false // 结束缓冲动画
					// 获取心愿详情数据成功
					if(res.success) {
						
						let info = res.result.data[0]
						_this.wishinfo = info
						
						// 设置轮播图的图片数组
						let imgsArr = []
						if(_this.wishinfo && _this.wishinfo.imgs) {
							_this.wishinfo.imgs.split(',').forEach(img => {
								let completeimg = _this.imgUrl + img
								imgsArr.push(completeimg)
							})
						}
						_this.imgsArr = imgsArr
					}
					else {
						uni.showToast({
							title: _this.i18n.error.loaderror,
							icon: 'none'
						});
					}
					
				}).catch(error => {
					
					_this.ifloading = false // 结束缓冲动画
					
					uni.showToast({
						title: _this.i18n.error.loaderror,
						icon: 'none'
					});
				})
				
			},
			
			// 点击复制源网站链接
			copysourcelink() {
				let sourcelink = this.wishinfo.sourceLink
				uni.setClipboardData({
					data: sourcelink,
					success() {
						uni.showToast({
							title: `copy ${sourcelink} succeed !`,
							icon: 'none'
						});
					}
				})
			},
			
			// 加载心愿时间轴数据
			loadtimelinedata() {
				
				_this.ifloading = true // 开始缓冲动画
				
				uniCloud.callFunction({
					name:'wishlisttimeline',
					data: {
						type: 'getlist',
						info: {
							wishid: _this.id
						}
					}
				}).then(res => {
					
					_this.ifloading = false // 结束缓冲动画
					
					if(res.success) {
						let timelinelist = res.result.data
						
						// 获取时间轴数据  将时间轴数据整理变更为按照日期来区分
						let newtimelinearrdic = {}
						timelinelist.forEach((timelineitem, index) => {
							let creatTime = timelineitem.creatTime
							// 获取日期
							let creatDate = _this.$moment(creatTime).format('YYYY-MM-DD')
							if(newtimelinearrdic[creatDate]) {
								let samedatearr = newtimelinearrdic[creatDate]
								samedatearr.push(timelineitem)
							}
							else {
								newtimelinearrdic[creatDate] = [timelineitem]
							}
						})
						_this.timelinearrdic = newtimelinearrdic
					}
					else {
						uni.showToast({
							title: _this.i18n.error.loaderror,
							icon: 'none'
						});
					}
				}).catch(error => {
					
					_this.ifloading = false // 结束缓冲动画
					
					uni.showToast({
						title: _this.i18n.error.loaderror,
						icon: 'none'
					});
				})
			},
			
			// 切换轮播图
			changeSwiper(e) {
				this.swiperCur = e.detail.current
			},
			
			// 查看大图
			previewImgs(index) {
				uni.previewImage({
					current:index,
					urls: _this.imgsArr
				})
			},
			
			// 更新心愿时间轴进度
			updatewishtimeline() {
				uni.navigateTo({
					url: `/pages/wishlist/handletimeline?wishid=${this.id}`
				});
			},
			
			// 编辑心愿
			editwish() {
				uni.navigateTo({
					url: `/pages/wishlist/handlewish?type=edit&id=${this.id}`
				});
			},
			
			// 删除心愿
			deletewish() {
				
				uni.showModal({
					content: _this.i18n.tip.deleteconfirm,
					showCancel: true,
					cancelText: _this.i18n.base.cancel,
					confirmText: _this.i18n.base.confirm,
					success: res => {
						if(res.confirm) {
							// 开始删除
							
							uniCloud.callFunction({
								name: 'wishlist',
								data: {
									type: 'delete',
									info: {
										_id: _this.id
									}
								}
							}).then(response => {
								// 删除成功
								uni.showToast({
									title: _this.i18n.tip.deletesuccess,
									icon: 'none'
								});
								// 更新列表数据
								uni.$emit('updatewishlist')
								// 返回
								setTimeout(function() {
									uni.navigateBack();
								}, 1500);
								
							}).catch(error => {
								// 删除失败
								uni.showToast({
									title: _this.i18n.error.deleteerror,
									icon: 'none'
								});
							})
							
						}
					},
				})
				
			},
			
		},
	}
</script>

<style lang="scss" scoped>
	
	.content{
		
		.addbtn{
			position: fixed;
			z-index: 999;
			width: 100upx;
			height: 100upx;
			bottom: 50upx;
			right: 50upx;
		}

	}
	
</style>
