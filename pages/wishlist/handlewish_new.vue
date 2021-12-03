<!-- 某个心愿的编辑页面 -->
<template>
	<view class="pagecontent">
		
		<!-- 自定义导航栏 -->
		<cu-custom bgColor="bg-gradual-pink" isBackConfirm>
			<block slot="content">{{i18n.nav.wishdetail}}</block>
		</cu-custom>
		
		<!-- 主视图 -->
		<view v-if="wishInfo" class="wishdetailview">
			
			<!-- 编辑类型 -->
			<template v-if="type == 'edit'">
				
				<!-- 仓库信息 -->
				
				<!-- 商品信息 -->
				<view class="productsview padding">
					
					<!-- 商品分割线 -->
					<view class="flex align-center padding-sm solid-bottom">
						<text class="cuIcon cuIcon-cascades text-orange"></text>
						<text class="text-orange margin-left-sm text-bold">{{ i18n.wishlist.common.product }}</text>
					</view>
					
					<view class="eachproduct shadow-warp margin-top-sm padding-sm" v-for="(eachproduct, productindex) in wishInfo.productList" :key="eachproduct.pid">
						
						<view class="titleview flex align-center">
							<u-image class="flex0" :src="eachproduct.imgs.split(',')[0]" width="80rpx" height="80rpx" mode="aspectFill"></u-image>
							<text class="margin-left-sm text-bold text-sm">{{ `${eachproduct.title}${eachproduct.aliasName ? `——(${eachproduct.aliasName})` : '' }` }}</text>
							<button class="flex0 cu-btn round cuIcon cuIcon-order bg-gray margin-left" @tap.stop="selectProduct = eachproduct; showSelector = true"></button>
						</view>
						
						<!-- 当前选中的规格table展示 -->
						<view class="productspectableview padding">
							<wishproducttable :productInfo="eachproduct" :ifShowTitle="false" :ifShowRemark="false" :ifShowAliasName="false"></wishproducttable>
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
						
					</view>
					
				</view>
				
			</template>
			
			<!-- 报价类型 -->
			<template v-if="type == 'quotation' ">
				
				<view class="quotationview padding">
					
					<wishTableSpec ref="wishtablespec" :wishInfo="wishInfo" type="quotation" @changeProSpec="changeProSpec"></wishTableSpec>
					
				</view>
				
			</template>
			
			
			<!-- 确定按钮 -->
			<button class="cu-btn confirmbtn bg-pink lg" @tap.stop="confirm">
				{{ i18n.base.confirm }}
			</button>
			
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
	import wishTableSpec from '@/components/wishtablespec/wishtablespec.vue'; // 使用u-table的多规格表格
	import wishproducttable from '@/components/wishtablespec/wishproducttable.vue'
	
	var _this
	
	export default {
		
		components: {
			proSpecSelector,
			wishTableSpec,
			wishproducttable
		},
		
		data() {
			return {
				wishId: null, // 心愿id
				wishInfo: null, // 心愿详情数据信息
				
				type: 'quotation', //  edit  编辑心愿  quotation 心愿单报价
				
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
					// .field('creatUid{username,nickname,avatar} as creatUser,agentUid{username,nickname,avatar} as agentUser,creatTime,updateTime,status,productList,quotationInfo')
					.get({getOne:true})
					.then(res => {
						
						_this.ifloading = false // 结束缓冲动画
						
						if(res.result.code == 0) {
							let detaildata = res.result.data
							detaildata.creatUser = detaildata.creatUid[0]
							detaildata.agentUser = detaildata.agentUid && detaildata.agentUid.length > 0 ? detaildata.agentUid[0] : null
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
			
			// 报价单修改某个商品价格
			changeProSpec(proIndex) {
				let selectProduct = this.wishInfo.productList[proIndex]
				this.selectProduct = selectProduct
				this.showSelector = true
			},
			
			// 确认操作
			confirm() {
				console.log(this.wishInfo);
				
				const db = uniCloud.database();
				_this.ifloading = true
				// 更新心愿的部分信息
				let productList = this.wishInfo.productList
				let updateTime = db.env.now
				
				db.collection('wish')
				.doc(this.wishId)
				.update({productList,updateTime})
				.then(response => {
					
					if(response.result.code == 0) {
						// 修改成功
						uni.showToast({
							title: _this.i18n.tip.optionsuccess,
							icon: 'none'
						});
						// 更新心愿详情和心愿列表
						uni.$emit('updatewishdetail')
						uni.$emit('updatewishlist')
						
						uni.navigateBack(); // 返回
					}
					else {
						uni.showToast({
							title: _this.i18n.error.optionerror,
							icon: 'none'
						});
					}
					
				})
				.catch(error => {
					uni.showToast({
						title: _this.i18n.error.optionerror,
						icon: 'none'
					});
				})
				.finally(() => {
					_this.ifloading = false
				})
				
			},
			
			//
			
		}
	}
</script>

<style lang="scss" scoped>
	
	.pagecontent {
		.wishdetailview{
			padding-bottom: 50px;
			.confirmbtn{
				position: fixed;
				bottom: 0;
				left: 0;
				right: 0;
			}
		}
	}
	
</style>
