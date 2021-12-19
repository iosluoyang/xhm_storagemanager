<template>
	<view class="pagecontent bgf5">
		
		<!-- 导航栏 -->
		<cu-custom bgColor="bg-gradual-red">
			<block slot="content">{{i18n.nav.wallet}}</block>
		</cu-custom>
		
		<!-- 钱包余额区域 -->
		<view class="balanceview margin padding radius bg-gradual-red shadow-blur">
			
			<!-- 开通了钱包 显示余额数据 -->
			<view v-if="walletInfo" class="walletview flex flex-direction justify-between height100">
				
				<view class="topview flex align-center justify-between">
					
					<view class="leftview flex0 flex flex-direction align-center margin-right">
						<u-icon name="rmb-circle-fill" color="#fbbd08" size="100"></u-icon>
					</view>
					
					<view class="rightview flex1 flex align-end justify-between">
						
						<u-count-to ref="uCountTo" start-val="0" :end-val="walletInfo ? walletInfo.money : '0' "
									:decimals="2" separator="," :duration="1000" 
									font-size="60" bold color="#FFFFFF"
									:use-easing="true" :autoplay="false"
						></u-count-to>
						
						<button v-if="bottomType == 'record'" class="margin-left-sm cu-btn sm round bg-yellow text-white" @tap.stop="chargeWallet">{{ i18n.me.wallet.charge }}</button>
						
					</view>
					
				</view>
				
				<view class="bottomview flex align-center justify-between">
					
					<!-- 更新时间 -->
					<view class="text-xs text-white flex align-center">
						<uni-dateformat :date="walletInfo.updateTime" />
					</view>
					
					<!-- 操作按钮 -->
					<view class="flex align-center justify-end text-xl">
						<text v-if="bottomType == 'record'" class="cuIcon cuIcon-settingsfill text-white" @tap.stop="clicksetting"></text>
					</view>
					
				</view>
				
			</view>
			
			<!-- 未开通钱包 -->
			<view v-else class="nowalletview flex align-center justify-center margin">
				<button class="cu-btn round lg bg-yellow text-white text-bold" @tap.stop="startToOpenWallet">{{ i18n.me.wallet.openwallet }}</button>
			</view>
			
		</view>
		
		<!-- 底部区域  根据是充值还是钱包普通页面选择渲染不同的组件 -->
		<template>
			
			<!-- 消费充值记录区域 -->
			<view v-if=" bottomType == 'record' && walletInfo " class="recordlistview padding margin">
				
				<!-- 切换选项 -->
				<u-subsection mode="button" :list="subsectionlist" :current="sectionIndex" active-color="#e54d42" @change="sectionChange"></u-subsection>
				
				<!-- 其他的内容视图 -->
				<unicloud-db  v-slot:default="{data, loading, error, options}" collection="bill"
							ref="udb"
							:where=" `creatUid == $cloudEnv_uid && type == ${billType}` "
							orderby="creatTime desc"
							:page-size="5" page-data="replace"
				>
					<view v-if="error">{{error.message}}</view>
					<view v-else-if="loading" class="cu-load loading"></view>
					<view v-else class="billview" style="max-height: 600rpx;overflow: auto;">
						
						<view class="cu-list menu margin-top-sm">
							<view v-if="data && data.length > 4" class="titleview flex align-center justify-end padding-sm">
								<view class="checkallbtn text-gray" @tap.stop="checkAllBillRecord">
									{{ i18n.base.checkall }}
									<text class="text-df cuIcon-right"></text>
								</view>
							</view>
							<view class="cu-item arrow" v-for="(item, index) in data" :key="item._id" @tap.stop="checkBillDetail(item)">
								<view class="content">
									<view class="topview">
										<text class="text-bold margin-right-sm" :class="[ item.type == 0 ? 'cuIcon-move text-green' : 'cuIcon-add text-red']"></text>
										<text class="text-price text-bold text-xl" :class="[ item.type == 0 ? 'text-green' : 'text-red' ]">{{ item.price }}</text>
										
										<!-- 待确认状态下有该值 -->
										<view v-if="item.status == 0" class="text-sm">
											<text class="cuIcon cuIcon-infofill text-grey margin-left">{{ i18n.me.wallet.waittoconfirm }}</text>
										</view>
									</view>
									<view class="bottomview text-grey text-sm">
										<uni-dateformat :date="item.creatTime" />
									</view>
								</view>
								<view class="action">
									
								</view>
							</view>
						</view>
						
					</view>
				</unicloud-db>
				
			</view>
			
			<!-- 充值区域 -->
			<view v-if="bottomType == 'charge' && chargePackages " class="chargeview">
				
				<swiper class="card-swiper round-dot" :indicator-dots="true" :circular="true"
				 :autoplay="false" interval="5000" duration="500" @change="(index) => swiperCur=index" indicator-color="#8799a3"
				 indicator-active-color="#e54d42">
					<swiper-item v-for="(item,index) in chargePackages" :key="index" :class="swiperCur==index?'cur':''" @tap.stop="selectPackageType = item.type">
						<view class="swiper-item pos-relative">
							
							<view :class="[ 'bg-img flex align-center', item.colorItem.bgColorClass ]" :style="{height: '414rpx', backgroundImage: `url(${item.bgImg})`}" >
								
								<view class="padding-xl text-white">
									<view class="padding-xs text-xxl text-bold" :class="[item.colorItem.textColorClass]">
										{{ `&yen ${item.price}` }}
										<text v-if="item.extraPrice" class="margin-left-sm text-xl">{{ `+ ${item.extraPrice}` }}</text>
									</view>
									<view class="padding-xs text-lg">
										{{ item.desc }}
									</view>
								</view>
								
							</view>
							
							<view class="text-sl pos-absolute" style="top: 10rpx;right: 30rpx;">
								<text class="cuIcon text-white" :class="[ selectPackageType == item.type ? 'cuIcon-roundcheckfill' : 'cuIcon-round' ]"></text>
							</view>
							
						</view>
					</swiper-item>
				</swiper>
				
				<view class="cu-bar btn-group padding-sm" :style="{position: 'fixed', bottom: 0, left: 0, right: 0}">
					
					<button class="cu-btn bg-grey lg" @tap.stop="bottomType = 'record' ">{{ i18n.base.cancel }}</button>
					
					<button class="cu-btn bg-gradual-red shadow-blur lg" @tap.stop="startToCharge">
						{{ i18n.base.confirm }}
						<text class="text-bold text-sm">{{ showSelectPackagePrice() }}</text>
					</button>
					
				</view>
				
			</view>
			
		</template>
		
		<!-- 设置支付密码 -->
		<u-keyboard
			default=""
			ref="uKeyboard" 
			mode="number" 
			:mask="true" 
			:mask-close-able="false"
			:dot-enabled="false" 
			v-model="keyboardShow"
			:safe-area-inset-bottom="true"
			:tooltip="false"
			:show-tips="false"
			:cancel-text="i18n.base.cancel"
			:confirm-text="i18n.base.confirm"
			@change="keyboardOnChange"
			@backspace="keyboardOnBackspace">
			<view>
				
				<!-- 上方内容区域 -->
				<view class="topview padding">
					
					<view class="toolsview flex align-center justify-between padding-left padding-right">
						<text class="text-grey text-df" @tap.stop="keyboardCancel">{{ i18n.base.cancel }}</text>
						<text class="text-black text-df text-bold">{{ i18n.base.confirm }}</text>
					</view>
					
					<view class="text-center margin-top-sm">
						<text class="text-bold text-black text-df">{{ paykeyboardtipstr }}</text>
					</view>
					
				</view>
				
				<view class="flex justify-center margin-bottom-sm">
					<u-message-input 
						mode="box" 
						:maxlength="passwordMaxLength"
						:dot-fill="true"
						v-model="payPassword"
						:disabled-keyboard="true"
						@finish="typePayPasswordFinish"
					></u-message-input>
				</view>
			</view>
		</u-keyboard>
		
	</view>
