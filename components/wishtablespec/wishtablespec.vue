<template>
	<view class="wishtablespec comcontent">
		
		<u-table class="u-table multiprotable" fontSize="20" padding="10rpx 0">
			
			<!-- 首先遍历表头 -->
			<u-tr v-if="tableHeaderArr" class="u-tr tableheader">
				<u-td class='u-td eachheaderitem' v-for="(headeritem, headerindex) in tableHeaderArr" :key="headerindex" :width="headeritem.width">
					
					<!-- 数组类型的表头 -->
					<template v-if="headeritem.type == 'arr'">
						<u-tr class="u-tr">
							<u-td class="u-td subth" v-for="(subhead, subheadindex) in headeritem.childList" :key="subheadindex" :width="subhead.width">
								
								<!-- 如果是数组类型 -->
								<template v-if="subhead.type == 'arr'">
									<u-tr class="u-tr">
										<u-td class="u-td subth" v-for="(thirdsubhead, thirdsubheadindex) in subhead.childList" :key="thirdsubheadindex" :width="thirdsubhead.width">
											<text class="text-center text-bold">{{ thirdsubhead.title }}</text>
										</u-td>
									</u-tr>
								</template>
								
								<!-- 普通类型 -->
								<template v-else>
									<text class="text-center text-bold">{{ subhead.title }}</text>
								</template>
								
							</u-td>
						</u-tr>
					</template>
					
					<!-- 其他类型的表头 -->
					<template v-else>
						<text class="text-center text-bold">{{ headeritem.title }}</text>
					</template>
					
				</u-td>
			</u-tr>
			
			<!-- 填充表格内容数据 -->
			<!-- 每一个商品数据 -->
			<u-tr v-if="tableDataArr" class="u-tr tableeachrow" v-for="(contentitem, contentindex) in tableDataArr" :key="contentindex">
				
				<!-- 每一列的数据要和header保持一致 -->
				<u-td class="u-td" v-for="(headeritem, headerindex) in tableHeaderArr" :key="headerindex" :width="headeritem.width">
					
					<!-- 如果类型为正常文本展示则直接展示 -->
					<template v-if="headeritem.type == 'text'">
						<text class="text-wrap" :class=" [ headeritem.key == 'totalAmount' ? 'text-bold text-pink text-lg' : '' ] ">{{ contentitem[headeritem.key] }}</text>
					</template>
					
					<!-- 如果类型为图片则渲染图片组件 -->
					<template v-else-if="headeritem.type == 'img'">
						<u-image  width="100%" height="60" mode="aspectFit" :src="contentitem[headeritem.key]" @click="previewImg(contentitem[headeritem.key])"></u-image>
					</template>
					
					<!-- 如果类型为数组则该列渲染多个行数据 -->
					<template v-else-if="headeritem.type == 'arr'">
						
						<!-- 如果对应表头为多规格则渲染多规格数据 -->
						<template v-if="headeritem.key == 'specList'">
							
							<!-- 商品的每一个一级规格行数据 -->
							<u-tr class="u-tr subtr" v-for="(subitem, subitemindex) in contentitem[headeritem.key]" :key="subitemindex">
								
								<!-- 二级表头与数据一一对应 -->
								<u-td class="u-td subtd" v-for="(subheaditem, subheaditemindex) in headeritem.childList" :key="subheaditemindex" :width="subheaditem.width">
									
									<!-- 索引类型 -->
									<text v-if="subheaditem.key == 'index'" :class=" subitemindex%2 == 0 ? 'bg-cyan light' : 'bg-pink light' ">
										{{ (subitemindex+1).toString() }}
									</text>
									
									<!-- 文本类型 -->
									<template v-if="subheaditem.type == 'text'">
										<text class="text-wrap" :class=" [ subheaditem.key == 'totalAmount' ? 'text-bold text-blue text-lg' : '' ] ">{{ subitem[subheaditem.key] }}</text>
									</template>
									
									<!-- 图片类型 -->
									<template v-if="subheaditem.type == 'img'">
										<u-image width="100%" height="60" mode="aspectFit" :src="subitem[subheaditem.key]" @click="previewImg(subitem[subheaditem.key])"></u-image>
										<!-- <u-image style="margin: 0 auto;width: 100%;" width="100%" mode="widthFix" :src="subitem[subheaditem.key]" @click="previewImg(subitem[subheaditem.key])"></u-image> -->
									</template>
									
									<!-- 对应的二级规格 此处默认一定会有二级规格(没有则为默认规格) -->
									<template v-if="subheaditem.type == 'arr'">
										<!-- 根据二级规格的多少选择渲染多少行 -->
										<u-tr class="u-tr spec2utr" v-for="(sub2item, sub2itemindex) in subitem[subheaditem.key]" :key="sub2itemindex">
											
											<!-- 三级表头与数据一一对应 -->
											<u-td class="u-td thirdsubtd" v-for="(sub3item, sub3itemindex) in subheaditem.childList" :key="sub3itemindex" :width="sub3item.width">
												
												<!-- 文本类型 -->
												<template v-if="sub3item.type == 'text'">
													<text class="text-wrap text-df">{{ sub2item[sub3item.key] }}</text>
												</template>

											</u-td>
											
										</u-tr>
										
									</template>
									
								</u-td>
								
							</u-tr>
						
						</template>
						
					</template>
					
				</u-td>
				
			</u-tr>
			
		</u-table>
		
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
		
		watch: {
			wishinfo: {
				handler(newValue, oldValue) {
					this.setTableData()
				},
				deep: true,
				immedicate: true
			}
		},
		
		data() {
			return {

				tableHeaderArr: null, // 表头数组
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
				
				// 将商品已选数量映射为表格展示
				let specList = []
				
				// 映射数据
				if(_this.wishinfo && _this.wishinfo.specPropInfo) {
					
					let proMainImg = this.wishinfo.imgs.split(',')[0]
					
					let firstList =  _this.wishinfo.specPropInfo.propValList
					firstList.forEach(firstitem => {
						let totalAmount = 0
						
						let childList = []
						// 遍历二级属性
						firstitem.specStockList.forEach(seconditem => {
							
							if(seconditem.amount && seconditem.amount > 0) {
								let childListItem = {
									attributeName: seconditem.propVal,
									amount: seconditem.amount,
									price: seconditem.price,
									specId: seconditem.specId,
								}
								totalAmount += Number(seconditem.amount)
								childList.push(childListItem)
							}
							
						})
						
						let firstImg = Array.isArray(firstitem.img) && firstitem.img.length > 0 ? firstitem.img[0] : firstitem.img
						let specListItem = {
							attributeName: firstitem.propVal,
							img: firstImg || proMainImg,
							childList: childList,
							totalAmount: totalAmount
						}
						
						if(totalAmount > 0) {
							specList.push(specListItem)
						}
						
					})
					
				}
				console.log(specList);
				
				if(specList.length == 0) {
					return
				}
				
				// 计算总数量
				let totalAmount = specList.reduce((total, item) => {
					return total + item.totalAmount
				}, 0)
				
				//设置三级表头
				let tableHeader3Arr = [
					
					{
						title: '属性2',
						key: 'attributeName',
						type: 'text',
						// width: '15%',
						ifShow: true
					},
					{
						title: '价格',
						key: 'price',
						type: 'text',
						// width:'10%',
						ifShow: true
					},
					{
						title: '数量',
						key: 'amount',
						type: 'text',
						// width:'10%',
						ifShow: true
					},
				]
				
				tableHeader3Arr = tableHeader3Arr.filter(item => (item.ifShow))
				
				// 设置二级表头
				let tableHeader2Arr = [
					{
						title: '索引',
						key: 'index',
						type: 'text',
						width: '5%',
						ifShow: false
					},
					{
						title: '属性1',
						key: 'attributeName',
						type: 'text',
						width: '15%',
						ifShow: true
					},
					{
						title: '图片',
						key: 'img',
						type: 'img',
						width: '20%',
						ifShow: true
					},
					{
						title: '规格',
						key: 'childList',
						type: 'arr',
						childList: tableHeader3Arr,
						// width:'auto',
						ifShow: true
					},
					{
						title: '小计',
						key: 'totalAmount',
						type: 'text',
						width:'10%',
						ifShow: true
					},
					
				]
				
				tableHeader2Arr = tableHeader2Arr.filter(item => (item.ifShow))
				
				// 设置表头
				let tableHeaderArr = [
					{
						title: '索引',
						key: 'index',
						type: 'text',
						width: '10%',
						ifShow: false
					},
					{
						title: '图片',
						key: 'mainImg',
						type: 'img',
						width: '10%',
						ifShow: false
					},
					{
						title: '名称',
						key: 'productTitle',
						type: 'text',
						width: '15%',
						ifShow: false
					},
					{
						title: '规格',
						key: 'specList',
						type: 'arr',
						childList: tableHeader2Arr, // 规格对应的子列表
						// width: 'auto',
						ifShow: true
					},
					{
						title: '合计',
						key: 'totalAmount',
						type: 'text',
						width: '10%',
						// #ifdef MP-WEIXIN
						ifShow: false
						// #endif
						
						// #ifndef MP-WEIXIN
						ifShow: true
						// #endif
					},
					
				]
				
				tableHeaderArr = tableHeaderArr.filter(item => (item.ifShow))
				_this.tableHeaderArr = tableHeaderArr
				
				
				// 表格内容数据数组
				let tableDataArr = []
				
				let productList = [{..._this.wishinfo, ...{specList: specList}, ...{totalAmount: totalAmount}}]
				
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
							eachtabledata[key] = proMainImg								
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
