<template>
	<view class="content wishdetailview">
		
		<!-- 导航栏 -->
		<cu-custom bgImage="https://image.weilanwl.com/color2.0/plugin/wdh2236.jpg" isBack>
			<block slot="content">{{i18n.nav.wishlist}}</block>
		</cu-custom>
		
		<!-- 详情区域 -->
		<view class="detailview">
			
			<!-- 基本信息区域 -->
			<view v-if="wishinfo" class="cu-item shadow bg-white">
				
				<!-- 发布人区域 -->
				<view v-if="wishinfo.user" class="cu-list menu-avatar">
					<view class="cu-item">
						
						<!-- 头像 -->
						<template>
							<image v-if="wishinfo.user.avatar" class="cu-avatar round lg" :src="imgUrl + wishinfo.user.avatar"></image>
							<view v-else class="cu-avatar round lg">
								<text class="cuIcon-people"></text>
							</view>
						</template>
						<!-- 昵称和时间 -->
						<view class="content flex-sub">
							<view>{{wishinfo.user.userName}}</view>
							<view class="text-gray text-sm flex justify-between">
								{{ wishinfo.creatTime }}
							</view>
						</view>
						
					</view>
			
				</view>
				
				<!-- 商品图片区域 -->
				<swiper class="card-swiper round-dot" indicator-dots circular
				 autoplay :duration="300" :interval="3000" :current="swiperCur" @change="changeSwiper" indicator-color="#8799a3"
				 indicator-active-color="#0081ff">
					<swiper-item v-for="(completeimg,index) in imgsArr" :key="index" :class="swiperCur==index?'cur':''" @tap.stop="previewImgs(index)">
						<view class="swiper-item">
							<image :src="completeimg" mode="aspectFit"></image>
						</view>
					</swiper-item>
				</swiper>
				
				<!-- 商品标题和备注区域 -->
				<view class="text-content padding-sm">
					
					<view class="text-bold text-xxl">
						{{wishinfo.productTitle}}
					</view>
					
					<!-- 商品备注 -->
					<view v-if="wishinfo.remark" class="bg-gray radius margin-sm padding-sm">
						{{ wishinfo.remark }}
					</view>
					
				</view>
				
				<!-- 操作区域 -->
				<view class="flex align-center justify-between padding-sm">
					
					<view class="btnsview flex align-center">
						
						<!-- 更新按钮 -->
						<button class="cu-btn radius bg-gradual-pink margin-right-sm" @tap.stop="updatewishtimeline">更新</button>
						
						<!-- 编辑按钮 -->
						<button class="cu-btn radius line-gray margin-right-sm" @tap.stop="editwish">编辑</button>
						
						<!-- 删除按钮 -->
						<button class="cu-btn radius line-red" @tap.stop="deletewish">删除</button>
					</view>
					
					<view class="staticview text-gray text-sm text-right">
						<text class="cuIcon-attentionfill margin-lr-xs"></text>{{wishinfo.previewCount || 0}}
						<text class="cuIcon-messagefill margin-lr-xs"></text> {{wishinfo.commentCount || 0}}
					</view>
					
				</view>
								
			</view>
			
			<!-- 时间轴 -->
			<view class="timelineview solid-top">
				
				<view class="cu-bar bg-white">
					<view class="action">
						<text class="cuIcon-titles text-green"></text>
						<text class="text-xl text-bold">{{ i18n.wishlist.timeline }}</text>
					</view>
				</view>
				
				<view class="cu-timeline">
					
					<view class="cu-time">{{ `发布动态时间` }}</view>
					
					<view class="cu-item">
						<view class="content">
							<view class="cu-item flex align-center">
								<image class="cu-avatar round lg margin-right-sm" :src="imgUrl + wishinfo.user.avatar" mode="aspectFill"></image>
								<view class="text-gray text-df">
									{{wishinfo.user.userName}}
								</view>
							</view>
							<view class="margin-top">
								{{
									`我是评论的内容，这个东西有点贵，我希望找到最便宜的一个`
								}}
							</view>
						</view>
					</view>
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
				id: null, // 当前心愿详情id
				wishinfo: null, // 当前心愿详情
				swiperCur: 0, // 当前轮播图索引
				imgsArr: [], // 轮播图的图片数组索引
				
			};
		},
		
		onLoad(option) {
			_this = this
			
			let id = option.id
			id = id || `5f51af0d2805da0001892767`
			this.id = id
			
			if(this.id) {
				// 开始加载心愿详情数据
				this.loaddetaildata()
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
			
		},
		
		onUnload() {
			uni.$off('updatewishdetail')
		},
		
		methods: {
			
			// 获取心愿详情
			loaddetaildata() {
				
				uniCloud.callFunction({
					name: 'wishlist',
					data: {
						type: 'getdetail',
						info: {
							_id: this.id
						}
					}
				}).then(response => {
					// 获取心愿详情数据成功
					let info = response.result.data[0]
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
					
				}).catch(error => {
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
				console.log(`开始更新时间轴内容`);
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
	
</style>
