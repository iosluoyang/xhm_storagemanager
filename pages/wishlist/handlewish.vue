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
						<view class="productspectableview padding-sm">
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
					
					<!-- 心愿表格展示区域 -->
					<wishTableSpec ref="wishtablespec" :wishInfo="wishInfo" type="quotation" @changeProSpec="changeProSpec"></wishTableSpec>
					
					<!-- 修改价格区域 -->
					<view class="operaview">
						
						<view class="optionview flex align-center padding-sm">
							
							<!-- 价格编辑状态  显示取消和确认 -->
							<template v-if="priceEditFlag">
								<button class="cu-btn round bg-grey lg cuIcon cuIcon-close" @tap.stop="priceEditFlag = false"></button>
								<button class="margin-left cu-btn round bg-red lg cuIcon cuIcon-check" @tap.stop="finishEditPrice"></button>
							</template>
							
							<!-- 非价格编辑状态 显示编辑按钮 -->
							<template v-else>
								<!-- <button class="cu-btn round bg-grey sm cuIcon cuIcon-edit" @tap.stop="startQuotation"></button> -->
								<button class="cu-btn block bg-blue radius lg width100" @tap.stop="startQuotation">{{ i18n.base.quotation }}</button>
							</template>
						
						</view>
						
						<!-- 报价区域  报价类型且为编辑状态时显示 -->
						<view v-if="priceEditFlag" class="editpriceview">
							
							<!-- 商品总价 -->
							<view class="cu-form-group">
								<view class="title">{{ i18n.wishlist.common.tabledata.proprice }}</view>
								<input class="text-right" type="digit" v-model="tmpQuotationInfo.totalProPrice" />
							</view>
							
							<!-- 国内运费 -->
							<view class="cu-form-group">
								<view class="title">{{ i18n.wishlist.common.tabledata.domesticshippingfee }}</view>
								<input class="text-right" type="digit" focus v-model="tmpQuotationInfo.totalShippingFee" />
							</view>
							
							<!-- 服务费 -->
							<view class="cu-form-group">
								<view class="title">{{ i18n.wishlist.common.tabledata.commissionfee }}</view>
								<input class="text-right" type="digit" v-model="tmpQuotationInfo.totalCommissionFee" />
							</view>
							
						</view>
						
					</view>
					
				</view>
				
			</template>
			
			<!-- 确定按钮 -->
			<template>
				
				<!-- 确认报价 -->
				<button v-if="type == 'quotation'" class="cu-btn confirmbtn bg-orange lg" :disabled="confirmDisabled" @tap.stop="confirmQuotation">
					{{ i18n.base.confirm }}
				</button>
				
				<!-- 确认编辑 -->
				<button v-if="type == 'edit'" class="cu-btn confirmbtn bg-pink lg" @tap.stop="confirmEdit">
					{{ i18n.base.confirm }}
				</button>
				
			</template>
			
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
				
				type: 'edit', //  edit  编辑心愿  quotation 心愿单报价
				
				showSelector: false, // 是否显示规格选择器
				selectProduct: null, // 当前选择的商品数据
				
				priceEditFlag: false, // 心愿单价格编辑状态 默认为否
				tmpQuotationInfo: null, // 临时报价对象
				
				
				ifloading: false, // 是否加载中
			}
		},
		
		computed: {
			
			// 确认按钮是否禁用
			confirmDisabled() {
				// 报价状态
				if(this.type == 'quotation') {
					if(this.priceEditFlag) {
						return true
					}
					else {
						// 无报价则禁用
						if(this.wishInfo && this.wishInfo.quotationInfo.totalProPrice && this.wishInfo.quotationInfo.totalCommissionFee && this.wishInfo.quotationInfo.totalShippingFee) {
							return false
						}
						else {
							return true
						}
					}
				}
				
				return false
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
			
			let type = option.type
			if(type) {
				this.type = type
			}
			
			
			//
		},
		
		onPullDownRefresh() {
			this.loaddetaildata()
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
			
			// 报价类型修改某个商品规格
			changeProSpec(proIndex) {
				let selectProduct = this.wishInfo.productList[proIndex]
				this.selectProduct = selectProduct
				this.showSelector = true
			},
			
			// 完成切换某个商品的规格
			specFinishSelect(selectSpecPropInfo) {
				
				console.log(`当前选择完规格的数据为`);
				console.log(selectSpecPropInfo);
				// 修改当前商品的选中规格
				this.$set(this.selectProduct, 'selectSpecPropInfo', selectSpecPropInfo)
				
			},
			
			// 开始报价
			startQuotation() {
				
				let quotationInfo = this.wishInfo.quotationInfo
				
				let originalProTotalPrice = this.$basejs.getWishSelectSpecInfo(_this.wishInfo).selectTotalPrice
				
				let tmpQuotationInfo = {
					totalProPrice: quotationInfo?.totalProPrice || originalProTotalPrice,
					totalShippingFee: quotationInfo?.totalShippingFee || '',
					totalCommissionFee: quotationInfo?.totalCommissionFee || ''
				}
				this.tmpQuotationInfo = tmpQuotationInfo
				this.priceEditFlag = true
				
			},
			
			// 结束编辑价格
			finishEditPrice() {
				let tmpQuotationInfo = {...this.tmpQuotationInfo}
				// 更新报价价格为保留两位小数的字符串
				tmpQuotationInfo = {
					totalProPrice: this.$basejs.keepTwoDecimalFull(tmpQuotationInfo.totalProPrice),
					totalShippingFee: this.$basejs.keepTwoDecimalFull(tmpQuotationInfo.totalShippingFee),
					totalCommissionFee: this.$basejs.keepTwoDecimalFull(tmpQuotationInfo.totalCommissionFee)
				}
				
				this.$set(this.wishInfo, 'quotationInfo', tmpQuotationInfo)
				this.priceEditFlag = false
			},
			
			// 确认编辑
			confirmEdit() {
				uni.showModal({
					content: _this.i18n.tip.optionconfirm,
					showCancel: true,
					cancelText: _this.i18n.base.cancel,
					confirmText: _this.i18n.base.confirm,
					success: res => {
						if (res.confirm) {
				
							const db = uniCloud.database();
							_this.ifloading = true
							// 更新心愿的部分信息
							let productList = this.wishInfo.productList
							let updateTime = db.env.now
							
							db.collection('wish')
							.doc(this.wishId)
							.update({productList,updateTime})
							.then(response => {
								
								_this.ifloading = false
								// 修改成功
								uni.showToast({
									title: _this.i18n.tip.optionsuccess,
									icon: 'none'
								});
								
								// 更新心愿单列表和详情
								uni.$emit('updatewishlist')
								uni.$emit('updatewishdetail')
								
								uni.navigateBack(); // 返回上一页面 注意此处不能加延时
								
								// 新增编辑心愿单时间轴
								let timelineinfo = {
									wishId: _this.wishId, // 当前心愿单的id
									type: 2, // 时间轴类型  0心愿单创建时间轴  1普通内容时间轴  2心愿单编辑时间轴  3待确认时间轴  4心愿单同意时间轴  5心愿单拒绝时间轴  6心愿单确认完成时间轴 7心愿单支付完成时间轴  90代理人代理心愿时间轴
								}
								db.collection('wish-timeline')
								.add(timelineinfo)
								.then(res => {
									// 新增成功
									if(res.result.code == 0) {
										console.log(`时间轴新增成功`)
										// 更新时间轴数据
										uni.$emit('updatetimeline')
									}
									// 新增失败
									else {
										console.log(`时间轴新增失败`);
									}
								})
								.catch(err => {
									console.log(err.message);
								})
								
							})
							.catch(error => {
								_this.ifloading = false
								uni.showToast({
									title: _this.i18n.error.optionerror,
									icon: 'none'
								});
							})
				
						}
					}
				});
			},
			
			// 确认报价
			confirmQuotation() {
				
				// 获取总价
				let totalPrice = this.$refs.wishtablespec.getWishInfoTotalMoney()				
				if(totalPrice) {
					// 进行二次确认提醒代
					uni.showModal({
						title: _this.i18n.tip.optionconfirm,
						content: `¥ ${totalPrice}`,
						showCancel: true,
						cancelText: _this.i18n.base.cancel,
						confirmText: _this.i18n.base.confirm,
						success: res => {
							if (res.confirm) {
								_this.finalConfirmQuotation()
							}
						}
					});
				}
				else {
					uni.showToast({
						title: `${_this.i18n.placeholder.handletimeline.typedomesticshippingfee} && ${_this.i18n.placeholder.handletimeline.typecommissionfee}`,
						icon: 'none'
					});
				}
				
			},
			
			// 确认报价最终操作
			finalConfirmQuotation() {
				
				const db = uniCloud.database();
				_this.ifloading = true
				// 更新心愿的部分信息
				let productList = this.wishInfo.productList
				let quotationInfo = this.wishInfo.quotationInfo
				let updateTime = db.env.now
				let status = 2
				
				db.collection('wish')
				.doc(this.wishId)
				.update({productList,updateTime,quotationInfo, status})
				.then(response => {
					
					if(response.result.code == 0) {
						
						// 更新成功
						_this.ifloading = false
						// 修改成功
						uni.showToast({
							title: _this.i18n.tip.optionsuccess,
							icon: 'none'
						});
						
						// 更新心愿单列表和详情
						uni.$emit('updatewishlist')
						uni.$emit('updatewishdetail')
						// 推送确认报价单的提醒消息
						_this.pushnoticemsg('confirmquotation')
						// 代理员订阅消息
						_this.subscribenoticemsg()
						
						// 新增一条待确认时间轴
						let totalPrice = _this.$refs.wishtablespec.getWishInfoTotalMoney()
						let timelineinfo = {
							wishId: _this.wishId, // 当前心愿单的id
							price: totalPrice, // 当前报价单的总价
							type: 3, // 时间轴类型  0心愿单创建时间轴  1普通内容时间轴  2心愿单编辑时间轴  3待确认时间轴  4心愿单同意时间轴  5心愿单拒绝时间轴  6心愿单确认完成时间轴 7心愿单支付完成时间轴  90代理人代理心愿时间轴
						}
						db.collection('wish-timeline')
						.add(timelineinfo)
						.then(res => {
							// 新增成功
							if(res.result.code == 0) {
								console.log(`时间轴新增成功`)
								// 更新时间轴数据
								uni.$emit('updatetimeline')
							}
							// 新增失败
							else {
								console.log(`时间轴新增失败`);
							}
						})
						.catch(err => {
							console.log(err.message);
						})
						
					}
					else {
						_this.ifloading = false
						uni.showToast({
							title: _this.i18n.error.optionerror,
							icon: 'none'
						});
					}
					
				})
				.catch(error => {
					_this.ifloading = false
					uni.showToast({
						title: _this.i18n.error.optionerror,
						icon: 'none'
					});
				})
				
			},
			
			// 订阅消息  订阅后返回
			subscribenoticemsg() {
				
				// 开始获取订阅
				// #ifdef MP-WEIXIN
				
				// 增加订阅模板消息的功能
				let finishpayId = this.$store.getters.configData.wxminiNoticeTemplateDic.finishpay
				let confirmquotationId = this.$store.getters.configData.wxminiNoticeTemplateDic.confirmquotation
				
				uni.requestSubscribeMessage({
					tmplIds: [finishpayId,confirmquotationId],
					success(res){
						let errMsg = res.errMsg
						if(errMsg == 'requestSubscribeMessage:ok') {
							console.log(res[finishpayId]);
							// 用户同意订阅
							if(res[confirmquotationId] == 'accept') {
								console.log(`用户订阅消息成功`);
							} else if(res[finishpayId] == 'reject') {
								console.log(`用户拒绝订阅消息`);
							}
						}
						else {
							console.log(`订阅消息失败`);
						}
					},
					fail(err) {
						console.log(`订阅消息失败`);
						console.log(err.errMsg);
					},
					complete() {
						uni.navigateBack();
					}
				})
				
				// #endif
				
				// #ifndef MP-WEIXIN
				setTimeout(function() {
					uni.navigateBack();
				}, 500);
				// #endif
				
			},
			
			// 推送消息
			pushnoticemsg(msgtype) {
				
				uniCloud.callFunction({
					name: 'base',
					data: {
						type: 'sendwxmsg',
						info: {
							msgtype: msgtype,
							wishId: _this.wishId
						}
					}
				})
				.then(response => {
					// 发送微信消息成功
					if(response.result.errCode == 0) {
						console.log(`发送微信订阅消息成功`);
					}
					else {
						console.log(`发送微信订阅消息失败,原因是:${response.result.message}`);
					}
						
				})
				.catch(error => {
					console.log(error.message);
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
