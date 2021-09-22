<template>
	<view class="linkprolistview pagecontent">
		
		<!-- 导航栏 -->
		<cu-custom bgColor="bg-gradual-blue">
			
			<!-- 搜索框 -->
			<view slot="content" class="search-form round">
				<text class="cuIcon-search"></text>
				<input :placeholder="i18n.base.search + i18n.wishlist.common.title" v-model="searchText" @confirm="startToSearch" :adjust-position="false" type="text" confirm-type="search"></input>
			</view>
			
			<!-- 确定按钮 -->
			<!-- #ifndef MP -->
			<button slot="right" class="cu-btn bg-gradual-orange round margin-right" @tap.stop="startToSearch">{{ i18n.base.search }}</button>
			<!-- #endif -->
						
		</cu-custom>
		
		<!-- 筛选框 -->
		<view class="filterview bg-gray fixed">
			<u-dropdown active-color="#0081ff">
				<u-dropdown-item v-model="sortFlag" @change="changefilter" :title="i18n.base.sorttype" :options="sortOption"></u-dropdown-item>
			</u-dropdown>
		</view>
		
		<!-- mescroll区域  通过fixed来进行定位处理-->
		<mescroll-uni class="mescroll" :fixed="true" :top=" Number(CustomBar + 40) + 'px' " :topbar="true" @init="mescrollInit" :up="upOption" :down="downOption" @down="downCallback" @up="upCallBack">
			
			<view class="goodslistview">
				
				<view class="eachgood flex align-center padding solid-bottom bg-white" v-for="(item, index) in dataArr" :key="index" @tap.stop="gotoprodetail(item)">
					
					<!-- 商品首图 -->
					
					<u-image style="flex-shrink: 0;" :src="item.img" width="150" height="150"></u-image>
					
					<!-- 商品内容 -->
					<view class="margin-left flex flex-direction">
						<!-- 商品名称 -->
						<text class="text-black text-df t_twoline">{{item.title}}</text>
						
						<!-- 价格 -->
						<view class="priceinfo margin-top-sm">
							<text class="text-red text-price text-lg">{{item.price}}</text>
						</view>
						
						<!-- 销量信息 -->
						<view class="sellnuminfo margin-top-sm">
							<text class="text-grey margin-right">{{`${i18n.wishlist.common.sellnum}`}}:</text>
							<text class="text-black text-df">{{item.sales || 0 }}</text>
						</view>
						
					</view>
					
				</view>
				
			</view>
			
		</mescroll-uni>
		
	</view>
</template>

