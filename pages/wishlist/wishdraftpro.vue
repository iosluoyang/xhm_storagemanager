<template>
	<view class="pagecontent">
		
		<!-- 自定义导航栏 -->
		<cu-custom bgColor="bg-gradual-pink">
			<block slot="content">{{i18n.nav.wishdraft}}</block>
		</cu-custom>
		
		<!-- 查询草稿箱商品 -->
		<unicloud-db v-slot:default="{data, loading, error, options}" 
					collection="wish-draft-product, product" 
					where=" creatUid == $cloudEnv_uid && status == 0 " 
					orderby=" creatTime desc "
					groupby="sellerId"
					group-field=" addToSet(pid) as productList "
					@load="loadData"
		>
			<view v-if="error" class="cu-load erro">{{ error.message }}</view>
			<view v-else-if="loading" class="cu-load loading"></view>
			<view v-else @longpress="$basejs.copytoclipboard(JSON.stringify(data))">
				
				<!-- 根据不同商家进行划分 -->
				<view class="storesview padding-sm">
					
					<view class="eachstoreview" v-for="(eachstore, storeindex) in data" :key="eachstore.sellerId">
						
						<!-- 商店头部展示区域 -->
						<view class="storeheaderview cu-bar bg-white margin-top-sm solids-bottom">
							<view class="action">
								<text class="cuIcon cuIcon-shopfill text-pink"></text>
								<text class="text-df text-black">{{ eachstore.sellerInfo.nickName }}</text>
							</view>
						</view>
						
						<!-- 商店对应的商品列表 -->
						<view class="storeproductlistview">
							
							<view class="eachproductview flex align-center justify-between solid-bottom" v-for="(eachproduct, productindex) in eachstore.productList" :key="eachproduct._id">
								<view class="content flex1 flex align-center padding-sm">
									
									<u-image class="flex0 margin-right" width="100" height="100" :src="eachproduct.imgs.split(',')[0]"></u-image>
									
									<view class="titleview flex1" style="max-width: 200px;">
										
										<view class="text-black text-df u-line-2">{{ eachproduct.title }}</view>
										<view class="text-gray text-sm text-wrap margin-top-sm text-cut">{{ JSON.stringify(eachproduct.specPropInfo.propValList) }}</view>
										
									</view>
									
								</view>
								<view class="action flex0">
									<text class="cuIcon cuIcon-pulldown round bg-grey"></text>
								</view>
							</view>
							
						</view>
						
					</view>
					
				</view>
				
			</view>
		</unicloud-db>
		
		
		
	</view>
</template>

<script>
	
	var _this
	
	export default {
		
		components: {
			
		},
		
		data() {
			return {
				
				type: 'add', // 页面状态 add新增 edit编辑 copy 拷贝
				
				aliasName: '', // 别名
				
				
			}
		},
		
		// 页面加载后
		onLoad() {
			_this = this
			
			//
		},
		
		methods: {
			
			// 加载数据 对数据进行加工
			loadData(data, ended, pagination) {
				data.forEach(eachstore => {
					let productList = []
					let sellerInfo = {}
					eachstore.productList.forEach((eachproduct, productindex) => {
						
						if(productindex == 0) {
							sellerInfo = eachproduct[0].sellerInfo
						}
						productList.push(eachproduct[0])
						
					})
					eachstore.productList = productList
					eachstore.sellerInfo = sellerInfo
				})
			},
			
		}
	}
</script>

<style lang="scss" scoped>
	
	.pagecontent {
		
	}
	
</style>
