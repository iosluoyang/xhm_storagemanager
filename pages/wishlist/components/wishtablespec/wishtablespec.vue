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
				<u-collapse ref="ucollapseview" v-if="ifCollapse" :item-style="{ marginTop: '20rpx' }" :accordion="false" @change="collapseChange">
					<u-collapse-item v-for="(eachproduct, productindex) in ownWishInfo.productList" :key="eachproduct.pid">
						
						<view slot="title" class="titleview flex align-center">
							<u-image class="flex0" :src="eachproduct.imgs.split(',')[0]" width="60rpx" height="60rpx" mode="aspectFill"></u-image>
							<text class="margin-left-sm text-bold text-sm">{{ `${eachproduct.title}` }}</text>
							<!-- 报价单状态时有此按钮 -->
							<button v-if="type == 'quotation' " class="flex0 cu-btn round cuIcon cuIcon-order bg-gray margin-left" @tap.stop="$emit('changeProSpec', productindex)"></button>
						</view>
						
						<view class="eachproducttableview padding">
							<wishproducttable :productInfo="eachproduct" :ifShowTitle="false"></wishproducttable>
						</view>
						
					</u-collapse-item>
				</u-collapse>
				
				<!-- 展开样式 -->
				<view v-else class="productListView">
					<block v-for="(eachproduct, productindex) in ownWishInfo.productList" :key="eachproduct.pid">
						<!-- 报价单状态时有此按钮 -->
						<button v-if="type == 'quotation' " class="flex0 cu-btn round cuIcon cuIcon-order bg-gray margin-left" @tap.stop="$emit('changeProSpec', productindex)"></button>
						<wishproducttable :productInfo="eachproduct" :ifShowTitle="true"></wishproducttable>
					</block>
				</view>
				
			</template>
			
		</template>
		
		<!-- 价格汇总区域 -->
		<template v-if="ifShowSummary">
			
			<!-- 分割线 -->
			<view class="flex align-center padding-sm solid-bottom">
				<text class="flex0 cuIcon cuIcon-rechargefill text-red"></text>
				<text class="flex0 text-red margin-left-sm text-bold">{{ i18n.wishlist.common.pricesummary }}</text>
			</view>
			
			<!-- 价格汇总表格内容 -->
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
								
								<!-- 有报价信息时 -->
								<template v-if="ownWishInfo.quotationInfo && ownWishInfo.quotationInfo.totalProPrice">
									
									<!-- 报价和商品总价一致 则仅显示计算出来的价格 -->
									<template v-if="Number(ownWishInfo.quotationInfo.totalProPrice) == Number(getTotalProPriceByWish(ownWishInfo))">
										<text class="text-price text-bold text-black">{{ getTotalProPriceByWish(ownWishInfo) }}</text>
									</template>
									
									<!-- 不一致时 显示两个价格 -->
									<template v-else>
										<text class="text-price text-bold text-lg text-black">{{ ownWishInfo.quotationInfo.totalProPrice }}</text>
										<text class="text-price text-light text-df text-gray text-del">{{ getTotalProPriceByWish(ownWishInfo) }}</text>
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
						<u-td class="u-td">
							<text :class="{'text-red text-bold text-xl': getWishInfoTotalMoney() != ''}">{{ getWishInfoTotalMoney() || '/' }}</text>
						</u-td>
					</u-tr>
				</u-table>
				
			</view>
		
		</template>
		
	</view>
</template>

<script>
	
	import wishproducttable from '@/pages/wishlist/components/wishtablespec/wishproducttable.vue'
	
	// var _this  自定义组件,尤其重复使用的自定义组件，不能用全局this指代 否则导致复用组件的更新问题
	
	export default {
		
		name:"wishtablespec",
		
		props: {
			
			// 规格对应的心愿信息
			wishInfo: {
				type: Object,
				default: null
			},
			
			// 心愿单表格类型  type=normal为正常展示  type=quotation为报价类型  默认为normal
			type: {
				type: String,
				default: 'normal',
			},
			
			// 是否折叠样式  默认为是
			ifCollapse: {
				type: Boolean,
				default: true,
			},
			
			// 是否显示心愿汇总区域 默认为是
			ifShowSummary: {
				type: Boolean,
				default: true,
			},
			
		},
		
		components: {
			wishproducttable, // 商品规格展示table
		},
		
		data() {
			return {
				ownWishInfo: null , // 当前自身心愿数据
			};
		},
		
		watch: {
			wishInfo: {
				handler: function(newValue, oldValue) {
					console.log(`心愿数据发生变更`);
					this.ownWishInfo = newValue
					this.$nextTick(function(){
						// 重新设置手风琴内部高度
						// 此处更新需注意，当表格所在页面为隐藏状态时更新会偶发性出问题
						if(this.$refs.ucollapseview) {
							this.$refs.ucollapseview.init()
						}
					})
				},
				deep: true,
			}
		},
		
		created() {
			this.ownWishInfo = this.wishInfo
		},
		
		methods: {
			
			// 获取心愿单所有选中规格的商品金额
			getTotalProPriceByWish(ownWishInfo) {
				
				let totalWishProPrice = '0.00'
				let wishSelectSpecInfo = this.$basejs.getWishSelectSpecInfo(ownWishInfo)
				if(wishSelectSpecInfo) {
					totalWishProPrice = wishSelectSpecInfo.selectTotalPrice
				}
				return totalWishProPrice
				
			},
			
			// 计算心愿的总费用
			getWishInfoTotalMoney() {
				
				let quotationInfo = this.ownWishInfo.quotationInfo
				let totalProPrice = quotationInfo.totalProPrice || this.getTotalProPriceByWish(this.ownWishInfo)
				let totalShippingFee = quotationInfo.totalShippingFee
				let totalCommissionFee = quotationInfo.totalCommissionFee
				// console.log(totalProPrice,totalShippingFee,totalCommissionFee);
				//三者缺其一
				if(!totalProPrice || !totalShippingFee || !totalCommissionFee) {
					return ''
				}
				else {
					let totalMoney = Number(totalProPrice) + Number(totalShippingFee) + Number(totalCommissionFee)
					totalMoney = this.$basejs.keepTwoDecimalFull(Number(totalMoney))
					return totalMoney
				}
				
			},
			
			// ucollapse状态发生变化时
			// 小程序中重新计算一下高度
			collapseChange() {
				// #ifdef MP-WEIXIN
				this.$nextTick(function(){
					// 重新设置手风琴内部高度
					// 此处更新需注意，当表格所在页面为隐藏状态时更新会偶发性出问题
					if(this.$refs.ucollapseview) {
						console.log(`重新计算了高度`);
						this.$refs.ucollapseview.init()
					}
				})
				// #endif
			}
			//
		},
	}
</script>

<style lang="scss" scoped>

</style>
