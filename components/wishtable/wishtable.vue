<template>
	<view class="wishprotable comcontent">
		
		<!-- 多商品table -->
		<u-table class="u-table multiprotable" fontSize="20">
			
			<!-- 首先遍历表头 -->
			<u-tr v-if="tableHeader" class="u-tr tableheader">
				<u-th class='u-th eachheaderitem' v-for="(headeritem, headerindex) in tableHeader" :key="headerindex" :width="headeritem.width">{{ headeritem.title }}</u-th>
			</u-tr>
			
			<!-- 填充表格内容数据 -->
			<!-- 每一个商品数据 -->
			<u-tr v-if="tableContent" class="u-tr tableeachrow" v-for="(contentitem, contentindex) in tableContent" :key="contentindex">
				
				<!-- 每一列的数据要和header保持一致 -->
				<!-- 每一商品数据的每一列数据 -->
				<u-td class="u-td" v-for="(headeritem, headerindex) in tableHeader" :key="headerindex" :width="headeritem.width">
					
					<!-- 如果类型为正常文本展示则直接展示 -->
					<template v-if="headeritem.type == 'text'">
						{{ contentitem[headeritem.key] }}
					</template>
					
					<!-- 如果类型为图片则渲染图片组件 -->
					<template v-else-if="headeritem.type == 'img'">
						<u-image style="margin: 0 auto;width: 100%;" width="100%" mode="widthFix" :src="contentitem[headeritem.key]" @click="previewImg(contentitem[headeritem.key])"></u-image>
					</template>
					
					<!-- 如果类型为数组则该列渲染多个行数据 -->
					<template v-else-if="headeritem.type == 'arr'">
						<!-- 每一个子行数据 -->
						<!-- 每一个商品数据的一级规格行数据 -->
						<u-tr class="u-tr subtr" v-for="(subitem, subitemindex) in contentitem[headeritem.key]" :key="subitemindex">
							
							<!-- 每一个子行包含的列数据 -->
							<!-- 每一个一级规格行数据的每一项内容 -->
							
							<!-- 一级规格索引 -->
							<u-td class="u-td subtd spec1index" :class=" subitemindex%2 == 0 ? 'bg-cyan light' : 'bg-pink light' " width="5%">
								{{ (subitemindex+1).toString() }}
							</u-td>
							
							<!-- 一级规格名称 -->
							<u-td class="u-td subtd spec1name" width="10%">
								<view class="u-line-5">{{ subitem.attributeName }}</view>
							</u-td>
							
							<!-- 一级规格图片 -->
							<u-td class="u-td subtd spec1img" width="10%">
								<u-image style="margin: 0 auto;width: 100%;" width="100%" mode="widthFix" :src="subitem.img" @click="previewImg(subitem.img)"></u-image>
							</u-td>
							
							<!-- 对应的二级规格 此处默认一定会有二级规格(没有则为默认规格) -->
							<u-td class="u-td subtd spec1speclist" width="70%" style="width: 70%;">
								
								<!-- 根据二级规格的多少选择渲染多少行 -->
								<u-tr class="u-tr spec2utr" v-for="(sub2item, sub2itemindex) in subitem.childList" :key="sub2itemindex">
									
									<!-- 每一个子行包含的列数据 -->
									<!-- 每一个二级规格对应的每一列的数据 -->
									
									<!-- 二级规格名称 -->
									<u-td class="u-td subtd spec2name">
										<view class="u-line-5">{{ sub2item.attributeName }}</view>
									</u-td>
									<!-- 二级规格单价 -->
									<u-td class="u-td subtd spec2price">{{ sub2item.price }}</u-td>
									<!-- 二级规格数量 -->
									<u-td class="u-td subtd spec2amount">{{ sub2item.amount }}</u-td>
									
								</u-tr>
								
							</u-td>
							
							<!-- 一级规格总数量 -->
							<u-td class="u-td subtd spec1totalamount" width="5%">{{ subitem.totalAmount }}</u-td>
							
						</u-tr>
					</template>
					
				</u-td>
				
			</u-tr>
			
		</u-table>
		
	</view>
</template>

