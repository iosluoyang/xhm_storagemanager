<template>
	<view class="pagecontent">

		<!-- 自定义导航栏 -->
		<cu-custom bgColor="bg-gradual-orange">
			<u-subsection slot="content" mode="button" :list="subsectionlist" :current="sectionIndex"
				active-color="#e54d42" :height="60" @change="sectionChange"></u-subsection>
		</cu-custom>

		<unicloud-db v-slot:default="{data, loading, error, options}" collection="bill" ref="udb"
			:where=" `creatUid == $cloudEnv_uid && type == ${billType}` " orderby="creatTime desc"
			:page-size="20" page-data="add">
			<view v-if="error">{{error.message}}</view>
			<view v-else-if="loading" class="cu-load loading"></view>
			<view v-else>
				<view class="cu-list menu margin-top-sm">

					<view class="cu-item" v-for="(item, index) in data" :key="item._id">
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

		}
	}
</script>

<style lang="scss" scoped>

</style>
