<template>
	
	<view v-if="stockinfo" class="hystockrecordview flex align-center justify-between padding-sm">
		
		<!-- 左侧信息区域 -->
		<view class="leftview">
			
			<!-- 商品名称 -->
			<view class="eachitem protitle margin-bottom-sm">
				<text class="itemtitle text-black text-bold margin-right-sm">{{ i18n.stock.protitle }}:</text>
				<text class="itemcontent text-grey text-light">{{ `${stockinfo.title}(${stockinfo.specInfo.specName})` }}</text>
			</view>
			
			<!-- 出入库数量 -->
			<view class="eachitem proamount margin-bottom-sm">
				<text class="itemtitle text-black text-bold margin-right-sm">{{ i18n.stock.amount }}:</text>
				<text class="itemcontent text-grey text-light text-cut">{{ stockinfo.stockCount }}</text>
			</view>
			
			<!-- 客户信息 -->
			<view v-if="stockinfo.customerInfo" class="eachitem customerinfo margin-bottom-sm">
				<text class="itemtitle text-black text-bold margin-right-sm">{{ i18n.stock.customer }}:</text>
				<text class="itemcontent text-grey text-light text-cut">{{ stockinfo.customerInfo.customer || stockinfo.customerInfo.company }}</text>
			</view>
			
			<!-- 价格类型 -->
			<view class="eachitem priceinfo margin-bottom-sm">
				<text class="itemtitle text-black text-bold margin-right-sm">{{ i18n.stock.pricetype }}:</text>
				<text class="itemcontent text-grey text-light text-cut">
					<!-- 价格类型1成本价2平台销售价格3代理价4授信价 -->
					{{ stockinfo.type === 1 ? i18n.goods.costprice : stockinfo.type === 2 ? i18n.goods.price : stockinfo.type === 3 ? i18n.goods.agentprice : stockinfo.type === 4 ? i18n.goods.creditprice : '' }}
				</text>
			</view>
			
			<!-- 操作时间 -->
			<view class="eachitem operatime margin-bottom-sm">
				<text class="itemtitle text-black text-bold margin-right-sm">{{ i18n.stock.operatime }}:</text>
				<text class="itemcontent text-grey text-light text-cut">{{ stockinfo.createDate }}</text>
			</view>
			
			<!-- 操作人 -->
			<view class="eachitem operapeople margin-bottom-sm">
				<text class="itemtitle text-black text-bold margin-right-sm">{{ i18n.stock.operapeople }}:</text>
				<text class="itemcontent text-grey text-light text-cut">{{ `${stockinfo.realName}(${stockinfo.account})` }}</text>
			</view>
			
		</view>
		
		<!-- 右侧标识区域 -->
		<view class="righview">
			<view class="cu-tag round" :class="[ stockinfo.flag === 1 ? 'bg-gradual-green' : stockinfo.flag === 0 ? 'bg-gradual-blue' : '' ]">
				{{ stockinfo.flag === 1 ? i18n.stock.stockout : stockinfo.flag === 0 ? i18n.stock.stockin : '' }}
			</view>
		</view>
		
	</view>
	
</template>

<script>
	export default {
		name: "stockrecorditem",
		props: {
			
			// 库存记录数据
			stockinfo: {
				type: Object,
				default: null,
			},
			
		},
	}
</script>

<style lang="scss" scoped>
	.hystockrecordview{
		
	}
</style>
