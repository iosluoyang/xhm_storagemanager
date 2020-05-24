<template>
	<view class="stockview">
		
		<!-- 自定义导航栏 -->
		<cu-custom bgColor="bg-gradual-green" isBack>
			<block slot="content">{{i18n.nav.stock}}</block>
		</cu-custom>
		
		<!-- 今日实时数据展示 -->
		<view class="grid col-1 padding-sm">
			
			<view class="bg-white padding-sm radius shadow-blur">
				
				<!-- 头部标题区域 -->
				<view class="titleview flex align-center justify-between padding-bottom dashed-bottom">
					<text class="flex-sub text-df text-black text-bold">{{ i18n.stock.todaystocksituation }}</text>
					<text v-if="nowstockinfo" class="flex-sub text-sm text-grey text-right">{{ i18n.stock.until }}: {{ nowstockinfo.tjDate }}</text>
				</view>
				
				<!-- 数据展示区域 -->
				<view v-if="nowstockinfo" class="grid col-2 padding text-center">
					
					<view class="todaystockout flex flex-direction justify-center solid-right solid-bottom padding-bottom-sm">
						<text class="text-green text-bold text-xl margin-bottom-sm">{{ nowstockinfo.outStockCount }}</text>
						<text class="text-black text-light text-df">{{ i18n.report.stockreport.outstockcount }}</text>
					</view>
					
					<view class="todaystockout flex flex-direction justify-center solid-bottom padding-bottom-sm">
						<text class="text-red text-bold text-xl margin-bottom-sm">{{ nowstockinfo.outStockTotalMoney }}</text>
						<text class="text-black text-light text-df">{{ i18n.report.stockreport.earntotalnum }}</text>
					</view>
					
					<view class="todaystockout flex flex-direction justify-center solid-right">
						<text class="text-blue text-bold text-xl margin-bottom-sm">{{ nowstockinfo.inStockCount }}</text>
						<text class="text-black text-light text-df">{{ i18n.report.stockreport.instockcount }}</text>
					</view>
					
					<view class="todaystockout flex flex-direction justify-center">
						<text class="text-red text-bold text-xl margin-bottom-sm">{{ nowstockinfo.inStockTotalMoney }}</text>
						<text class="text-black text-light text-df">{{ i18n.report.stockreport.paytotalnum }}</text>
					</view>
					
				</view>
				
			</view>
			
		</view>
		
		<!-- 出入库操作区域 -->
		<!-- <view class="grid col-2 padding-sm">
			
			<view class="padding-sm">
				<view class="bg-gradual-green padding radius text-center shadow-blur text-lg ">
					<text class="cuIcon cuIcon-deliver margin-right-sm"></text>
					<text class="text-light text-xxl">{{ i18n.stock.stockout }}</text>
				</view>
			</view>
			
			<view class="padding-sm">
				<view class="bg-gradual-blue padding radius text-center shadow-blur text-lg ">
					<text class="cuIcon cuIcon-cart margin-right-sm"></text>
					<text class="text-light text-xxl">{{ i18n.stock.stockin }}</text>
				</view>
			</view>
			
		</view> -->
		
		<!-- 近日出入库情况图表概览 -->
		<view class="uchartsview bg-white margin">
			<canvas :canvas-id="stockchartcanvasid" :id="stockchartcanvasid" class="charts" :style="{width: cWidth+'px',height: cHeight+'px'}" @touchstart="touchstartstockchart"></canvas>
		</view>
		
		<!-- 库存记录 -->
		<view class="stockrecordview">
			
			<!-- 导航栏 -->
			<scroll-view scroll-x class="bg-white nav text-center">
				<view class="cu-item" :class="checkstocktype === 'out' ?'text-green cur':''" @tap="tabSelect" data-stocktype="out">
					<text class="cuIcon-deliver"></text>
					<text class="text-df">{{ i18n.stock.stockout }}</text>
				</view>
				<view class="cu-item" :class="checkstocktype === 'in' ?'text-blue cur':''" @tap="tabSelect" data-stocktype="in">
					<text class="cuIcon-cart"></text>
					<text class="text-df">{{ i18n.stock.stockin }}</text>
				</view>
			</scroll-view>
			
			<!-- 最近10条库存列表 -->
			<view class="recentrecordview padding">
				
				<view class="outrecordview" v-show="checkstocktype==='out'">
					<stockrecorditem class="bg-white radius margin-bottom-sm solid-bottom" v-for="(stockinfo, index) in recentstockoutrecordlist" :key="index" :stockinfo="stockinfo"></stockrecorditem>
				</view>
				
				<view class="inrecordview" v-show="checkstocktype==='in'">
					<stockrecorditem class="bg-white radius margin-bottom-sm solid-bottom" v-for="(stockinfo, index) in recentstockinrecordlist" :key="index" :stockinfo="stockinfo"></stockrecorditem>
				</view>

			</view>
			
			
		</view>
		
		
	</view>
</template>

