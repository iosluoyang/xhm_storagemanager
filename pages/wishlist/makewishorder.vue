<template>
	<view class="pagecontent makeorderpage">
		
		<!-- 自定义导航栏 -->
		<cu-custom bgColor="bg-gradual-pink">
			<block slot="content">{{i18n.nav.makewishorder}}</block>
		</cu-custom>
		
		<!-- 仓库地址区域 -->
		
		<!-- 订单信息区域  下单页根据分组展示 无需考虑顺序 -->
		<unicloud-db v-if="false" ref="udb" v-slot:default="{data, loading, error, options}" collection="wish-draft-product, product"
					:where=" `_id in ${JSON.stringify(draftIds)}` "
					orderby=" updateTime desc, creatTime desc "
					groupby="sellerId"
					group-field=" addToSet( pid ) as productList, addToSet( selectSpecPropInfo ) as selectSpecPropInfoList, addToSet(_id) as ids "
					loadtime="auto"
					@load="loadData"
		>
			<view v-if="error">{{error.message}}</view>
			<view v-else-if="loading" class="cu-load loading"></view>
			<view v-else>
				
				<!-- 商品展示区域 -->
				<view class="ordercontentview storesview padding-sm">
					
					<!-- 店铺 -->
					<view class="eachstore u-margin-bottom-20 bg-white radius shadow-warp" v-for="(eachstore, storeindex) in data" :key="eachstore.sellerId">
						
						<!-- 商店头部展示区域 -->
						<view v-if="eachstore.sellerInfo" class="storeheaderview cu-bar bg-white solids-bottom">
							<view class="action">
								<text class="cuIcon cuIcon-shopfill text-pink"></text>
								<text class="text-black">{{ storeindex + 1 }}.</text>
								<text class="text-df text-black">{{ eachstore.sellerInfo.nickName }}</text>
							</view>
						</view>
						
						<!-- 商店对应的商品列表 -->
						<view class="storeproductlistview">
							
							<view class="eachproductview padding-sm solid-bottom" v-for="(eachproduct, productindex) in eachstore.productList" :key="eachproduct._id">
								
								<!-- 商品基本信息 -->
								<view class="productcontent flex align-center padding-sm">
									<u-image class="flex0 margin-right" width="100" height="100" :src="eachproduct.imgs.split(',')[0]"></u-image>
									<view class="titleview flex1 u-line-2">{{ eachproduct.title }}</view>
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
													
												</view>
												
												<view class="rightview flex0 flex flex-direction align-center">
													<!-- 价格 -->
													<text class="text-red text-price text-sm">{{ secondspec.price }}</text>
													<!-- 数量 -->
													<text class="text-black  margin-top-sm">{{ `x ${secondspec.amount}` }}</text>
												</view>
												
											</view>
											
										</block>
										
									</block>
									
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
								
								<!-- 商品汇总信息 -->
								<view class="flex align-center justify-end margin-top">
									<text class="text-bold text-black">{{ `共${eachproduct.selectNum}件` }}</text>
									<text class="text-price text-red margin-left">{{ `${eachproduct.selectTotalPrice}` }}</text>
								</view>
								
							</view>
							
						</view>
						
					</view>
					
				</view>
				
			</view>
		</unicloud-db>
		
		<!-- 下单店铺区域  根据草稿箱顺序而定 -->
		<view v-if="ownDataList" class="ordercontentview storesview padding-sm">
			
			<!-- 店铺 -->
			<view class="eachstore u-margin-bottom-20 bg-white radius shadow-warp" v-for="(eachstore, storeindex) in ownDataList" :key="eachstore.sellerId">
				
				<!-- 商店头部展示区域 -->
				<view v-if="eachstore.sellerInfo" class="storeheaderview cu-bar bg-white solids-bottom">
					<view class="action">
						<text class="cuIcon cuIcon-shopfill text-pink"></text>
						<text class="text-black">{{ storeindex + 1 }}.</text>
						<text class="text-df text-black">{{ eachstore.sellerInfo.nickName }}</text>
					</view>
				</view>
				
				<!-- 商店对应的商品列表 -->
				<view class="storeproductlistview">
					
					<view class="eachproductview padding-sm solid-bottom" v-for="(eachproduct, productindex) in eachstore.productList" :key="eachproduct._id">
						
						<!-- 商品基本信息 -->
						<view class="productcontent flex align-center padding-sm">
							<u-image class="flex0 margin-right" width="100" height="100" :src="eachproduct.imgs.split(',')[0]"></u-image>
							<view class="titleview flex1 u-line-2">{{ eachproduct.title }}</view>
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
											
										</view>
										
										<view class="rightview flex0 flex flex-direction align-center">
											<!-- 价格 -->
											<text class="text-red text-price text-sm">{{ secondspec.price }}</text>
											<!-- 数量 -->
											<text class="text-black  margin-top-sm">{{ `x ${secondspec.amount}` }}</text>
										</view>
										
									</view>
									
								</block>
								
							</block>
							
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
						
						<!-- 商品汇总信息 -->
						<view v-if="$basejs.getProSelectSpecInfo(eachproduct.selectSpecPropInfo)" class="flex align-center justify-end margin-top">
							<text class="text-bold text-black">{{ `共${$basejs.getProSelectSpecInfo(eachproduct.selectSpecPropInfo).selectTotalNum}件` }}</text>
							<text class="text-price text-red margin-left">{{ `${$basejs.getProSelectSpecInfo(eachproduct.selectSpecPropInfo).selectTotalPrice}` }}</text>
						</view>
						
					</view>
					
				</view>
				
			</view>
			
		</view>
		
		<!-- 底部操作栏 -->
		<view class="cu-bar bg-white bordertop bottombar flex align-center justify-between padding-left padding-right">
			
			<view v-if="summaryInfo" class="flex flex-direction justify-center margin-left">
				<text class="text-grey text-df">{{ `共${summaryInfo.totalStoreNum}个商店  共${summaryInfo.totalProNum}件商品` }}</text>
				
				<text class="text-price text-red text-xl">{{ `${summaryInfo.totalPrice}元` }}</text>
			</view>
			
			<view class="btnview">
				<button class="cu-btn bg-gradual-pink lg" @tap.stop="makeWish">{{ i18n.base.confirm }}</button>
			</view>
			
		</view>
		
		<!-- 加载条 -->
		<loading :loadModal="ifloading"></loading>
		
	</view>
