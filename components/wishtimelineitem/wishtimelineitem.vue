<template>
	<view v-if="timelineitem" class="wishtimelineitem" :class=" [ ifDisappear ? ' animation-fade animation-reverse' : ''] ">
		
		<!-- 心愿开始类型  type=0 -->
		<view v-if="timelineitem.type == 0" class="content bg-pink shadow-blur">
			<uni-dateformat :date="timelineitem.creatTime" format="yyyy/MM/dd hh:mm:ss" />
			<text class="margin-left">{{ i18n.wishlist.timeline.startsign }}</text>
		</view>
		
		<!-- 心愿单普通时间轴类型  type=1 -->
		<!-- 参见下方v-else内容 -->
		
		<!-- 心愿单编辑类型  type=2 -->
		<view v-else-if="timelineitem.type == 2" class="content bg-gradual-red shadow-blur">
			<text class="cuIcon cuIcon-edit text-white margin-right"></text>
			<uni-dateformat :date="timelineitem.creatTime" format="yyyy/MM/dd hh:mm:ss" />
			<text class="block margin-top-sm">{{ `"  ${timelineitem.creatUser ? timelineitem.creatUser.nickname : ''}  " ${i18n.base.edit}${i18n.wishlist.timeline.wishtitle}` }}</text>
		</view>
		
		<!-- 心愿单关联代理人类型  type=90 -->
		<view v-else-if="timelineitem.type == 90" class="content bg-gradual-blue shadow-blur">
			<!-- 时间轴发布人信息 -->
			<view v-if="timelineitem.creatUser" class="flex align-center justify-between">
				<view class="leftview flex align-center">
					<image class="cu-avatar round margin-right-sm" :src="timelineitem.creatUser.avatar" mode="aspectFill"></image>
					<view class="flex flex-direction">
						<text class="text-df">{{ timelineitem.creatUser.nickname }}</text>
						<uni-dateformat class="commenttime text-sm text-gray" :date="timelineitem.creatTime" />
					</view>
				</view>
			</view>
			
			<!-- 文本内容 -->
			<view class="margin-top-sm t_wrap">
				{{ i18n.wishlist.timeline.wishagentbindtip }}
			</view>
		</view>
		
		<!-- 心愿单待确认类型 type=3 -->
		<view v-else-if="timelineitem.type == 3 " class="content bg-orange shadow-blur shadow-blur">
			
			<!-- 发布人 -->
			<view v-if="timelineitem.creatUser" class="flex align-center justify-between">
				<view class="leftview flex align-center">
					<image class="cu-avatar round margin-right-sm" :src="timelineitem.creatUser.avatar" mode="aspectFill"></image>
					<view class="flex flex-direction">
						<text class="text-df text-black">{{ timelineitem.creatUser.nickname }}</text>
						<uni-dateformat class="commenttime text-sm text-gray" :date="timelineitem.creatTime" />
					</view>
				</view>
			</view>
			
			<!-- 文本内容 -->
			<view class="margin-top-sm t_wrap text-white">
				{{ i18n.wishlist.timeline.wishupdatequotationtip }}
			</view>
			
			<!-- 价格 -->
			<view v-if="timelineitem.price" class="priceview margin-top-sm flex align-center">
				<text class="cuIcon cuIcon-moneybagfill text-red"></text>
				<text class="text-white text-bold text-xl margin-left-sm"> RMB {{ timelineitem.price }}</text>
			</view>
			
			<!-- 按钮操作区域   -->
			<view v-if="wishInfo.creatUser._id == user._id " class="btnview margin-top-sm flex align-center solid-top padding-top-sm">
				
				<button class="cu-btn round text-white" :style="{background: '#8799a3'}" @tap.stop="refusetimeline(timelineitem)">{{ i18n.base.refuse }}</button>
				<button class="cu-btn round text-white margin-left" :style="{background: '#8dc63f'}" @tap.stop="agreetimeline(timelineitem)">{{ i18n.base.agree }}</button>
				
			</view>
			
		</view>
		
		<!-- 心愿单同意类型 type=4 -->
		<view v-else-if="timelineitem.type == 4 " class="content bg-cyan shadow-blur">
			
			<!-- 发布人 -->
			<view v-if="timelineitem.creatUser" class="flex align-center justify-between">
				<view class="leftview flex align-center">
					<image class="cu-avatar round margin-right-sm" :src="timelineitem.creatUser.avatar" mode="aspectFill"></image>
					<view class="flex flex-direction">
						<text class="text-df text-black">{{ timelineitem.creatUser.nickname }}</text>
						<uni-dateformat class="commenttime text-sm text-gray" :date="timelineitem.creatTime" />
					</view>
				</view>
			</view>
			
			<!-- 文本内容 -->
			<view class="margin-top-sm t_wrap">
				{{ user.role == 'PRODUCT_AGENT' ? i18n.wishlist.timeline.wishconfirmquotationagenttip : i18n.wishlist.timeline.wishconfirmquotationcustomertip }}
			</view>
			
			<!-- 总价 -->
			<view v-if="timelineitem.price" class="priceview margin-top-sm flex align-center">
				
				<text class="cuIcon cuIcon-moneybagfill text-red"></text>
				<text class="text-red text-xl margin-left-sm"> RMB {{ timelineitem.price }}</text>
				
			</view>
			
			<!-- 同意区域 -->
			<view class="agreeview margin-left-sm margin-top-sm padding-sm solid">
				
				<!-- 同意人 -->
				<view class="agreeUserview flex align-center">
					<view class="leftview flex align-center">
						<image class="cu-avatar round sm" :src="timelineitem.optionUser.avatar" mode="aspectFill"></image>
						<view class="flex margin-left-sm flex-direction text-sm">
							<text class="usernameview text-black text-sm">{{ timelineitem.optionUser.nickname }}</text>
							<uni-dateformat class="optiontime text-sm text-gray" :date="timelineitem.optionTime" />
						</view>
					</view>
				</view>
				
				<view class="text-black text-bold margin-top-sm">{{ i18n.wishlist.timeline.agreequotation }}</view>
				
			</view>
			
		</view>
		
		<!-- 心愿单拒绝类型 type=5 -->
		<view v-else-if="timelineitem.type == 5 " class="content bg-gray shadow-blur">
			
			<!-- 发布人 -->
			<view v-if="timelineitem.creatUser" class="flex align-center justify-between">
				<view class="leftview flex align-center">
					<image class="cu-avatar round margin-right-sm" :src="timelineitem.creatUser.avatar" mode="aspectFill"></image>
					<view class="flex flex-direction">
						<text class="text-df">{{ timelineitem.creatUser.nickname }}</text>
						<uni-dateformat class="commenttime text-sm text-gray" :date="timelineitem.creatTime" />
					</view>
				</view>
			</view>
			
			<!-- 文本内容 -->
			<view class="margin-top-sm t_wrap">
				{{ user.role == 'PRODUCT_AGENT' ? i18n.wishlist.timeline.wishrefusequotationagenttip : i18n.wishlist.timeline.wishrefusequotationcustomertip }}
			</view>
			
			<!-- 总价 -->
			<view v-if="timelineitem.price" class="priceview margin-top-sm flex align-center">
				
				<text class="cuIcon cuIcon-moneybagfill text-red"></text>
				<text class="text-gray text-xl margin-left-sm" style="text-decoration: line-through;"> RMB {{ timelineitem.price }}</text>
				
			</view>
			
			<!-- 拒绝区域 -->
			<view class="refuseview margin-left-sm margin-top-sm padding-sm solid">
				
				<!-- 拒绝人 -->
				<view class="refuseUserview flex align-center">
					<view class="leftview flex align-center">
						<image class="cu-avatar round sm" :src="timelineitem.optionUser.avatar" mode="aspectFill"></image>
						<view class="flex margin-left-sm flex-direction text-sm">
							<text class="usernameview text-black text-sm text-cut">{{ timelineitem.optionUser.nickname }}</text>
							<uni-dateformat class="optiontime text-sm text-black" :date="timelineitem.optionTime" />
						</view>
					</view>
				</view>
				
				<view class="text-black text-bold margin-top-sm">{{ i18n.wishlist.timeline.refusequotation }}</view>
			
			</view>
			
		</view>
		
		<!-- 心愿单用户支付完成类型 type=91 -->
		<view v-else-if="timelineitem.type == 91" class="content bg-blue shadow-blur">
			
			<!-- 时间轴发布人信息 -->
			<view v-if="timelineitem.creatUser" class="flex align-center justify-between">
				<view class="leftview flex align-center">
					<image class="cu-avatar round margin-right-sm" :src="timelineitem.creatUser.avatar" mode="aspectFill"></image>
					<view class="flex flex-direction">
						<text class="text-df">{{ timelineitem.creatUser.nickname }}</text>
						<uni-dateformat class="commenttime text-sm text-gray" :date="timelineitem.creatTime" />
					</view>
				</view>
			</view>
			
			<!-- 文本内容 -->
			<view class="margin-top-sm t_wrap">
				{{ i18n.wishlist.timeline.wishfinishpay }}
			</view>
			
			<!-- 操作区域 查看订单按钮 当该心愿有心愿订单id时显示 -->
			<!-- <view class="optionbtnview margin-top-sm">
				
				<button v-if="wishInfo.wishOrderInfo && wishInfo.wishOrderId" class="cu-btn round margin-right" :style="{backgroundColor: '#ffffff'}" @tap.stop="checkwishorder">{{ i18n.wishlist.wishorder.checkwishorder }}</button>
				
			</view> -->
			
		</view>
		
		<!-- 心愿单代理人已经下单类型 type=92 -->
		<view v-else-if="timelineitem.type == 92" class="content bg-gradual-blue shadow-blur">
			
			<!-- 时间轴发布人信息 -->
			<view v-if="timelineitem.creatUser" class="flex align-center justify-between">
				<view class="leftview flex align-center">
					<image class="cu-avatar round margin-right-sm" :src="timelineitem.creatUser.avatar" mode="aspectFill"></image>
					<view class="flex flex-direction">
						<text class="text-df">{{ timelineitem.creatUser.nickname }}</text>
						<uni-dateformat class="commenttime text-sm text-gray" :date="timelineitem.creatTime" />
					</view>
				</view>
			</view>
			
			<!-- 文本内容 -->
			<view class="margin-top-sm t_wrap">
				{{ i18n.wishlist.timeline.wishfinishpurchase }}
			</view>
			
			<!-- 操作区域 查看订单按钮 当该心愿有心愿订单id时显示 -->
			<!-- <view class="optionbtnview margin-top-sm">
				
				<button v-if="wishInfo.wishOrderInfo && wishInfo.wishOrderId" class="cu-btn round margin-right" :style="{backgroundColor: '#ffffff'}" @tap.stop="checkwishorder">{{ i18n.wishlist.wishorder.checkwishorder }}</button>
				
			</view> -->
			
		</view>
		
		<!-- 心愿单完成类型 type=6 -->
		<view v-else-if="timelineitem.type == 6" class="content bg-green shadow-blur">
			<uni-dateformat :date="timelineitem.creatTime" format="yyyy/MM/dd hh:mm:ss" />
			<text class="margin-left">{{ i18n.wishlist.timeline.finishsign }}</text>
		</view>
		
		<!-- 普通时间轴内容 -->
		<view v-else class="content">
			
			<!-- 时间轴发布人信息 -->
			<view v-if="timelineitem.creatUser" class="flex align-center justify-between">
				<view class="leftview flex align-center">
					<image class="cu-avatar round margin-right-sm" :src="timelineitem.creatUser.avatar" mode="aspectFill"></image>
					<view class="flex flex-direction">
						<text class="text-df">{{ timelineitem.creatUser.nickname }}</text>
						<uni-dateformat class="commenttime text-sm text-gray" :date="timelineitem.creatTime" />
					</view>
				</view>
			</view>
			
			<!-- 文本内容 -->
			<view v-if="timelineitem.content" class="margin-top-sm t_wrap">
				{{timelineitem.content}}
			</view>
			
			<!-- 图片 -->
			<view v-if="timelineitem.imgs" class="imgsview bg-white margin-top-sm padding">
				
				<view class="grid col-3 grid-square">
					<view class="bg-img" v-for="(img,index) in timelineitem.imgs.split(',')" :key="index" :style="[{ backgroundImage:'url(' + img + ')' }]" @tap.stop="previewImgs(timelineitem.imgs, index)"></view>
				</view>
				
			</view>
			
			<!-- 价格 -->
			<view v-if="timelineitem.price" class="priceview margin-top-sm flex align-center">
				
				<text class="cuIcon cuIcon-moneybagfill text-red"></text>
				<text class="text-red text-xl margin-left-sm">{{ `${timelineitem.moneyType === 'RMB' ? '¥' : timelineitem.moneyType === 'THB' ? '฿' : ''}${timelineitem.price}` }}</text>
				
			</view>
			
			<!-- 链接 -->
			<view v-if="timelineitem.link" class="linkview flex align-center margin-top-sm">
				
				<text class="cuIcon cuIcon-link text-green"></text>
				<text class="text-sm text-gray margin-left-sm">{{ timelineitem.link }}</text>
				<!-- 复制按钮 -->
				<!-- #ifndef H5 -->
				<button class="cu-btn bg-cyan shadow sm margin-left" style="flex-shrink: 0;" @tap.stop="$basejs.copytoclipboard(timelineitem.link)">{{i18n.base.copy}}</button>
				<!-- #endif -->
				
			</view>
			
			<!-- 编辑记录区域 -->
			<view v-if="timelineitem.editTime" class="editoptionview padding-top-sm solid-top text-wrap text-sm text-gray padding-left-sm padding-right-sm">
				<uni-dateformat :date="timelineitem.editTime" format="MM/dd hh:mm:ss" />
				<text class="margin-left">{{ `"${timelineitem.editUser ? timelineitem.editUser.nickname : ''}"${i18n.base.edit}` }}</text>
			</view>
			
			<!-- 按钮操作区域 该心愿为进行中或者待确认时显示 -->
			<view v-if="user._id == timelineitem.creatUser._id && (wishInfo.achieveFlag == 0 || wishInfo.achieveFlag == 1)" class="btnsview margin-top-sm solid-top padding-top-sm flex align-center">
				
				<button class="cu-btn cuIcon-delete text-red round bg-white" @tap.stop="deletetimeline"></button>
				<button class="cu-btn cuIcon-edit round bg-white margin-left-sm" @tap.stop="edittimeline"></button>
				<!-- #ifdef MP -->
				<button class="cu-btn cuIcon-share round bg-white margin-left-sm" @tap.stop="sharetimeline"></button>
				<!-- #endif -->
				
			</view>
			
		</view>
		
	</view>
