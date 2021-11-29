<template>
	<view v-if="wishInfo" class="wishtablespec comcontent">
		
		<!-- 分割线 -->
		<view class="flex align-center padding-sm solid-bottom">
			<text class="cuIcon cuIcon-cascades text-orange"></text>
			<text class="text-orange margin-left-sm text-bold">{{ i18n.wishlist.common.product }}</text>
		</view>
		
		<!-- 商品规格表格内容 -->
		<template>
			
			<!-- 正常心愿单表格  折叠样式 -->
			<u-collapse v-if="type == 'normal'" :item-style="{ marginTop: '20rpx' }">
				<u-collapse-item v-for="(eachproduct, productindex) in wishInfo.productList" :key="eachproduct.pid" 
					:title="eachproduct.title"
				>
					
					<view slot="title" class="titleview flex align-center">
						<u-image class="flex0" :src="eachproduct.imgs.split(',')[0]" width="60rpx" height="60rpx" mode="aspectFill"></u-image>
						<text class="margin-left-sm text-bold text-sm">{{ `${eachproduct.title}${eachproduct.aliasName ? `——(${eachproduct.aliasName})` : '' }` }}</text>
					</view>
					
					<view class="eachproducttableview">
						<wishproducttable :productInfo="eachproduct" :ifShowTitle="false"></wishproducttable>
					</view>
					
				</u-collapse-item>
			</u-collapse>
			
			<!-- 报价单心愿单表格 -->
			<view v-if="type == 'quotation' " class="productListView">
				<block v-for="(eachproduct, productindex) in wishInfo.productList" :key="eachproduct.pid">
					<wishproducttable :productInfo="eachproduct" type="quotation" :ifShowTitle="true"></wishproducttable>
				</block>
			</view>
			
		</template>
		
		<!-- 分割线 -->
		<view class="flex align-center padding-sm solid-bottom">
			<text class="cuIcon cuIcon-rechargefill text-red"></text>
			<text class="text-red margin-left-sm text-bold">{{ i18n.wishlist.common.pricesummary }}</text>
		</view>
		
		<!-- 汇总表格内容 -->
		<view class="margin-top-sm summaryview">
			<u-table class="u-table">
				<u-tr class="u-tr">
					<u-th class="u-th">{{ i18n.wishlist.common.tabledata.proprice }}</u-th>
					<u-th class="u-th">{{ i18n.wishlist.common.tabledata.domesticshippingfee }}</u-th>
					<u-th class="u-th">{{ i18n.wishlist.common.tabledata.commissionfee }}</u-th>
					<u-th class="u-th">{{ i18n.wishlist.common.tabledata.totalsummary }}</u-th>
				</u-tr>
				<u-tr class="u-tr">
					<u-td class="u-td">
						<view class="flex flex-direction align-center">
							<text v-if="wishInfo.quotationInfo && wishInfo.quotationInfo.totalProPrice" class="text-price text-red">{{ wishInfo.quotationInfo.totalProPrice }}</text>
							<text class="text-price text-bold text-black">{{ getTotalProPriceByWish(wishInfo) }}</text>
						</view>
					</u-td>
					
					<u-td class="u-td">{{ wishInfo.quotationInfo.totalShippingFee || '/' }}</u-td>
					<u-td class="u-td">{{ wishInfo.quotationInfo.totalCommissionFee || '/' }}</u-td>
					<u-td class="u-td">{{ getWishInfoTotalMoney(wishInfo) }}</u-td>
				</u-tr>
			</u-table>
		</view>
		
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
			
			// 心愿表格类型 normal为正常心愿单表格  quotation为报价单心愿单表格
			type: {
				type: String,
				default: 'normal',
			},
			
			
		},
		
		components: {
			wishproducttable, // 商品规格展示table
		},
		
		data() {
			return {
				
			};
		},
		
		created() {
			_this = this
			
		},
		
		methods: {
			
			// 根据心愿单商品计算所有的商品总价
			getTotalProPriceByWish(wishInfo) {
				
				let productList = wishInfo.productList
				
				let totalProPrice = 0
				
				productList.forEach(eachproduct => {
					eachproduct.selectSpecPropInfo.propValList.forEach(firstSpec => {
						firstSpec.specStockList.forEach(secondSpec => {
							if(secondSpec.amount > 0) {
								let secondSpecPrice = Number(secondSpec.amount) * Number(this.$basejs.keepTwoDecimalFull(secondSpec.price))
								totalProPrice += Number(secondSpecPrice)
							}
						})
					})
				})
				
				totalProPrice = this.$basejs.keepTwoDecimalFull(totalProPrice)
				
				return totalProPrice
			},
			
			// 计算心愿的总费用
			getWishInfoTotalMoney(wishInfo) {
				
				// 首先计算商品总价
				let totalProPrice = this.getTotalProPriceByWish(wishInfo) || 0
				let totalShippingFee = wishInfo.totalShippingFee
				let totalCommissionFee = wishInfo.totalCommissionFee
				
				//三者缺其一
				if(!totalProPrice || !totalShippingFee || !totalCommissionFee) {
					return '/'
				}
				else {
					let totalMoney = parseFloat(totalProPrice) + parseFloat(totalShippingFee)
				}
				
			},
			
		},
	}
</script>

<style lang="scss" scoped>

</style>
