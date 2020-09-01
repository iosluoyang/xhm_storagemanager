<template>
	<view class="content wishlistview">
		
		<!-- 导航栏 -->
		<cu-custom bgImage="https://image.weilanwl.com/color2.0/plugin/wdh2236.jpg" isBack>
			<block slot="content">{{i18n.nav.wishlist}}</block>
		</cu-custom>
		
		<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback">
			
			<view class="eachwish" v-for="(wishitem, index) in datalist" :key="index" @tap.stop="wishdetail(wishitem)">
				
				<view class="cu-card case no-card">
					<view class="cu-item shadow">
						
						<!-- 图片区域 -->
						<view class="image">
							<image :src="wishitem.imgs ? imgUrl + wishitem.imgs.split(',')[0] : 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg' " mode="widthFix"></image>
							<view class="cu-tag bg-pink text-white">实现中</view>
							<view class="cu-bar bg-shadeBottom">
								
								<text class="text-bold text-sl text-cut">
									{{wishitem.productTitle}}
									<text class="text-red text-xxl margin-right-sm">{{ `${wishitem.expectmoneytype === 'RMB' ? '¥' : wishitem.expectmoneytype === 'THB' ? '฿' : ''}${wishitem.expectPrice}` }}</text>
									<text class="text-gray text-xl">{{ `${wishitem.platformmoneytype === 'RMB' ? '¥' : wishitem.platformmoneytype === 'THB' ? '฿' : ''}${wishitem.platformPrice}` }}</text>
								</text>
								
							</view>
						</view>
						<!-- 列表区域 -->
						<view class="cu-list menu-avatar">
							<view class="cu-item">
								
								<!-- 头像 -->
								<image class="cu-avatar round lg" src="https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg"></image>
								
								<!-- 内容 -->
								<view class="content flex-sub">
									
									<!-- 上方发布人昵称 -->
									<view class="text-grey">发布人昵称</view>
									
									<!-- 内容区域 -->
									<view class="flex justify-between">
										<!-- 发布时间 -->
										<view class="text-gray text-sm">
											三天前
										</view>
										<!-- 点赞浏览区域 -->
										<view class="text-gray text-sm">
											<text class="cuIcon-attentionfill margin-lr-xs"></text> 10
											<text class="cuIcon-appreciatefill margin-lr-xs"></text> 20
											<text class="cuIcon-messagefill margin-lr-xs"></text> 30
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
					console.log(`当前获取的数据为:${JSON.stringify(response)}`);
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
