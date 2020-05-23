<template>
	<view class="stockview">
		
		<!-- 自定义导航栏 -->
		<cu-custom bgColor="bg-gradual-green" isBack>
			<block slot="content">{{i18n.nav.stock}}</block>
		</cu-custom>
		
		<view class="uchartsview margin bg-white">
			<!--#ifndef MP-ALIPAY -->
			<canvas :canvas-id="stockchartcanvasid" :id="stockchartcanvasid" class="charts" @touchstart="touchstartstockchart"></canvas>
			<!--#endif-->
		</view>
		
	</view>
</template>

<script>
	
	import uCharts from '@/components/u-charts/u-charts.js'
	var _this
	var stockchart = null // 当前库存的图表
	
	export default {
		data() {
			return {
				stockchartcanvasid: 'canvasColumn', // 库存出入库情况图表画布id
				
				cWidth:'', // 图表宽度
				cHeight:'', // 图表高度
				pixelRatio:1, // 图表像素比
				
				chartData: '', // 图表数据
				
				
				
			};
		},
		
		onLoad() {
			_this = this
			
			let res = uni.getSystemInfoSync()
			let windowWidth = res.windowWidth
			let windowHeight = res.windowHeight
			
			this.cWidth=350;
			this.cHeight=350;
			
			// 获取图表数据
			this.getchartData();
		},
		
		methods: {
			
			// 获取数据
			getchartData() {
				
				// 获取最近10天的出入库数据
				let data = {
					dayNum: 10
				}
				
				this.$api.reportapi.geteachdaystocklist(data).then(response => {
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
		.uchartsview{
			width: 350px;
			height:350px;
			.charts{
				width: 350px;
				height: 350px;
			}
		}
		
	}
</style>
