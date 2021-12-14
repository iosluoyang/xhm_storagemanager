<!-- 某个商品的选中规格表格展示 完全受控组件 -->
<template>
	
	<view v-if="productInfo" class="wishproducttable comcontent">
		
		<!-- 表格组件 -->
		<u-table class="u-table" fontSize="20" padding="10rpx 0rpx">
			
			<!-- 商品名称 -->
			<template v-if="ifShowTitle">
				<u-tr v-if="productInfo.title" class="u-tr">
					<u-th class="u-th">
						{{ productInfo.title }}
					</u-th>
				</u-tr>
			</template>
			
			<!-- 商品别名 -->
			<template v-if="ifShowAliasName">
				<u-tr v-if="productInfo.aliasName" class="u-tr">
					<u-td class="u-td" :width="firstColumnWidth">
						<text class="text-bold">{{ i18n.wishlist.common.aliasname }}</text>
					</u-td>
					<u-td class="u-td">{{ productInfo.aliasName }}</u-td>
				</u-tr>
			</template>
			
			<!-- 规格 -->
			<template v-if="ifShowSpec">
				
				<!-- 表格数据 按照选中的一级属性列表 -->
				<u-tr class="u-tr" v-for="(firstSpec,firstSpecIndex) in getFirstSpecRowData(productInfo)" :key="firstSpecIndex">
					
					<!-- 一级属性相关 -->
					<u-td class="u-td" :width="firstColumnWidth">
						<view class="attribute1view flex flex-direction align-center">
							
							<view class="imgview pos-relative">
								<u-image width="60" height="60" mode="aspectFill" :src="getFirstSpecImgSrc(productInfo, firstSpec)" @click="previewImg(getFirstSpecImgSrc(productInfo, firstSpec))"></u-image>
								<text class="cu-tag badge">{{ `${getFirstSpecSelectAmount(firstSpec)}` }}</text>
							</view>
							
							<text class="text-bold text-black">{{ firstSpec.propVal }}</text>
							
						</view>
					</u-td>
					
					<!-- 二级属性相关 -->
					<u-td class="u-td">
						<u-tr class="u-tr" v-if="secondSpec.amount > 0" v-for="(secondSpec,secondSpecIndex) in firstSpec.specStockList" :key="secondSpecIndex">
							
							<!-- 二级属性名称 -->
							<u-td class="u-td">
								<text class="text-sm">{{ secondSpec.propVal }}</text>
							</u-td>
							
							<!-- 二级属性价格 -->
							<u-td class="u-td">
								<text class="text-sm">{{ secondSpec.price }}</text>
							</u-td>
							
							<!-- 二级属性数量 -->
							<u-td class="u-td">
								<text class="text-sm">{{ secondSpec.amount }}</text>
							</u-td>
							
						</u-tr>
					</u-td>
					
				</u-tr>
				
			</template>
			
			<!-- 合计行 -->
			<template v-if="ifShowSummary">
				<u-tr class="u-tr">
					
					<u-td class="u-td" :width="firstColumnWidth">
						<text class="text-bold">{{ i18n.wishlist.common.summary }}</text>
					</u-td>
					<u-td class="u-td">
						<text class="cuIcon cuIcon-goods text-orange">{{ $basejs.getProSelectSpecInfo(productInfo.selectSpecPropInfo).selectTotalNum }}</text>
					</u-td>
					<u-td class="u-td">
						<text class="cuIcon cuIcon-moneybagfill text-red">{{ $basejs.getProSelectSpecInfo(productInfo.selectSpecPropInfo).selectTotalPrice }}</text>
					</u-td>
					
				</u-tr>
			</template>
			
			<!-- 备注 -->
			<template v-if="ifShowRemark">
				<u-tr v-if="productInfo.remark" class="u-tr">
					<u-td class="u-td" :width="firstColumnWidth">
						<text class="text-bold">{{ i18n.wishlist.common.remark }}</text>
					</u-td>
					<u-td class="u-td">{{ productInfo.remark }}</u-td>
				</u-tr>
			</template>
			
		</u-table>
		
	</view>
	
</template>

<script>
	
	var _this
	
	export default {
		
			name:'wishproducttable',
			
			components:{
				
			},
			
			props: {
				
				// 商品数据
				productInfo: {
					type: Object,
					default: null
				},
				
				// 是否显示标题
				ifShowTitle: {
					type: Boolean,
					default: true
				},
				
				// 是否显示别名
				ifShowAliasName: {
					type: Boolean,
					default: true
				},
				
				// 是否显示规格
				ifShowSpec: {
					type: Boolean,
					default: true
				},
				
				// 是否显示商品汇总
				ifShowSummary: {
					type: Boolean,
					default: true
				},
				
				// 是否显示备注
				ifShowRemark: {
					type: Boolean,
					default: true
				},

			},
			
			data() {
				return {
					firstColumnWidth: '200rpx', // 首列宽度
				}
			},
			
			created() {
				_this = this
			},
			
			methods: {
	
				// 获取一级分类的展示图片链接
				getFirstSpecImgSrc(productInfo, firstSpec) {
					let proMainImg = productInfo.imgs.split(',')[0]
					let firstImg = firstSpec.img || proMainImg // 默认一级分类图片
					if(Array.isArray(firstSpec.img)) {
						firstImg = firstSpec.img.length > 0 && firstSpec.img[0] ? firstSpec.img[0] : proMainImg
					}
					
					return firstImg
					
				},
				
				// 获取商品选中规格的表格展示行数据
				getFirstSpecRowData(productInfo) {
					
					let newPropValList = []
					let propValList = productInfo.selectSpecPropInfo.propValList
					
					propValList.forEach(firstspec => {
						// 过滤一级属性下的所有未选择数量的二级属性
						let selectSpecStockList = firstspec.specStockList.filter(secondspec => (secondspec.amount > 0))
						// 如果二级属性选中的为0则说明该一级属性未选中
						if(selectSpecStockList.length > 0) {
							let selectFirstSpec = {...firstspec, specStockList: selectSpecStockList}
							newPropValList.push(selectFirstSpec)
						}
					})
					
					// console.log(`当前选中规格的一级属性数据为`);
					// console.log(newPropValList);
					
					return newPropValList
					
				},
				
				// 获取一级分类的选中数量
				getFirstSpecSelectAmount(firstSpec) {
					let totalAmount = firstSpec.specStockList.reduce((amount, secondSpec) => {
						return secondSpec.amount > 0 ? amount + secondSpec.amount : amount
					}, 0)
					return totalAmount
				},
				
				// 预览商品规格大图
				previewImg(imgUrl) {
					uni.previewImage({
						urls: [imgUrl],
						current:0
					})
				},
				
				//
				
			},
		
	}
	
</script>

<style lang="scss" scope>
	
</style>
