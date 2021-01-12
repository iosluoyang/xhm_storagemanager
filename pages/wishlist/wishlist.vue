<template>
	<view class="content wishlistview">
		
		<!-- 自定义导航栏 -->
		<view class="customnav" :style="[{height:customBarHeight + 'px'}]">
			
			<view class="fixed cu-bar search bg-gradual-pink" :style="[{height: customBarHeight + 'px',paddingTop: statusBarHeight + 'px', minHeight: customBarHeight + 'px'}]">
				
				<view class="action" @tap.stop="pageBack">
					<text class="cuIcon-back"></text>
				</view>
				
				<view class="search-form round">
					<text class="cuIcon-search"></text>
					<input :adjust-position="false" type="text" :placeholder="i18n.tip.searchwish" v-model="searchText" @confirm="searchwishlist" confirm-type="search"></input>
				</view>
				
				<!-- 微信小程序中没有右侧该按钮 -->
				<!-- #ifndef MP-WEIXIN -->
				<view class="action">
					<button class="cu-btn bg-pink shadow-blur round" @tap.stop="searchwishlist">{{i18n.base.search}}</button>
				</view>
				<!-- #endif -->
				
			</view>
			
		</view>
		
		<!-- 筛选面板 -->
		<HMfilterDropdown class="filterview" :menuTop="customBarHeight" :filterData="filterData" :defaultSelected ="defaultSelected" @confirm="confirmfilter"></HMfilterDropdown>
		
		<!-- 数据列表 -->
		<mescroll-body ref="mescrollRef" top="44px" :down="downOption" @init="mescrollInit" @down="downCallback" @up="upCallback">
			
			<!-- 心愿单列表 -->
			<view class="wishlist" v-if="datalist && datalist.length > 0" >
				<wishlistitem class="eachwish" v-for="(wishitem, index) in datalist" :key="index" :wishitem="wishitem"></wishlistitem>
			</view>
			
		</mescroll-body>
		
	</view>
</template>

<script>
	
	import HMfilterDropdown from '@/components/HM-filterDropdown/HM-filterDropdown.vue'
	import wishlistitem from '@/components/wishlistitem/wishlistitem.vue'
	
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js"
	
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
				
				searchText: '', // 搜索文本
				pageSize: 10, // 每页条数
				datalist: [], // 数据源
				
			};
		},
		
		mixins: [MescrollMixin],
		
		components: {
			HMfilterDropdown,
			wishlistitem,
			
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
			
			// 搜索心愿 开始刷新数据
			searchwishlist() {
				this.mescroll.resetUpScroll(true)
			},
			
			// 加载筛选面板数据
			loadfilterdata() {
				
				let filterdata = [
					{
						"name":this.i18n.base.choose,
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
				
				// 设置筛选面板的top值(rpx)
				let filterMenuTopPx = parseInt(this.customBarHeight/(uni.upx2px(this.customBarHeight)/this.customBarHeight));
				this.filterMenuTop = filterMenuTopPx
				
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
				
				let searchText = this.searchText // 搜索文本
				
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
							searchText: searchText,
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
							_this.mescroll.scrollTo(0,0) // 如果是第一页则滑动到顶部
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
			
			
		},
		
		//
	}
</script>

<style lang="scss" scoped>

</style>

