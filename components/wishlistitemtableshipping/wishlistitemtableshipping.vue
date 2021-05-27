<template>
	<view class="wishlistitemtableshippingview comcontent">
		
		<!-- 物流表格 -->
		<tableCom v-if="tableHeader" ref="tableComRef" :headers="tableHeader" :contents="tableContents"
				width="100%"
				height="auto"
				:fontSize="[12,20]"
				:headerWeight="true"
				:minHeight="[70,120]"
				:defaultColWidth="165"
				headerBgColor="#6739b6"
				contentBgColor="#fff"
				headerFtColor="#fff"
				contentFtColor="#3e3e3e"
				linkColor="#0024c8"
				firstColBgColor="#f1f1f1"
				borderColor="#e1e1e1"
				:showLeftAndRightBorder="true"
				:showVertBorder="true"
				:loaderSize="50"
				loaderColor="#a3a3a3"
				loaderBgColor="#f8f8f8"
				:checkColWidth="70"
				checkerColor="#3e3e3e"
				checkerBorderColor="#d3d3d3"
				checkerBgColor="rgba(0, 0, 0, 0)"
				checkerBoxBgColor="'rgba(0, 0, 0, 0)'"
				checkerCellBgColor="#f1f1f1"
				
				emptyString="-"
				:firstLineFixed="true"
				textAlign="center"
				:padding="[5,10]"
				:urlCol="tableUrlCol"
				:mediaCol="tableMediaCol"
				:computedCol="tableComputedCol"
				:bottomComputedFixed="true"
				:valueFormat="tableValueFormat"
				:formatCol="tableFormatCol"
				:sortCol="tableSortCol"
				:sortWays="tableSortWays"
				:loading="tableLoading"
				enableCheck=""
		></tableCom>
		
	</view>
</template>

<script>
	
	import tableCom from "@/components/wyb-table/wyb-table.vue";
	
	var _this;
	
	export default {
		name:"wishlistitemtablespec",
		
		data() {
			return {
				
				tableHeader: null, // 表格表头数据
				tableContents: null, // 表格内容数据
				tableUrlCol: [],
				tableMediaCol: [],
				tableComputedCol: [],
				tableValueFormat: [],
				tableFormatCol: [],
				tableSortCol: [],
				tableSortWays: [],
				tableLoading: false,
				
			};
		},
		
		components: {
			tableCom,
		},
		
		props: {
			
			// 心愿商品信息
			wishinfo: {
				type: Object,
				default: null
			},
			
		},
		
		created() {
			_this = this
			// 加载table数据
			this.setTableData()
		},
		
		methods: {
			
			// 设置table数据
			setTableData() {
				
				// 设置table的header数据
				let headers = [
					
					{
						label: _this.i18n.wishlist.shippingtable.internationalshippingcompany, // 国际快递公司名称
						key: 'interShippingName'
					},
					{
						label: _this.i18n.wishlist.shippingtable.internationalshippingcode, // 国际物流编码
						key: 'interShippingCode'
					},
					{
						label: _this.i18n.wishlist.shippingtable.img, // 图片
						key: 'shippingImg'
					},
					{
						label: _this.i18n.wishlist.shippingtable.domesticshippingcompany, // 国内快递公司名称
						key: 'domeShippingName'
					},
					{
						label: _this.i18n.wishlist.shippingtable.domesticshippingnum, // 国内快递运单号
						key: 'domeShippingNum',
					},
					{
						label: _this.i18n.wishlist.shippingtable.boxContainerNum, // 装箱数量
						key: 'boxContainerNum'
					},
					{
						label: _this.i18n.wishlist.shippingtable.boxVolume, // 箱子体积
						key: 'boxVolume'
					},
					{
						label: _this.i18n.wishlist.shippingtable.boxWeight, // 装箱重量
						key: 'boxWeight'
					},
					
				]
				
				this.tableHeader = headers
				
				// 设置表格数据
				let contents = [
					{
						interShippingName: 'carGo',
						interShippingCode: 'BL-SPUG',
						shippingImg: this.wishinfo.imgs.split(',')[0] || '',
						domeShippingName: "中通快递",
						domeShippingNum: 'ZT335679479982774904',
						boxContainerNum: this.wishinfo?.productExt?.boxContainNum || '',
						boxVolume: this.wishinfo?.productExt?.boxVolume || '',
						boxWeight: this.wishinfo?.productExt?.boxWeight || '',
						url: ['运费估算', `/pages/logistic/checklogisticresult`]
					}
				]
				
				this.tableContents = contents
				
				this.tableUrlCol = [
					{
						type: 'route',
						key: 'url'
					}
				]
				
				this.tableMediaCol = [
					{
						type: 'img',
						key: 'shippingImg'
					}
				]
				
				// 暂不加入统计行
				// this.tableComputedCol = ['specAmount']
				
			},
			
		},
		
		//
	}
</script>

<style lang="scss" scoped>

</style>
