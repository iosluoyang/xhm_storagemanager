<template>
	<view class="goodslist">
		
		<!-- 自定义导航栏 -->
		<view class="customnav" :style="[{height:customBarHeight + 'px'}]">
			
			<view class="fixed cu-bar search bg-gradual-blue" :style="[{height: customBarHeight + 'px',paddingTop: statusBarHeight + 'px', minHeight: customBarHeight + 'px'}]">
				
				<view class="action" @tap.stop="pageBack">
					<text class="cuIcon-back"></text>
				</view>
				
				<view class="search-form round">
					<text class="cuIcon-search"></text>
					<input :adjust-position="false" type="text" :placeholder="i18n.tip.searchproduct" v-model="searchText" @confirm="searchproduct" confirm-type="search"></input>
				</view>
				
				<!-- 微信小程序中没有右侧该按钮 -->
				<!-- #ifndef MP-WEIXIN -->
				<view class="action">
					<button class="cu-btn bg-blue shadow-blur round" @tap.stop="searchproduct">{{i18n.base.search}}</button>
				</view>
				<!-- #endif -->
				
			</view>
			
		</view>
		
		<!-- 筛选面板 -->
		<HMfilterDropdown class="filterview" :top="customBarHeight" :filterData="filterData" :defaultSelected ="filterDropdownValue" @confirm="confirmfilter"></HMfilterDropdown>
		
		<!-- 商品列表 -->
		<mescroll-uni class="mescroll" :top=" customBarHeight + 44 + 'px' " @init="mescrollInit" :down="downOption" @down="downCallback" @up="loadproductlist">
			
			<view class="goodslistview">
				
				<view class="eachgood flex justify-between align-center padding solid-bottom bg-white" v-for="(productinfo, index) in productlist" :key="index" @tap.stop="clickeachgood(productinfo)">
					
					<!-- 左侧区域 -->
					<view class="leftview flex align-center">
						
						<!-- 商品首图 -->
						<template>
							<view v-if=" productinfo.img && productinfo.img !== '' " class="cu-avatar radius lg" :style="{backgroundImage: 'url('+(imgUrl + productinfo.img)+')'}"></view>
							<view v-else class="cu-avatar radius lg"><text class="cuIcon-goodsfavor"></text></view>
						</template>
						
						<!-- 商品内容 -->
						<view class="margin-left flex flex-direction">
							<!-- 商品名称 -->
							<text class="text-black text-lg t_twoline">{{productinfo.title}}</text>
							
							<!-- 商品数据信息 -->
							<view class="flex align-center margin-top text-gray text-xs">
								<!-- 库存信息 -->
								<view class="storageinfo margin-right-sm">
									<text class="text-gray">{{`${i18n.goods.stock}: `}}</text>
									<text :class="[ parseInt(productinfo.totalStockCount) < stockCountLimitation ? 'text-red' : 'text-black', 'text-bold' ]">{{productinfo.totalStockCount}}</text>
								</view>
								
								<!-- 日销量信息 -->
								<view class="sellnuminfo">
									<text class="text-gray">{{`${i18n.goods.sellnum}: `}}</text>
									<text class="text-bold text-black">{{productinfo.daySellNum || 0 }}</text>
								</view>
								
							</view>
							
						</view>
						
					</view>
					
					
					<!-- 操作区域 -->
					<view class="optionview margin-left-sm flex align-center">
						<!-- 库存预警标识 -->
						<view v-if="parseInt(productinfo.totalStockCount) < stockCountLimitation" class=" flex align-center justify-end">
							<text class="text-red cuIcon-hotfill lg" v-for="i in 3" :key="i"></text>
						</view>
						
					</view>
					
				</view>
				
			</view>
			
		</mescroll-uni>
		
		<!-- 添加商品按钮 悬浮 -->
		<view class="addbtn cu-btn round bg-gradual-blue shadow-blur cuIcon lg" @tap.stop="addproduct">
			<text class="cuIcon-add" style="font-size: 100upx;"></text>
		</view>
		
	</view>
</template>

