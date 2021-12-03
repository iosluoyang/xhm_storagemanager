<template>
	<view v-if="ownWishInfo" class="wishtablespec comcontent">
		
		<!-- 商品区域 -->
		<template>
			
			<!-- 商品分割线 -->
			<view class="flex align-center padding-sm solid-bottom">
				<text class="cuIcon cuIcon-cascades text-orange"></text>
				<text class="text-orange margin-left-sm text-bold">{{ i18n.wishlist.common.product }}</text>
			</view>
			
			<!-- 两种商品规格样式 -->
			<template>
				
				<!-- 商品折叠样式 -->
				<u-collapse ref="ucollapseview" v-if="ifCollapse" :item-style="{ marginTop: '20rpx' }" :accordion="false">
					<u-collapse-item v-for="(eachproduct, productindex) in ownWishInfo.productList" :key="eachproduct.pid">
						
						<view slot="title" class="titleview flex align-center">
							<u-image class="flex0" :src="eachproduct.imgs.split(',')[0]" width="60rpx" height="60rpx" mode="aspectFill"></u-image>
							<text class="margin-left-sm text-bold text-sm">{{ `${eachproduct.title}` }}</text>
							<!-- 报价单状态时有此按钮 -->
							<button v-if="type == 'quotation' " class="flex0 cu-btn round cuIcon cuIcon-order bg-gray margin-left" @tap.stop="$emit('changeProSpec', productindex)"></button>
						</view>
						
						<view class="eachproducttableview">
							<wishproducttable :productInfo="eachproduct" :ifShowTitle="false"></wishproducttable>
						</view>
						
					</u-collapse-item>
				</u-collapse>
				
				<!-- 展开样式 -->
				<view v-else class="productListView">
					<block v-for="(eachproduct, productindex) in sownWishInfo.productList" :key="eachproduct.pid">
						<!-- 报价单状态时有此按钮 -->
						<button v-if="type == 'quotation' " class="flex0 cu-btn round cuIcon cuIcon-order bg-gray margin-left" @tap.stop="$emit('changeProSpec', productindex)"></button>
						<wishproducttable :productInfo="eachproduct" :ifShowTitle="true"></wishproducttable>
					</block>
				</view>
				
			</template>
			
		</template>
		
		<!-- 价格汇总区域 -->
		<template>
			
			<!-- 分割线 -->
			<view class="flex align-center padding-sm solid-bottom">
				<text class="flex0 cuIcon cuIcon-rechargefill text-red"></text>
				<text class="flex0 text-red margin-left-sm text-bold">{{ i18n.wishlist.common.pricesummary }}</text>
				
				<!-- 操作按钮区域 报价类型时显示 -->
				<template v-if="type == 'quotation'">
					<view class="optionview flex1 flex align-center padding-sm">
						
						<!-- 价格编辑状态  显示取消和确认 -->
						<template v-if="priceEditFlag">
							<button class="cu-btn round bg-grey sm cuIcon cuIcon-close" @tap.stop="priceEditFlag = false"></button>
							<button class="margin-left cu-btn round bg-red sm cuIcon cuIcon-check" @tap.stop="finishEditPrice"></button>
						</template>
						
						<!-- 非价格编辑状态 显示编辑按钮 -->
						<template v-else>
							<button class="cu-btn round bg-grey sm cuIcon cuIcon-edit" @tap.stop="startEditPrice"></button>
						</template>
					
					</view>
				</template>
				
			</view>
			
			<!-- 价格汇总表格内容 -->
			<view class="margin-top-sm summaryview">
				
				<!-- 正常展示类型  正常展示类型或者报价类型且为非编辑价格状态 -->
				<u-table v-if="type == 'normal' || (type == 'quotation' && !priceEditFlag) " class="u-table">
					<u-tr class="u-tr">
						<u-th class="u-th">{{ i18n.wishlist.common.tabledata.proprice }}</u-th>
						<u-th class="u-th">{{ i18n.wishlist.common.tabledata.domesticshippingfee }}</u-th>
						<u-th class="u-th">{{ i18n.wishlist.common.tabledata.commissionfee }}</u-th>
						<u-th class="u-th">{{ i18n.wishlist.common.tabledata.totalsummary }}</u-th>
					</u-tr>
					<u-tr class="u-tr">
						<u-td class="u-td">
							<view class="flex flex-direction align-center">
								
								<!-- 有报价信息时 -->
								<template v-if="ownWishInfo.quotationInfo && ownWishInfo.quotationInfo.totalProPrice">
									
									<!-- 报价和商品总价一致 则仅显示计算出来的价格 -->
									<template v-if="Number(ownWishInfo.quotationInfo.totalProPrice) == Number(getTotalProPriceByWish(ownWishInfo))">
										<text class="text-price text-bold text-black">{{ getTotalProPriceByWish(ownWishInfo) }}</text>
									</template>
									
									<!-- 不一致时 显示两个价格 -->
									<template v-else>
										<text class="text-price text-bold text-black">{{ ownWishInfo.quotationInfo.totalProPrice }}</text>
										<text class="text-price text-bold text-grey text-del">{{ getTotalProPriceByWish(ownWishInfo) }}</text>
									</template>
									
								</template>
								
								<!-- 无报价信息时 -->
								<template v-else>
									<text class="text-price text-bold text-black">{{ getTotalProPriceByWish(ownWishInfo) }}</text>
								</template>
								
							</view>
						</u-td>
						
						<u-td class="u-td">{{ ownWishInfo.quotationInfo.totalShippingFee || '/' }}</u-td>
						<u-td class="u-td">{{ ownWishInfo.quotationInfo.totalCommissionFee || '/' }}</u-td>
						<u-td class="u-td">{{ getWishInfoTotalMoney(ownWishInfo) }}</u-td>
					</u-tr>
				</u-table>
				
				<!-- 报价区域  报价类型且为编辑状态时显示 -->
				<view v-if="type == 'quotation' && priceEditFlag" class="editpriceview">
					
					<!-- 商品总价 -->
					<view class="cu-form-group">
						<view class="title">{{ i18n.wishlist.common.tabledata.proprice }}</view>
						<input class="text-right" type="digit" v-model="tmpQuotationInfo.totalProPrice" />
					</view>
					
					<!-- 国内运费 -->
					<view class="cu-form-group">
						<view class="title">{{ i18n.wishlist.common.tabledata.domesticshippingfee }}</view>
						<input class="text-right" type="digit" v-model="tmpQuotationInfo.totalShippingFee" />
					</view>
					
					<!-- 服务费 -->
					<view class="cu-form-group">
						<view class="title">{{ i18n.wishlist.common.tabledata.commissionfee }}</view>
						<input class="text-right" type="digit" v-model="tmpQuotationInfo.totalCommissionFee" />
					</view>
					
				</view>
				
			</view>
		
		</template>
		
	</view>
