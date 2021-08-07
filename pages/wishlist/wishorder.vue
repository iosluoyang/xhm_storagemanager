<template>
	<view class="pagecontent wishorderpage">
		
		<!-- 导航栏 -->
		<cu-custom bgColor="bg-cyan" isBack>
			<block slot="content">{{ i18n.nav.wishorder }}</block>
		</cu-custom>
		
		<!-- 其他的内容视图 -->
		<view class="contentview">
			
			<!-- 代理下单页面 -->
			<view v-if="type == 'agentpurchasepro' && wishinfo" class="agentpurchaseproview">
				
				<!-- 订购信息字样 -->
				<view class="cu-bar bg-white">
					<view class="action">
						<text class="cuIcon cuIcon-titles text-cyan"></text>
						<text class="text-xl text-bold">{{ i18n.wishlist.wishorder.purchaseinfo }}</text>
					</view>
				</view>
				
				<!-- 订购数量详情表格 -->
				<view class="purchasetableview padding-sm">
					<wishTableSpec ref="wishtablespec1" :wishinfo="wishinfo" sourcefrom="wishorder" ></wishTableSpec>
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
					
					<!-- 价格相关 -->
					<template v-if="orderPriceInfo">
						
						<view class="cu-form-group">
							<view class="title">{{ i18n.wishlist.common.amount }}</view>
							<input class="text-right" type="text" v-model="orderPriceInfo.totalAmount" />
						</view>
						
						<view class="cu-form-group">
							<view class="title">{{ i18n.wishlist.wishorder.totalproprice }}</view>
							<input class="text-right" type="text" v-model="orderPriceInfo.totalProPrice" />
						</view>
						
						<view class="cu-form-group">
							<view class="title">{{ i18n.wishlist.wishorder.totaldomesticshippingfee }}</view>
							<input class="text-right" type="text" v-model="orderPriceInfo.totalDomesticShippingFee" />
						</view>
						
						<view class="cu-form-group">
							<view class="title">{{ i18n.wishlist.wishorder.totalcommissionfee }}</view>
							<input class="text-right" type="text" v-model="orderPriceInfo.totalCommissionFee" />
						</view>
						
						<view class="cu-form-group">
							<view class="title">{{ i18n.wishlist.wishorder.totalorderprice }}</view>
							<input class="text-right" type="text" v-model="orderPriceInfo.totalOrderPrice" />
						</view>
						
					</template>
					
					<!-- 第三方平台类型 -->
					<view class="cu-form-group text-grey">
						<view class="title">{{ i18n.wishlist.common.thirdplatformtype }}</view>
						<input class="text-right" type="text" :disabled="true" v-model="thirdPlatformType" />
					</view>
					
					<!-- 第三方平台订单号 -->
					<view class="cu-form-group">
						<view class="title">{{ i18n.wishlist.common.thirdplatformordernum }}</view>
						<input class="text-right" type="text" v-model="thirdOrderNum" />
						<button class='cu-btn bg-green shadow' @tap.stop="pastefromclipboard('thirdOrderNum')">{{ i18n.base.paste }}</button>
					</view>
					
				</view>
				
				<!-- 确定按钮 -->
				<view v-if="wishinfo || orderinfo" class="btnview padding-left padding-right flex align-center justify-center margin-top">
					<button class="cu-btn width50 round lg" :class="[ receiveAllFlag == '1' ? 'bg-cyan' : 'bg-red' ]" @tap.stop="confirm">{{ i18n.base.confirm }}</button>
				</view>
				
			</view>
			
			<!-- 普通心愿订单页面 -->
			<view v-else-if="type == 'normal' && orderinfo && wishinfo" class="normalorderview">
				
				<!-- 心愿详情信息 -->
				<view v-if="wishinfo" class="wishdetailview bg-white padding-sm solid-bottom">
					
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
				
				<!-- 订单基本信息 -->
				<view class="orderinfoview">
					
					<!-- 订购信息字样 -->
					<view class="cu-bar bg-white padding-left-sm padding-right-sm">
						<view class="action">
							<text class="cuIcon cuIcon-titles text-cyan"></text>
							<text class="text-xl text-bold">{{ i18n.wishlist.wishorder.purchaseinfo }}</text>
						</view>
					</view>
					
					<!-- 订购数量详情表格 仅显示订购规格 -->
					<view class="purchasetableview padding-sm">
						<wishTableSpec ref="wishtablespec2" :wishinfo="wishinfo" sourcefrom="wishorder" ></wishTableSpec>
					</view>
					
					<!-- 其他信息 -->
					<view class="basicorderinfoview cu-list menu">
						
						<!-- 商品总价 -->
						<view class="cu-item">
							<view class="content">
								<text class="cuIcon-goodsfill text-orange"></text>
								<text class="text-grey">{{ i18n.wishlist.wishorder.totalproprice }}</text>
							</view>
							<view class="action">
								<text class="text-price text-black text-xl">{{ orderinfo.totalProPrice }}</text>
							</view>
						</view>
						
						<!-- 国内总运费 -->
						<view class="cu-item">
							<view class="content">
								<text class="cuIcon-deliver_fill text-green"></text>
								<text class="text-grey">{{ i18n.wishlist.wishorder.totaldomesticshippingfee }}</text>
							</view>
							<view class="action">
								<text class="text-price text-black text-xl">{{ orderinfo.totalDomesticShippingFee }}</text>
							</view>
						</view>
						
						<!-- 总服务费 -->
						<view class="cu-item">
							<view class="content">
								<text class="cuIcon-servicefill text-blue"></text>
								<text class="text-grey">{{ i18n.wishlist.wishorder.totalcommissionfee }}</text>
							</view>
							<view class="action">
								<text class="text-price text-black text-xl">{{ orderinfo.totalCommissionFee }}</text>
							</view>
						</view>
						
						<!-- 订单总价 -->
						<view class="cu-item">
							<view class="content">
								<text class="cuIcon-moneybagfill text-red"></text>
								<text class="text-grey">{{ i18n.wishlist.wishorder.totalorderprice }}</text>
							</view>
							<view class="action">
								<text class="text-price text-red text-xxl">{{ orderinfo.totalOrderPrice }}</text>
							</view>
						</view>
						
						<!-- 第三方平台类型 仅自身代理可见 -->
						<view v-if="user._id == orderinfo.agentUser" class="cu-item">
							<view class="content">
								<text class="text-grey">{{ i18n.wishlist.common.thirdplatformtype }}</text>
							</view>
							<view class="action">
								<text class="text-grey text-sm">{{ orderinfo.thirdPlatformType }}</text>
							</view>
						</view>
						
						<!-- 第三方平台订单号  仅自身代理可见 -->
						<view v-if="user._id == orderinfo.agentUser" class="cu-item">
							<view class="content">
								<text class="text-grey">{{ i18n.wishlist.common.thirdplatformordernum }}</text>
							</view>
							<view class="action">
								<text class="text-grey text-sm">{{ orderinfo.thirdOrderNum }}</text>
								<button class="margin-left cu-btn radius line-grey sm" @tap.stop="$basejs.copytoclipboard(orderinfo.thirdOrderNum)">{{ i18n.base.copy }}</button>
							</view>
						</view>
						
						<!-- 下单时间 -->
						<view class="cu-item">
							<view class="content">
								<text class="text-grey">{{ i18n.wishlist.wishorder.makeordertime }}</text>
							</view>
							<view class="action">
								<uni-dateformat class="text-grey text-sm" :date="orderinfo.creatTime" format="yyyy-MM-dd hh:mm:ss" />
							</view>
						</view>
						
						<!-- 发货时间 -->
						<view v-if="orderinfo.deliveryTime" class="cu-item">
							<view class="content">
								<text class="text-grey">{{ i18n.wishlist.wishorder.deliverytime }}</text>
							</view>
							<view class="action">
								<uni-dateformat class="text-grey text-sm" :date="orderinfo.deliveryTime" format="yyyy-MM-dd hh:mm:ss" />
							</view>
						</view>
						
						<!-- 收货时间 -->
						<view v-if="orderinfo.receiveTime" class="cu-item">
							<view class="content">
								<text class="text-grey">{{ i18n.wishlist.wishorder.receivetime }}</text>
							</view>
							<view class="action">
								<uni-dateformat class="text-grey text-sm" :date="orderinfo.receiveTime" format="yyyy-MM-dd hh:mm:ss" />
							</view>
						</view>
						
					</view>
					
				</view>
				
			</view>
			
		</view>
		
		<!-- 其他操作输入区域 -->
		<view v-if="orderinfo" class="optionview">
			
			<!-- 如果是已发货待收货则客户显示确认收货视图 -->
			<view v-if="orderinfo.status == 2 && user._id == orderinfo.creatUser ">
				
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
				
				
				<!-- 确定按钮 -->
				<view class="btnview padding-left padding-right flex align-center justify-center margin-top">
					<button class="cu-btn width50 round lg" :class="[ receiveAllFlag == '1' ? 'bg-cyan' : 'bg-red' ]" @tap.stop="confirm">{{ i18n.base.confirm }}</button>
				</view>
				
			</view>
			
		</view>
		
		<!-- 按钮区域 -->
		<view v-if="orderinfo" class="btnsview bg-white solid-top flex align-center justify-end padding">
			
			<!-- 如果是待发货则代理显示发货按钮 -->
			<!-- orderinfo.status == 1 &&  -->
			<template v-if="user._id == orderinfo.agentUser">
				
				<button class="cu-btn round bg-cyan" @tap.stop="deliveryproduct">{{ i18n.wishlist.wishorder.delivery }}</button>
				
			</template>
			
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
				
				type: 'normal', // 该页面类型 normal 为正常订单页面类型  agentpurchasepro 为代理下单页面
				
				wishId: null, // 心愿id
				wishOrderId: null, // 心愿订单id
				wishinfo: null, // 心愿详情数据
				orderinfo: null, // 心愿订单数据
				
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
			let wishOrderId = option.wishOrderId
			
			// 如果心愿订单id存在的情况下则通过wishOrderId获取心愿详情信息
			if(wishOrderId) {
				_this.ifloading = true
				const db = uniCloud.database();
				db.collection('order,wishlist')
				.doc(wishOrderId)
				.get({getOne: true})
				.then(response => {
					// 获取成功
					if(response.result.code == 0) {
						let orderinfo = response.result.data
						console.log(orderinfo);
						
						if(orderinfo) {
							_this.orderinfo = orderinfo
							let wishinfo = orderinfo.wishId[0]
							_this.wishinfo = wishinfo
							console.log(_this.wishinfo);
						}
						else {
							uni.showToast({
								title: _this.i18n.error.loaderror,
								icon: 'none'
							});
						}
						
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
			}
			
			// 如果不存在orderid但是存在wishId则进行加载详情信息(仅代理确认下单时使用)
			else if(wishId) {
				_this.wishId = wishId
				// 获取心愿详情信息
				_this.loadwishdetail()
			}
			
			// 均不存在 报错
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
								_this.initPurchaseOrderData()
							}
							
						}
					})
					.catch(error => {
						_this.ifloading = false // 结束缓冲动画
					})
				
			},
			
			// 初始化心愿订单的数据
			initPurchaseOrderData() {
				
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
				
				let totalOrderPrice = parseFloat(totalProPrice) + parseFloat(totalDomesticShippingFee) + parseFloat(totalCommissionFee)
				totalOrderPrice = totalOrderPrice.toFixed(2)
				
				let orderPriceInfo = {
					totalProPrice,
					totalAmount,
					totalDomesticShippingFee,
					unitCommissionFee,
					totalCommissionFee,
					totalOrderPrice
				}
				
				_this.orderPriceInfo = orderPriceInfo
				
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
				
				uni.showModal({
					title: _this.i18n.tip.optionconfirm,
					content: _this.i18n.wishlist.timeline.purchasetip,
					showCancel: true,
					cancelText: _this.i18n.base.cancel,
					confirmText: _this.i18n.base.confirm,
					success: res => {
						if(res.confirm) {
							// 确认进货
							
							let wishInfo = _this.wishinfo
							
							// 创建订单数据
							let data = {
								creatUser: wishInfo.creatUser._id,
								agentUser: wishInfo.agentUser._id,
								status: 1, // 设置订单为已付款状态
								wishId: wishInfo._id,
								title: wishInfo.productTitle,
								totalProPrice: _this.orderPriceInfo.totalProPrice.toString(),
								totalCommissionFee: _this.orderPriceInfo.totalCommissionFee.toString(),
								totalDomesticShippingFee: _this.orderPriceInfo.totalDomesticShippingFee.toString(),
								totalOrderPrice: _this.orderPriceInfo.totalOrderPrice.toString(),
								thirdPlatformType: _this.thirdPlatformType,
								thirdOrderNum: _this.thirdOrderNum
							}
							
							_this.ifloading = true
							const db = uniCloud.database();
							db.collection('order')
							.add(data)
							.then(response => {
								
								console.log(response.result);
								// 生成订单成功
								if(response.result.code == 0) {
									
									// 改变心愿状态为已下单待收货
									let newwishorderid = response.result.id
									
									db.collection('wishlist')
									.doc(wishInfo._id)
									.update({
										achieveFlag: 3 , // 代理已下单客户待收货
										wishOrderId: newwishorderid, // 更新心愿绑定的心愿订单号
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
											_this.delwishorderbyid(newwishorderid) // 操作失败,删除新增心愿订单
										}
									})
									.catch(error => {
										_this.ifloading = false
										uni.showToast({
											title: error.message,
											icon: 'none'
										});
										
										_this.delwishorderbyid(newwishorderid) // 操作失败,删除新增心愿订单
										
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
							
						}
					}
				});
				
			},
			
			// 代理发货
			deliveryproduct() {
				// 区分无物流发货和物流发货
				uni.showToast({
					title: '代理开始发货',
					icon: 'none'
				});
			},
			
			// 公共处理删除新增心愿订单的方法
			delwishorderbyid(orderid) {
				const db = uniCloud.database();
				db.collection('order').doc(orderid).remove()
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
					
					
					
				}
				
			},
			
			// 客户确认收货
			clientconfirmreceive() {
				
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
			
			//
			
		}
	}
</script>

<style lang="scss" scoped>
	
	.pagecontent {
		padding-bottom: 120rpx;
		.btnsview{
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			height: 100rpx;
		}
	}
	
</style>
