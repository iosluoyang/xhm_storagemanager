<template>
	<view class="pagecontent wishorderpage">
		
		<!-- 导航栏 -->
		<cu-custom bgColor="bg-cyan">
			<block slot="content">{{ i18n.nav.wishorder }}</block>
		</cu-custom>
		
		<!-- 内容视图 -->
		<view v-if="wishinfo && orderinfo" class="contentview padding-sm">
			
			<!-- 收货地址 -->
			<view v-if="false" class="addressview shadow-warp bg-white padding flex">
				
				<view class="iconview margin-right">
					<text class="cuIcon cuIcon-deliver_fill text-blue u-font-40"></text>
				</view>
				
				<view class="addresscontentview">
					<view class="contactview text-lg flex align-center">
						<view class="text-black text-bold">{{ `收货人` }}</view>
						<view class="text-black margin-left">{{ `18818881888` }}</view>
					</view>
					<view class="addressview margin-top-sm text-wrap">
						{{ `详细地址详细地址详细地址详细地址详细地址详细地址详细地址` }}
					</view>
				</view>
				
				<view class="shippingview">
					
				</view>
				
			</view>
			
			<!-- 商品清单 -->
			<view class="proudctview padding solid margin-top-sm">
				
				<view class="iconview flex align-center">
					<text class="cuIcon cuIcon-goodsfill text-orange u-font-40 margin-right"></text>
					<text class="text-black text-bold">{{ i18n.wishlist.wishorder.purchaseinfo }}</text>
				</view>
				
				<view class="productlistview margin-top-sm">
					
					<view class="firstattrview" v-for="(firstitem, index) in wishinfo.specPropInfo.propValList" :key="index">
						
						<view class="secondattrview" v-for="(seconditem, secondindex) in firstitem.specStockList" :key="secondindex">
							
							<view v-if="seconditem.amount > 0" class="eachproduct flex align-center solid-bottom padding-sm">
								
								<image :src="firstitem.img ? (Array.isArray(firstitem.img) ? firstitem.img[0] : firstitem.img) : '/static/publicicon/logo.png'" mode="aspectFill" :style="{width: '100rpx', height: '100rpx'}"></image>
								
								<view class="productinfoview" :style="{width: 'calc(100% - 100rpx - 30rpx)', marginLeft: '30rpx'}">
									<view class="topview flex justify-between">
										
										<view class="text-df text-black text-wrap t_twoline" :style="{maxWidth: '300rpx'}">
											{{ wishinfo.productTitle }}
										</view>
										
										<view class="text-black text-df margin-left">
											{{ `x ${seconditem.amount}` }}
										</view>
										
									</view>
									
									<view class="bottomview margin-top-sm flex align-center justify-between">
										
										<view class="specview text-grey text-sm">
											{{ `${firstitem.propVal}-${seconditem.propVal}` }}
										</view>
										
										<view class="priceview text-red text-price">
											{{ `${seconditem.price}` }}
										</view>
										
									</view>
								</view>
								
							</view>
							
						</view>
						
					</view>
					
				</view>
				
				<view class="productsummaryview margin-top-sm flex justify-end align-center">
					
					<text class="text-df text-black">{{ i18n.wishlist.wishorder.totalproprice }}:</text>
					<text class="margin-left-sm text-bold text-xl text-red text-price">{{ orderinfo.totalProPrice }}</text>
					
				</view>
				
			</view>
			
			<!-- 订单信息 -->
			<view class="orderinfoview padding solid margin-top-sm">
				
				<view class="iconview flex align-center">
					<text class="cuIcon cuIcon-infofill text-cyan u-font-40 margin-right"></text>
					<text class="text-black text-bold">{{ i18n.wishlist.wishorder.orderinfo }}</text>
				</view>
				
				<view class="basicorderinfoview cu-list menu margin-top-sm">
					
					<!-- 商品总价 -->
					<view class="cu-item">
						<view class="content">
							<text class="cuIcon-goodsfill text-orange"></text>
							<text class="text-grey text-df">{{ i18n.wishlist.wishorder.totalproprice }}</text>
						</view>
						<view class="action">
							<text class="text-price text-black text-df">{{ orderinfo.totalProPrice }}</text>
						</view>
					</view>
					
					<!-- 国内总运费 -->
					<view class="cu-item">
						<view class="content">
							<text class="cuIcon-deliver_fill text-green"></text>
							<text class="text-grey text-df">{{ i18n.wishlist.wishorder.totaldomesticshippingfee }}</text>
						</view>
						<view class="action">
							<text class="text-price text-black text-df">{{ orderinfo.totalDomesticShippingFee }}</text>
						</view>
					</view>
					
					<!-- 总服务费 -->
					<view class="cu-item">
						<view class="content">
							<text class="cuIcon-servicefill text-blue"></text>
							<text class="text-grey text-df">{{ i18n.wishlist.wishorder.totalcommissionfee }}</text>
						</view>
						<view class="action">
							<text class="text-price text-black text-df">{{ orderinfo.totalCommissionFee }}</text>
						</view>
					</view>
					
					<!-- 订单总价 -->
					<view class="cu-item">
						<view class="content">
							<text class="cuIcon-moneybagfill text-red"></text>
							<text class="text-grey text-df">{{ i18n.wishlist.wishorder.totalorderprice }}</text>
						</view>
						<view class="action">
							<text class="text-price text-red text-df">{{ orderinfo.totalOrderPrice }}</text>
						</view>
					</view>
					
					<!-- 第三方平台类型 仅自身代理可见 -->
					<view v-if="user._id == orderinfo.agentUser" class="cu-item">
						<view class="content">
							<text class="text-grey text-df">*{{ i18n.wishlist.common.thirdplatformtype }}</text>
						</view>
						<view class="action">
							<text class="text-grey text-sm">{{ orderinfo.thirdPlatformType }}</text>
						</view>
					</view>
					
					<!-- 第三方平台订单号  仅自身代理可见 -->
					<view v-if="user._id == orderinfo.agentUser" class="cu-item">
						<view class="content">
							<text class="text-grey text-df">*{{ i18n.wishlist.common.thirdplatformordernum }}</text>
						</view>
						<view v-if="orderinfo.thirdOrderNum" class="action">
							<text class="text-grey text-sm">{{ orderinfo.thirdOrderNum }}</text>
							<button class="margin-left cu-btn radius line-grey sm" @tap.stop="$basejs.copytoclipboard(orderinfo.thirdOrderNum)">{{ i18n.base.copy }}</button>
						</view>
					</view>
					
					<!-- 支付方式 -->
					<view class="cu-item">
						<view class="content">
							<text class="text-grey text-df">{{ i18n.wishlist.wishorder.paytype }}</text>
						</view>
						<view class="action">
							<text class="text-grey text-sm">{{ orderinfo.payType == 'alipay' ? '支付宝/AliPay' : orderinfo.payType == 'wechatpay' ? '微信/WechatPay' : orderinfo.payType == 'bankcard' ? '银行卡/BankCard' : '未知/Unknown' }}</text>
						</view>
					</view>
					
					<!-- 下单时间 -->
					<view class="cu-item">
						<view class="content">
							<text class="text-grey text-df">{{ i18n.wishlist.wishorder.makeordertime }}</text>
						</view>
						<view class="action">
							<uni-dateformat class="text-grey text-sm" :date="orderinfo.creatTime" format="yyyy-MM-dd hh:mm:ss" />
						</view>
					</view>
					
					<!-- 付款时间 -->
					<view v-if="orderinfo.payTime" class="cu-item">
						<view class="content">
							<text class="text-grey text-df">{{ i18n.wishlist.wishorder.paytime }}</text>
						</view>
						<view class="action">
							<uni-dateformat class="text-grey text-sm" :date="orderinfo.payTime" format="yyyy-MM-dd hh:mm:ss" />
						</view>
					</view>
					
					<!-- 发货时间 仅自身代理可见 -->
					<view v-if="user._id == orderinfo.agentUser && orderinfo.deliveryTime" class="cu-item">
						<view class="content">
							<text class="text-grey text-df">*{{ i18n.wishlist.wishorder.deliverytime }}</text>
						</view>
						<view class="action">
							<uni-dateformat class="text-grey text-sm" :date="orderinfo.deliveryTime" format="yyyy-MM-dd hh:mm:ss" />
						</view>
					</view>
					
					<!-- 收货时间 -->
					<view v-if="orderinfo.receiveTime" class="cu-item">
						<view class="content">
							<text class="text-grey text-df">{{ i18n.wishlist.wishorder.receivetime }}</text>
						</view>
						<view class="action">
							<uni-dateformat class="text-grey text-sm" :date="orderinfo.receiveTime" format="yyyy-MM-dd hh:mm:ss" />
						</view>
					</view>
					
				</view>
				
			</view>
			
		</view>
		
		<!-- 按钮区域 -->
		<view v-if="orderinfo && wishinfo" class="btnsview shadow-blur bg-white solid-top flex align-center justify-end padding">
			
			<!-- 供应商视角 -->
			<template v-if="user._id == orderinfo.creatUser">
				
				<!-- 如果是待付款订单 -->
				<template v-if="orderinfo.status == 0">
					<button class="optionbtn cu-btn round bg-red" @tap.stop="paynow">{{ i18n.base.paynow }}</button>
				</template>
				
				<!-- 如果是待收货订单 -->
				<template v-if="orderinfo.status == 2">
					<button class="cu-btn round bg-cyan" @tap.stop="clientstarttoconfirmreceive">{{ i18n.wishlist.wishorder.receive }}</button>
				</template>
				
			</template>
			
			<!-- 代理员视角 -->
			<template v-if="user._id == orderinfo.agentUser">
				
				<!-- 如果是待发货显示发货按钮 -->
				<template v-if="orderinfo.status == 1">
					<button class="cu-btn round bg-cyan" @tap.stop="agentstartdeliverypro">{{ i18n.wishlist.wishorder.delivery }}</button>
				</template>
				
			</template>
			
		</view>
		
		<!-- 加载条 -->
		<loading :loadModal="ifloading"></loading>
		
		<!-- 弹出框 -->
		<u-popup v-model="ifshowpopup" mode="bottom" safe-area-inset-bottom border-radius="30" height="auto" z-index="700">
			
			<view class="showcontentview">
				
				<!-- 代理下单 -->
				<template v-if="popuptype == 'agentpurchase'">
					
					<!-- 第三方订单号和下单图片 -->
					<view class="width100 padding">
						
						<u-field class="round"
								style="background-color: #F5F5F5;"
								v-model="thirdOrderNum" :placeholder="i18n.wishlist.wishorder.pleaseinputthirdordernum"
								:border-bottom="false" label-width="0"
								clear-size="45"
						>
							<button slot="right" class="cu-btn round bg-cyan shadow" @tap.stop="pastefromclipboard('thirdOrderNum')">{{i18n.base.paste}}</button>
							
						</u-field>
					
						<view class="bg-white padding">
							<uni-file-picker ref="filepickerref" v-model="imgArr" :limit="1"
							return-type="array" :del-icon="true" :auto-upload="false" mode='grid' :disable-preview="false" file-mediatype="image" 
							@select="fileselect" @delete="filedelete" @progress="fileprogress" @success="filesuccess" @fail="filefail">
							</uni-file-picker>
						</view>
						
					</view>
					
					<button class="cu-btn block width100 bg-cyan" :style="{height: '100rpx'}" :disabled="!thirdOrderNum" @tap.stop="agentpurchasepro">
						{{ i18n.base.confirm }}
					</button>
					
				</template>
				
				<!-- 代理发货 -->
				<template v-if="popuptype == 'agentdelivery'">
					
					<!-- 发货的内容 -->
					<view class="width100 padding">
						
						<view class="deliverytypeview flex align-center justify-between padding-sm text-center">
							
							<view class="text-wrap radius padding-sm" :class="[ deliveryType == 0 ? 'bg-grey text-bold' : 'solid' ]" :style="{width: '40%'}" @tap.stop="deliveryType = 0">{{ i18n.wishlist.wishorder.havenotrackingnum }}</view>
							<view class="text-wrap radius padding-sm" :class="[ deliveryType == 1 ? 'bg-cyan text-bold' : 'solid' ]" :style="{width: '40%'}" @tap.stop="deliveryType = 1">{{ i18n.wishlist.wishorder.havetrackingnum }}</view>
							
						</view>
						
						<scroll-view scroll-y :style="{maxHeight: '800rpx'}">
							
							<template v-if="deliveryType == 1">
								
								<view class="margin-top-sm">
									
									<u-field class="round"
											style="background-color: #F5F5F5;"
											v-model="domesticShippingName" :placeholder="i18n.wishlist.wishorder.pleaseinputshippingname"
											:border-bottom="false" label-width="0"
											clear-size="45"
									>
										<button slot="right" class="cu-btn round bg-cyan shadow" @tap.stop="pastefromclipboard('domesticShippingName')">{{i18n.base.paste}}</button>
										
									</u-field>
									
								</view>
								
								<view class="margin-top-sm">
									
									<u-field class="round"
											style="background-color: #F5F5F5;"
											v-model="domesticShippingNum" :placeholder="i18n.wishlist.wishorder.pleaseinputshippingnum"
											:border-bottom="false" label-width="0"
											clear-size="45"
									>
										<button slot="right" class="cu-btn round bg-cyan shadow" @tap.stop="pastefromclipboard('domesticShippingNum')">{{i18n.base.paste}}</button>
										
									</u-field>
									
								</view>
								
							</template>
							
							<!-- 备注内容 -->
							<view class="remarkview margin-top-sm padding solid">
								<textarea class="width100" auto-height maxlength="-1" :show-confirm-bar="false" disable-default-padding :cursor-spacing="100" v-model="remark" :placeholder="i18n.wishlist.common.remark" placeholder-style="fontSize: 12px;" />
							</view>
							
							<!-- 上传图片 -->
							<view class="bg-white padding">
								<uni-file-picker ref="filepickerref" v-model="imgArr" :limit="9"
								return-type="array" :del-icon="true" :auto-upload="false" mode='grid' :disable-preview="false" file-mediatype="image" 
								@select="fileselect" @delete="filedelete" @progress="fileprogress" @success="filesuccess" @fail="filefail">
								</uni-file-picker>
							</view>
							
						</scroll-view>
						
					</view>
					
					<button class="cu-btn block width100 bg-cyan" :style="{height: '100rpx'}" @tap.stop="agentdeliverypro">
						{{ i18n.base.confirm }}
					</button>
					
				</template>
				
				<!-- 客户收货 -->
				<template v-if="popuptype == 'customerreceive'">
					
					<!-- 收货的内容 -->
					<view class="width100 padding">
						
						<view class="receivetypeview flex align-center justify-between padding-sm text-center">
							
							<view class="text-wrap radius padding-sm" :class="[ receiveType == 1 ? 'bg-grey text-bold' : 'solid' ]" :style="{width: '40%'}" @tap.stop="receiveType = 1">{{ i18n.wishlist.wishorder.receiveparts }}</view>
							<view class="text-wrap radius padding-sm" :class="[ receiveType == 2 ? 'bg-cyan text-bold' : 'solid' ]" :style="{width: '40%'}" @tap.stop="receiveType = 2">{{ i18n.wishlist.wishorder.receiveall }}</view>
							
						</view>
						
						<view class="tipview flex align-center bg-white margin-bottom-sm">
							
							<text class="cuIcon cuIcon-infofill text-orange"></text>
							<text class="text-sm text-wrap">{{ receiveType == 1 ? i18n.wishlist.wishorder.receiveparttip : i18n.wishlist.wishorder.receivealltip }}</text>
							
						</view>
						
						<scroll-view scroll-y :style="{maxHeight: '800rpx'}">
							
							<!-- 部分收货信息 -->
							<view v-if="orderinfo && orderinfo.receiveType == 1 && (orderinfo.receiveInfo.remarks || orderinfo.receiveInfo.imgs) " class="receivepartsview solids padding-sm shadow-blur">
								
								<view v-if="orderinfo.receiveInfo.remark" class="cu-tag bg-gray round" @longpress="$basejs.copytoclipboard(orderinfo.receiveInfo.remark)">
									{{ orderinfo.receiveInfo.remark }}
								</view>
								
								<view v-if="orderinfo.receiveInfo.imgs" class="bg-white padding-sm">
									<view class="grid col-4 grid-square">
										<view class="bg-img" v-for="(img,index) in orderinfo.receiveInfo.imgs.split(',')" :key="index" :style="[{ backgroundImage:'url(' + img + ')' }]" @tap.stop="previewImgs(orderinfo.receiveInfo.imgs, index)"></view>
									</view>
								</view>
								
							</view>
							
							<!-- 备注内容 -->
							<view class="remarkview margin-top-sm padding solid">
								<textarea class="width100" auto-height maxlength="-1" :show-confirm-bar="false" disable-default-padding :cursor-spacing="100" v-model="remark" :placeholder="i18n.wishlist.common.remark" placeholder-style="fontSize: 12px;" />
							</view>
							
							<!-- 上传图片 -->
							<view class="bg-white padding">
								<uni-file-picker ref="filepickerref" v-model="imgArr" :limit="9"
								return-type="array" :del-icon="true" :auto-upload="false" mode='grid' :disable-preview="false" file-mediatype="image" 
								@select="fileselect" @delete="filedelete" @progress="fileprogress" @success="filesuccess" @fail="filefail">
								</uni-file-picker>
							</view>
							
						</scroll-view>
						
					</view>
					
					<button class="cu-btn block width100 bg-cyan" :style="{height: '100rpx'}" @tap.stop="clientconfirmreceive">
						{{ i18n.base.confirm }}
					</button>
					
				</template>
				
			</view>
			
		</u-popup>
		
	</view>