<script>
	
	import uCharts from '@/components/u-charts/u-charts.js'
	import stockrecorditem from '@/components/base/stockrecorditem.vue'
	
	var _this
	var stockchart = null // 当前库存的图表
	
	export default {
		
		components: {
			
			stockrecorditem,
		},
		
		data() {
			return {
				
				nowstockinfo: null, // 当前实时库存统计数据
				checkstocktype: 'out', // 当前查看库存记录的类型  out为出库记录 in为入库记录  默认为出库记录
				recentstockoutrecordlist: null, // 最近10条出库数据
				recentstockinrecordlist: null, // 最近10条入库数据
				
				stockchartcanvasid: 'canvasColumn', // 库存出入库情况图表画布id
				
				cWidth:'', // 图表宽度
				cHeight:'', // 图表高度
				pixelRatio:1, // 图表像素比
				
				chartData: '', // 图表数据
				
			};
		},
		
		onLoad() {
			_this = this
			
			// 获取今日实时统计数据
			this.getstocksituationnow()
			
			// 获取最近10条的出入库数据
			this.getrecentstockrecord()
			
			let res = uni.getSystemInfoSync()
			let windowWidth = res.windowWidth
			
			this.cWidth=windowWidth - 50;
			this.cHeight=this.cWidth*1;
			
			// 获取图表数据
			this.getchartData();
		},
		
		methods: {
			
			// 获取当前实时库存统计数据
			getstocksituationnow() {
				this.$api.reportapi.gettodaystockreport().then(response => {
					// 获取成功
					let nowstockinfo = response.data.stockInfo
					this.nowstockinfo = nowstockinfo
					
				}).catch(error => {})
			},
			
			// 获取最近的出入库数据
			getrecentstockrecord() {
				
				// 获取最近10条出库数据
				let outdata = {
					flag: 1, //	出入库标识0入库1出库
					pageSize: 10, //	每页显示的条数
					pageNum: 1, //	页码
				}
				this.$api.stockapi.getstockrecord(outdata).then(response => {
					// 获取成功
					let recentstockoutrecordlist = response.data.list
					this.recentstockoutrecordlist = recentstockoutrecordlist
					
				}).catch(error => {
					uni.showToast({
						title: this.i18n.error.loaderror,
						icon: 'none'
					});
				})
				
				// 获取最近10条入库数据
				let indata = {
					flag: 0, //	出入库标识0入库1出库
					pageSize: 10, //	每页显示的条数
					pageNum: 1, //	页码
				}
				this.$api.stockapi.getstockrecord(indata).then(response => {
					// 获取成功
					let recentstockinrecordlist = response.data.list
					this.recentstockinrecordlist = recentstockinrecordlist
					
				}).catch(error => {
					uni.showToast({
						title: this.i18n.error.loaderror,
						icon: 'none'
					});
				})
				
			},
			
			// 切换查看库存记录的类型
			tabSelect(e) {
				this.checkstocktype = e.currentTarget.dataset.stocktype;
			},
			
			// 获取最近几天的库存统计数据
			getchartData() {
				
				// 获取最近10天的出入库数据
				let data = {
					dayNum: 10
				}
				
				this.$api.reportapi.geteachdaystockreport(data).then(response => {
					// 获取成功
					let list = response.data.list
					
					// 处理数据
					let chartData = _this.setchartdata(list)
					this.chartData = chartData
					
					// 显示图表
					_this.showChart(_this.stockchartcanvasid,chartData);
					
				}).catch(error => {
					uni.showToast({
						title: _this.i18n.error.loaderror,
						icon: 'none'
					});
				})
				
			},
			
			// 处理图表数据
			setchartdata(originallist) {
				
				/*
				数据格式:
				chartData: {
					categories: ['2012', '2013', '2014', '2015', '2016', '2017'],
					series: [{
						name: '成交量A',
						data: [35, 20, 25, 37, 4, 20],
						color: '#000000'
					}, {
						name: '成交量B',
						data: [70, 40, 65, 100, 44, 68]
					}, {
						name: '成交量C',
						data: [100, 80, 95, 150, 112, 132]
					}]
				}
				
				*/
			   
				let list = [...originallist]
				let categories = []
				let outstockArr = []
				let instockArr = []
			   
				list.forEach((eachitem, index) => {
				   // 汇总日期
				   let date = eachitem.tjDate
				   let monthstr = date.split('-')[1]
				   let daystr = date.split('-')[2]
				   let categoriestr = `${monthstr}/${daystr}`
				   categories.push(categoriestr)
				   
				   // 出库信息
				   let outStockCount = eachitem.outStockCount
				   outstockArr.push(outStockCount)
				   
				   // 入库信息
				   let inStockCount = eachitem.inStockCount
				   instockArr.push(inStockCount)
				   
			   })
			   
				let series = [
				   {
					   name: _this.i18n.report.stockreport.outstockcount,
					   data: outstockArr,
					   color: '#e54d42'
				   },
				   {
						name: _this.i18n.report.stockreport.instockcount,
						data: instockArr,
						color: '#39b54a'
				   }
			   ]
				
				let chartData = { categories:categories , series:series };
				
				return chartData
				
			},
			
			// 显示图表
			showChart(canvasId,chartData) {
				
				stockchart = new uCharts({
					$this:_this,
					canvasId: canvasId,
					type: 'line',
					fontSize:11,
					legend:{show:true},
					dataLabel:true,
					dataPointShape:true,
					background:'#FFFFFF',
					pixelRatio:_this.pixelRatio,
					categories: chartData.categories,
					series: chartData.series,
					animation: true,
					xAxis: {
						type:'grid',
						gridColor:'#CCCCCC',
						gridType:'dash',
						dashLength:8
					},
					yAxis: {
						gridType:'dash',
						gridColor:'#CCCCCC',
						dashLength:8,
						splitNumber:5,
						min:10,
						max:180,
						format:(val)=>{return val.toFixed(0)}
					},
					width: _this.cWidth*_this.pixelRatio,
					height: _this.cHeight*_this.pixelRatio,
					extra: {
						line:{
							type: 'straight'
						}
					}
				})
				
				
			},
			
			// 触摸图表事件
			touchstartstockchart(e) {
				stockchart.showToolTip(e, {
					format: function (item, category) {
						return category + ' ' + item.name + ':' + item.data 
					}
				});
			},
			
			//
		},
	}
</script>

<style lang="scss" scoped>
	
	.stockview{
		
		
	}
	
</style>
