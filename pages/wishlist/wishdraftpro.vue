<template>
	<view class="pagecontent">
		
		<!-- 自定义导航栏 -->
		<cu-custom bgColor="bg-gradual-pink">
			<block slot="content">{{i18n.nav.wishdraft}}</block>
			<template>
				<text class="text-white margin-right" slot="right" @tap.stop=" type = type == 'edit' ? 'normal' : 'edit'; showSelector = false ">{{ type == 'normal' ? i18n.base.edit : i18n.base.cancel }}</text>
			</template>
		</cu-custom>
		
		<!-- 查询草稿箱商品 -->
		<unicloud-db ref="udb" v-slot:default="{data, loading, error, options}" 
					collection="wish-draft-product, product" 
					where=" creatUid == $cloudEnv_uid && status == 0 " 
					orderby=" creatTime desc "
					groupby=" sellerId"
					group-field=" addToSet( pid ) as productList, addToSet( selectSpecPropInfo ) as selectSpecPropInfoList, addToSet(_id) as ids "
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
								<text class="cuIcon u-font-40 margin-right" :class="[ getStoreSelectFlag(eachstore) ? 'cuIcon-roundcheckfill text-pink' : 'cuIcon-round text-gray' ]" @tap.stop="toggleStoeSelectFlag(eachstore)"></text>
								<text class="cuIcon cuIcon-shopfill text-pink"></text>
								<text class="text-df text-black">{{ eachstore.sellerInfo.nickName }}</text>
							</view>
						</view>
						
						<!-- 商店对应的商品列表 -->
						<view class="storeproductlistview">
							
							<view class="eachproductview" v-for="(eachproduct, productindex) in eachstore.productList" :key="eachproduct._id">
								
								<!-- 商品基本信息 -->
								<view class="productcontent flex align-center padding-sm" @tap.stop="checkProDetail(eachproduct)">
									<text class="cuIcon u-font-40 margin-right" :class="[ eachproduct.ifSelect ? 'cuIcon-roundcheckfill text-pink' : 'cuIcon-round text-gray' ]" @tap.stop="eachproduct.ifSelect = !eachproduct.ifSelect"></text>
									<u-image class="flex0 margin-right" width="100" height="100" :src="eachproduct.imgs.split(',')[0]"></u-image>
									<view class="titleview flex1 u-line-2" style="max-width: 200px;">{{ eachproduct.title }}</view>
									<text class="cuIcon cuIcon-order margin-left" @tap.stop="selectProduct = eachproduct; showSelector = true"></text>
								</view>
								
								<!-- 选中的规格数组 -->
								<view v-if="eachproduct.selectSpecPropInfo" class="productspeclist padding-left-sm padding-right-sm">
									
									<!-- 一级属性 -->
									<block v-for="(firstspec, firstspecindex) in eachproduct.selectSpecPropInfo.propValList" :key="firstspecindex">
										
										<!-- 二级属性 -->
										<block v-if="secondspec.amount > 0" v-for="(secondspec , secondspecindex) in firstspec.specStockList" :key="secondspec.specId">
											
											<view class="eachspecview bg-gray flex align-center margin-top-sm padding-sm radius">
												
												<view class="leftview flex1">
													
													<!-- 规格参数 -->
													<text class="text-df u-line-2">{{ `${firstspec.propVal},${secondspec.propVal}` }}</text>
													<!-- 价格 -->
													<text class="text-price text-red margin-top-sm">{{ secondspec.price }}</text>
													
												</view>
												
												<u-number-box class="flex0" v-model="secondspec.amount" :min="1" @change="changeSpecAmount(eachproduct)"></u-number-box>
												
											</view>
											
										</block>
										
									</block>
									
								</view>
								
							</view>
							
						</view>
						
					</view>
					
				</view>
				
			</view>
		</unicloud-db>
		
		<!-- 底部操作条 -->
		<view class="cu-bar bg-white bordertop bottombar flex align-center justify-between padding-left padding-right">
			
			<view class="flex align-center">
				
				<text class="cuIcon" :class="[ allSelectFlag ? 'cuIcon-roundcheckfill text-pink' : 'cuIcon-round text-gray' ]" @tap.stop="toggleSelectFlag"></text>
				
				<view v-if="selectInfo" class="flex flex-direction justify-center margin-left">
					<text v-if="type == 'normal' " class="text-price text-red text-xl">{{ `${selectInfo.totalPrice}元` }}</text>
					<text class="text-grey text-xs">{{ `共${selectInfo.totalProNum}件商品  总数量:${selectInfo.totalNum}` }}</text>
				</view>
				
			</view>
			
			<view class="btnview">
				<!-- 根据不同状态选择不同元素 -->
				<template>
					<button v-if="type == 'normal'" class="cu-btn bg-gradual-pink lg" :disabled="selectInfo.totalProNum == 0" @tap.stop="gotoMakeWish">{{ i18n.base.confirm }}</button>
					<button v-if="type == 'edit'" class="cu-btn bg-red lg" :disabled="selectInfo.totalProNum == 0" @tap.stop="deleteSpecPro">{{ i18n.base.delete }}</button>
				</template>
				
			</view>
			
		</view>
		
		<!-- 多规格弹框 -->
		<proSpecSelector   :productInfo="selectProduct" 
							specInfoName="selectSpecPropInfo"
							:ifshow.sync="showSelector"
							@finishSelect="specFinishSelect">
		</proSpecSelector>
		
	</view>