</template>

<script>
	
	var _this
	
	export default {
		
		components: {
			
		},
		
		data() {
			return {
				ifloading: false, // 是否正在加载
				
				wishId: null, // 心愿id
				wishOrderId: null, // 心愿订单id
				
				wishinfo: null, // 心愿详情数据
				orderinfo: null, // 心愿订单数据
				
				receiveType: 2, // 收货状态 0未收货  1部分收货  2全部收到货 默认为2
				receiveproductcontent: "", // 部分收货信息内容
				remark: '', // 备注内容
				
				thirdOrderNum: '', // 第三方订单号
				deliveryType: 1, // 发货方式 0无物流发货  1有物流发货  默认为1
				domesticShippingName: '', // 国内物流名称
				domesticShippingNum: '', // 国内物流编号
				
				imgArr: [], // 图片数组
				
				popuptype: '', // 弹框显示内容类型 
				ifshowpopup: false, // 是否显示弹框
				
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
			
			let wishOrderId = option.wishOrderId
			
			// 如果心愿订单id存在的情况下加载数据
			if(wishOrderId) {
				_this.wishOrderId = wishOrderId
				_this.loaddata()
			}
			
			// 不存在 报错
			else {
				uni.showToast({
					title: _this.i18n.error.loaderror,
					icon: 'none'
				});
			}
			
			uni.$on('updatewishorderdetail', function() {
				_this.loaddata()
			})
			
		},
		
		onUnload() {
			uni.$off('updatewishorderdetail')
		},
		
		methods: {
			
			// 加载订单详情数据
			loaddata() {
				
				_this.ifloading = true
				const db = uniCloud.database();
				db.collection('order,wishlist')
				.doc(_this.wishOrderId)
				.get({getOne: true})
				.then(response => {
					console.log(response);
					// 获取成功
					if(response.result.code == 0) {
						let orderinfo = response.result.data
						if(orderinfo) {
							_this.orderinfo = orderinfo
							
							let wishinfo = orderinfo.wishId[0]
							_this.wishinfo = wishinfo
							_this.wishId = wishinfo._id
							
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
					console.log(error);
					uni.showToast({
						title: _this.i18n.error.loaderror,
						icon: 'none'
					});
				})
				.finally(() => {
					_this.ifloading = false
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
						console.log(content);
						if(content) {
							_this[datatype] = content
						}
					}
				})
			},
			
			// 选择图片成功
			fileselect(e) {
				this.imgArr.push.apply(this.imgArr, e.tempFiles)
				// this.imgArr =  this.imgArr.concat(e.tempFiles)
				console.log(`选择图片成功`);
			},
			
			// 图片删除
			filedelete(e) {
				let deleteIndex = this.imgArr.findIndex(item => {
					return e.tempFilePath == item.path
				})
				if(deleteIndex > -1) {
					this.imgArr.splice(deleteIndex,1)
				}
			},
			
			// 图片上传
			fileprogress(e) {
				console.log(`上传图片中`);
				console.log(e);
			},
			
			// 上传图片成功
			filesuccess(e) {
				console.log(`上传图片成功,`);
				console.log(e);
				
				this.ifloading = false
				// 弹出框类型为agentpurchase
				if(this.popuptype == 'agentpurchase') {
					// 继续代理下单操作
					this.agentpurchasepro()
				}
				// 弹出框类型为agentdelivery
				else if(this.popuptype == 'agentdelivery') {
					this.agentdeliverypro()
				}
				// 弹出框类型为customerreceive
				else if(this.popuptype == 'customerreceive') {
					this.clientconfirmreceive()
				}
				// 其他
				else {
					uni.showToast({
						title: this.i18n.tip.addsuccess,
						icon: 'none'
					});
				}
				
			},
			
			// 上传图片失败
			filefail(e) {
				// 上传图片失败
				console.log(`上传图片失败`);
				console.log(e);
				
				this.ifloading = false
				uni.showToast({
					title: this.i18n.error.uploaderror,
					icon: 'none'
				});
			},
			
			// 客户立即支付
			paynow() {
				
				let orderId = this.orderinfo._id
				uni.navigateTo({
					url: `/pages/wishlist/payment?orderType=wishorder&orderId=${orderId}`
				});
				
			},
			
			// 代理开始下单操作
			agentstartpurchasepro() {
				
				this.popuptype = 'agentpurchase'
				this.ifshowpopup = true
				
			},
			
			// 代理下单
			agentpurchasepro() {
				
				// 校验订单号
				if(!_this.thirdOrderNum) {
					uni.showToast({
						title: _this.i18n.wishlist.wishorder.pleaseinputthirdordernum,
						icon: 'none'
					});
					return
				}
				
				// 开始上传
				// 检查是否需要上传图片
				if(_this.imgArr.find(item => { return item.progress == 0 })) {
					// 开始上传图片
					_this.ifloading = true
					_this.$refs.filepickerref.upload()
					return
				}
				
				// 上传图片已经成功 此时开始提交其他数据
				let imgs = _this.imgArr.map(item => (item.url)).join(',')
				
				let wishInfo = _this.wishinfo
				
				_this.ifloading = true
				
				const db = uniCloud.database();
				db.collection('order')
				.doc(_this.orderinfo._id)
				.update({
					thirdOrderNum: _this.thirdOrderNum, // 第三方订单号
					thirdOrderImgs: imgs, // 第三方订单图片
				})
				.then(response => {
					// 操作成功
					_this.ifloading = false
					if(response.result.code == 0) {
						uni.showToast({
							title: _this.i18n.tip.optionsuccess,
							icon: 'none'
						});
						
						_this.imgArr = []
						
						setTimeout(function(){
							// 发送推送消息  给用户发送下单通知
							_this.pushnoticemsg('purchaseorder')
							_this.loaddata() // 刷新数据
						}, 1000)
						
						// 添加下单成功的时间轴
						db.collection('wishlisttimeline')
						.add({type: 92, wishId: _this.wishId})
						.then(response => {
							if(response.result.code == 0) {
								// 添加成功
								uni.$emit('wishtimeline')
							}
							else {
								console.log(response.result.message);
							}
						})
						.catch(error => {
							console.log(error);
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
				.finally(() => {
					_this.ifshowpopup = false
				})
				
			},
			
			// 代理开始发货操作
			agentstartdeliverypro() {
				
				// 校验是否有第三方订单号 如果没有则执行代理下单
				if(!this.orderinfo.thirdOrderNum) {
					this.agentstartpurchasepro()
					return
				}
				
				_this.popuptype = 'agentdelivery'
				_this.ifshowpopup = true
				
			},
			
			// 代理发货
			agentdeliverypro() {
				
				// 开始上传
				// 检查是否需要上传图片
				if(_this.imgArr.find(item => { return item.progress == 0 })) {
					// 开始上传图片
					_this.ifloading = true
					_this.$refs.filepickerref.upload()
					return
				}
				
				// 上传图片已经成功 此时开始提交其他数据
				let imgs = _this.imgArr.map(item => (item.url)).join(',')
				
				// 更改订单状态为已发货, 更改物流方式
				const db = uniCloud.database();
				_this.ifloading = true
				db.collection('order')
				.doc(_this.wishOrderId)
				.update({
					status: 2,
					deliveryTime: db.env.now,
					deliveryType: _this.deliveryType,
					deliveryInfo: {
						domesticShippingName: _this.domesticShippingName,
						domesticShippingNum: _this.domesticShippingNum,
						remark: _this.remark,
						imgs: imgs
					}
				})
				.then(response => {
					_this.ifloading = false
					if(response.result.code == 0) {
						// 更改成功
						
						// 更改对应的心愿为已发货待收货状态
						let wishId = _this.wishId
						db.collection('wishlist')
						.doc(wishId)
						.update({
							achieveFlag: 3
						})
						.then(response => {
							
							uni.showToast({
								title: _this.i18n.tip.optionsuccess,
								icon: 'none'
							});
							_this.imgArr = []
							_this.remark = ''
							setTimeout(function() {
								_this.loaddata()
								uni.$emit('updatewishlist')
								uni.$emit('updatewishdetail')
							}, 1000);
							
						})
						.catch(error => {
							console.log(error);
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
					_this.ifloading = false
					uni.showToast({
						title: _this.i18n.error.optionerror,
						icon: 'none'
					});
				})
				.finally(() => {
					_this.ifshowpopup = false
				})
				
			},
			
			// 客户开始确认收货
			clientstarttoconfirmreceive() {
				
				// 判断当前订单收货信息是否为部分收货
				if(this.orderinfo.receiveType == 1) {
					this.receiveType = 1
				}
				
				_this.popuptype = 'customerreceive'
				_this.ifshowpopup = true
				
			},
			
			// 客户收货
			clientconfirmreceive() {
				
				// 开始上传
				// 检查是否需要上传图片
				if(_this.imgArr.find(item => { return item.progress == 0 })) {
					// 开始上传图片
					_this.ifloading = true
					_this.$refs.filepickerref.upload()
					return
				}
				
				// 上传图片已经成功 此时开始提交其他数据
				let imgs = _this.imgArr.map(item => (item.url)).join(',')
				
				// 如果是全部收货
				if(this.receiveType == 2) {
					
					const db = uniCloud.database();
					
					db.collection('order')
					.doc(_this.wishOrderId)
					.update({
						status: 3,
						receiveTime: db.env.now,
						receiveType: 2,
						receiveInfo: {
							remark: _this.remark,
							imgs: imgs
						}
						
					})
					.then(response => {
						
						if(response.result.code == 0) {
							
							_this.ifshowpopup = false
							_this.imgsArr = []
							
							// 更新订单成功
							_this.loaddata()
							
							uni.showToast({
								title: _this.i18n.tip.optionsuccess,
								icon: 'none'
							});
							
							// 更改对应的心愿状态
							db.collection('wishlist')
							.doc(_this.wishId)
							.update({achieveFlag: 4})
							.then(response => {
								// 更改状态成功
								
								// 更新心愿单列表和详情
								uni.$emit('updatewishlist')
								uni.$emit('updatewishdetail')
								
								// 增加时间轴信息
								// 增加一条已完成的时间轴
								db.collection('wishlisttimeline')
								.add({type: 6, wishId: _this.wishId})
								.then(response => {
									// 增加时间轴成功
									
									// 更新列表 详情和时间轴
									// 更新数据
									uni.$emit('updatetimeline')
									
								})
								.catch(error => {
									console.log(error);
								})
							})
							.catch(error => {
								console.log(error);
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
				
				// 部分收货
				else if(this.receiveType == 1) {
					
					const db = uniCloud.database();
					
					db.collection('order')
					.doc(_this.wishOrderId)
					.update({
						receiveTime: db.env.now,
						receiveType: 1,
						receiveInfo: {
							remark: _this.remark,
							imgs: imgs
						}
						
					})
					.then(response => {
						
						if(response.result.code == 0) {
							
							_this.ifshowpopup = false
							_this.imgsArr = []
							
							// 更新订单成功
							_this.loaddata()
							
							uni.showToast({
								title: _this.i18n.tip.optionsuccess,
								icon: 'none'
							});

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
				
			},
			
			// 推送消息
			pushnoticemsg(msgtype) {
				
				uniCloud.callFunction({
					name: 'base',
					data: {
						type: 'sendwxmsg',
						info: {
							msgtype: msgtype,
							orderId: _this.orderinfo._id
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
				
				
			},
			
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
