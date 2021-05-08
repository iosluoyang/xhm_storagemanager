<template>
	<view class="wishlistitemtablespecview comcontent">
		
		<!-- 多规格表格 -->
		<tableCom v-if="tableHeader" ref="tableComRef" :headers="tableHeader" :contents="tableContents"
				width="100%"
				height="auto"
				:fontSize="[30,20]"
				:headerWeight="true"
				:minHeight="[70,120]"
				:defaultColWidth="165"
				headerBgColor="#f1f1f1"
				contentBgColor="#fff"
				headerFtColor="#3e3e3e"
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
			
			// 规格对应的心愿信息
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
			
			// 初始化table数据
			// 设置table数据
			setTableData() {
				
				// 设置table的header数据
				let headers = [
					{
						label: _this.i18n.wishlist.spectable.spec, // 规格
						key: 'spec'
					},
					{
						label: _this.i18n.wishlist.spectable.img, // 图片
						key: 'specImg'
					},
					{
						label: _this.i18n.wishlist.spectable.amount, // 数量
						key: 'specAmount'
					},
					{
						label: _this.i18n.wishlist.spectable.singleprice, // 单价
						key: 'specPrice'
					},
					// {
					// 	label: _this.i18n.wishlist.boxContainerNum, // 装箱数量
					// 	key: 'boxContainerNum'
					// },
					// {
					// 	label: _this.i18n.wishlist.boxSize, // 箱体尺寸
					// 	key: 'boxSize'
					// },
					// {
					// 	label: _this.i18n.wishlist.boxVolume, // 装箱体积
					// 	key: 'boxVolume'
					// },
					// {
					// 	label: _this.i18n.wishlist.boxWeight, // 装箱重量
					// 	key: 'boxWeight'
					// },
					// {
					// 	label: _this.i18n.shipping.calcualteshipping, // 计算运费
					// 	key: 'url'
					// }
				]
				
				this.tableHeader = headers
				
				// 设置表格数据
				let contents = [
					{
						spec: '1',
						specImg: this.wishinfo.imgs.split(',')[0] || '',
						specAmount: '100',
						specPrice: '12.5',
						boxContainerNum: this?.productExt?.boxContainNum || '',
						boxSize: this.wishinfo?.productExt?.boxLength && this.wishinfo?.productExt?.boxWidth && this.wishinfo?.productExt?.boxHeight ? `${this.wishinfo?.productExt?.boxLength}*${this.wishinfo?.productExt?.boxWidth}*${this.wishinfo?.productExt?.boxHeight}` : '',
						boxVolume: this.wishinfo?.productExt?.boxVolume || '',
						boxWeight: this.wishinfo?.productExt?.boxWeight || '',
						url: ['点击跳转', `/pages/logistic/checklogisticresult`]
					},
					{
						spec: '2',
						specImg: this.wishinfo.imgs.split(',')[1] || '',
						specAmount: '300',
						specPrice: '32.8',
						boxContainerNum: this?.productExt?.boxContainNum || '',
						boxSize: this.wishinfo?.productExt?.boxLength && this.wishinfo?.productExt?.boxWidth && this.wishinfo?.productExt?.boxHeight ? `${this.wishinfo?.productExt?.boxLength}*${this.wishinfo?.productExt?.boxWidth}*${this.wishinfo?.productExt?.boxHeight}` : '',
						boxVolume: this.wishinfo?.productExt?.boxVolume || '',
						boxWeight: this.wishinfo?.productExt?.boxWeight || '',
						url: ['点击跳转', `/pages/logistic/checklogisticresult`]
					},
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
						key: 'specImg'
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
