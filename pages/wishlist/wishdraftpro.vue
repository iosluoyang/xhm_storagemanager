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
					groupby=" sellerId"
					group-field=" addToSet( pid ) as productList, addToSet( selectSpecPropInfo ) as selectSpecPropInfoList "
					@load="loadData"
		>
			<view v-if="error" class="cu-load erro">{{ error.message }}</view>
			<view v-else-if="loading" class="cu-load loading"></view>
			<view v-else>
				
				<!-- 根据不同商家进行划分 -->
				<view class="storesview padding-sm">
					
					<view class="eachstoreview" v-for="(eachstore, storeindex) in data" :key="eachstore.sellerId">
						
						<!-- 商店头部展示区域 -->
						<view v-if="eachstore.sellerInfo" class="storeheaderview cu-bar bg-white solids-bottom">
							<view class="action">
								<text class="cuIcon cuIcon-shopfill text-pink"></text>
								<text class="text-df text-black">{{ eachstore.sellerInfo.nickName }}</text>
							</view>
						</view>
						
						<!-- 商店对应的商品列表 -->
						<view class="storeproductlistview">
							
							<view class="eachproductview" v-for="(eachproduct, productindex) in eachstore.productList" :key="eachproduct._id">
								
								<!-- 商品基本信息 -->
								<view class="productcontent flex align-center padding-sm">
									<u-image class="flex0 margin-right" width="100" height="100" :src="eachproduct.imgs.split(',')[0]"></u-image>
									<view class="titleview flex1 u-line-2" style="max-width: 200px;">{{ eachproduct.title }}</view>
								</view>
								
								<!-- 选中的规格数组 -->
								<view v-if="eachproduct.selectSpecPropInfo" class="productspeclist padding-sm">
									
									
									
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
				datalist: [], // 数据
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
				console.log(data);
				
				// 遍历数据进行数据重组
				data.forEach(eachstore => {
					
					// 商店商品列表
					let productList = []
					let selectSpecPropInfoList = eachstore.selectSpecPropInfoList
					
					eachstore.productList.forEach((eachproduct, productindex) => {
						eachproduct = eachproduct[0] // 转数组为对象
						eachproduct['selectSpecPropInfo'] = selectSpecPropInfoList[productindex]
						productList.push(eachproduct)
						if(productindex == 0) {
							eachstore['sellerInfo'] = eachproduct.sellerInfo
						}
					})
					eachstore.productList = productList
					
					delete eachstore.selectSpecPropInfoList
					
				})
				console.log(data);

			},
			
		}
	}
</script>

<style lang="scss" scoped>
	
	.pagecontent {
		
	}
	
</style>
