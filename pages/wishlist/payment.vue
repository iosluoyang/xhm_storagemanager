<template>
	<view class="pagecontent paymentpage">
		
		<!-- 导航栏 -->
		<cu-custom bgColor="bg-blue">
			<block slot="content">{{ i18n.nav.payment }}</block>
		</cu-custom>
		
		<!-- 其他的内容视图 -->
		<view class="contentview">
			
			<!-- 支付方式区域 -->
			<view v-if="paymentArr && paymentArr.length > 0" class="paymentview margin-top cu-list menu card-menu">
				
				<view class="cu-item" v-for="(item, index) in paymentArr" :key="item.type" @tap.stop="paymentType = item.type">
					
					<view class="content titleleftview flex align-center">
						
						<template>
							<u-icon v-if="item.type == 'alipay'" name="zhifubao" color="#108EE9" size="50"></u-icon>
							<u-icon v-else-if="item.type == 'wechat'" name="weixin-fill" color="#07C160" size="50"></u-icon>
							<u-icon v-else="item.type == 'bankcard'" name="rmb-circle-fill" color="#e54d42" size="50"></u-icon>
						</template>
						
						<text class="text-df margin-left">{{ item.title }}</text>
						
					</view>
					
					<view class="action">
						<radio :checked="item.type == paymentType" />
					</view>
					
				</view>
				
			</view>
			
			<!-- 支付信息区域 -->
			<view v-if="selectpaymentinfo" class="payinfoview padding shadow-blur bg-white margin-top">
				
				<view class="text-bold text-xl text-center">{{ i18n.wishlist.payment.paymentinfo }}</view>
				
				<view class="cu-list menu margin-top-sm">
					
					<!-- 账号 -->
					<view v-if="selectpaymentinfo.account" class="cu-item">
						
						<view class="content">
							<view class="text-black text-bold">{{ selectpaymentinfo.account }}</view>
							<view class="text-df">{{ i18n.wishlist.payment.account }}</view>
						</view>
						
						<view class="action">
							<button class="cu-btn radius line-grey sm" @tap.stop="$basejs.copytoclipboard(selectpaymentinfo.account)">{{ i18n.base.copy }}</button>
						</view>
						
					</view>
					
					<!-- 姓名 -->
					<view v-if="selectpaymentinfo.name" class="cu-item">
						
						<view class="content">
							<view class="text-black text-bold">{{ selectpaymentinfo.name }}</view>
							<view class="text-df">{{ i18n.wishlist.payment.name }}</view>
						</view>
						
						<view class="action">
							<button class="cu-btn radius line-grey sm" @tap.stop="$basejs.copytoclipboard(selectpaymentinfo.name)">{{ i18n.base.copy }}</button>
						</view>
						
					</view>
					
					<!-- 银行名称 -->
					<view v-if="selectpaymentinfo.bankname" class="cu-item">
						
						<view class="content">
							<view class="text-black text-bold">{{ selectpaymentinfo.bankname }}</view>
							<view class="text-df">{{ i18n.wishlist.payment.bankname }}</view>
						</view>
						
						<view class="action">
							<button class="cu-btn radius line-grey sm" @tap.stop="$basejs.copytoclipboard(selectpaymentinfo.bankname)">{{ i18n.base.copy }}</button>
						</view>
						
					</view>
					
					<!-- 银行分支名称 -->
					<view v-if="selectpaymentinfo.bankbranch" class="cu-item">
						
						<view class="content">
							<view class="text-black text-bold">{{ selectpaymentinfo.bankbranch }}</view>
							<view class="text-df">{{ i18n.wishlist.payment.bankbranch }}</view>
						</view>
						
						<view class="action">
							<button class="cu-btn radius line-grey sm" @tap.stop="$basejs.copytoclipboard(selectpaymentinfo.bankbranch)">{{ i18n.base.copy }}</button>
						</view>
						
					</view>
					
				</view>
				
				<!-- 支付图片 -->
				<view v-if="selectpaymentinfo.img" class="paymentimg margin-top flex justify-center">
					<image :src="selectpaymentinfo.img" :style="{width: '400rpx', height: '400rpx'}" mode="aspectFit" @tap.stop="previewimg(selectpaymentinfo.img)"></image>
				</view>
				
			</view>
			
			<!-- 已经支付完成的信息区域 -->
			<view class="alreadypaidinfoview padding shadow-blur shadow-warp bg-white margin-top">
				
				<!-- 图片上传 -->
				<view class="cu-bar bg-white margin-top">
					<view class="action">{{i18n.base.uploadimg}}</view>
					<view class="action">{{`${imgArr.length} / ${mainpiclimitnum}`}}</view>
				</view>
				
				<view class="bg-white padding">
					<uni-file-picker ref="filepickerref" v-model="imgArr" :limit="mainpiclimitnum"
					return-type="array" :del-icon="true" :auto-upload="false" mode='grid' :disable-preview="false" file-mediatype="image" 
					@select="fileselect" @delete="filedelete" @progress="fileprogress" @success="filesuccess" @fail="filefail">
					</uni-file-picker>
				</view>
				
			</view>
			
		</view>
		
		<!-- 支付按钮 -->
		<view class="bottombtnview">
			<button class="paybtn cu-btn bg-blue text-xl" @tap.stop="confirm">
				{{ `${i18n.base.confirm}` }}
				{{ totalPrice ? `(&yen${totalPrice})` : '' }}
			</button>
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
				
				ifloading: false, // 是否正在加载中
				
				orderType: 'wishorder', // 订单类型  wishorder代表心愿订单
				orderId: null, // 订单id
				wishId: null, // 订单对应的心愿单id
				
				paymentArr: null, // 支付方式数组
				paymentType: 'bankcard', // 支付方式  alipay  wechat  bandcard
				
				totalPrice: null, // 支付金额
				
				mainpiclimitnum: 5, // 图片上传的数量限制
				imgArr: [], // 图片数组

			}
		},
		
		computed: {
			
			// 当前选中的支付方式对应的信息
			selectpaymentinfo() {
				if(this.paymentArr && this.paymentArr.length > 0) {
					let selectpaymentinfo = this.paymentArr.find(item => (item.type == this.paymentType))
					return selectpaymentinfo
				}
				return null
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
			
			let orderType = option.orderType
			if(orderType) this.orderType = orderType
			
			let orderId = option.orderId
			if(orderId){
				this.orderId = orderId
			}
			else {
				uni.showToast({
					title: _this.i18n.error.loaderror,
					icon: 'none'
				});
			}
			
			// 获取支付方式
			_this.loadPaymentData()
			
			// 获取订单信息
			_this.loadPayOrderData()
		},
		
		methods: {
			
			// 获取支付信息
			loadPaymentData() {
				
				// 初始化完成时  加载配置信息
				_this.$store.dispatch('app/setConfigData').then(response => {
					// 此时配置信息已经加载成功并且保存到本地
					
					let paymentInfo = _this.$store.getters.configData.paymentInfo
					let paymentArr = paymentInfo.paymentArr
					_this.paymentArr = paymentArr
					let defaultType = paymentInfo.defaultType
					_this.paymentType = defaultType
					
					console.log(_this.paymentArr, _this.paymentType)
					
				}).catch(error => {
					// 配置信息加载失败,提示用户
					uni.showToast({
						title: this.i18n.error.configerror,
						icon: 'none'
					});
				})
				
			},
			
			// 获取订单信息
			loadPayOrderData() {
				
				// 根据不同的订单类型选择不同的数据获取
				if(this.orderType == 'wishorder') {
					const db = uniCloud.database();
					db.collection('order')
					.doc(_this.orderId)
					.get({getOne: true})
					.then(response => {
						if(response.result.code == 0) {
							
							let totalPrice = response.result.data.totalOrderPrice
							_this.totalPrice = totalPrice
							
							let wishId = response.result.data.wishId
							_this.wishId = wishId
							
						}
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
				}
				
			},
			
			// 点击查看大图
			previewimg(img) {
				uni.previewImage({
					urls: [img]
				})
			},
			
			// 选择图片成功
			fileselect(e) {
				this.imgArr.push.apply(this.imgArr, e.tempFiles)
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
				
				// 继续提交数据
				this.uploaddata()
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
			
			// 确定按钮
			confirm() {
				
				// 开始检测上传支付凭证
				
				// 如果没有上传凭证则将页面滑动到最底部提示用户上传凭证
				if(this.imgArr.length == 0) {
					
					uni.showModal({
						content: _this.i18n.wishlist.payment.pleaseuploadpaymentimg,
						showCancel: true,
						cancelText: _this.i18n.base.cancel,
						confirmText: _this.i18n.base.confirm,
						success: res => {
							if(res.confirm) {
								// 直接提交
								_this.uploaddata()
							}
							else {
								uni.pageScrollTo({
									scrollTop: 5000,
									duration: 300
								})
							}
						}
					});
					
				}
				else {
					// 直接提交
					this.uploaddata()
				}
				
			},
			
			// 提交数据
			uploaddata() {
				
				// 检查是否需要上传图片
				if(this.imgArr.find(item => { return item.progress == 0 })) {
					// 开始上传图片
					this.ifloading = true
					this.$refs.filepickerref.upload()
					return
				}
				
				// 上传图片已经成功 此时开始提交其他数据
				let imgs = this.imgArr.map(item => (item.url)).join(',')
				
				// 开始更新数据
				const db = uniCloud.database();
				db.collection('order')
				.doc(_this.orderId)
				.update({
					payTime: db.env.now,
					status: 1,
					payType: _this.paymentType,
					payImgs: imgs
				})
				.then(response => {
					// 更新成功
					if(response.result.code == 0) {
						
						// 发送用户支付成功通知
						_this.pushnoticemsg('finishpay')
						
						// 刷新心愿详情数据和心愿订单数据
						uni.$emit('updatewishdetail')
						uni.$emit('updatewishorderdetail')
						
						// 增加用户已支付的时间轴
						db.collection('wishlisttimeline')
						.add({type: 91, wishId: _this.wishId})
						.then(response => {
							// 刷新时间轴
							uni.$emit('updatetimeline')
							
							uni.showToast({
								title: _this.i18n.tip.optionsuccess,
								icon: 'none'
							});
						})
						.catch(error => {
							console.log(error);
						})
						.finally(() => {
							
							setTimeout(function() {
								uni.navigateBack()
							}, 1000);
							
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
				
			},
			
			// 推送消息
			pushnoticemsg(msgtype) {
				
				uniCloud.callFunction({
					name: 'base',
					data: {
						type: 'sendwxmsg',
						info: {
							msgtype: msgtype,
							orderId: _this.orderId
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
			
			//
			
		}
	}
</script>

<style lang="scss" scoped>
	
	page,.pagecontent {
		
		height: 100%;
		background-color: #F7F7F7;
		
		.contentview{
			padding-bottom: 100rpx;
		}
		
		.bottombtnview{
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			height: 100rpx;
			line-height: 100rpx;
			
			.paybtn{
				width: 100%;
				height: 100%;
			}
		}
		
	}
	
</style>
