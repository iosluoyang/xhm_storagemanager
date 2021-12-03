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
							<button class="margin-left cu-btn round bg-red sm cuIcon cuIcon-check" @tap.stop="priceEditFlag = false"></button>
						</template>
						
						<!-- 非价格编辑状态 显示编辑按钮 -->
						<template v-else>
							<button class="cu-btn round bg-grey sm cuIcon cuIcon-edit" @tap.stop="priceEditFlag = true"></button>
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
								<text v-if="ownWishInfo.quotationInfo && ownWishInfo.quotationInfo.totalProPrice" class="text-price text-red">{{ ownWishInfo.quotationInfo.totalProPrice }}</text>
								<text class="text-price text-bold text-black">{{ getTotalProPriceByWish(ownWishInfo) }}</text>
							</view>
						</u-td>
						
						<u-td class="u-td">{{ ownWishInfo.quotationInfo.totalShippingFee || '/' }}</u-td>
						<u-td class="u-td">{{ ownWishInfo.quotationInfo.totalCommissionFee || '/' }}</u-td>
						<u-td class="u-td">{{ getWishInfoTotalMoney(ownWishInfo) }}</u-td>
					</u-tr>
				</u-table>
				
				<!-- 报价类型 显示 -->
				
				
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
			
			//
		},
	}
</script>

<style lang="scss" scoped>

</style>
