<template>
	<view class="wishtablespec comcontent">
		
		
		<!-- 使用uview的table -->
		<u-table v-if="false" class="u-table multiprotable" fontSize="20" padding="10rpx 0">
			
			<!-- 首先遍历表头 -->
			<u-tr v-if="tableHeaderArr" class="u-tr tableheader">
				<u-th class='u-th eachheaderitem' v-for="(headeritem, headerindex) in tableHeaderArr" :key="headerindex" :width="headeritem.width">{{ headeritem.title }}</u-th>
			</u-tr>
			
			<!-- 填充表格内容数据 -->
			<!-- 每一个商品数据 -->
			<u-tr v-if="tableDataArr" class="u-tr tableeachrow" v-for="(contentitem, contentindex) in tableDataArr" :key="contentindex">
				
				<!-- 每一列的数据要和header保持一致 -->
				<!-- 每一商品数据的每一列数据 -->
				<u-td class="u-td" v-for="(headeritem, headerindex) in tableHeaderArr" :key="headerindex" :width="headeritem.width">
					
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
						
						<!-- 如果对应表头为多规格则渲染多规格数据 -->
						<template v-if="headeritem.key == 'specList'">
							
							<!-- 每一个商品数据的一级规格行数据 -->
							<u-tr class="u-tr subtr" v-for="(subitem, subitemindex) in contentitem[headeritem.key]" :key="subitemindex">
								
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
								<u-td class="u-td subtd spec1speclist" width="70%">
									
									<!-- 根据二级规格的多少选择渲染多少行 -->
									<u-tr class="u-tr spec2utr" v-for="(sub2item, sub2itemindex) in subitem.childList" :key="sub2itemindex">
										
										<!-- 每一个子行包含的列数据 -->
										<!-- 每一个二级规格对应的每一列的数据 -->
										
										<!-- 二级规格名称 -->
										<u-td class="u-td subtd spec2name" width="50%">
											<view class="u-line-5">{{ sub2item.attributeName }}</view>
										</u-td>
										<!-- 二级规格单价 -->
										<u-td class="u-td subtd spec2price" width="30%">{{ sub2item.price }}</u-td>
										<!-- 二级规格数量 -->
										<u-td class="u-td subtd spec2amount" width="20%">{{ sub2item.amount }}</u-td>
										
									</u-tr>
									
								</u-td>
								
								<!-- 一级规格总数量 -->
								<u-td class="u-td subtd spec1totalamount" width="5%">{{ subitem.totalAmount }}</u-td>
								
							</u-tr>
						
						</template>
						
					</template>
					
				</u-td>
				
			</u-tr>
			
		</u-table>
		
		<!-- 使用uni-table -->
		<uni-table class="multiprotable" border stripe>
			
			<!-- 首先遍历表头 -->
			<uni-tr v-if="tableHeaderArr" class="tableheader">
				<uni-th class='eachheaderitem' v-for="(headeritem, headerindex) in tableHeaderArr" :key="headerindex" :width="headeritem.width" align="center" :sortable="false">{{ headeritem.title }}</uni-th>
			</uni-tr>
			
			<!-- 填充表格内容数据 -->
			<!-- 每一个商品数据 -->
			<uni-tr v-if="tableDataArr" class="tableeachrow" v-for="(contentitem, contentindex) in tableDataArr" :key="contentindex">
				
				<!-- 每一列的数据要和header保持一致 -->
				<!-- 每一商品数据的每一列数据 -->
				<uni-td v-for="(headeritem, headerindex) in tableHeaderArr" :key="headerindex">
					
					<!-- 如果类型为正常文本展示则直接展示 -->
					<template v-if="headeritem.type == 'text'">
						{{ contentitem[headeritem.key] }}
					</template>
					
					<!-- 如果类型为图片则渲染图片组件 -->
					<template v-else-if="headeritem.type == 'img'">
						<u-image width="100" height="100" mode="aspectFill" :src="contentitem[headeritem.key]" @click="previewImg(contentitem[headeritem.key])"></u-image>
					</template>
					
					<!-- 如果类型为数组则该列渲染多个行数据 -->
					<template v-else-if="headeritem.type == 'arr'">
						<!-- 每一个子行数据 -->
						
						<!-- 如果对应表头为多规格则渲染多规格数据 -->
						<template v-if="headeritem.key == 'specList'">
							
							<!-- 表头区域 -->
							<uni-tr class="subheadtr">
								<uni-th v-for="(subheaditem, subheaditemindex) in tableHeaderArr2" :key="subheaditemindex" :width="subheaditem.width" align="center">{{ subheaditem.title }}</uni-th>
							</uni-tr>
							
							<!-- 每一个商品数据的一级规格行数据 -->
							<uni-tr class="subtr" v-for="(subitem, subitemindex) in contentitem[headeritem.key]" :key="subitemindex">
								
								<uni-td class="subtd" v-for="(subheaditem, subheaditemindex) in tableHeaderArr2" :key="subheaditemindex" align="center">
								
									<!-- 一级规格索引 -->
									<template v-if="subheaditem.key == 'index'" class="subtd spec1index" :class=" subitemindex%2 == 0 ? 'bg-cyan light' : 'bg-pink light' ">
										{{ (subitemindex+1).toString() }}
									</template>
									
									<!-- 一级规格名称 -->
									<template v-if="subheaditem.key == 'attributeName'" class="subtd spec1name">
										<view class="u-line-5">{{ subitem[subheaditem.key] }}</view>
									</template>
									
									<!-- 一级规格图片 -->
									<template v-if="subheaditem.key == 'img'" class="subtd spec1img">
										<u-image width="150" height="150" mode="aspectFill" :src="subitem[subheaditem.key]" @click="previewImg(subitem[subheaditem.key])"></u-image>
									</template>
									
									<!-- 对应的二级规格 此处默认一定会有二级规格(没有则为默认规格) -->
									<template v-if="subheaditem.key == 'childList'" class="subtd spec1speclist">
										<!-- 根据二级规格的多少选择渲染多少行 -->
										<uni-tr class="spec2utr" v-for="(sub2item, sub2itemindex) in subitem[subheaditem.key]" :key="sub2itemindex">
											
											<!-- 每一个子行包含的列数据 -->
											<!-- 每一个二级规格对应的每一列的数据 -->
											
											<!-- 二级规格名称 -->
											<uni-td class="subtd spec2name" align="center">{{ sub2item.attributeName }}</uni-td>
											<!-- 二级规格单价 -->
											<uni-td class="subtd spec2price" align="center">{{ sub2item.price }}</uni-td>
											<!-- 二级规格数量 -->
											<uni-td class="subtd spec2amount" align="center">{{ sub2item.amount }}</uni-td>
											
										</uni-tr>
										
									</template>
									
									<!-- 一级规格总数量 -->
									<template v-if="subheaditem.key == 'totalAmount'" class="u-td subtd spec1totalamount" >{{ subitem[subheaditem.key] }}</template>
									
								</uni-td>
								
							</uni-tr>
						
						</template>
						
					</template>
					
				</uni-td>
				
			</uni-tr>
			
		</uni-table>
		
	</view>
