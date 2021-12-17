<template>
	<view class="pagecontent makeorderpage">
		
		<!-- 自定义导航栏 -->
		<cu-custom bgColor="bg-gradual-pink">
			<block slot="content">{{i18n.nav.makeorder}}</block>
		</cu-custom>
		
		<!-- 仓库地址区域 -->
		
		
		<!-- 下单店铺区域  根据购物车顺序而定 -->
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
				sourceFrom: 'draftpro', // 下单页来源  draftpro 为心愿草稿箱 wishbuyagain 为心愿单再次购买 directbuy 为直购下单
				ifloading: false, // 是否加载中
				ownDataList: null, // 重组后的数据列表
				
				draftIds: [], // 选中心愿草稿的id数组 sourceFrom = draftpro时使用
				wishId: null, // 心愿单再次购买的id  sourceFrom = wishbuyagain 时使用
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
			
			// 来源心愿草稿箱
			if(this.sourceFrom == 'draftpro') {
				let makeorderdraftidarr = uni.getStorageSync('makeorderdraftidarr')
				if(makeorderdraftidarr) {
					// 获取草稿箱下单数据
					this.draftIds = makeorderdraftidarr
					this.loadDraftProMakeOrderData()
					// 移除本地缓存
					uni.removeStorageSync('makeorderdraftidarr')
					
				}
			}
			// 来源心愿单再次购买
			else if(this.sourceFrom == 'wishbuyagain') {
				// 获取心愿单再次购买的下单数据
				this.wishId = option.wishId
				this.loadWishBuyAgainMakeOrderData()
			}
			
			//
		},
		
		methods: {
			
			// 加载心愿草稿箱下单数据 对数据进行按同店铺重组
			loadDraftProMakeOrderData() {
				
				_this.ifloading = true
				
				const db = uniCloud.database();
				db.collection('shoppingcart, product')
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
			
			// 心愿单再次购买获取下单数据
			loadWishBuyAgainMakeOrderData() {
				
				let wishId = this.wishId
				_this.ifloading = true
				
				const db = uniCloud.database();
				db.collection('wish')
				.doc(wishId)
				.field(`productList`)
				.get({getOne:true})
				.then(response => {
					if(response.result.code == 0) {
						let productList = response.result.data.productList
						
						// 如果是从心愿单再次加购来则删除商品信息中的draftproId(如果有的话)
						productList.forEach(eachproduct => {
							if(eachproduct.draftproId) {
								delete eachproduct.draftproId
							}
						})
						
						// 组装数据
						let storeList = []
						let eachstore = {
							sellerId: productList[0].sellerInfo.sellerId,
							sellerInfo: productList[0].sellerInfo,
							productList: productList
						}
						storeList.push(eachstore)
						this.ownDataList = storeList
					}
					else {
						uni.showToast({
							title: _this.i18n.tips.loaderror,
							icon: 'none'
						});
					}
				})
				.catch(error => {
					uni.showToast({
						title: _this.i18n.tips.loaderror,
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
					addWishArr.push(wishdata)
					
					// 如果是草稿箱下单则收集草稿箱id
					if(this.sourceFrom == 'draftpro') {
						// 草稿箱id数据
						let addIds = samestoreproductlist.map(eachproduct => (eachproduct.draftproId))
						draftIds = draftIds.concat(addIds)
					}
					
				})
				
				this.ifloading = true
				
				const db = uniCloud.database();
				db.collection('wish')
				.add(addWishArr)
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
						db.collection('wish-timeline')
						.add(addTimeLineArr)
						.then(response => {
							if(response.result.code == 0) {
								console.log(`批量添加时间轴数据成功`);
							}
						})
						.catch(error => {
							console.log(`批量添加时间轴数据发生错误`);
						})
						
						// 如果来源为草稿箱下单则变更状态
						if(this.sourceFrom == 'draftpro') {
							
							// 添加成功后将草稿箱中的数据状态变更为已加入心愿单
							db.collection('shoppingcart')
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
						// 其他情况跳转至心愿列表页
						else {
							_this.ifloading = false
							console.log(`生成心愿单成功`);
							// 跳转到心愿单列表页面
							uni.redirectTo({
								url: '/pages/wishlist/list'
							});
						}
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
