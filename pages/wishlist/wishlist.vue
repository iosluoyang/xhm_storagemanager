<template>
	<view class="content wishlistview">
		
		<!-- 导航栏 -->
		<cu-custom bgImage="https://image.weilanwl.com/color2.0/plugin/wdh2236.jpg" isBack>
			<block slot="content">{{i18n.nav.wishlist}}</block>
		</cu-custom>
		
		<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback">
			
			<view class="eachwish" v-if="wishitem" v-for="(wishitem, index) in datalist" :key="index" @tap.stop="wishdetail(wishitem)">
				
				<!-- 每一个卡片的内容 -->
				<view class="cu-card case">
					
					<view class="cu-item shadow">
						
						<!-- 卡片上方-图片区域 -->
						<view class="image">
							<image :src="wishitem.imgs ? imgUrl + wishitem.imgs.split(',')[0] : '/static/publicicon/logo.png' " mode="aspectFill"></image>
							<view class="cu-tag text-white" :class="[wishitem.achieveFlag == 2 ? 'bg-green' : wishitem.achieveFlag == 1 ? 'bg-orange' : 'bg-pink']">{{wishitem.achieveFlag == 2 ? i18n.wishlist.achieveFlag.finish : wishitem.achieveFlag == 1 ? i18n.wishlist.achieveFlag.waittoconfirm : i18n.wishlist.achieveFlag.ing}}</view>
							<view class="cu-bar bg-shadeBottom flex-direction align-start">
								
								<!-- 商品标题 -->
								<view class="text-bold text-xl margin-top-sm">{{wishitem.productTitle}}</view>
								<!-- 商品价格 -->
								<view class="priceview margin-top-sm">
									<text class="text-red text-xl margin-right">{{ `${wishitem.targetMoneyType === 'RMB' ? '¥' : wishitem.targetMoneyType === 'THB' ? '฿' : ''}${wishitem.targetPrice}` }}</text>
									<text class="text-gray text-df" style="text-decoration: line-through;">{{ `${wishitem.sourceMoneyType === 'RMB' ? '¥' : wishitem.sourceMoneyType === 'THB' ? '฿' : ''}${wishitem.sourcePrice}` }}</text>
								</view>
								
							</view>
						</view>
						
						<!-- 卡片下方-内容区域 -->
						<view class="cu-list menu-avatar">
							<view class="cu-item">
								
								<!-- 头像 -->
								<template>
									<image v-if="wishitem.user && wishitem.user.avatar" class="cu-avatar round lg" :src="imgUrl + wishitem.user.avatar"></image>
									<view v-else class="cu-avatar round lg">
										<text class="cuIcon-people"></text>
									</view>
								</template>
								
								<!-- 内容 -->
								<view class="content flex-sub">
									
									<!-- 上方发布人昵称 -->
									<view class="text-grey">{{wishitem.user && wishitem.user.userName ? wishitem.user.userName : 'XXX'}}</view>
									
									<!-- 内容区域 -->
									<view class="flex justify-between">
										<!-- 发布时间 -->
										<view class="text-gray text-sm">
											{{showtimestr(wishitem.creatTime)}}
										</view>
										<!-- 点赞浏览区域 -->
										<view class="text-gray text-sm">
											<!-- 紧急程度 -->
											<text class="hurryleveltext margin-right-sm">
												<text v-for="item in wishitem.hurryLevel" :key="item" class="cuIcon cuIcon-lightfill text-red"></text>
											</text>
											<text class="cuIcon-attentionfill margin-lr-xs"></text>{{wishitem.previewCount || 0}}
											<text class="cuIcon-messagefill margin-lr-xs"></text> {{wishitem.commentCount || 0}}
										</view>
									</view>
									
								</view>
								
							</view>
						</view>
						
					</view>
					
				</view>
				
			</view>
			
		</mescroll-body>
		
	</view>
</template>

<script>
	
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	var _this
	
	export default {
		
		data() {
			return {
				
				pageSize: 10, // 每页条数
				
				datalist: [], // 数据源
				
			};
		},
		
		mixins: [MescrollMixin],
		
		onLoad(option) {
			
			_this = this
			// 开始加载数据
			uni.$on('updatewishlist', function() {
				_this.mescroll.resetUpScroll()
			})
		},
		
		onUnload() {
			uni.$off('updatenoticelist')
		},
		
		methods: {
			
			// 上拉加载
			upCallback(page) {
				let pageNum = page.num // 页码, 默认从1开始
				let pageSize = this.pageSize // 页长, 默认每页10条
				let date = page.date // 请求时间
				
				// 调用云函数
				uniCloud.callFunction({
					name: 'wishlist',
					data: {
						type: 'getlist',
						info: {
							date: date,
							pageSize: pageSize,
							pageNum: pageNum
						}
					}
				}).then(response => {
					if(response) {
						// 加载成功
						let date = response.result.data.date
						let curdatalist = response.result.data || []
						
						if(page.num == 1) {
							this.datalist = []; //如果是第一页需手动置空列表
							page.date = date
						} 
						this.datalist = this.datalist.concat(curdatalist); //追加新数据
						let hasNext = curdatalist.length === page.size //如果当前页的数据量不等于每页请求的数据量  则说明已经没有下一页了
						_this.mescroll.endSuccess(curdatalist.length,hasNext)
					}
					else {
						uni.showToast({
							title: _this.i18n.error.loaderror,
							icon: 'none'
						});
						// 失败隐藏下拉加载状态
						_this.mescroll.endErr()
					}
					
				}).catch(error => {
					uni.showToast({
						title: _this.i18n.error.loaderror,
						icon: 'none'
					});
					// 失败隐藏下拉加载状态
					_this.mescroll.endErr()
				})
			},
			
			// 显示时间字符串
			showtimestr(creatTime) {
				let moment = this.$moment
				let nowmoment = new moment()
				let creatmoment = new moment(creatTime)
				let duration = moment.duration(nowmoment.diff(creatTime))
				let difftimestr = duration.humanize()
				return difftimestr
			},
			
			// 点击查看详情
			wishdetail(wishitem) {
				uni.navigateTo({
					url: `/pages/wishlist/wishdetail?id=${wishitem._id}`
				});
			},
			
			
			
		},
		
		//
	}
</script>

<style lang="scss" scoped>

</style>