</template>

<script>
	import proSpecSelector from '@/components/base/prospecselector.vue'; // 多规格选择器
	
	var _this
	
	export default {
		
		components: {
			proSpecSelector,
		},
		
		data() {
			return {
				
				type: 'normal', // 页面状态 normal正常模式 edit编辑模式
				ownDataList: [], // 数据列表  同udb中的dataList
				showSelector: false, // 是否显示规格选择器
				selectProduct: null, // 当前选择的商品数据
				
			}
		},
		
		computed: {
			
			// 整体选中标识
			allSelectFlag() {
				
				let dataList = this.ownDataList
				if(dataList.length == 0) {
					return false
				}
				let selectFlag = true
				dataList.forEach(eachstore => {
					eachstore.productList.forEach(eachproduct => {
						if(eachproduct.ifSelect == false) {
							selectFlag = false
							return
						}
					})
				})
				return selectFlag
				
			},
			
			// 选中的集合对象
			selectInfo() {
				
				let dataList = this.ownDataList
				
				let totalProNum = 0
				let totalNum = 0
				let totalPrice = 0
				
				dataList.forEach(eachstore => {
					eachstore.productList.forEach(eachproduct => {
						if(eachproduct.ifSelect) {
							
							totalProNum += 1
							
							// 遍历该商品下的选中规格对象
							eachproduct.selectSpecPropInfo.propValList.forEach(firstspec => {
								firstspec.specStockList.forEach(secondspec => {
									
									if(secondspec.amount > 0) {
										totalNum += Number(secondspec.amount)
										let specTotalPrice = (parseFloat(secondspec.price) * parseFloat(secondspec.amount))
										totalPrice += Math.round(specTotalPrice * 100) / 100
									}
									
								})
							})
							
						}
					})
				})
				totalPrice = parseFloat(totalPrice).toFixed(2)
				
				let selectInfo = {
					totalProNum: totalProNum,
					totalNum: totalNum,
					totalPrice: totalPrice.toString()
				}
				
				return selectInfo
				
			},
		},
		
		// 页面加载后
		onLoad() {
			_this = this
			
			//
			uni.$on('updatecartdata', function() {
				console.log(`更新购物车数据`);
				_this.$refs.udb.refresh()
			})
			
		},
		
		onUnload() {
			uni.$off('updatecartdata')
		},
		
		methods: {
			
			// 加载数据 对数据进行加工
			loadData(data, ended, pagination) {
				
				// 遍历数据进行数据重组
				data.forEach(eachstore => {
					
					// 商店商品列表
					let productList = []
					let selectSpecPropInfoList = eachstore.selectSpecPropInfoList
					let ids = eachstore.ids
					
					eachstore.productList.forEach((eachproduct, productindex) => {
						eachproduct = eachproduct[0] // 转数组为对象
						// 给每一个商品增加选中标识
						eachproduct['ifSelect'] = true
						eachproduct['selectSpecPropInfo'] = selectSpecPropInfoList[productindex]
						eachproduct['draftproId'] = ids[productindex]
						delete eachproduct._id
						productList.push(eachproduct)
						if(productindex == 0) {
							eachstore['sellerInfo'] = eachproduct.sellerInfo
						}
					})
					eachstore.productList = productList
					
					delete eachstore.selectSpecPropInfoList
					delete eachstore.ids
					
				})
				console.log(data);
				this.ownDataList = data
				
			},
			
			// 切换某个商品的规格
			specFinishSelect(selectSpecPropInfo) {
				console.log(`当前选择完规格的数据为`);
				console.log(selectSpecPropInfo);
				// 修改当前商品的选中规格
				let _id = this.selectProduct.draftproId
				this.$refs.udb.update(_id,{selectSpecPropInfo}, {
					showToast: _this.i18n.tip.optionsuccess,
					needConfirm: false,
					success: (res) => {
						// 修改成功
						// 改变当前dataList的数据
						_this.$set(_this.selectProduct, 'selectSpecPropInfo', selectSpecPropInfo)
					}
				})
			},
			
			// 计算某个店铺选中状态
			getStoreSelectFlag(eachstore) {
				let selectFlag = eachstore.productList.findIndex(eachproduct => eachproduct.ifSelect == false) < 0
				return selectFlag
			},
			
			// 切换某个店铺的选中状态
			toggleStoeSelectFlag(eachstore) {
				// 首先判断当前店铺下的商品是否为全选中
				let ifSelectAllFlag = eachstore.productList.findIndex(eachproduct => eachproduct.ifSelect == false) < 0
				
				// 将该商铺下的所有商品选中状态变更
				eachstore.productList.forEach(eachproduct => {
					eachproduct.ifSelect = !ifSelectAllFlag
				})
				
			},
			
			// 切换底部操作条的选中状态
			toggleSelectFlag() {
				
				let dataList = this.$refs?.udb?.dataList || []
				let newSelectFlag = !this.allSelectFlag
				
				dataList.forEach(eachstore => {
					eachstore.productList.forEach(eachproduct => {
						eachproduct.ifSelect = newSelectFlag
					})
				})
			},
			
			// 查看商品
			checkProDetail(eachproduct) {
				uni.navigateTo({
					url: `/pages/wishlist/linkprodetail?pid=${eachproduct.pid}&platformPid=${eachproduct.platformPid}`
				});
			},
			
			// 变更规格数量
			changeSpecAmount(eachproduct) {
				eachproduct.ifSelect = true
			},
			
			// 删除选择规格商品
			deleteSpecPro() {
				
				let dataList = this.$refs?.udb?.dataList || []
				
				uni.showModal({
					content: this.i18n.tip.deleteconfirm,
					showCancel: true,
					cancelText: this.i18n.base.cancel,
					confirmText: this.i18n.base.confirm,
					success: res => {
						if(res.confirm) {
							// 开始删除所选规格商品
							
							// 获取当前选择的规格商品id
							let selectSpecProIdArr = []
							let removeIndexArr = []
							dataList.forEach((eachstore, storeindex) => {
								eachstore.productList.forEach((eachpro, proindex) => {
									if(eachpro.ifSelect) {
										selectSpecProIdArr.push(eachpro.draftproId)
										removeIndexArr.push({storeindex, proindex})
									}
								})
							})
							
							console.log(selectSpecProIdArr);
							
							_this.$refs.udb.remove(selectSpecProIdArr, {
								needConfirm: false,
								success: (res) => {
									const {code, message} = res
									console.log(res);
									
									// 手动删除对应的商品
									removeIndexArr.forEach(indexitem => {
										let storeitem = dataList[indexitem.storeindex]
										storeitem.productList.splice(indexitem.proindex, 1)
										// 删除完之后判断是否无商品
										if(storeitem.productList.length == 0) {
											dataList.splice(indexitem.storeindex, 1)
										}
									})
									
								},
								fail: (err) => {
									const {message} = err
									console.log(message);
									uni.showToast({
										title: _this.i18n.tip.optionerror,
										icon: 'none'
									});
								}
							})
							
						}
					}
				});
				
			},
			
			// 选择规格商品到下单页
			gotoMakeWish() {
				
				let dataList = this.$refs?.udb?.dataList || []
				// 获取当前选择的规格商品id
				let selectSpecProIdArr = []
				dataList.forEach(eachstore => {
					eachstore.productList.forEach(eachpro => {
						if(eachpro.ifSelect) {
							selectSpecProIdArr.push(eachpro.draftproId)
						}
					})
				})
				
				console.log(selectSpecProIdArr);
				
				// 跳转至下单页 将选择的draftId数组传递至下单页进行请求
				uni.setStorageSync('makeorderdraftidarr', selectSpecProIdArr)
				uni.navigateTo({
					url: '/pages/wishlist/makewishorder?sourceFrom=draftpro'
				});
			},
			
		}
	}
</script>

<style lang="scss" scoped>
	
	.pagecontent {
		padding-bottom: calc(50px + 0px + env(safe-area-inset-bottom) / 2);
		.bottombar{
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
		}
	}
	
</style>
