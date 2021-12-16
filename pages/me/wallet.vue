<template>
	<view class="pagecontent">
		
		<!-- 导航栏 -->
		<cu-custom bgColor="bg-gradual-red">
			<block slot="content">{{i18n.nav.wallet}}</block>
		</cu-custom>
		
		<!-- 钱包余额区域 -->
		<view class="balanceview flex flex-direction justify-between margin padding radius bg-gradual-red shadow-blur">
			
			<view class="flex align-center">
				<u-icon class="margin-right" name="rmb-circle-fill" color="#fbbd08" size="100"></u-icon>
				<u-count-to ref="uCountTo" start-val="0.00" :end-val="walletInfo ? walletInfo.money : '0.00' " 
							:decimals="2" separator="," :duration="2000" 
							font-size="60" color="#FFFFFF"
							:use-easing="true" :autoplay="false"
				></u-count-to>
			</view>
			
			
			<view class="bottomview flex align-center">
				
				<!-- 更新时间 -->
				<view v-if="walletInfo" class="text-xs text-white flex align-center">
					<text class="margin-right-sm">{{ `Last Operation / 最新操作:` }}</text>
					<uni-dateformat :date="walletInfo.updateTime" />
				</view>
				
			</view>
			
		</view>
		
		<view class="btnview flex align-center padding">
			
			<button class="cu-btn round cuIcon-lock round plain text-red margin-right"></button>
			
			<button class="cu-btn round bg-yellow text-white" @tap.stop="chargeWallet">{{ i18n.me.wallet.charge }}</button>
			
		</view>
		
		<view class="recordlistview padding margin">
			
			<!-- 切换选项 -->
			<u-subsection mode="subsection" :list="subsectionlist" :current="sectionIndex" active-color="#e54d42" @change="sectionChange"></u-subsection>
			
			<!-- 其他的内容视图 -->
			<unicloud-db v-slot:default="{data, loading, error, options}" collection="bill"
						:where=" `creatUid == $cloudEnv_uid && type == ${billType}` "
			>
				<view v-if="error">{{error.message}}</view>
				<view v-else-if="loading" class="cu-load loading"></view>
				<view v-else class="billview">
					
					<!-- 列表数据  前n条 -->
					<view class="listview padding margin-top-sm">
						{{ JSON.stringify(data) }}
					</view>
					
				</view>
			</unicloud-db>
			
		</view>

	</view>
</template>

<script>
	
	var _this
	
	export default {
		
		components: {
			
		},
		
		data() {
			return {
				walletInfo: null, // 钱包数据
				billType: 0, // 0 支出 1充值
				subsectionlist: null, // 分段器数据
			}
		},
		
		// 页面加载后
		onLoad() {
			_this = this
			
			// 加载钱包数据
			_this.checkWallet()
			
			_this.setSubSectionList()
			//
		},
		
		methods: {
			
			// 检测是否开通钱包
			checkWallet() {
				
				// 首先判断是否开通钱包
				const db = uniCloud.database();
				db.collection('wallet')
				.where(`uid == $cloudEnv_uid`)
				.get({getOne: true})
				.then(response => {
					if(response.result.code == 0) {
						// 有钱包数据
						if(response.result.data) {
							// 开始加载钱包数据
							_this.getWalletMoneyData()
						}
						// 没有钱包数据
						else {
							uni.showModal({
								content: '您还未开通钱包,点击确定即刻开通,后续将可直接使用钱包进行支付，各种不定时优惠现金活动等您来参与!',
								showCancel: true,
								cancelText: _this.i18n.base.cancel,
								confirmText: _this.i18n.base.confirm,
								success: res => {
									if(res.cancel) {
										uni.navigateBack();
									}
									else {
										// 开通钱包
										_this.openWallet()
									}
								}
							});
						}
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
			
			// 开通钱包
			openWallet() {
				const db = uniCloud.database();
				let walletitem = {
					updateTime: db.env.now
				}
				db.collection('wallet')
				.add(walletitem)
				.then(response => {
					if(response.result.code == 0) {
						// 开通成功
						// 加载钱包余额数据
						_this.getWalletMoneyData()
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
			
			// 加载钱包余额数据
			getWalletMoneyData() {
				const db = uniCloud.database();
				db.collection('wallet')
				.where(`uid == $cloudEnv_uid`)
				.get({getOne: true})
				.then(response => {
					if(response.result.code == 0) {
						// 获取成功
						let walletInfo = response.result.data
						_this.walletInfo = walletInfo
						// 开始滚动金额
						_this.$refs.uCountTo.start()
						console.log(walletInfo);
					}
					else {
						uni.showToast({
							title: _this.i18n.error.loaderror,
							icon: 'none'
						});
					}
				})
			},
			
			// 充值钱包余额
			chargeWallet() {
				uni.navigateTo({
					url: '/pages/makeorder/payment?type=walletcharge',
				});
			},
			
			// 设置分段器数据
			setSubSectionList() {
				
				let subsectionlist = [
					{
						name: _this.i18n.me.wallet.expense,
						type: 0
					},
					{
						name: _this.i18n.me.wallet.income,
						type: 1
					}
				]
				this.subsectionlist = subsectionlist
				
				let sectionIndex = subsectionlist.findIndex(item => item.type == this.billType)
				this.sectionIndex = sectionIndex
			},
			
			sectionChange(index) {
				this.sectionIndex = index
				this.billType = this.subsectionlist[this.sectionIndex].type
			}
			//
			
		}
	}
</script>

<style lang="scss" scoped>
	
	.pagecontent {
		
		.balanceview{
			height: 300rpx;
		}
		
	}
	
</style>
