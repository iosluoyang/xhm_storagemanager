<!-- 某个心愿的编辑页面 -->
<template>
	<view class="pagecontent">
		
		<!-- 自定义导航栏 -->
		<cu-custom bgColor="bg-gradual-pink" isBackConfirm>
			<block slot="content">{{i18n.nav.wishlist}}</block>
		</cu-custom>
		
		
		<!-- 主视图 -->
		<view v-if="wishInfo" class="wishdetailview">
			
			<!-- 仓库信息 -->
			
			<!-- 商品信息 -->
			<view class="productlistview padding">
				
				<u-collapse>
					<u-collapse-item v-for="(eachproduct, productindex) in wishInfo.productList" :key="eachproduct.pid">
						
						<view slot="title" class="titleview flex align-center">
							<u-image class="flex0" :src="eachproduct.imgs.split(',')[0]" width="60rpx" height="60rpx" mode="aspectFill"></u-image>
							<text class="margin-left-sm text-bold text-sm">{{ `${eachproduct.title}${eachproduct.aliasName ? `——(${eachproduct.aliasName})` : '' }` }}</text>
							<button class="flex0 cu-btn round cuIcon cuIcon-order bg-gray margin-left" @tap.stop="selectProduct = eachproduct; showSelector = true"></button>
						</view>
						
						<view class="eachproducttableview">
							<!-- 当前选中的规格table展示 -->
							<wishproducttable :productInfo="eachproduct" :ifShowTitle="false" :ifShowRemark="false"></wishproducttable>
						</view>
						
						<view class="padding-sm radius solid margin-top-sm">
							<!-- 该商品别名 -->
							<view class="cu-form-group">
								<view class="title text-sm">{{ i18n.wishlist.common.aliasname }}</view>
								<input :style="{fontSize: '12px'}" v-model="eachproduct.aliasName" :placeholder="i18n.placeholder.handlewish.aliasname" name="input"></input>
							</view>
							
							<!-- 该商品的备注 -->
							<view class="cu-form-group">
								<textarea maxlength="-1" :style="{fontSize: '12px'}" v-model="eachproduct.remark" :placeholder=" i18n.placeholder.handlewish.remark "></textarea>
							</view>
						</view>
						
					</u-collapse-item>
				</u-collapse>
				
				<view v-if="false" class="eachproductview padding-sm solid-bottom" v-for="(eachproduct, productindex) in wishInfo.productList" :key="eachproduct._id">
					
					<!-- 商品基本信息 -->
					<view class="productcontent flex align-center padding-sm">
						
						<u-image class="flex0 margin-right" width="100" height="100" :src="eachproduct.imgs.split(',')[0]"></u-image>
						<view class="titleview flex1 u-line-2">{{ eachproduct.title }}</view>
						<button class="flex0 cu-btn round cuIcon cuIcon-order bg-gray margin-left" @tap.stop="selectProduct = eachproduct; showSelector = true"></button>
						
					</view>
					
					<!-- 选中的规格数组 -->
					<view v-if="false && eachproduct.selectSpecPropInfo" class="productspeclist padding-left-sm padding-right-sm">
						
						<!-- 一级属性 -->
						<block v-for="(firstspec, firstspecindex) in eachproduct.selectSpecPropInfo.propValList" :key="firstspecindex">
							
							<!-- 二级属性 -->
							<block v-if="secondspec.amount > 0" v-for="(secondspec , secondspecindex) in firstspec.specStockList" :key="secondspec.specId">
								
								<view class="eachspecview bg-gray flex align-center margin-top-sm padding-sm radius">
									
									<view class="leftview flex1">
										
										<!-- 规格参数 -->
										<text class="text-sm u-line-2">{{ `${firstspec.propVal},${secondspec.propVal}` }}</text>
										
									</view>
									
									<view class="rightview flex0 flex flex-direction align-center">
										<!-- 价格 -->
										<text class="text-red text-price text-sm">{{ secondspec.price }}</text>
										<!-- 数量 -->
										<text class="text-black text-bold margin-top-sm">{{ `x ${secondspec.amount}` }}</text>
									</view>
									
								</view>
								
							</block>
							
						</block>
						
					</view>
					
				</view>
				
			</view>
			
		</view>
		
		<!-- 多规格弹框 -->
		<proSpecSelector   :productInfo="selectProduct" 
							specInfoName="selectSpecPropInfo"
							:ifshow.sync="showSelector"
							@finishSelect="specFinishSelect">
		</proSpecSelector>
		
		<!-- 加载条 -->
		<loading :loadModal="ifloading"></loading>
		
	</view>
</template>

<script>
	
	import proSpecSelector from '@/components/base/prospecselector.vue'; // 多规格选择器
	import wishproducttable from '@/components/wishtablespec/wishproducttable.vue'
	
	var _this
	
	export default {
		
		components: {
			proSpecSelector,
			wishproducttable
		},
		
		data() {
			return {
				wishId: null, // 心愿id
				wishInfo: null, // 心愿详情数据信息
				
				showSelector: false, // 是否显示规格选择器
				selectProduct: null, // 当前选择的商品数据
				
				ifloading: false, // 是否加载中
			}
		},
		
		// 页面加载后
		onLoad(option) {
			_this = this
			
			let wishId = option.wishId
			if(wishId) {
				this.wishId = wishId
				this.loadDetailData()
			}
			
			
			//
		},
		
		methods: {
			
			// 获取心愿详情
			loadDetailData() {
				
				_this.ifloading = true // 开始缓冲动画
				
				// 使用openDB获取详情信息
				const db = uniCloud.database();
				db.collection('wish,uni-id-users')
					.doc(_this.wishId)
					.field('creatUid{username,nickname,avatar} as creatUser,agentUid{username,nickname,avatar} as agentUser,creatTime,updateTime,status,productList,quotationInfo')
					.get({getOne:true})
					.then(res => {
						
						_this.ifloading = false // 结束缓冲动画
						
						if(res.result.code == 0) {
							let detaildata = res.result.data
							detaildata.creatUser = detaildata.creatUser[0]
							detaildata.agentUser = detaildata.agentUser && detaildata.agentUser.length > 0 ? detaildata.agentUser[0] : null
							if(detaildata.productList.length > 0) {
								let sellerInfo = detaildata.productList[0].sellerInfo
								detaildata['sellerInfo'] = sellerInfo
							}
							
							_this.wishInfo = detaildata
							console.log(_this.wishInfo);

						}
					})
					.catch(error => {
						_this.ifloading = false // 结束缓冲动画
					})
				
			},
			
			// 切换某个商品的规格
			specFinishSelect(selectSpecPropInfo) {
				console.log(`当前选择完规格的数据为`);
				console.log(selectSpecPropInfo);
				// 修改当前商品的选中规格
				_this.$set(_this.selectProduct, 'selectSpecPropInfo', selectSpecPropInfo)
				
			},
			
			//
			
		}
	}
</script>

<style lang="scss" scoped>
	
	.pagecontent {
		
	}
	
</style>
