<template>
	<view class="pagecontent paymentpage">
		
		<!-- 导航栏 -->
		<cu-custom bgColor="bg-blue">
			<block slot="content">{{ i18n.nav.payment }}</block>
		</cu-custom>
		
		<!-- 其他的内容视图 -->
		<view class="contentview">
			
			<!-- 支付方式区域 -->
			<view v-if="paymentArr" class="paymentview margin-top cu-list menu card-menu">
				
				<view class="cu-item" v-for="(item, index) in paymentArr" :key="item.type" @tap.stop="paymentType = item.type">
					
					<view class="content titleleftview flex align-center">
						
						<template>
							<u-icon v-if="item.type == 'alipay'" name="zhifubao" color="#108EE9" size="50"></u-icon>
							<u-icon v-else-if="item.type == 'wechat'" name="weixin-fill" color="#07C160" size="50"></u-icon>
							<u-icon v-else-if="item.type == 'bankcard'" name="grid" color="#9c26b0" size="50"></u-icon>
							<u-icon v-else-if="item.type == 'balance'" name="rmb-circle-fill" color="#e54d42" size="50"></u-icon>
						</template>
						
						<text class="text-df margin-left">{{ item.title }}</text>
						
					</view>
					
					<view class="action">
						<radio :checked="item.type == paymentType" :disabled=" type == 'walletcharge' && Number(totalPrice) > Number(walletMoney) " />
					</view>
					
				</view>
				
			</view>
			
			<!-- 支付凭证上传区域 仅余额充值类型时展示 用于上传充值凭证 -->
			<view class="alreadypaidinfoview radius margin padding shadow-blur bg-white">
				
				<!-- 图片上传 -->
				<view class="cu-bar bg-white">
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
		<view v-if="totalPrice" class="bottombtnview">
			<button class="paybtn cu-btn bg-blue text-xl" @tap.stop="confirm" :disabled="!totalPrice">
				{{ `&yen${totalPrice}` }}
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
				type: 'makeorder', // 收银台类型  makeorder为订单支付  walletcharge为钱包充值  默认为订单支付
				walletMoney: '', // 用户钱包余额
				
				orderId: null, // 订单id
				orderInfo: null, // 订单信息
				
				paymentArr: null, // 支付方式数组
				paymentType: 'balance', // 支付方式 balance  alipay  wechat  bandcard
				
				totalPrice: '', // 支付金额
				
				mainpiclimitnum: 5, // 图片上传的数量限制
				imgArr: [], // 图片数组

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
			// 页面类型
			let type = option.type
			if(type) {
				_this.type = type
			}
			
			// 根据收银台类型选择加载不同的数据
			
			// 支付订单类型
			if(_this.type == 'makeorder') {
				
				let orderId = option.orderId
				if(orderId){
					this.orderId = orderId
					// 获取订单支付信息
					_this.loadPayOrderData()
				}
				else {
					uni.showToast({
						title: _this.i18n.error.loaderror,
						icon: 'none'
					});
				}
			}
			
			// 钱包充值类型
			else if(_this.type == 'walletcharge') {
				
				let totalPrice = option.totalPrice
				// 如果是钱包充值则赋值支付价格
				if(totalPrice) {
					_this.totalPrice = totalPrice
				}
				else {
					uni.showToast({
						title: _this.i18n.error.loaderror,
						icon: 'none'
					});
				}
				
			}
			
			else {
				uni.showToast({
					title: _this.i18n.error.loaderror,
					icon: 'none'
				});
			}
			
			// 获取支付方式
			_this.loadPaymentData()
			
		},
		
		methods: {
			
			// 获取支付信息
			loadPaymentData() {
				
				_this.ifloading = true
				// 初始化完成时  加载配置信息
				_this.$store.dispatch('app/setConfigData').then(response => {
					// 此时配置信息已经加载成功并且保存到本地
					
					let paymentInfo = _this.$store.getters.configData.paymentInfo
					let paymentArr = paymentInfo.paymentArr
					let defaultType = paymentInfo.defaultType
					
					// 筛选支付方式数组
					// 如果为钱包充值 则过滤掉余额支付的方式
					if(_this.type == 'walletcharge') {
						paymentArr = paymentArr.filter(item => (item.type !== 'balance'))
						defaultType = defaultType == 'balance' ? paymentArr[0].type : defaultType
					}
					else {
						// 有余额支付方式  获取钱包余额
						const db = uniCloud.database();
						db.collection('wallet')
						.where(`uid == $cloudEnv_uid`)
						.field('money')
						.get({getOne: true})
						.then(response => {
							if(response.result.code == 0) {
								let walletMoney = response.result.data.money
								this.walletMoney = walletMoney
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
					// 其余的根据正常的支付信息来设置
					_this.paymentArr = paymentArr
					_this.paymentType = defaultType
					
					console.log(_this.paymentArr, _this.paymentType)
					
				}).catch(error => {
					// 配置信息加载失败,提示用户
					uni.showToast({
						title: this.i18n.error.configerror,
						icon: 'none'
					});
				})
				.finally(() => {
					_this.ifloading = false
				})
				
			},
			
			// 获取订单信息
			loadPayOrderData() {
				
				const db = uniCloud.database();
				db.collection('order')
				.doc(_this.orderId)
				.get({getOne: true})
				.then(response => {
					if(response.result.code == 0) {
						
						let orderInfo = response.result.data
						_this.orderInfo = orderInfo
						let totalMoney = orderInfo.totalOrderPrice
						_this.totalMoney = totalMoney
						
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
				
				// 根据不同的收银台类型选择不同的校验标准
				if(this.type == 'walletcharge') {
					// 校验转账凭证
					
					// 如果没有上传凭证则将页面滑动到最底部提示用户上传凭证
					if(this.imgArr.length == 0) {
						uni.showToast({
							title: _this.i18n.me.wallet.paymentimgtip,
							icon: 'none'
						});
						return
					}
					// 有了支付凭证 开始充值
					else {
						// 开始
						_this.ifloading = true
						_this.$refs.filepickerref.upload()
					}
					
				}
				else {
					_this.uploaddata()
				}
				
			},
			
			// 提交数据
			uploaddata() {
				
				// 根据不同的收银台类型选择不同的数据修改
				
				// 钱包余额充值
				if(this.type == 'walletcharge') {
					
					// 上传图片已经成功 此时开始提交其他数据
					let imgs = this.imgArr.map(item => (item.url)).join(',')
					
					let billitem = {
						status: 0, // 账单待确认状态
						type: 1, // 充值类型
						price: _this.totalPrice, // 充值金额
						billType: 2, // 2为用户主动充值
						imgs: imgs, // 凭证图片
					}
					const db = uniCloud.database();
					db.collection('bill')
					.add(billitem)
					.then(response => {
						if(response.result.code == 0) {
							// 操作成功
							uni.showToast({
								title: _this.i18n.tip.optionsuccess,
								icon: 'none'
							});
							uni.$emit('updatebillrecord') // 刷新账单记录数据
							uni.navigateBack();
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
				
				// 正常订单支付
				else if(this.type == 'makeorder') {
					
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
							
							uni.showToast({
								title: _this.i18n.tips.optionsuccess,
								icon: 'none'
							});
							
							// 发送用户支付成功通知
							_this.pushnoticemsg('finishpay')
							uni.$emit('updatewishorderdetail')
							
							// 如果订单有心愿id则添加对应的时间轴数据
							if(_this.orderInfo.wishId) {
								// 刷新心愿详情数据和心愿订单数据
								// uni.$emit('updatewishlist')
								// uni.$emit('updatewishdetail')
								
								// 增加用户已支付的时间轴
								db.collection('wish-timeline')
								.add({type: 7, wishId: _this.orderInfo.wishId})
								.then(response => {
									// 刷新时间轴
									uni.$emit('updatetimeline')
								})
								.catch(error => {
									console.log(error);
								})
								
							}
							
							setTimeout(function() {
								uni.navigateBack()
							}, 1000);
					
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
