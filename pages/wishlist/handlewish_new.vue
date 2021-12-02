<!-- 某个心愿的编辑页面 -->
<template>
	<view class="pagecontent">
		
		<!-- 自定义导航栏 -->
		<cu-custom bgColor="bg-gradual-pink" isBackConfirm>
			<block slot="content">{{i18n.nav.wishdetail}}</block>
		</cu-custom>
		
		<!-- 主视图 -->
		<view class="wishdetailview">
			
			<unicloud-db v-slot:default="{data, loading, error, options}" collection="wish, uni-id-users"
				:where=" `_id == '${wishId}' && creatUid._id == $cloudEnv_uid ` "
				:getone="true"
			>
				<view v-if="error">{{error.message}}</view>
				<view v-else-if="data" class="wishInfoview">
					
					<!-- 仓库信息 -->
					
					<!-- 商品信息 -->
					<view class="productlistview padding">
						
						<!-- 商品分割线 -->
						<view class="flex align-center padding-sm solid-bottom">
							<text class="cuIcon cuIcon-cascades text-orange"></text>
							<text class="text-orange margin-left-sm text-bold">{{ i18n.wishlist.common.product }}</text>
						</view>
						
						<u-collapse :accordion="false">
							<u-collapse-item v-for="(eachproduct, productindex) in data.productList" :key="eachproduct.pid" open>
								
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
						
					</view>
					
					<!-- 确定按钮 -->
					<button class="cu-btn bg-gradual-purple width100 lg" :style="{position: 'fixed', bottom: 0}">
						{{ i18n.base.confirm }}
					</button>
					
				</view>
			</unicloud-db>
			
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
				// this.loadDetailData()
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
