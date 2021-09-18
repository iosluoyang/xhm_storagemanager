<template>
	<view class="wishtablespec comcontent">
		
		<u-table v-if="tableData" class="u-table multiprotable" fontSize="20" padding="10rpx 0">
			
			<!-- 订购规格区域 均显示 -->
			<template>
				
				<!-- 分隔栏 -->
				<u-tr class="u-tr tableeachsummaryrow">
					<u-td class="u-td">
						<text class="text-bold text-white bg-gradual-pink">{{ i18n.wishlist.common.spec }}</text>
					</u-td>
				</u-tr>
				
				<!-- 表头 -->
				<u-tr v-if="tableHeaderArr" class="u-tr tableheader bg-gray">
					<u-td class='u-td eachheaderitem' v-for="(headeritem, headerindex) in tableHeaderArr" :key="headerindex" :width="headeritem.width">
						
						<!-- 数组类型的表头 -->
						<template v-if="headeritem.type == 'arr'">
							<u-tr class="u-tr">
								<u-td class="u-td subth" v-for="(subhead, subheadindex) in headeritem.childList" :key="subheadindex" :width="subhead.width">
									
									<!-- 如果是数组类型 -->
									<template v-if="subhead.type == 'arr'">
										<u-tr class="u-tr">
											<u-td class="u-td subth" v-for="(thirdsubhead, thirdsubheadindex) in subhead.childList" :key="thirdsubheadindex" :width="thirdsubhead.width">
												<text class="text-center text-bold u-line-3">{{ thirdsubhead.title }}</text>
											</u-td>
										</u-tr>
									</template>
									
									<!-- 普通类型 -->
									<template v-else>
										<text class="text-center text-bold u-line-3">{{ subhead.title }}</text>
									</template>
									
								</u-td>
							</u-tr>
						</template>
						
						<!-- 其他类型的表头 -->
						<template v-else>
							<text class="text-center text-black text-bold u-line-3">{{ headeritem.title }}</text>
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
				
			</template>
			
			<!-- 心愿单金额汇总区域 -->
			<!-- 心愿详情来源中如果心愿为进行中则不显示  其他情况下均显示 -->
			<!-- 时间轴编辑来源均显示 -->
			<!-- 心愿订单不显示 -->
			<template v-if=" (sourcefrom == 'wishdetail' && wishinfo.achieveFlag != 0) || sourcefrom == 'handletimeline' ">
				
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
					<u-td class="u-td">
						
						<view class="flex flex-direction align-center justify-center">
							<text class="">{{ tableData.totalProPrice }}</text>
							<text v-if=" tableData.totalProPriceOld && tableData.totalProPriceOld != tableData.totalProPrice " :style="{ textDecoration: 'line-through' }" class="">{{ `(${tableData.totalProPriceOld})` }}</text>
						</view>
						
					</u-td>
					<u-td class="u-td">{{ tableData.totalDomesticShippingFee }}</u-td>
					<u-td class="u-td">{{ tableData.totalCommissionFee }}</u-td>
					<u-td class="u-td">
						<text class="text-red text-bold text-lg">{{ totalPrice }}</text>
					</u-td>
				</u-tr>
				
			</template>
			
			<!-- 补充信息区域 -->
			<!-- 心愿详情一直显示  编辑时间轴不显示  心愿订单不显示-->
			<template v-if=" sourcefrom == 'wishdetail' && wishinfo && wishinfo.productExt">
				
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
					<u-th class="u-th">{{ i18n.wishlist.common.boxweight }} (kg)</u-th>
				</u-tr>
				
				<!-- 总结区域内容 -->
				<u-tr class="u-tr">
					<u-td class="u-td">{{ wishinfo.productExt.boxContainerNum || '/' }}</u-td>
					<u-td class="u-td">{{ wishinfo.productExt.boxLength ? `${wishinfo.productExt.boxLength} * ${wishinfo.productExt.boxWidth} * ${wishinfo.productExt.boxHeight}` : '/' }}</u-td>
					<u-td class="u-td">{{ wishinfo.productExt.boxVolume || '/' }}</u-td>
					<u-td class="u-td">{{ wishinfo.productExt.boxWeight || '/' }}</u-td>
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
			
			// 表格展示来源  sourcefrom:  wishdetail 心愿详情	handletimeline 时间轴编辑  wishorder 心愿订单
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
					if(this.tableData.totalProPrice && this.tableData.totalDomesticShippingFee && this.tableData.totalCommissionFee) {
						let totalProPrice = parseFloat(this.tableData.totalProPrice).toFixed(2)
						let totalDomesticShippingFee = parseFloat(this.tableData.totalDomesticShippingFee).toFixed(2)
						let totalCommissionFee = parseFloat(this.tableData.totalCommissionFee).toFixed(2)
						let totalPrice = +totalProPrice + +totalDomesticShippingFee + +totalCommissionFee
						totalPrice = parseFloat(totalPrice).toFixed(2)
						return totalPrice
					}
				}
				return '/'
			}
		
		},
		
		data() {
			return {
				
				tableHeaderArr: null, // 表头数组
				tableData: null, // 表格内容数据
				
			};
		},
		
		created() {
			_this = this
			
			_this.setTableData()
			
		},
		
		methods: {
			
			setTableData() {
				
				// 将商品已选数量映射为表格展示
				let specList = []
				
				// 映射数据
				if(_this.wishinfo && _this.wishinfo.specPropInfo) {
					
					let proMainImg = this.wishinfo.imgs.split(',')[0]
					
					let firstList = _this.wishinfo.specPropInfo.propValList
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
				
				let tableData = {}
				
				// 设置价格相关的参数
				
				let totalAmount = 0
				let totalProPrice = 0
				let totalSpecAmount = specList.length
				// console.log(`共有${totalSpecAmount}种类型`);
				let totalDomesticShippingFee = _this.wishinfo.productExt.domesticShippingFee ? parseFloat(_this.wishinfo.productExt.domesticShippingFee).toFixed(2) : ''
				let totalCommissionFee = _this.wishinfo.productExt.commissionFee ? parseFloat( _this.wishinfo.productExt.commissionFee).toFixed(2) : ''
				specList.forEach(eachitem => {
					totalAmount += Number(eachitem.totalAmount)
					totalProPrice += +parseFloat(eachitem.totalProPrice).toFixed(2)
				})
				totalProPrice = parseFloat(totalProPrice).toFixed(2) // 计算出来的商品总价
				let agentEditProPrice = _this.wishinfo.productExt.proPrice ? parseFloat(_this.wishinfo.productExt.proPrice).toFixed(2) : '' // 代理编辑的商品总价
				
				// 表格内容初始化数据
				let priceData = {
					totalProPrice: agentEditProPrice ? agentEditProPrice : totalProPrice, // 若存在代理编辑商品价格则取代理编辑价格显示
					totalProPriceOld: totalProPrice, // 计算出来的商品总价
					totalDomesticShippingFee: totalDomesticShippingFee,
					totalCommissionFee: totalCommissionFee
				}
				tableData = Object.assign(tableData, priceData) 
				
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
			
			// 获取表格中计算的各种价格
			getPriceInfo() {
				let priceInfo = {
					totalProPrice: this.tableData.totalProPrice,
					totalDomesticShippingFee: this.tableData.totalDomesticShippingFee,
					totalCommissionFee: this.tableData.totalCommissionFee,
					totalPrice: this.totalPrice
				}
				return priceInfo
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
					word-break: break-all;
				}
			}
		}
	}

</style>
