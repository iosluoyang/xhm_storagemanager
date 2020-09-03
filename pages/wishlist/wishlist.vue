<template>
	<view class="content wishlistview">
		
		<!-- 导航栏 -->
		<cu-custom bgImage="https://image.weilanwl.com/color2.0/plugin/wdh2236.jpg" isBack>
			<block slot="content">{{i18n.nav.wishlist}}</block>
		</cu-custom>
		
		<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback">
			
			<view class="eachwish" v-if="wishitem" v-for="(wishitem, index) in datalist" :key="index" @tap.stop="wishdetail(wishitem)">
				
				<view class="cu-card case no-card">
					<view class="cu-item shadow">
						
						<!-- 卡片上方-图片区域 -->
						<view class="image">
							<image :src="wishitem.imgs ? imgUrl + wishitem.imgs.split(',')[0] : 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg' " mode="aspectFill"></image>
							<view class="cu-tag text-white" :class="[wishitem.ifachieve == 1 ? 'bg-green' : 'bg-pink']">{{wishitem.ifachieve == 1 ? '已实现' : '未实现'}}</view>
							<view class="cu-bar bg-shadeBottom flex-direction align-start">
								
								<!-- 商品标题 -->
								<view class="text-bold text-xl">{{wishitem.productTitle}}</view>
								<!-- 商品价格 -->
								<view class="priceview margin-top-sm">
									<text class="text-red text-xl margin-right">{{ `${wishitem.expectmoneytype === 'RMB' ? '¥' : wishitem.expectmoneytype === 'THB' ? '฿' : ''}${wishitem.expectPrice}` }}</text>
									<text class="text-gray text-df">{{ `${wishitem.platformmoneytype === 'RMB' ? '¥' : wishitem.platformmoneytype === 'THB' ? '฿' : ''}${wishitem.platformPrice}` }}</text>
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
	var moment = require('moment');
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
					if(response.success) {
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