</template>

<script>
	
	import wishproducttable from '@/components/wishtablespec/wishproducttable.vue'
	
	var _this
	
	export default {
		
		name:"wishtablespec",
		
		props: {
			
			// 规格对应的心愿信息
			wishInfo: {
				type: Object,
				default: null
			},
			
			// 是否折叠样式  默认为是
			ifCollapse: {
				type: Boolean,
				default: true,
			},
			
			// 心愿表格类型 type= normal 为正常展示样式  type=quotation为报单价样式
			type: {
				type: String,
				default: 'normal'
			}
			
			
		},
		
		components: {
			wishproducttable, // 商品规格展示table
		},
		
		data() {
			return {
				ownWishInfo: null , // 当前自身心愿数据
				
				priceEditFlag: false, // 心愿单价格编辑状态 默认为否
				tmpQuotationInfo: null, // 临时报价对象
			};
		},
		
		watch: {
			wishInfo: {
				handler: function(newValue, oldValue) {
					if(newValue != oldValue) {
						console.log(`心愿数据发生变更`);
						_this.ownWishInfo = newValue
						_this.$nextTick(function(){
							// 重新设置手风琴内部高度
							_this.$refs.ucollapseview.init()
						})
					}
				},
				deep: true,
			}
		},
		
		created() {
			_this = this
			_this.ownWishInfo = _this.wishInfo
		},
		
		methods: {
			
			// 根据心愿单商品计算所有的商品总价
			getTotalProPriceByWish(ownWishInfo) {
				
				let productList = ownWishInfo.productList
				
				let totalProPrice = 0
				
				productList.forEach(eachproduct => {
					eachproduct.selectSpecPropInfo.propValList.forEach(firstSpec => {
						firstSpec.specStockList.forEach(secondSpec => {
							if(secondSpec.amount > 0) {
								let secondSpecPrice = Number(secondSpec.amount) * Number(this.$basejs.keepTwoDecimalFull(Number(secondSpec.price)))
								totalProPrice += Number(secondSpecPrice)
							}
						})
					})
				})
				
				totalProPrice = this.$basejs.keepTwoDecimalFull(totalProPrice)
				
				return totalProPrice
			},
			
			// 计算心愿的总费用
			getWishInfoTotalMoney(ownWishInfo) {
				
				// 首先计算商品总价
				let totalProPrice = this.getTotalProPriceByWish(ownWishInfo) || 0
				let totalShippingFee = ownWishInfo.totalShippingFee
				let totalCommissionFee = ownWishInfo.totalCommissionFee
				
				//三者缺其一
				if(!totalProPrice || !totalShippingFee || !totalCommissionFee) {
					return '/'
				}
				else {
					let totalMoney = parseFloat(totalProPrice) + parseFloat(totalShippingFee)
				}
				
			},
			
			
			// 开始编辑价格
			startEditPrice() {
				let quotationInfo = _this.ownWishInfo.quotationInfo
				
				let originalProTotalPrice = this.getTotalProPriceByWish(this.ownWishInfo)
				
				let tmpQuotationInfo = {
					totalProPrice: quotationInfo?.totalProPrice || originalProTotalPrice,
					totalShippingFee: quotationInfo?.totalShippingFee || '',
					totalCommissionFee: quotationInfo?.totalCommissionFee || ''
				}
				this.tmpQuotationInfo = tmpQuotationInfo
				this.priceEditFlag = true
				
			},
			
			// 结束编辑价格
			finishEditPrice() {
				let tmpQuotationInfo = this.tmpQuotationInfo
				this.$set(this.ownWishInfo, 'quotationInfo', tmpQuotationInfo)
				this.priceEditFlag = false
			},
			//
		},
	}
</script>

<style lang="scss" scoped>

</style>
