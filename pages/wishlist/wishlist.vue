<template>
	<view class="content wishlistview">
		
		<!-- 导航栏 -->
		<cu-custom bgImage="https://image.weilanwl.com/color2.0/plugin/wdh2236.jpg" isBack>
			<block slot="content">{{i18n.nav.wishlist}}</block>
		</cu-custom>
		
		<!-- 筛选面板 -->
		<HMfilterDropdown class="filterview" :menuTop="customBarHeight * 2" :filterData="filterData" :defaultSelected ="defaultSelected" @confirm="confirmfilter"></HMfilterDropdown>
		
		<!-- 数据列表 -->
		<mescroll-body ref="mescrollRef" :top=" customBarHeight + 'px' " :down="downOption" @init="mescrollInit" @down="downCallback" @up="upCallback">
			
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
	
	import HMfilterDropdown from '@/components/HM-filterDropdown/HM-filterDropdown.vue'
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	var _this
	
	export default {
		
		data() {
			return {
				
				statusBarHeight: this.StatusBar,
				customBarHeight: this.CustomBar,
				
				filterData: [], // 筛选面板的数据源
				defaultSelected: null, // 默认选中的筛选面板数组
				filterDropdownValue: null, // 默认选中的筛选面板数据源
				
				
				downOption: {
					auto: false, // 是否自动执行下拉刷新 
				},
				pageSize: 10, // 每页条数
				datalist: [], // 数据源
				
			};
		},
		
		mixins: [MescrollMixin],
		
		components: {
			HMfilterDropdown
		},
		
		onLoad(option) {
			
			_this = this
			
			// 加载筛选面板数据
			this.loadfilterdata()
			
			// 开始加载数据
			uni.$on('updatewishlist', function() {
				_this.mescroll.resetUpScroll()
			})
		},
		
		onUnload() {
			uni.$off('updatewishlist')
		},
		
		methods: {
			
			// 加载筛选面板数据
			loadfilterdata() {
				
				let filterdata = [
					{
						"name":'筛选',
						"type": 'filter',
						"submenu": [{
								"name": "心愿状态/Status",
								"submenu": [{
										"name": this.i18n.wishlist.achieveFlag.ing,
										"value": 0
									},
									{
										"name": this.i18n.wishlist.achieveFlag.waittoconfirm,
										"value": 1
									},
									{
										"name": this.i18n.wishlist.achieveFlag.finish,
										"value": 2
									}
								]
							},
							{
								"name": "紧急程度/HurryLevel",
								"submenu": [{
										"name": "1级",
										"value": 1
									},
									{
										"name": "2级",
										"value": 2
									},
									{
										"name": "3级",
										"value": 3
									},
									{
										"name": "4级",
										"value": 4
									},
									{
										"name": "5级",
										"value": 5
									}
								]
							}
						]
					},
					{
						name: _this.i18n.goods.filter.sortway,
						id: 'sort',
						type: 'hierarchy',
						submenu: [
							{
								"name": _this.i18n.goods.filter.hurryleveldecrease,
								"value": 0
							},
							{
								"name": _this.i18n.goods.filter.hurrylevelascend,
								"value": 1
							},
						]
					}
				]
				this.filterData = filterdata
				
				// 设置默认的选中项
				this.defaultSelected = [
					[[0,1],[0,1,2,3,4]],
					[0]
				]
				// 将初始的默认值赋值给选中值数组
				this.filterDropdownValue = this.defaultSelected
				// this.defaultSelected = [
				// 	[1,1,0],				//第0个菜单选中 一级菜单的第1项，二级菜单的第1项，三级菜单的第3项
				// 	[null,null],			//第1个菜单选中 都不选中
				// 	[1],					//第2个菜单选中 一级菜单的第1项
				// 	[[0],[1,2,7],[1,0]],	//筛选菜单选中 第一个筛选的第0项，第二个筛选的第1,2,7项，第三个筛选的第1,0项
				// 	[[0],[1],[1]]			//单选菜单选中 第一个筛选的第0项，第二个筛选的第1项，第三个筛选的第1项
				// ];
				
				this.$nextTick(function(){
					// 设置完默认筛选项后根据进行数据请求
					this.mescroll.resetUpScroll(true)
				})
				
			},
			
			// 开始筛选操作
			confirmfilter(e) {
				
				let confirmIndexArr = e.index
				let confirmValueArr = e.value
				this.filterDropdownValue = confirmValueArr
				this.$nextTick(function(){
					this.mescroll.resetUpScroll(true)
				})
				
			},
			
			// 上拉加载
			upCallback(page) {
				
				let pageNum = page.num // 页码, 默认从1开始
				let pageSize = this.pageSize // 页长, 默认每页10条
				let date = page.date // 请求时间
				
				// 获取筛选项的字段内容
				console.log(`当前的筛选项数组为:`);
				console.log(JSON.stringify(this.filterDropdownValue));
				
				// 根据当前的筛选项提取对应的字段
				// 心愿状态
				let achieveFlagArr = this.filterDropdownValue[0][0]
				
				// 紧急程度
				let hurryLevelArr = this.filterDropdownValue[0][1]
				
				// 排序方式
				let sortType = this.filterDropdownValue[1][0]
				
				console.log(`心愿状态:${JSON.stringify(achieveFlagArr)}--紧急程度:${JSON.stringify(hurryLevelArr)}--排序方式:${sortType}`);
				
				// 调用云函数
				uniCloud.callFunction({
					name: 'wishlist',
					data: {
						type: 'getlist',
						info: {
							achieveFlagArr: achieveFlagArr,
							hurryLevelArr: hurryLevelArr,
							sortType: sortType,
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