</template>

<script>
	
	var _this
	
	export default {
		
		name:"wishtablespec",
		
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
				tableHeaderArr: null, // 表头数组
				tableHeaderArr2: null, // 副表头数组
				tableDataArr: null, // 表格内容数组
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
				// 模拟规格数组
				let specList = [
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
						totalAmount: 900,
					}]

				// 构建商品数组
				let productList = [
					{...this.wishinfo, ...{specList: specList}, ...{totalAmount: 1100}}
				]
				
				// 设置表头
				let tableHeaderArr = [
					{
						title: '索引',
						key: 'index',
						type: 'text',
						width: '20rpx'
					},
					{
						title: '图片',
						key: 'mainImg',
						type: 'img',
						width: '200rpx'
					},
					{
						title: '名称',
						key: 'productTitle',
						type: 'text',
						width: '50rpx'
					},
					{
						title: '规格',
						key: 'specList',
						type: 'arr',
						width: '1500rpx'
					},
					{
						title: '合计',
						key: 'totalAmount',
						type: 'text',
						width: '50rpx'
					},
					
				]
				
				_this.tableHeaderArr = tableHeaderArr
				
				// 设置二级表头
				let tableHeader2Arr = [
					{
						title: '索引',
						key: 'index',
						type: 'text',
						width: '20rpx'
					},
					{
						title: '规格1',
						key: 'attributeName',
						type: 'text',
						width: '50rpx'
					},
					{
						title: '规格图片',
						key: 'img',
						type: 'img',
						width: '100rpx'
					},
					{
						title: '规格2',
						key: 'childList',
						type: 'arr',
						width: '1000rpx'
					},
					{
						title: '合计',
						key: 'totalAmount',
						type: 'text',
						width: '50rpx'
					},
					
				]
				
				this.tableHeaderArr2 = tableHeader2Arr
				
				// 表格内容数据数组
				let tableDataArr = []
				
				productList.forEach( (proitem, proindex) => {
					
					let eachtabledata = {}
					
					// 根据表头内容进行数据填充
					tableHeaderArr.forEach(headeritem => {
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
											
					tableDataArr.push(eachtabledata)
					
				})
				
				this.tableDataArr = tableDataArr
				
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
