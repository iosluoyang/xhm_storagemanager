<template>
	<view class="pagecontent">

		<!-- 自定义导航栏 -->
		<cu-custom bgColor="bg-gradual-orange">
			<block slot="content">{{i18n.nav.bill}}</block>
		</cu-custom>
		
		<unicloud-db v-slot:default="{data, loading, error, options}" collection="bill" ref="udb" :options="options"
			:where=" `creatUid == $cloudEnv_uid && type == ${billType}` " orderby="creatTime desc"
			:page-size="20" page-data="add">
			<view v-if="error">{{error.message}}</view>
			<view v-else class="contentview" style="padding-top: 80rpx;">
				
				<view class="headerview" style="position: fixed; top: 45px; left: 0; right: 0; zIndex: 100;">
					<u-subsection mode="button" :list="subsectionlist" :current="sectionIndex"
						active-color="#e54d42" :height="80" @change="sectionChange"></u-subsection>
				</view>
				
				<view class="cu-list menu margin-top-sm">
					<view class="cu-item arrow" v-for="(item, index) in data" :key="item._id" @tap.stop="checkBillDetail(item)">
						<!-- 索引 -->
						<view class="indexview flex0 margin-right-sm cu-avatar bg-grey sm round">{{ index + 1 }}</view>
						<!-- 列表内容 -->
						<view class="content padding-tb-sm">
							<view class="topview">
								<text class="text-bold margin-right-sm" :class="[ item.type == 0 ? 'cuIcon-move text-green' : 'cuIcon-add text-red']"></text>
								<text class="text-price text-bold text-xl" :class="[ item.type == 0 ? 'text-green' : 'text-red' ]">{{ item.price }}</text>
								<!-- 待确认状态下显示 -->
								<view v-if="item.status == 0" class="text-sm margin-left-sm" @tap.stop="showConfirmTip">
									<text class="cuIcon cuIcon-questionfill text-gray"></text>
								</view>
							</view>
							<view class="bottomview text-grey text-sm">
								<uni-dateformat :date="item.creatTime" format="yy/MM/dd hh:mm:ss"/>
							</view>
						</view>
						<view class="action">
							<text class="cu-tag round text-sm">{{ i18n.me.wallet.billType[item.billType] }}</text>
						</view>
					</view>
				</view>
			</view>
			<!-- 注意分页时laoding要放在数据展示后面 -->
			<view v-if="loading" class="cu-load loading"></view>
		</unicloud-db>

	</view>
</template>

<script>
	var _this

	export default {
		data() {
			return {

				billType: 0, // 0 支出 1充值
				subsectionlist: null, // 分段器数据
				sectionIndex: 0, // 选项卡索引

			};
		},

		onPullDownRefresh() { //下拉刷新
			this.$refs.udb.loadData({
				clear: true //可选参数，是否清空数据
			}, () => {
				uni.stopPullDownRefresh()
			})
		},
		
		onReachBottom() { //滚动到底翻页
			this.$refs.udb.loadMore()
		},

		onLoad(option) {
			_this = this
			if(option.billType) {
				this.billType = Number(option.billType)
			}

			// 设置账单明细数据
			_this.setSubSectionList()
		},

		methods: {

			// 设置分段器数据
			setSubSectionList() {

				let subsectionlist = [{
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
			
			// 点击查看待确认状态
			showConfirmTip() {
				uni.showModal({
					content: _this.i18n.me.wallet.balancetip,
					showCancel: false,
					confirmText: _this.i18n.base.confirm
				});
			},
			
			// 查看账单详情
			checkBillDetail(item) {
				let billId = item._id
				uni.navigateTo({
					url: `/pages/me/billrecorddetail?id=${billId}`
				});
			},

		}
	}
</script>

<style lang="scss" scoped>
 .pagecontent{
	 
 }
</style>