</template>

<script>
	
	import md5Libs from "uview-ui/libs/function/md5";
	
	var colorList = [
		{
			bgColorClass: 'bg-red',
			colorClass: 'text-white',
		},
		{
			bgColorClass: 'bg-orange',
			colorClass: 'text-white',
		},
		{
			bgColorClass: 'bg-olive',
			colorClass: 'text-white',
		},
		{
			bgColorClass: 'bg-blue',
			colorClass: 'text-white',
		},
		{
			bgColorClass: 'bg-purple',
			colorClass: 'text-white',
		},
		{
			bgColorClass: 'bg-mauve',
			colorClass: 'text-white',
		},
		{
			bgColorClass: 'bg-brown',
			colorClass: 'text-white',
		}
	]
	
	var _this
	
	export default {
		
		components: {
			
		},
		
		data() {
			return {
				
				walletInfo: null, // 钱包数据  为null 代表暂未开通钱包
				
				bottomType: 'record', // 底部区域类型  record代表明细,charge代表充值
				
				billType: 0, // 0 支出 1充值
				subsectionlist: null, // 分段器数据
				
				swiperCur: 0, // 充值包的swiper索引
				chargePackages: null, // 充值包数组
				selectPackageType: null, // 选择充值包的类型
				
				keyboardShow: false, // 支付键盘是否显示  默认为否
				passwordMaxLength: 6, // 支付密码长度
				payPassword: '', // 支付密码
				
				settingType: '', // 设置钱包类型 changepwd为修改支付密码 closewallet为注销钱包
				inputType: 'verifypwd', // 输入类型 verifypwd为验证支付密码类型  openwallet为开通钱包类型 settingnewpwd为设置新的支付密码
				inputStep: 1, // 输入步骤   默认为1
				tmpPassword: '', // 临时支付密码变量  用于两次输入的对比
				
			}
		},
		
		computed: {
			
			// 支付键盘提示文字
			paykeyboardtipstr() {
				
				if(_this.inputStep == 1) {
					if(_this.inputType == 'settingnewpwd') {
						return _this.i18n.me.wallet.pleasetyenewpaypassword
					}
					else {
						return _this.i18n.me.wallet.pleasetypepaypassword
					}
				}
				else {
					return _this.i18n.me.wallet.pleasetypepaypasswordagain
				}
				
			}
		},
		
		// 页面加载后
		onLoad() {
			
			_this = this
			
			// 加载钱包数据
			_this.getWalletData()
			
			// 设置账单明细数据
			_this.setSubSectionList()
			
			// 设置充值包数据
			_this.setChargePackges()
			
			uni.$on('updatebillrecord', function() {
				_this.$refs.udb.refresh() // 刷新账单数据
			})
			
		},
		
		onUnload() {
			uni.$off('updatebillrecord')
		},
		
		methods: {
			
			// 开始开通钱包
			startToOpenWallet() {
				this.payPassword = ''
				this.tmpPassword = ''
				this.inputType = 'openwallet'
				this.inputStep = 1
				this.keyboardShow = true
			},
			
			// 开通钱包
			openWallet() {
				
				const db = uniCloud.database();
				let walletdata = {
					payPassword: md5Libs.md5(_this.payPassword)
				}
				db.collection('wallet')
				.add(walletdata)
				.then(response => {
					if(response.result.code == 0) {
						// 开通成功
						uni.showToast({
							title: _this.i18n.tip.addsuccess,
							icon: 'none'
						});
						// 加载钱包数据
						_this.getWalletData()
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
			
			// 加载钱包数据
			getWalletData() {
				const db = uniCloud.database();
				db.collection('wallet')
				.where(`uid == $cloudEnv_uid`)
				.get({getOne: true})
				.then(response => {
					if(response.result.code == 0) {
						// 有开通钱包数据
						if(response.result.data) {
							// 获取成功
							let walletInfo = response.result.data
							_this.walletInfo = walletInfo
							// 开始滚动金额
							_this.$nextTick(function(){
								_this.$refs.uCountTo.start()
							})
						}
						// 未开通钱包数据 提示进行开通
						else {
							uni.showModal({
								content: _this.i18n.me.wallet.openwallettip,
								showCancel: true,
								cancelText: _this.i18n.base.cancel,
								confirmText: _this.i18n.base.confirm,
								success: res => {
									if(res.confirm) {
										// 开始开通钱包
										_this.startToOpenWallet()
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
			},
			
			// 充值钱包余额
			chargeWallet() {
				this.setChargePackges() // 设置充值数据
				this.bottomType = 'charge'
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
			},
			
			// 查看全部账单记录
			checkAllBillRecord() {
				let billType = this.billType
				console.log(billType);
				uni.navigateTo({
					url: `/pages/me/billrecord?billType=${billType}`
				});
			},
			
			// 查看账单详情
			checkBillDetail(item) {
				let billId = item._id
				uni.navigateTo({
					url: `/pages/me/billrecorddetail?id=${billId}`
				});
			},
			
			// 设置充值包数据
			setChargePackges() {
				
				let configData = this.$store.getters.configData
				console.log(configData);
				if(configData && configData.chargePackagesInfo) {
					
					let chargePackages = configData.chargePackagesInfo.packages
					chargePackages.forEach(item => {
						let randomIndex = _this.$u.random(0, colorList.length - 1)
						item.colorItem = colorList[randomIndex]
					})
					let defaultSelectType = configData.chargePackagesInfo.defaultType
					
					this.chargePackages = chargePackages
					this.swiperCur = chargePackages.findIndex(item => (item.type == defaultSelectType))
					this.selectPackageType = defaultSelectType
					
				}
			},
			
			// 显示选中的充值包价格
			showSelectPackagePrice() {
				let selectPackage = this.chargePackages.find(item => item.type == _this.selectPackageType)
				return selectPackage ? `(${selectPackage.price})` : ''
			},
			
			// 开始充值
			startToCharge() {
				
				this.bottomType = 'record'
				let selectPackage = this.chargePackages.find(item => item.type == _this.selectPackageType)
				let price = selectPackage.price
				uni.navigateTo({
					url: `/pages/makeorder/payment?type=walletcharge&totalPrice=${price}`
				});
				
			},
			
			// 点击钱包的设置按钮
			clicksetting() {
				let itemList = [
					_this.i18n.me.wallet.changepaypassword,
					_this.i18n.me.wallet.closewallet,
				]
				uni.showActionSheet({
					itemList: itemList,
					success: res => {
						let tapIndex = res.tapIndex
						
						// 开始修改支付密码
						if(tapIndex == 0) {
							_this.startToChangePayPassword()
						}
						// 开始注销钱包
						else if(tapIndex == 1) {
							_this.startToCloseWallet()
						}
					}
				});
			},
			
			// 开始修改支付密码
			startToChangePayPassword() {
				
				this.payPassword = ''
				this.tmpPassword = ''
				this.settingType = 'changepwd'
				this.inputType = 'verifypwd'
				this.inputStep = 1
				this.keyboardShow = true
				
			},
			
			// 修改支付密码
			changePayPassword() {
				
				uni.showLoading()
				const db = uniCloud.database();
				db.collection('wallet')
				.where(`uid == $cloudEnv_uid`)
				.update({
					payPassword: md5Libs.md5(_this.payPassword),
					updateTime: db.env.now
				})
				.then(response => {
					uni.hideLoading()
					// 修改成功
					if(response.result.code == 0) {
						uni.showToast({
							title: _this.i18n.tip.optionsuccess,
							icon: 'none'
						});
						_this.getWalletData() // 重新加载钱包数据
					}
					else {
						uni.showToast({
							title: _this.i18n.error.optionerror,
							icon: 'none'
						});
					}
				})
				.catch(error => {
					uni.hideLoading()
					uni.showToast({
						title: _this.i18n.error.optionerror,
						icon: 'none'
					});
				})
				
			},
			
			// 开始注销钱包账户
			startToCloseWallet() {
				
				uni.showModal({
					content: _this.i18n.tip.optionconfirm,
					showCancel: true,
					cancelText: _this.i18n.base.cancel,
					confirmText: _this.i18n.base.confirm,
					success: res => {
						if(res.confirm) {
							
							_this.payPassword = ''
							_this.tmpPassword = ''
							_this.settingType = 'closewallet'
							_this.inputType = 'verifypwd'
							_this.inputStep = 1
							_this.keyboardShow = true
							
						}
					},
				});
			},
			
			// 注销钱包账户
			closeWallet() {
				uni.showLoading();
				
				const db = uniCloud.database();
				db.collection('wallet')
				.where(`uid == $cloudEnv_uid`)
				.remove()
				.then(response => {
					uni.hideLoading()
					// 注销成功
					if(response.result.code == 0) {
						uni.navigateBack(); // 返回上一页
						uni.showToast({
							title: _this.i18n.tip.optionsuccess,
							icon: 'none'
						});
					}
					else {
						uni.showToast({
							title: _this.i18n.tip.optionerror,
							icon: 'none'
						});
					}
				})
				.catch(error => {
					uni.hideLoading()
					uni.showToast({
						title: _this.i18n.tip.optionerror,
						icon: 'none'
					});
				})
				
			},
			
			// 输入完支付密码
			typePayPasswordFinish() {
				
				console.log(this.payPassword);
				
				// 根据输入类型选择不同的处理
				
				// 开通钱包类型
				if(this.inputType == 'openwallet') {
					
					// 第一次输入完成
					if(this.inputStep == 1) {
						this.tmpPassword = this.payPassword
						this.payPassword = '' // 清空首次输入的支付密码
						this.inputStep = 2 // 变更为第2步
					}
					// 二次输入完成
					else{
						// 对比首次和二次的密码
						// 一致
						if(this.payPassword == this.tmpPassword) {
							_this.keyboardShow = false
							// 开始开通钱包
							_this.openWallet()
						}
						// 不同 提示
						else {
							uni.showToast({
								title: _this.i18n.login.typenewagainpwd,
								icon: 'none'
							});
							_this.payPassword = '' // 清空本次输入
						}
					}
					
				}
				
				// 验证支付密码类型
				else if(this.inputType == 'verifypwd') {
					
					uni.showLoading()
					
					const db = uniCloud.database();
					db.collection('wallet')
					.where(`uid == $cloudEnv_uid`)
					.field('payPassword')
					.get({getOne: true})
					.then(response => {
						uni.hideLoading()
						if(response.result.code == 0) {
							// 验证成功
							if(response.result.data.payPassword == md5Libs.md5(_this.payPassword)) {
								
								// 判断当前使用支付密码类型
								// 修改支付密码验证成功
								if(_this.settingType == 'changepwd') {
									
									// 开始进行设置新的支付密码
									_this.payPassword = ''
									_this.tmpPassword = ''
									_this.inputType = 'settingnewpwd'
									_this.inputStep = 1
									_this.keyboardShow = true
									
								}
								// 注销钱包验证支付密码成功
								else if(_this.settingType == 'closewallet') {
									_this.closeWallet()
								}
								
							}
							// 验证失败
							else {
								_this.payPassword = ''
								uni.showToast({
									title: _this.i18n.me.wallet.paypasswordwrong,
									icon: 'none'
								});
							}
						}
						else {
							_this.payPassword = ''
							uni.showToast({
								title: _this.i18n.error.loaderror,
								icon: 'none'
							});
						}
					})
					.catch(error => {
						uni.hideLoading()
						_this.payPassword = ''
						uni.showToast({
							title: _this.i18n.error.loaderror,
							icon: 'none'
						});
					})
				}
				
				// 设置新的支付密码
				else if(this.inputType == 'settingnewpwd') {
					
					// 第一次输入完成
					if(this.inputStep == 1) {
						this.tmpPassword = this.payPassword
						this.payPassword = '' // 清空首次输入的支付密码
						this.inputStep = 2 // 变更为第2步
					}
					// 二次输入完成
					else{
						// 对比首次和二次的密码
						// 一致
						if(this.payPassword == this.tmpPassword) {
							_this.keyboardShow = false
							// 修改支付密码
							_this.changePayPassword()
						}
						// 不同 提示
						else {
							uni.showToast({
								title: _this.i18n.login.typenewagainpwd,
								icon: 'none'
							});
							_this.payPassword = '' // 清空本次输入
						}
					}
				}
			
			},
			
			// 支付键盘输入和回退
			keyboardOnChange(val){
				// 输入未达限制
				if(this.payPassword.length<this.passwordMaxLength){
					this.payPassword += val;
				}
				// 输入完成
				if(this.payPassword.length>=this.passwordMaxLength){
					this.typePayPasswordFinish()
				}
			},
			
			// 点击退格
			keyboardOnBackspace(e){
				if(this.payPassword.length>0){
					this.payPassword = this.payPassword.substring(0,this.payPassword.length-1);
				}
			},
			
			keyboardCancel() {
				// 清空输入密码和临时密码
				this.payPassword = ''
				this.tmpPassword = ''
				this.inputStep = 1
				this.keyboardShow = false
			},
			
			//
			
		}
	}
</script>

<style lang="scss" scoped>
	
	page{
		height: 100%;
	}
	.pagecontent {
		height: 100%;
		.balanceview{
			height: 300rpx;
		}
		
	}
	
</style>
