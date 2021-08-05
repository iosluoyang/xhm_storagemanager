<template>
	<view class="pagecontent wishorderpage">
		
		<!-- 导航栏 -->
		<cu-custom bgColor="bg-cyan" isBack>
			<block slot="content">{{ i18n.nav.wishorder }}</block>
		</cu-custom>
		
		<!-- 其他的内容视图 -->
		<view v-if="wishinfo" class="contentview">
			
			<!-- 心愿详情信息 -->
			<view v-if="false" class="wishdetailview bg-white padding-sm solid-bottom">
				
				<!-- 心愿商品基本信息 -->
				<view class="prodetailview padding-sm flex align-center">
					
					<!-- 商品轮播图 -->
					<swiper class="screen-swiper square-dot" indicator-dots circular
					 autoplay interval="3000" duration="500" style="width: 40%;height: 200rpx;min-height: auto;flex-shrink: 0;">
						<swiper-item class="radius" v-for="(img,index) in wishinfo.imgs.split(',')" :key="index">
							<image :src="img" mode="aspectFill" @tap.stop="previewImgs(wishinfo.imgs,index)"></image>
						</swiper-item>
					</swiper>
					
					<!-- 商品标题和备注 链接 -->
					<view class="procontentview flex-sub margin-left-sm" style="flex-shrink: 1;">
						<view class="text-bold margin-bottom-sm t_twoline">{{ wishinfo.productTitle }}</view>
						<view v-if="wishinfo.remark" class="tipsview radius bg-gray padding-sm text-sm text-light" style="word-break: break-all;" @longpress="$basejs.copytoclipboard(wishinfo.remark)">{{wishinfo.remark}}</view>
						<view class="bottomview margin-top-sm flex justify-between align-center">
							<view class="priceview flex align-center">
								<text class="text-red text-xl margin-right">{{ `${wishinfo.sourceMoneyType === 'RMB' ? '¥' : wishinfo.sourceMoneyType === 'THB' ? '฿' : ''}${wishinfo.sourcePrice}` }}</text>
								<view class="cu-tag radius bg-cyan">{{ wishinfo.targetAmount }}</view>
							</view>
							
						</view>
					</view>
					
				</view>
				
			</view>
			
			<!-- 订购信息字样 -->
			<view class="cu-bar bg-white">
				<view class="action">
					<text class="cuIcon cuIcon-titles text-cyan"></text>
					<text class="text-xl text-bold">{{ i18n.wishlist.wishorder.purchaseinfo }}</text>
				</view>
			</view>
			
			<!-- 订购数量详情表格 -->
			<view class="purchasetableview padding-sm">
				<wishTableSpec ref="wishtablespec" :wishinfo="wishinfo" sourcefrom="productreceive" ></wishTableSpec>
			</view>
			
			<!-- 操作区域字样 -->
			<view class="cu-bar bg-white">
				<view class="action">
					<text class="cuIcon cuIcon-titles text-blue"></text>
					<text class="text-xl text-bold">{{ i18n.wishlist.wishorder.confirminfo }}</text>
				</view>
			</view>
			
			<!-- 操作区域 -->
			<view class="optionview padding-left padding-right">
				
				<!-- 如果是代理下单类型 -->
				<view v-if="type == 'agentpurchasepro'">
					
					<!-- 价格相关 -->
					<template v-if="orderPriceInfo">
						
						<view class="cu-form-group">
							<view class="title">{{ i18n.wishlist.common.amount }}</view>
							<input class="text-right" type="text" v-model="orderPriceInfo.totalAmount" />
						</view>
						
						<view class="cu-form-group">
							<view class="title">{{ i18n.wishlist.common.tabledata.proprice }}</view>
							<input class="text-right" type="text" v-model="orderPriceInfo.totalProPrice" />
						</view>
						
						<view class="cu-form-group">
							<view class="title">{{ i18n.wishlist.common.tabledata.domesticshippingfee }}</view>
							<input class="text-right" type="text" v-model="orderPriceInfo.totalDomesticShippingFee" />
						</view>
						
						<view class="cu-form-group">
							<view class="title">{{ i18n.wishlist.common.tabledata.commissionfee }}</view>
							<input class="text-right" type="text" v-model="orderPriceInfo.totalCommissionFee" />
						</view>
						
					</template>
					
					<view class="cu-form-group text-grey">
						<view class="title">{{ i18n.wishlist.common.thirdplatformtype }}</view>
						<input class="text-right" type="text" :disabled="true" v-model="thirdPlatformType" />
					</view>
					
					<view class="cu-form-group">
						<view class="title">{{ i18n.wishlist.common.thirdplatformordernum }}</view>
						<input class="text-right" type="text" v-model="thirdOrderNum" />
						<button class='cu-btn bg-green shadow' @tap.stop="pastefromclipboard('thirdOrderNum')">{{ i18n.base.paste }}</button>
					</view>
					
				</view>
				
				<!-- 如果是客户收货类型 -->
				<view v-else-if="type == 'clientconfirmreceive'">
					
					<!-- 收货状态 -->
					<radio-group class="block" @change="(e) => {receiveAllFlag = Number(e.detail.value)}">
						
						<view class="flex justify-around">
							<label class="radio">
								<radio class='cyan margin-right-sm' :class="receiveAllFlag==1?'checked':''" :checked="receiveAllFlag==1?true:false" value="1"></radio>
								{{ i18n.wishlist.receiveproduct.receiveall }}
							</label>
							<label class="radio">
								<radio class='red radio margin-right-sm' :class="receiveAllFlag==0?'checked':''" :checked="receiveAllFlag==0?true:false" value="0"></radio>
								{{ i18n.wishlist.receiveproduct.receiveparts }}
							</label>
						</view>
						
					</radio-group>
					
					<!-- 如果是部分收货的话则记录收货信息 -->
					<view v-if="receiveAllFlag == 0" class="padding">
						
						<view class="partreceiveview">
							
							<view class="title text-bold">{{ `部分收货信息` }}</view>
							<view class="cu-form-group solid margin-top-sm">
								<textarea maxlength="-1" v-model="receiveproductcontent" placeholder="输入收货信息"></textarea>
							</view>
							
						</view>
						
						<view class="remarkview margin-top-sm">
							
							<view class="title text-bold">{{ `备注` }}</view>
							<view class="cu-form-group solid margin-top-sm">
								<textarea maxlength="-1" v-model="remark" placeholder="请输入备注"></textarea>
							</view>
							
						</view>
						
					</view>
					
					<!-- <view class="cu-form-group">
						<view class="title">{{ `第三方订单号` }}</view>
						<input class="text-right" type="text" v-model="thirdOrderNum" />
						<button class='cu-btn bg-green shadow' @tap.stop="pasteData('thirdOrderNum')">{{ i18n.base.paste }}</button>
					</view>
					
					
					<view class="cu-form-group">
						<view class="title">{{ `国内物流名称` }}</view>
						<input class="text-right" type="text" v-model="domesticShippingName" />
					</view>
					
					<view class="cu-form-group">
						<view class="title">{{ `国内物流单号` }}</view>
						<input class="text-right" type="text" v-model="domesticShippingNum" />
						<button class='cu-btn bg-green shadow' @tap.stop="pasteData('domesticShippingNum')">{{ i18n.base.paste }}</button>
					</view> -->
					
				</view>
				
			</view>
			
			
			<!-- 确定按钮 -->
			<view class="btnview padding-left padding-right flex align-center justify-center margin-top">
				<button class="cu-btn width50 round lg" :class="[ receiveAllFlag == '1' ? 'bg-cyan' : 'bg-red' ]" @tap.stop="confirm">{{ i18n.base.confirm }}</button>
			</view>
			
		</view>
		
		<!-- 加载条 -->
		<loading :loadModal="ifloading"></loading>
		
	</view>