<script>
	
	var _this
	
	export default {
		
		name:"wishtable",
		
		props: {
			
			// 规格对应的心愿信息
			wishinfo: {
				type: Object,
				default: null
			},
			
		},
		
		data() {
			return {
				tableType: 'multipro', // 表格类型  multipro代表多商品表格  logistic代表物流表格  默认多商品表格
				tableHeader: null, // 表头数据
				tableContent: null, // 表格内容数据
			};
		},
		
		
		created() {
			_this = this
			
			// 开始设置table数据
			this.setTableData()
			
		},
		
		methods: {
			
			setTableData() {
				
				// 模拟加载table数据
				// 根据不同的表格类型选择初始不同的表格数据
				
				if(_this.tableType == 'multipro') {
					
					// 设置表头
					let tableHeader = [
						// {
						// 	title: '索引',
						// 	key: 'index',
						// 	type: 'text',
						// 	width: '10'
						// },
						{
							title: '规格',
							key: 'specList',
							type: 'arr',
						},
						// {
						// 	title: '图片',
						// 	key: 'mainImg',
						// 	type: 'img',
						// 	width: '100'
						// },
					]
					
					_this.tableHeader = tableHeader
					
					// 设置商品规格表头
					let subTableHeader = [
						{
							title: '索引',
							key: 'index',
							type: 'text',
						},
						{
							title: '规格',
							key: 'specArr',
							type: 'arr',
							width: '80%'
						},
						{
							title: '图片',
							key: 'mainImg',
							type: 'img',
						},
						{
							title: '单价',
							key: 'price',
							type: 'text',
						},
						{
							title: '数量',
							key: 'amount',
						}
							
					]
					
					let productList = [
						{
							pid: 1,
							imgs: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-444a0d7a-4a95-4237-9dec-e7b434d01cda/fd01c09b-47da-4c8e-9bb4-a61b16a7c965.jpeg',
							specList: [
								{
									attributeName: '红色/Red',
									img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-444a0d7a-4a95-4237-9dec-e7b434d01cda/dae8f9be-91e5-479b-a662-7601a34858a7.jpg',
									childList: [
										{
											attributeName: '大号/Big',
											amount: 200,
											price: '6.00'
										}
									],
									totalAmount: 200
									
								},
								{
									attributeName: '蓝色/Blue',
									img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-444a0d7a-4a95-4237-9dec-e7b434d01cda/fd01c09b-47da-4c8e-9bb4-a61b16a7c965.jpeg',
									childList: [
										{
											attributeName: '大号/Big',
											amount: 200,
											price: '6.00'
										},
										{
											attributeName: '中号/Middle',
											amount: 300,
											price: '3.00'
										},
										{
											attributeName: '小号/Small',
											amount: 400,
											price: '2.00'
										}
									],
									totalAmount: 900
									
								},
								{
									attributeName: '黄色/Yellow',
									img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-444a0d7a-4a95-4237-9dec-e7b434d01cda/dae8f9be-91e5-479b-a662-7601a34858a7.jpg',
									childList: [
										{
											attributeName: '大号/Big',
											amount: 150,
											price: '6.00'
										},
										{
											attributeName: '小号/Small',
											amount: 50,
											price: '2.00'
										}
									],
									totalAmount: 200
									
								},
							]
						}
					]
					
					// 遍历每一个商品根据表头进行填充数据
					let tableContent = []
					
					productList.forEach( (proitem, proindex) => {
						
						let eachtabledata = {}
						
						// 根据表头内容进行数据填充
						tableHeader.forEach(headeritem => {
							let key = headeritem.key // 取值key
							// 如果key值为索引则赋值当前商品列表的索引
							if(key == 'index') {
								eachtabledata[key] = (proindex + 1).toString()
							}
							// 如果是主图则展示商品的第一张图片
							else if(key == 'mainImg') {
								eachtabledata[key] = proitem.imgs.split(',')[0]								
							}
							else {
								eachtabledata[key] = proitem[key] // 赋值value
							}
							
						})
												
						tableContent.push(eachtabledata)
						
					})
					
					this.tableContent = tableContent
					
				}
				
			},
			
			// 查看图片
			previewImg(img) {
				let imgs = [img]
				uni.previewImage({
					urls:imgs,
					current:0
				})
			},
			
		},
	}
</script>

<style lang="scss" scoped>

	.comcontent{
		/deep/.u-table{
			.u-tr{
				.u-th{
					
				}
				.u-td{
					height: auto;
				}
			}
		}
	}

</style>
