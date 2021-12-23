<template>
	<view class="pagecontent bgf5">

		<!-- 自定义导航栏 -->
		<cu-custom bgColor="bg-gradual-orange">
			<block slot="content">{{i18n.nav.bill}}</block>
		</cu-custom>

		<unicloud-db manual v-slot:default="{data, loading, error, options}" collection="bill" ref="udb"
			:where="wherestr" :getone="true">
			
			<view v-if="error">{{error.message}}</view>
			<view v-else-if="loading" class="cu-load loading"></view>
			<view v-else>
				
				<!-- 信息区域 -->
				<view class="cu-list menu card-menu margin-top">
					
					<!-- 账单时间 -->
					<view class="cu-item">
						<view class="content">
							<text class="cuIcon cuIcon-time text-grey"></text>
							<uni-dateformat :date="data.creatTime" />
						</view>
					</view>
					
					<!-- 账单收入支出类型 -->
					<view class="cu-item">
						<view class="content">
							<text class="cuIcon cuIcon-rank text-grey"></text>
							<text class="text-bold" :class="[ data.type == 0 ? 'cuIcon-move text-green' : 'cuIcon-add text-red']"></text>
							<text class="text-price text-bold text-xl" :class="[ data.type == 0 ? 'text-green' : 'text-red' ]">{{ data.price }}</text>
						</view>
					</view>
					
					<!-- 账单待确认状态 -->
					<view v-if="data.status == 0" class="cu-item">
						<view class="content">
							<text class="cuIcon cuIcon-info text-grey"></text>
						</view>
						<view class="action padding-sm">
							<text class="text-df">{{ i18n.me.wallet.balancetip }}</text>
						</view>
					</view>
					
					<!-- 账单类型 -->
					<view class="cu-item">
						<view class="content">
							<text class="cuIcon cuIcon-sort text-grey"></text>
							<text>{{ i18n.me.wallet.billType[data.billType] }}</text>
						</view>
					</view>
					
					<!-- 账单关联订单id -->
					<view v-if="data.orderId" class="cu-item">
						<view class="content">
							<text class="cuIcon cuIcon-form text-grey"></text>
							<text>{{ data.orderId }}</text>
						</view>
					</view>
					
					<!-- 账单凭证图片 -->
					<view v-if="data.imgs" class="bg-white padding">
						<view class="grid col-4 grid-square">
							<view class="bg-img" v-for="(img,index) in data.imgs.split(',')" :key="index" :style="[{ backgroundImage:'url(' + img + ')' }]" @tap.stop="previewImg(index)"></view>
						</view>
					</view>
					
				</view>
				
				<!-- 操作区域 仅管理员有该权限 且为账单状态为待确认状态时 -->
				<view v-if="user && user.role == $basejs.roleEnum.admin && data.status == 0" class="optonview margin-top flex align-center justify-center">
					
					<button class="cu-btn block lg bg-orange width50" @tap.stop="confirmBill">{{ i18n.base.confirm }}</button>
					
				</view>
				
			</view>
		</unicloud-db>

	</view>
</template>

<script>
	var _this

	export default {
		data() {
			return {

				id: null, // 账单id
				wherestr: '', // udb的where 查询语句
			};
		},


		onLoad(option) {
			_this = this
			if(option.id) {
				this.id = option.id
				this.wherestr = `_id == '${this.id}'`
			}
		},
		
		onReady() {
			if (this.id) {
				this.$refs.udb.loadData()
			}
		},

		methods: {

			// 预览图片
			previewImg(index) {
				let data = this.$refs.udb.dataList
				uni.previewImage({
					current: index,
					urls: data.imgs.split(',')
				})
			},
			
			// 管理员确认账单
			confirmBill() {
				uni.showModal({
					content: _this.i18n.tip.optionconfirm,
					showCancel: true,
					cancelText: _this.i18n.base.cancel,
					confirmText: _this.i18n.base.confirm,
					success: res => {
						if(res.confirm) {
							const db = uniCloud.database();
							db.collection('bill').doc(_this.id)
							.update({status: 1})
							.then(response => {
								if(response.result.code == 0) {
									// 确认账单状态成功，将该用户的钱包余额增加账单的金额
									let billInfo = _this.$refs.udb.dataList
									billInfo.status = 1 // 手动更改状态
									let price = billInfo.price
									let uid = billInfo.uid // 该账单拥有者的uid
									// 获取该拥有者的钱包数据  进行更新
									db.collection('wallet').where(`uid == '${uid}'`)
									.field('money')
									.get({getOne: true})
									.then(response => {
										if(response.result.code == 0) {
											let money = response.result.data.money
											let walletId = response.result.data._id
											let newMoney = _this.$basejs.keepTwoDecimalFull(Number(money) + Number(price))
											
											// 进行更新
											db.collection('wallet')
											.doc(walletId)
											.update({money: newMoney, updateTime: db.env.now})
											.then(response => {
												if(response.result.code == 0) {
													// 修改成功
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
			},

		}
	}
</script>

<style lang="scss" scoped>
page{
	height: 100%;
	.pagecontent{
		height: 100%;
	}
}
</style>