</template>

<script>
	
	var _this
	
	import wishTableSpec from '@/components/wishtablespec/wishtablespec.vue'; // 使用u-table的多规格表格
	
	export default {
		
		components: {
			wishTableSpec,
		},
		
		data() {
			return {
				ifloading: false, // 是否正在加载
				
				type: 'agentpurchasepro', // 该页面类型  agentpurchasepro 为代理下单页面  clientconfirmreceive 为客户确认收货页面
				
				wishId: null, // 心愿id
				wishinfo: null, // 心愿详情数据
				
				receiveAllFlag: '1', // 收货状态 0 未全部收到货  1全部收到货  默认为1 字符串类型
				
				receiveproductcontent: "", // 部分收货信息内容
				remark: '', // 备注内容
				
				unitCommissionFee: '20', // 心愿客户的服务费单价
				thirdPlatformType: 'pro-1688', // 第三方平台名称 pro-1688  pro-taobao  pro-shopee  固定为pro-1688
				orderPriceInfo: null, // 订单相关的价格类型和金额
				thirdOrderNum: '', // 第三方订单号
				domesticShippingName: '', // 国内物流名称
				domesticShippingNum: '', // 国内物流编号
			}
		},
		
		onShareAppMessage(res) {
			
			console.log(`分享到聊天`);
			let shareObj = this.shareObj
			return shareObj
			
		},
		
		onShareTimeline(res) {
			
			console.log(`分享到朋友圈`);
			let shareObj = this.shareObj
			return shareObj
			
		},
		
		// 页面加载后
		onLoad(option) {
			_this = this
			
			let wishId = option.wishId
			if(wishId) {
				_this.wishId = wishId
				// 获取心愿详情信息
				_this.loadwishdetail()
			}
			else {
				uni.showToast({
					title: _this.i18n.error.loaderror,
					icon: 'none'
				});
			}
			
		},
		
		methods: {
			
			// 获取心愿详情
			loadwishdetail() {
				
				_this.ifloading = true // 开始缓冲动画
				
				// 使用openDB获取详情信息
				const db = uniCloud.database();
				db.collection('wishlist,uni-id-users')
					.doc(_this.wishId)
					.field('creatUser{nickname,avatar,unitCommissionFee},agentUser{avatar,nickname},agentFlag,productTitle,aliasName,imgs,targetPrice,targetAmount,targetMoneyType,sourcePrice,sourceMoneyType,sourceLink,achieveFlag,hurryLevel,remark,creatTime,productExt,specPropInfo,thirdPidType,thirdPid')
					.get({
						getOne:true
					})
					.then(res => {
						
						_this.ifloading = false // 结束缓冲动画
						
						if(res.result.code == 0) {
							let detaildata = res.result.data
							detaildata.creatUser = detaildata.creatUser[0]
							detaildata.agentUser = detaildata.agentUser && detaildata.agentUser.length > 0 ? detaildata.agentUser[0] : null
							_this.wishinfo = detaildata
							
							// 如果当前用户身份为代理员且为待下单状态则设置页面类型为代理员下单类型
							if(_this.user.role == 'PRODUCT_AGENT' && _this.wishinfo.achieveFlag == 2) {
								_this.type = 'agentpurchasepro'
								
								// 开始计算即将生成订单的部分信息
								// 计算当前心愿的相关价格 生成订单
								let wishInfo = _this.wishinfo
								let clientUnitCommissionFee = wishInfo.creatUser.unitCommissionFee
								_this.unitCommissionFee = clientUnitCommissionFee
								// 计算费用
								let totalProPrice = 0
								let totalAmount = 0
								let totalDomesticShippingFee = wishInfo.productExt.domesticShippingFee
								let unitCommissionFee = Number(_this.unitCommissionFee)
								let totalCommissionFee = 0
								
								let firstList = wishInfo.specPropInfo.propValList
								
								firstList.forEach(firstitem => {
								
									//遍历二级属性 计算总商品金额和总数量
									firstitem.specStockList.forEach(seconditem => {
										if(seconditem.amount) {
											totalAmount += seconditem.amount
											totalProPrice = parseFloat(totalProPrice) + parseFloat( Number(seconditem.amount) * parseFloat(seconditem.price) )
										}
									})
									
									totalProPrice = totalProPrice.toFixed(2)
									
									// 服务费为大种类类型*
									totalCommissionFee += unitCommissionFee
									
								})
																
								let orderPriceInfo = {
									totalProPrice,
									totalAmount,
									totalDomesticShippingFee,
									unitCommissionFee,
									totalCommissionFee
								}
								
								_this.orderPriceInfo = orderPriceInfo
								
							}
							
						}
					})
					.catch(error => {
						_this.ifloading = false // 结束缓冲动画
					})
				
			},
			
			previewImgs(imgsStr,index) {
				uni.previewImage({
					current:index,
					urls: imgsStr.split(',')
				})
			},
			
			// 从粘贴板粘贴内容
			pastefromclipboard(datatype) {
				uni.getClipboardData({
					success(res) {
						let content = res.data
						if(content) {
							_this[datatype] = content
						}
					}
				})
			},
			
			// 代理下单操作
			agentpurchasepro() {
				
				// 校验订单号
				if(!_this.thirdOrderNum) {
					uni.showToast({
						title: _this.i18n.wishlist.wishorder.pleaseinputthirdordernum,
						icon: 'none'
					});
					return
				}
				
				let wishInfo = _this.wishinfo
				
				// 创建订单数据
				let data = {
					creatUser: wishInfo.creatUser._id,
					agentUser: wishInfo.agentUser._id,
					wishId: wishInfo._id,
					title: wishInfo.productTitle,
					totalProPrice: _this.orderPriceInfo.totalProPrice.toString(),
					totalCommissionFee: _this.orderPriceInfo.totalCommissionFee.toString(),
					totalDomesticShippingFee: _this.orderPriceInfo.totalDomesticShippingFee.toString(),
					thirdPlatformType: _this.thirdPlatformType,
					thirdOrderNum: _this.thirdOrderNum
				}
				
				_this.ifloading = true
				const db = uniCloud.database();
				db.collection('order')
				.add(data)
				.then(response => {
					
					// 生成订单成功
					if(response.result.code == 0) {
						
						// 改变心愿状态为已下单待收货
						
						db.collection('wishlist')
						.doc(wishInfo._id)
						.update({
							achieveFlag: 3 , // 代理已下单客户待收货
						})
						.then(response => {
							// 操作成功
							if(response.result.code == 0) {
								
								// 发送推送消息  给用户发送下单通知
								_this.pushnoticemsg('purchaseorder')
								
								// 增加一条代理已经下单的时间轴
								db.collection('wishlisttimeline')
								.add({type: 91, wishId: wishInfo._id})
								.then(response => {
									// 增加时间轴成功
									_this.ifloading = false
									
									// 更新列表 详情和时间轴
									// 更新数据
									uni.$emit('updatetimeline')
									// 更新心愿单列表和详情
									uni.$emit('updatewishlist')
									uni.$emit('updatewishdetail')
									
									uni.showToast({
										title: _this.i18n.tip.optionsuccess,
										icon: 'none'
									});
									setTimeout(function() {
										uni.navigateBack();
									}, 1000);
									
								}).catch(error => {
									_this.ifloading = false
									console.log(error.message);
								})
								
							}
							// 操作失败
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
								title: error.message,
								icon: 'none'
							});
						})
						
					}
					else{
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
			
			// 推送消息
			pushnoticemsg(msgtype) {
				
				uniCloud.callFunction({
					name: 'base',
					data: {
						type: 'sendwxmsg',
						info: {
							msgtype: msgtype,
							wishId: _this.wishinfo._id
						}
					}
				}).then(response => {
					// 发送微信消息成功
					if(response.result.errCode == 0) {
						console.log(`发送微信订阅消息成功`);
					}
					else {
						console.log(`发送微信订阅消息失败,原因是:${response.result.message}`);
					}
						
				}).catch(error => {
					console.log(error.message);
				})
			
			},
			
			// 确认操作
			confirm() {
				
				// 代理确认下单
				if(this.type == 'agentpurchasepro') {
					this.agentpurchasepro()
				}
				
				// 客户确认收货
				else if(this.type == 'clientconfirmreceive') {
					
					// 如果是全部收货
					if(this.receiveAllFlag == 1) {
						uni.showModal({
							title: _this.i18n.base.tip,
							content: _this.i18n.wishlist.receiveproduct.receiveallconfirm,
							showCancel: true,
							cancelText: _this.i18n.base.cancel,
							confirmText: _this.i18n.base.confirm,
							success: res => {
								if(res.confirm) {
									
									const db = uniCloud.database();
									db.collection('wishlist')
									.doc(_this.wishId)
									.update({achieveFlag: 4})
									.then(response => {
										if(response.result.code == 0) {
											
											// 更改状态成功
											// 增加时间轴信息
											// 增加一条代理已经进货的时间轴
											db.collection('wishlisttimeline')
											.add({type: 6, wishId: _this.wishId})
											.then(response => {
												// 增加时间轴成功
												
												// 更新列表 详情和时间轴
												// 更新数据
												uni.$emit('updatetimeline')
												// 更新心愿单列表和详情
												uni.$emit('updatewishlist')
												uni.$emit('updatewishdetail')
												
												uni.showToast({
													title: _this.i18n.tip.optionsuccess,
													icon: 'none'
												});
												
												setTimeout(function() {
													uni.navigateBack();
												}, 1000);
												
											}).catch(error => {
												console.log(error.message);
												uni.showToast({
													title: _this.i18n.error.optionerror,
													icon: 'none'
												});
											})
											
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
								}
							}
						});
					}
					
					// 部分收货
					else if(this.receiveAllFlag == 0) {
						console.log(`部分收货`);
					}
					
				}
				
			},
			
			//
			
		}
	}
</script>

<style lang="scss" scoped>
	
	.content {
		
	}
	
</style>
