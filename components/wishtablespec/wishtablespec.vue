<template>
	<view class="wishtablespec comcontent">
		
		<u-table class="u-table multiprotable" fontSize="20" padding="10rpx 0">
			
			<!-- 表头 -->
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
			
			<!-- 填充表格规格内容数据 -->
			<u-tr class="u-tr tableeachrow">
								
				<!-- 每一列的数据要和header保持一致 -->
				<u-td class="u-td" v-for="(headeritem, headerindex) in tableHeaderArr" :key="headerindex" :width="headeritem.width">
					
					<!-- 如果类型为正常文本展示则直接展示 -->
					<template v-if="headeritem.type == 'text'">
						<text class="text-wrap" :class=" [ headeritem.key == 'totalAmount' ? 'text-bold text-pink text-lg' : '' ] ">{{ tableData[headeritem.key] }}</text>
					</template>
					
					<!-- 如果类型为图片则渲染图片组件 -->
					<template v-else-if="headeritem.type == 'img'">
						<u-image  width="100%" height="60" mode="aspectFit" :src="tableData[headeritem.key]" @click="previewImg(tableData[headeritem.key])"></u-image>
					</template>
					
					<!-- 如果类型为数组则该列渲染多个行数据 -->
					<template v-else-if="headeritem.type == 'arr'">
						
						<!-- 如果对应表头为多规格则渲染多规格数据 -->
						<template v-if="headeritem.key == 'specList'">
							
							<!-- 商品的每一个一级规格行数据 -->
							<u-tr class="u-tr subtr" v-for="(subitem, subitemindex) in tableData[headeritem.key]" :key="subitemindex">
								
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
			
			<!-- 金额汇总区域 -->
			<!-- 心愿详情中如果心愿为进行中则不显示  其他情况下均显示 -->
			<template v-if=" sourcefrom == 'wishdetail' && wishinfo.achieveFlag == 0 ? false : true ">
				
				<!-- 分隔栏 -->
				<u-tr class="u-tr tableeachsummaryrow">
					<u-td class="u-td">
						<text class="text-bold text-white bg-gradual-red">{{ i18n.wishlist.common.pricesummary }}</text>
					</u-td>
				</u-tr>
				
				<!-- 总结区域表头 -->
				<u-tr class="u-tr">
					<u-th class="u-th">{{ i18n.wishlist.common.tabledata.proprice }}</u-th>
					<u-th class="u-th">{{ i18n.wishlist.common.tabledata.domesticshippingfee }}</u-th>
					<u-th class="u-th">{{ i18n.wishlist.common.tabledata.commissionfee }}</u-th>
					<u-th class="u-th">{{ i18n.wishlist.common.tabledata.accrudeexpense }}</u-th>
				</u-tr>
				
				<!-- 总结区域内容 -->
				<u-tr class="u-tr">
					<u-td class="u-td">{{ tableData.totalProPrice }}</u-td>
					<u-td class="u-td">{{ wishinfo && wishinfo.productExt && wishinfo.productExt.domesticShippingFee || '/' }}</u-td>
					<u-td class="u-td">{{ tableData.totalServiceFee }}</u-td>
					<u-td class="u-td">
						<text class="text-red text-bold text-lg">{{ totalPrice }}</text>
					</u-td>
				</u-tr>
				
			</template>
			
			<!-- 补充信息区域 -->
			<!-- 心愿详情一直显示  编辑时间轴不显示 -->
			<template v-if=" sourcefrom != 'handletimeline' && wishinfo && wishinfo.productExt">
				
				<!-- 分隔栏 -->
				<u-tr class="u-tr tableeachsummaryrow">
					<u-td class="u-td">
						<text class="text-bold text-white bg-gradual-blue">{{ i18n.wishlist.common.params }}</text>
					</u-td>
				</u-tr>
				
				<!-- 总结区域表头 -->
				<u-tr class="u-tr">
					<u-th class="u-th">{{ i18n.wishlist.common.boxcontainernum }} (pcs/box)</u-th>
					<u-th class="u-th">{{ i18n.wishlist.common.boxsize }} (cm)</u-th>
					<u-th class="u-th">{{ i18n.wishlist.common.boxvolume }} (m³)</u-th>
					<u-th class="u-th">{{ i18n.wishlist.common.internationalshippingfee }}</u-th>
					<u-th class="u-th">{{ i18n.wishlist.common.internationalshippingcode }}</u-th>
				</u-tr>
				
				<!-- 总结区域内容 -->
				<u-tr class="u-tr">
					<u-td class="u-td">{{ wishinfo.productExt.boxContainerNum || '/' }}</u-td>
					<u-td class="u-td">{{ wishinfo.productExt.boxLength ? `${wishinfo.productExt.boxLength} * ${wishinfo.productExt.boxWidth} * ${wishinfo.productExt.boxHeight}` : '/' }}</u-td>
					<u-td class="u-td">{{ wishinfo.productExt.boxVolume || '/' }}</u-td>
					<u-td class="u-td">{{ wishinfo.productExt.internationalShippingName || '/' }}</u-td>
					<u-td class="u-td">{{ wishinfo.productExt.internationalShippingCode || '/' }}</u-td>
				</u-tr>
				
			</template>
			
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
			
			// 表格展示来源  sourcefrom:  wishdetail 心愿详情	handletimeline 时间轴编辑
			sourcefrom: {
				type: String,
				default: 'wishdetail'
			}
			
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
		
		computed: {
			
			// 显示总价格
			totalPrice() {
				
				if(this.tableData) {
					let totalProPrice = parseFloat(this.tableData.totalProPrice).toFixed(2)
					let totalDomesticShippingFee = parseFloat(this.wishinfo && this.wishinfo.productExt && this.wishinfo.productExt.domesticShippingFee || 0).toFixed(2)
					let totalServiceFee = parseFloat(this.tableData.totalServiceFee).toFixed(2)
					let totalPrice = +totalProPrice + +totalDomesticShippingFee + +totalServiceFee
					totalPrice = parseFloat(totalPrice).toFixed(2)
					return totalPrice
				}
				return '/'
			}
		
		},
		
		data() {
			return {
				
				singleServiceFee: 20, // 单个规格服务费
				tableHeaderArr: null, // 表头数组
				tableData: null, // 表格内容数据
				
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
						let totalProPrice = 0
						
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
								totalProPrice += (Number(seconditem.amount) * parseFloat(seconditem.price).toFixed(2))
								childList.push(childListItem)
							}
							
						})
						
						let firstImg = Array.isArray(firstitem.img) && firstitem.img.length > 0 ? firstitem.img[0] : firstitem.img
						let specListItem = {
							attributeName: firstitem.propVal,
							img: firstImg || proMainImg,
							childList: childList,
							totalAmount: totalAmount,
							totalProPrice: totalProPrice
						}
						
						if(totalAmount > 0) {
							specList.push(specListItem)
						}
						
					})
					
				}
				
				if(specList.length == 0) {
					return
				}
				
				// 遍历规格数组获取商品总价
				let totalAmount = 0
				let totalProPrice = 0
				let totalSpecAmount = specList.length
				let totalServiceFee =  parseFloat(this.singleServiceFee).toFixed(2)
				specList.forEach(eachitem => {
					totalAmount += Number(eachitem.totalAmount)
					totalProPrice += +parseFloat(eachitem.totalProPrice).toFixed(2)
				})
				totalProPrice = parseFloat(totalProPrice).toFixed(2)
				
				//设置三级表头
				let tableHeader3Arr = [
					
					{
						title: _this.i18n.wishlist.common.tabledata.attribute2,
						key: 'attributeName',
						type: 'text',
						// width: '15%',
						ifShow: true
					},
					{
						title: _this.i18n.wishlist.common.tabledata.price,
						key: 'price',
						type: 'text',
						// width:'10%',
						ifShow: true
					},
					{
						title: _this.i18n.wishlist.common.tabledata.amount,
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
						title: _this.i18n.wishlist.common.tabledata.index,
						key: 'index',
						type: 'text',
						width: '5%',
						ifShow: false
					},
					{
						title: _this.i18n.wishlist.common.tabledata.attribute1,
						key: 'attributeName',
						type: 'text',
						width: '15%',
						ifShow: true
					},
					{
						title: _this.i18n.wishlist.common.tabledata.image,
						key: 'img',
						type: 'img',
						width: '20%',
						ifShow: true
					},
					{
						title: _this.i18n.wishlist.common.tabledata.spec,
						key: 'childList',
						type: 'arr',
						childList: tableHeader3Arr,
						// width:'auto',
						ifShow: true
					},
					{
						title: _this.i18n.wishlist.common.tabledata.summary,
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
						title: _this.i18n.wishlist.common.tabledata.index,
						key: 'index',
						type: 'text',
						width: '10%',
						ifShow: false
					},
					{
						title: _this.i18n.wishlist.common.tabledata.image,
						key: 'mainImg',
						type: 'img',
						width: '10%',
						ifShow: false
					},
					{
						title: _this.i18n.wishlist.common.tabledata.title,
						key: 'productTitle',
						type: 'text',
						width: '15%',
						ifShow: false
					},
					{
						title: _this.i18n.wishlist.common.tabledata.spec,
						key: 'specList',
						type: 'arr',
						childList: tableHeader2Arr, // 规格对应的子列表
						// width: 'auto',
						ifShow: true
					},
					{
						title: _this.i18n.wishlist.common.tabledata.totalsummary,
						key: 'totalAmount',
						type: 'text',
						width: '10%',
						// #ifdef MP-WEIXIN
						ifShow: false,
						// #endif
						
						// #ifndef MP-WEIXIN
						ifShow: true,
						// #endif
					},
					
				]
				
				tableHeaderArr = tableHeaderArr.filter(item => (item.ifShow))
				_this.tableHeaderArr = tableHeaderArr
								
				// 表格内容数据
				let tableData = {
					totalProPrice: totalProPrice,
					totalServiceFee: totalServiceFee
				}
				let productData = {..._this.wishinfo, ...{specList: specList}, ...{totalAmount: totalAmount}}
				
				// 根据表头内容进行数据填充
				tableHeaderArr.forEach(headeritem => {
					let key = headeritem.key // 取值key
					// 如果key值为索引则赋值当前商品列表的索引
					if(key == 'index') {
						tableData[key] = (proindex + 1).toString()
					}
					// 如果是主图则展示商品的第一张图片
					else if(key == 'mainImg') {
						tableData[key] = proMainImg								
					}
					else {
						tableData[key] = productData[key] // 赋值value
					}
					
				})
				
				this.tableData = tableData
				
			},
			
			// 查看图片
			previewImg(img) {
				let imgs = [img]
				uni.previewImage({
					urls:imgs,
					current:0
				})
			},
			
			// 获取计算的总价
			getTotalPrice() {
				return this.totalPrice
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