<script>
	import HMfilterDropdown from '@/components/HM-filterDropdown/HM-filterDropdown.vue'
	import _ from 'lodash'
	import MescrollUni from '@/components/mescroll-uni/mescroll-uni.vue'
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js" // 引入mescroll-mixins.js
	
	
	var _this;
	
	export default {
		
		components: {
			HMfilterDropdown,
			MescrollUni,
		},
		
		mixins: [MescrollMixin],
		
		data() {
			return {
				statusBarHeight: this.StatusBar,
				customBarHeight: this.CustomBar,
				
				typelist: null, // 当前分类数据
				
				
				firstTypeId: -1, // 当前一级分类的数据
				secondTypeId: -2, // 当前二级分类的数据
				sortType: 0, // 当前商品排序方式  0默认排序	1库存量升序2 库存量降序3 日销量升序	4日销量降序
				
				
				/**********商品相关数据******************/
				downOption: {
					auto: false, // 是否自动执行下拉刷新 
				},
				searchText: '', // 当前商品搜索文本
				filterData: [], // 筛选面板的数据源
				filterDropdownValue: null, // 默认选中的筛选面板数据源
				productlist: [], // 当前商品数据源数组
				stockCountLimitation: 100, // 库存预警临界值				
				
			};
		},
		
		onLoad(option) {
			
			_this = this
			
			// 数据赋值
			if(option.firstTypeId !== null) {
				this.firstTypeId = option.firstTypeId
			}
			if(option.secondTypeId !== null) {
				this.secondTypeId = option.secondTypeId
			}
			if(option.sortType !== null) {
				this.sortType = option.sortType
			}
			
			// 加载分类数据
			this.loadgoodstypelist()
			
			uni.$on('updateprolist', function() {
				_this.starttorefresh()
			})
			
			uni.$on('updateprolength', function(deleteproinfo) {
				console.log(`${JSON.stringify(deleteproinfo)}`);
				// 遍历商品列表数据 找到要删除的商品
				let deleteindex = _this.productlist.findIndex((proinfo, index) => {
					return proinfo.pid.toString() === deleteproinfo.deletepid.toString()
				})
				console.log(`找到了对应的索引,为${deleteindex}`);
				if(deleteindex !== -1) {
					_this.productlist.splice(deleteindex, 1)
				}
			})
			
		},
		
		onUnload() {
			uni.$off('updateprolist')
			uni.$off('updateprolength')
		},
		
		methods: {
			
			// 导航栏返回
			pageBack() {
				uni.navigateBack({
					delta:1
				})
			},
			
			/****************商品分类相关***************/
			
			// 加载商品分类数据
			loadgoodstypelist() {
				
				// 加载分类数据
				this.$api.goodsapi.gettypelist().then(response => {
					// 获取分类列表成功
					let typelist = response.data.list
					this.typelist = typelist
					
					// 加载筛选面板数据
					this.loadfilterdata()
					// 开始加载商品数据
					this.starttorefresh()
				
				}).catch(error => {
					// 获取分类失败
					uni.showToast({
						title: this.i18n.error.getgoodstypeerror,
						icon: 'none'
					});
				})
				
			},
			
			/****************商品列表相关***************/
			
			// 加载筛选面板数据
			loadfilterdata() {
				
				// 递归获取商品分类筛选数据源
				let gettypesubmenu = function(childList) {
					if(!childList || childList.length == 0) {
						return []
					}
					else{
						let submenu = []
						childList.forEach((typeinfo, secondindex) => {
							let subtypeinfo = {
								name: typeinfo.sysFlag === 1 ? _this.i18n.base[typeinfo.typeName] : typeinfo.typeName ,
								value: typeinfo.typeId,
								submenu: gettypesubmenu(typeinfo.childList)
							}
							submenu.push(subtypeinfo)
						})
						return submenu
					}
				}
				
				// 获取到商品分类进行遍历重组筛选数据
				let filtertypeArr = []
				let typelistsubmenu = gettypesubmenu(this.typelist)
				
				let filterdata = [
					{
						name: _this.i18n.goods.filter.goodstype,
						id: 'type',
						type: 'hierarchy',
						submenu: typelistsubmenu
					},
					{
						name: _this.i18n.goods.filter.sortway,
						id: 'sort',
						type: 'hierarchy',
						submenu: [
							{
								"name": _this.i18n.goods.filter.defaultsort,
								"value": 0
							},
							{
								"name": _this.i18n.goods.filter.stockascend,
								"value": 1
							},
							{
								"name": _this.i18n.goods.filter.stockdecrease,
								"value": 2
							},
							{
								"name": _this.i18n.goods.filter.sellnumascend,
								"value": 3
							},
							{
								"name": _this.i18n.goods.filter.sellnumdecrease,
								"value": 4
							}
						]
					}
				]
				
				this.filterData = filterdata
				
				// 根据当前默认的分类id和排序方式找到对应的选中索引
				let typevalueindexArr = []
				let sortvalueindexArr = []
				filterdata.forEach((filterinfo, index) => {
					// 分类筛选源
					if(filterinfo.id === 'type') {
						filterinfo.submenu.forEach((typeinfo, typeindex) => {
							if(Number(typeinfo.value) === Number(_this.firstTypeId)) {
								typevalueindexArr.push(typeindex)
								typeinfo.submenu.forEach((secondtypeinfo, secondtypeindex) => {
									if(Number(secondtypeinfo.value) === Number(_this.secondTypeId)) {
										typevalueindexArr.push(secondtypeindex)
									}
								})
							}
						})
					}
					// 排序筛选源
					if(filterinfo.id === 'sort') {
						filterinfo.submenu.forEach((sortinfo, sortindex) => {
							if(Number(sortinfo.value) === Number(_this.sortType)) {
								sortvalueindexArr.push(sortindex)
							}
						})
					}
				})
				
				let filterDropdownValue = new Array(filterdata.length)
				filterdata.forEach((filterinfo, index) => {
					if(filterinfo.id === 'type') {
						filterDropdownValue[index] = typevalueindexArr
					}
					else if(filterinfo.id === 'sort') {
						filterDropdownValue[index] = sortvalueindexArr
					}
				})
				
				// 设置默认选中的筛选面板的值
				this.filterDropdownValue = filterDropdownValue
				/*
				
				this.filterDropdownValue = [
					[0,1],				//第0个菜单选中 一级菜单的第0项，二级菜单的第1项
					[0],			//第1个菜单选中
				];
				
				*/
				
				
			},
			
			// 开始筛选操作
			confirmfilter(e) {
				
				let confirmIndexArr = e.index
				let confirmValueArr = e.value
				
				// 找到分类对应的筛选数据源索引
				let typevalueArrindex, sortvalueArrindex // 分类和排序的值数组索引
				
				this.filterData.forEach((firstfilterdata, index) => {
					if(firstfilterdata.id === 'type') {
						typevalueArrindex = index
					}
					else if(firstfilterdata.id === 'sort') {
						sortvalueArrindex = index
					}
				})
				// 计算分类筛选值
				let typevaluearr = confirmValueArr[typevalueArrindex]
				// 如果有一个值代表仅选中了一级分类 如果有两个值则代表选中了一级和二级分类
				let firsttypeid, secondtypeid = ''
				if(typevaluearr.length > 1) {
					firsttypeid = typevaluearr[0]
					secondtypeid = typevaluearr[1]
				}
				else {
					firsttypeid = typevaluearr[0] 
				}
				
				
				
				// 计算排序筛选值
				let sortvaluearr = confirmValueArr[sortvalueArrindex]
				let sortType = sortvaluearr[0]
				
				
				// 筛选数据发生了变化 进行刷新操作
				if(this.firstTypeId !== firsttypeid || this.secondTypeId !== secondtypeid || this.sortType !== sortType) {
					
					this.firstTypeId = firsttypeid
					this.secondTypeId = secondtypeid
					this.sortType = sortType
					// 开始刷新数据
					this.starttorefresh()
					
				}
				// 否则不进行操作
				else{
					console.log(`不进行刷新操作`);
				}
				
			},
			
			// mescroll初始化的时候
			mescrollinit(mescroll){
				//mescroll初始化之后就将其加入数据源中 以便于之后手动刷新使用
				this.mescroll = mescroll
			},
			
			// 手动触发刷新数据
			starttorefresh(){
				this.mescroll.resetUpScroll(true)
			},
			
			//上拉加载
			loadproductlist(page){
								
				let pageNum = page.num; // 页码, 默认从1开始
				let pageSize = page.size; // 页长, 默认每页10条
				let date = pageNum === 1 ? '' : page.date // 请求时间标识
				let dataArr = [...this.productlist]
				
				let data = {
					firstTypeId: this.firstTypeId, // 一级分类id
					subTypeId: this.secondTypeId, // 二级分类id
					sortType: this.sortType, // 排序方式
					barCode: '', // 商品条形码 通过扫描获取或者手动输入编码
					searchText: this.searchText, // 当前商品搜索的文本
					pageSize: pageSize, // 每页显示的条数	Int	O	不传默认10条
					pageNum: pageNum, //	页码	Int	O	第一页页码从1开始,不传默认1
					date: date, //yyyy-MM-dd hh:mm:ss	String	O	第一页 不传
				}
								
				this.$api.goodsapi.getproductlist(data).then(response => {
					//获取商品列表成功
			
					//订单列表
					let list = response.data.list || []
					
					//如果是第一页的话则获取分页时间
					if(pageNum === 1){
						dataArr = [] //清空数据源
						let date = response.data.date
						page.date = date
					}
					
					//将请求的数据添加至现有数据源中
					dataArr = dataArr.concat(list)
					
					this.productlist = dataArr
			
					// 如果渲染的数据较复杂,可延时隐藏下拉加载状态: 如
					let hasNext = dataArr.length === page.size //如果当前页的数据量不等于每页请求的数据量  则说明已经没有下一页了
					this.mescroll.endSuccess(list.length,hasNext)
					
				}).catch(error => {
					
					// 失败隐藏下拉加载状态
					this.mescroll.endErr()
					
					//获取数据失败
					uni.showToast({
						title: error.msg || error,
						icon: 'none'
					});
										
				})
				
			},
			
			// 搜索商品名称
			searchproduct: _.debounce(function(){
				let searchText = _this.searchText
				// 开始搜索操作
				_this.starttorefresh()
			}, 300),
			
			// 点击某个商品  查看商品详情
			clickeachgood(productinfo) {
				let pid = productinfo.pid
				uni.navigateTo({
					url: `/pages/goods/goodsdetail?pid=${pid}`
				});
			},
			
			// 添加新商品
			addproduct() {
				_this.$basejs.checklogin().then(() => {
					uni.navigateTo({
						url: `/pages/goods/handlegoods?type=add`
					});
				})
			},
			
			// 
		},
		
	}
</script>

<style lang="scss" scoped>
	
	page {
		height: 100%;
	}
	
	.goodslist{
		
		height: 100%;
		
		.filterview{
			
			/deep/.sub-menu-class{
				.sub-menu-list{
					&.first{
						border-right: #ededed 1px solid;
					}
					.sub-menu{
						background-color: #FFFFFF;
						&.on{
							color: #ec652b;
						}
					}
				}
			}
			
		}
	
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