<script>
	var _this
	
	import MescrollUni from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-uni.vue'
	import MescrollBody from '@/uni_modules/mescroll-uni/components/mescroll-body/mescroll-body.vue'
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js" // 引入mescroll-mixins.js
	
	export default {
		
		components: {
			MescrollUni,
			MescrollBody
		},
		
		mixins: [MescrollMixin],
		
		props: {
			
		},
		
		data() {
			return {
				
				searchText: '', // 搜索文本
				typeId: '', // 分类id
				
				sortOption: [], // 排序方式数据
				sortFlag: '', // 默认排序方式
				
				downOption: {
					auto: false, // 是否自动执行下拉刷新 
					isLock: false,
				},
				upOption: {
					page: {
						num: 0,
						size: 20,
						date: '',
					}
				},
				
				dataArr: [], // 数据源数组
				
			};
		},
		
		onLoad(option) {
			_this = this
			
			let typeId = option.typeId
			if(typeId) this.typeId = typeId
			
			let searchText = option.searchText
			if(searchText) this.searchText
			
			// 设置筛选项
			this.setFilterData()
			
			this.$nextTick(function(){
				this.mescroll.resetUpScroll(true)
			})
			
		},
		
		methods: {
			
			// 设置筛选数据
			setFilterData() {
				// 设置排序方式筛选源 1价格从小到大 2从大到小为	3 销量从大到小
				let sortOption = [
					{
						label: this.i18n.base.default,
						value: ''
					},
					{
						label: this.i18n.base.priceasc,
						value: 1
					},
					{
						label: this.i18n.base.pricedesc,
						value: 2
					},
					{
						label: this.i18n.base.sellnumdesc,
						value: 3
					}
				]
				
				this.sortOption = sortOption
			},
			
			// 更改筛选项
			changefilter(value) {
				this.mescroll.resetUpScroll(true)
			},
			
			// 开始搜索
			startToSearch() {
				console.log(`开始刷新${this.searchText}`);
				if(this.searchText == 'cleartype') {
					uni.showModal({
						content: '是否清空分类id',
						showCancel: true,
						cancelText: this.i18n.base.cancel,
						confirmText: this.i18n.base.confirm,
						success: res => {
							if(res.confirm) {
								this.typeId = ''
								this.searchText = ''
								this.mescroll.resetUpScroll(true)
							}
							else {
								this.searchText = ''
								this.mescroll.resetUpScroll(true)
							}
						}
					});
				}
				else {
					this.mescroll.resetUpScroll(true)
				}
				
			},
			
			//上拉加载
			upCallBack(page){
								
				let pageNum = page.num; // 页码, 默认从1开始
				let pageSize = page.size; // 页长, 默认每页10条
				let date = pageNum === 1 ? '' : page.date // 请求时间标识
				let dataArr = [...this.dataArr]
				
				let data = {
					typeId: this.typeId, // 分类id
					searchText: this.searchText, // 当前商品搜索的文本
					sortFlag: this.sortFlag, // 排序方式
					pageSize: pageSize, // 每页显示的条数	Int	O	不传默认10条
					pageNum: pageNum, //	页码	Int	O	第一页页码从1开始,不传默认1
					date: date, //yyyy-MM-dd hh:mm:ss	String	O	第一页 不传
				}
				
				// 开始加载数据
				uniCloud.callFunction({
					name: 'wishlist',
					data: {
						type: 'getlinkprolist',
						info: data
					},
					success(res) {
						
						if(res.result.code == 0) {
							
							let list = res.result.data.list || []
							
							console.log(`当前的数据信息为`);
							console.log(list);
							
							//如果是第一页的话则获取分页时间
							if(pageNum === 1){
								dataArr = [] //清空数据源
								let date = res.result.data.date
								page.date = date
							}
							
							//将请求的数据添加至现有数据源中
							dataArr = dataArr.concat(list)
							
							_this.dataArr = dataArr
										
							// 如果渲染的数据较复杂,可延时隐藏下拉加载状态: 如
							let hasNext = list.length > 0
							_this.mescroll.endSuccess(list.length,hasNext)
	
						}
						else {
							uni.showToast({
								title: res.result.message,
								icon: 'none'
							});
							_this.mescroll.endErr()
						}
						
					},
					fail(error) {
						console.log(`获取失败${JSON.stringify(error)}`);
						console.log(error.message);
						uni.showToast({
							title: error.message,
							icon: 'none'
						});
						_this.mescroll.endErr()
					}
				})
				
				// 开始加载数据
				// this.$api.productapi.get1688prosearch(data).then(res => {
				// 	// 获取成功
					
				// 	let list = res.data.list || []
					
				// 	console.log(`当前的数据信息为`);
				// 	console.log(list);
					
				// 	//如果是第一页的话则获取分页时间
				// 	if(pageNum === 1){
				// 		dataArr = [] //清空数据源
				// 		let date = res.data.date
				// 		page.date = date
				// 	}
					
				// 	//将请求的数据添加至现有数据源中
				// 	dataArr = dataArr.concat(list)
					
				// 	_this.dataArr = dataArr
								
				// 	// 如果渲染的数据较复杂,可延时隐藏下拉加载状态: 如
				// 	let hasNext = list.length > 0
				// 	_this.mescroll.endSuccess(list.length,hasNext)
					
				// }).catch(error => {
				// 	uni.showToast({
				// 		title: error.msg || error,
				// 		icon: 'none'
				// 	});
				// 	_this.mescroll.endErr()
				// })
				
			},
			
			// 点击详情
			gotoprodetail(item) {
				let thirdPid = item.thirdPid
				uni.navigateTo({
					url: `/pages/wishlist/linkprodetail?thirdPid=${thirdPid}`
				});
			},
			
		},
	}
</script>

<style lang="scss" scoped>
	
</style>