</template>

<script>
	
	var _this
	
	export default {
		
		components: {
			
		},
		
		data() {
			return {
				sourceFrom: 'draftpro', // 下单页来源  draftpro 为心愿草稿箱  directbuy 为直购下单
				ifloading: false, // 是否加载中
				ownDataList: null, // 重组后的数据列表
				
				draftIds: [], // 选中心愿草稿的id数组 sourceFrom = draftpro时使用
			}
		},
		
		computed: {
			
			// 计算的汇总信息
			summaryInfo() {
				if(!this.ownDataList) {
					return null
				}
				else {
					
					let totalStoreNum = 0
					let totalProNum = 0
					let totalNum = 0
					let totalPrice = 0
					
					// 计算商店数量和商品数量
					this.ownDataList.forEach(eachstore => {
						totalStoreNum ++
						eachstore.productList.forEach(eachproduct => {
							
							totalProNum += 1
							
							let proSelectSpecPropInfo = this.$basejs.getProSelectSpecInfo(eachproduct.selectSpecPropInfo)
							let selectTotalNum = proSelectSpecPropInfo.selectTotalNum // 选择的总数量
							let selectTotalPrice = proSelectSpecPropInfo.selectTotalPrice // 选择的总金额
							
							totalNum = Number(totalNum) + Number(selectTotalNum)
							totalPrice = Number(totalPrice) + Number(Math.round(Number(selectTotalPrice) * 100) / 100)
							
						})
					})
					
					totalPrice = this.$basejs.keepTwoDecimalFull(Number(totalPrice))
					
					let summaryInfo = {
						totalStoreNum,
						totalProNum,
						totalNum,
						totalPrice
					}
					return summaryInfo
					
				}
			}
		
		},
		
		// 页面加载后
		onLoad(option) {
			
			_this = this
			
			if(option.sourceFrom) {
				this.sourceFrom = option.sourceFrom
			}
			if(this.sourceFrom == 'draftpro') {
				let makeorderdraftidarr = uni.getStorageSync('makeorderdraftidarr')
				if(makeorderdraftidarr) {
					this.draftIds = makeorderdraftidarr
					// 获取下单数据
					this.loadMakeOrderData()
				}
			}
			
			//
		},
		
		methods: {
			
			// 加载数据 对数据进行加工
			loadData(data, ended, pagination) {
				
				let totalStoreNum = 0
				let totalProNum = 0
				let totalNum = 0
				let totalPrice = 0
				
				// 遍历数据进行数据重组
				data.forEach(eachstore => {
					
					totalStoreNum += 1
					
					// 商店商品列表
					let productList = []
					let selectSpecPropInfoList = eachstore.selectSpecPropInfoList
					let ids = eachstore.ids
					
					eachstore.productList.forEach((eachproduct, productindex) => {
						
						totalProNum += 1
						
						eachproduct = eachproduct[0] // 转数组为对象
						eachproduct['selectSpecPropInfo'] = selectSpecPropInfoList[productindex]
						eachproduct['draftproId'] = ids[productindex]
						// 初始化别名和备注
						eachproduct['aliasName'] = ''
						eachproduct['remark'] = ''
						
						// 计算每个商品的总数量和总金额
						let selectNum = 0
						let selectTotalPrice = 0
						eachproduct.selectSpecPropInfo.propValList.forEach(firstspec => {
							firstspec.specStockList.forEach(secondspec => {
								
								if(secondspec.amount > 0) {
									
									let specTotalPrice = (Number(secondspec.price) * Number(secondspec.amount))
									
									selectNum = Number(selectNum) + Number(secondspec.amount)
									selectTotalPrice = Number(selectTotalPrice) + Number(Math.round(specTotalPrice * 100) / 100)
									
									totalNum = Number(totalNum) + Number(secondspec.amount)
									totalPrice = Number(totalPrice) + Number(Math.round(specTotalPrice * 100) / 100)
									
								}
								
							})
						})
						
						eachproduct['selectNum'] = selectNum
						eachproduct['selectTotalPrice'] = this.$basejs.keepTwoDecimalFull(Number(selectTotalPrice))
						
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
				totalPrice = this.$basejs.keepTwoDecimalFull(Number(totalPrice))
				console.log(data);
				
				let summaryInfo = {
					totalStoreNum,
					totalProNum,
					totalNum,
					totalPrice
				}
				this.summaryInfo = summaryInfo
				
			},
			
			// 加载预下单数据 对数据进行按同店铺重组
			loadMakeOrderData() {
				
				_this.ifloading = true
				
				const db = uniCloud.database();
				db.collection('wish-draft-product, product')
				.where(`_id in ${JSON.stringify(_this.draftIds)}`)
				.orderBy('updateTime desc, creatTime desc')
				.get()
				.then(response => {
					// 获取成功
					if(response.result.code == 0) {
						
						let storeList = []
						
						let dataList = response.result.data
						dataList.forEach(eachdraft => {
							
							let eachproduct = eachdraft.pid && eachdraft.pid.length > 0 ? eachdraft.pid[0] : null
							if(eachproduct) {
								// 重组商品数据
								eachproduct['draftproId'] = eachdraft._id
								eachproduct['selectSpecPropInfo'] = eachdraft.selectSpecPropInfo
								// 初始化别名和备注
								eachproduct['aliasName'] = ''
								eachproduct['remark'] = ''
								delete eachproduct._id
							}
							
							let existStoreItem = storeList.find(eachstore => (eachstore.sellerId == eachdraft.sellerId))
							// 已存在有同店铺商品
							if(existStoreItem) {
								let productList = existStoreItem.productList
								productList.push(eachproduct)
							}
							// 未存在同店铺商品 新增店铺
							else {
								
								let eachstore = {
									sellerId: eachproduct.sellerInfo.sellerId,
									sellerInfo: eachproduct.sellerInfo,
									productList: [eachproduct]
								}
								storeList.push(eachstore)
							}
						})
						
						this.ownDataList = storeList
						
					}
					// 获取失败
					else {
						uni.showToast({
							title: _this.i18n.error.loaderror,
							icon: 'none'
						});
					}
				})
				.catch(error => {
					uni.showToast({
						title: _this.i18n.error.loaderror,
						icon: 'none'
					});
				})
				.finally(() => {
					_this.ifloading = false
				})
				
			},
			
			// 生成心愿单
			makeWish() {
				console.log(`开始生成心愿单`);
				// let dataList = this.$refs.udb.dataList
				let dataList = this.ownDataList
				
				let draftIds = []
				
				// 根据每一个商店生成一个心愿单
				let addWishArr = []
				
				dataList.forEach(eachstore => {
					
					let samestoreproductlist = eachstore.productList
					// 生成心愿单数据
					let wishdata = {
						productList: samestoreproductlist,
						quotationInfo: {
							totalProPrice: "",
							totalShippingFee: "",
							totalCommissionFee: ""
						}
					}
					// 草稿箱id数据
					let addIds = samestoreproductlist.map(eachproduct => (eachproduct.draftproId))
					draftIds = draftIds.concat(addIds)
					
					addWishArr.push(wishdata)
					
				})
				
				this.ifloading = true
				
				const db = uniCloud.database();
				db.collection('wish').add(addWishArr)
				.then(response => {
					// 添加成功
					if(response.result.code == 0) {
						
						// 无关联操作
						// 新增对应的时间轴数据
						let wishIdsArr = response.result.ids
						let addTimeLineArr = wishIdsArr.map(eachwishid => {
							let timelineinfo = {
								wishId: eachwishid,
								type: 0, // 新增时间轴类型
							}
							return timelineinfo
						})
						db.collection('wish-timeline').add(addTimeLineArr)
						.then(response => {
							if(response.result.code == 0) {
								console.log(`批量添加时间轴数据成功`);
							}
						})
						.catch(error => {
							console.log(`批量添加时间轴数据发生错误`);
						})
						
						// 添加成功后将草稿箱中的数据状态变更为已加入心愿单
						db.collection('wish-draft-product')
						.where( `_id in ${JSON.stringify(draftIds)}` )
						.update({status: 1})
						.then(response => {
							
							_this.ifloading = false
							console.log(`修改草稿箱数据成功`);
							
							// 更新草稿箱数据
							uni.$emit('updatecartdata')
							
							// 跳转到心愿单列表页面
							uni.redirectTo({
								url: '/pages/wishlist/list'
							});
							
						})
						.catch(error => {
							_this.ifloading = false
							uni.showToast({
								title: _this.i18n.tip.optionerror,
								icon: 'none'
							});
						})
					
					}
					else {
						_this.ifloading = false
						uni.showToast({
							title: _this.i18n.tip.optionerror,
							icon: 'none'
						});
					}
				})
				.catch(error => {
					_this.ifloading = false
					uni.showToast({
						title: _this.i18n.tip.optionerror,
						icon: 'none'
					});
				})
				
			},
			
			//
			
		}
	}
</script>

<style lang="scss" scoped>
	
	page{
		background-color: #F7F7F7;
	}
	
	.pagecontent {
		
		padding-bottom: calc(50px + 20px + env(safe-area-inset-bottom) / 2);
		.bottombar{
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
		}
	}
	
</style>