</template>

<script>
	
	var _this
	
	export default {
		
		options: {
			styleIsolation: 'apply-shared',
			addGlobalClass: true,
		},
		
		name:"wishtimelineitem",
		
		props: {
			timelineInfo: {
				type: Object,
				default: null
			},
			
			wishInfo: {
				type: Object,
				default: null
			},
		},
		
		data() {
			return {
				timelineitem: this.timelineInfo, // 当前的时间轴数据
				ifDisappear: false, // 是否消失
			};
		},
		
		watch: {
			
			// 深度监听时间轴数据变更
			timelineInfo: {
				handler(newValue, oldValue) {
					this.timelineitem = newValue
				},
				deep: true
			}
		},
		
		created() {
			_this = this
		},
		
		methods: {
			
			// 查看原图
			previewImgs(imgsStr,index) {
				uni.previewImage({
					current:index,
					urls: imgsStr.split(',')
				})
			},
			
			// 删除时间轴
			deletetimeline() {
				
				const _this = this
				
				uni.showModal({
					content: _this.i18n.tip.deleteconfirm,
					showCancel: true,
					cancelText: _this.i18n.base.cancel,
					confirmText: _this.i18n.base.confirm,
					success: res => {
						if(res.confirm) {
							// 开始删除
							const db = uniCloud.database();
							db.collection('wishlisttimeline')
							.doc(_this.timelineitem._id)
							.remove()
							.then(response => {
								// 删除成功
								_this.ifDisappear = true
								setTimeout(function() {
									_this.timelineitem = null
									
									// 删除成功
									uni.showToast({
										title: _this.i18n.tip.deletesuccess,
										icon: 'none'
									});
									
								}, 500);
								
							})
							.catch(error => {
								// 删除失败
								console.log(error.message);
								uni.showToast({
									title: _this.i18n.error.optionerror,
									icon: 'none'
								});
								
							})

						}
					},
				})
				
			},
			
			// 编辑时间轴
			edittimeline() {
				uni.navigateTo({
					url: `/pages/wishlist/handletimeline?wishId=${this.timelineitem.wishId}&timelineId=${this.timelineitem._id}&type=edit`
				});
			},
			
			// 分享时间轴
			sharetimeline() {
				this.$emit('sharetimeline', this.timelineitem)
			},
			
			// 拒绝时间轴报价单
			refusetimeline(timelineitem) {
				
				uni.showModal({
					content: _this.i18n.tip.optionconfirm,
					showCancel: true,
					cancelText: _this.i18n.base.cancel,
					confirmText: _this.i18n.base.confirm,
					success: res => {
						if(res.confirm) {
							
							uni.showLoading()
							
							const db = uniCloud.database();
							db.collection('wishlist').doc(timelineitem.wishId).update({achieveFlag: 0})
							.then(response => {
								// 拒绝成功  回退当前心愿为进行中
								uni.hideLoading()
								// 发送推送消息
								this.pushnoticemsg('refusequotation')
								
								uni.showLoading()
								//将当前时间轴数据变更状态
								db.collection('wishlisttimeline')
								.doc(timelineitem._id)
								.update({type: 5,  optionTime: db.env.now, optionUser: db.env.uid})
								.then(response => {
									// 操作成功
									uni.hideLoading()
								})
								.catch(error => {
									uni.hideLoading()
									uni.showToast({
										title: error.message,
										icon: 'none'
									});
								})
								
								// 更新数据
								uni.$emit('updatetimeline')
								// 更新心愿单列表和详情
								uni.$emit('updatewishlist')
								uni.$emit('updatewishdetail')

							})
							.catch(error => {
								uni.hideLoading()
								uni.showToast({
									title: error.message,
									icon: 'none'
								});
							})
							
						}
					},
				})
				
			},
			
			// 同意时间轴报价单
			agreetimeline(timelineitem) {
				
				uni.showModal({
					content: _this.i18n.tip.optionconfirm,
					showCancel: true,
					cancelText: _this.i18n.base.cancel,
					confirmText: _this.i18n.base.confirm,
					success: res => {
						if(res.confirm) {
							
							const db = uniCloud.database();
							
							// 生成待支付的心愿订单
							let productExt = _this.wishInfo.productExt
							
							let data = {
								creatUser: _this.user._id, // 操作人
								agentUser: _this.wishInfo.agentUser._id, // 代理人
								status: 0, // 待付款
								wishId: _this.wishInfo._id, // 订单关联的心愿id
								title: _this.wishInfo.productTitle, // 订单标题
								totalProPrice: productExt.proPrice, // 订单商品总价
								totalCommissionFee: productExt.commissionFee, // 订单总服务费
								totalDomesticShippingFee: productExt.domesticShippingFee, // 订单总运费
								totalOrderPrice: productExt.totalPrice, // 订单总价
							}
							
							uni.showLoading()
							
							db.collection('order').add(data).then(response => {
								uni.hideLoading()
								
								// 生成订单成功
								if(response.result.code == 0) {
									
									// 更新心愿单的值
									uni.showLoading()
									let wishOrderId = response.result.id
									db.collection('wishlist')
									.doc(_this.wishInfo._id)
									.update({achieveFlag: 2, wishOrderId: wishOrderId})
									.then(response => {
										// 同意成功 
										uni.hideLoading()
										// 发送推送消息
										_this.pushnoticemsg('agreequotation')
										
										//将当前时间轴数据变更状态
										uni.showLoading()
										db.collection('wishlisttimeline')
										.doc(timelineitem._id)
										.update({type: 4, optionTime: db.env.now, optionUser: db.env.uid})
										.then(response => {
											// 操作成功
											uni.hideLoading()
											
											// 更新数据
											uni.$emit('updatetimeline')
											
											// 用户订阅消息
											_this.subscribenoticemsg()
										})
										.catch(error => {
											uni.hideLoading()
											uni.showToast({
												title: error.message,
												icon: 'none'
											});
										})
										
										// 更新心愿单列表和详情
										uni.$emit('updatewishlist')
										uni.$emit('updatewishdetail')
										
									})
									.catch(error => {
										uni.hideLoading()
										uni.showToast({
											title: error.message,
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
							}).catch(error => {
								uni.hideLoading()
								uni.showToast({
									title: error.message,
									icon: 'none'
								});
							})
							
						}
					},
				})
				
			},
			
			// 查看心愿订单
			checkwishorder() {
				
				let wishOrderId = this.wishInfo.wishOrderId
				uni.navigateTo({
					url: `/pages/wishlist/wishorder?wishOrderId=${wishOrderId}`
				});
				
			},
			
			// 支付
			paynow() {
				let wishOrderId = this.wishInfo.wishOrderId
				uni.navigateTo({
					url: `/pages/wishlist/payment?orderType=wishorder&orderId=${wishOrderId}`
				});
			},
			
			// 商家收货
			confirmproductreceive() {
				// 跳转收货页面
				uni.navigateTo({
					url: `/pages/wishlist/wishorder?type=clientconfirmreceive&wishId=${_this.wishInfo._id}`
				});
			},
			
			// 订阅消息
			subscribenoticemsg() {
				
				// 开始获取订阅
				// #ifdef MP-WEIXIN
				
				// 增加订阅模板消息的功能
				let purchaseorderId = this.$store.getters.configData.wxminiNoticeTemplateDic.purchaseorder
				let deliveryorderId = this.$store.getters.configData.wxminiNoticeTemplateDic.deliveryorder
				
				uni.requestSubscribeMessage({
					tmplIds: [purchaseorderId,deliveryorderId],
					success(res){
						let errMsg = res.errMsg
						console.log(errMsg);
						if(errMsg == 'requestSubscribeMessage:ok') {
							console.log(res[purchaseorderId]);
							// 用户同意订阅
							if(res[purchaseorderId] == 'accept') {
								console.log(`用户订阅消息成功`);
							} else if(res[purchaseorderId] == 'reject') {
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
						console.log(`订阅消息接口完成`);
					}
				})
				
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
							wishId: _this.wishInfo._id
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
			
		},
	}
</script>

<style lang="scss" scoped>



</style>
