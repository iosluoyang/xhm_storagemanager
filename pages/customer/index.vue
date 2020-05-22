<template>
	<view class="customerview">
		
		<!-- 自定义导航栏 -->
		<cu-custom bgColor="bg-gradual-purple" isBack>
			<block slot="content">{{i18n.nav.customer}}</block>
		</cu-custom>
		
		<!-- 搜索框 -->
		<view class="cu-bar bg-white search fixed" :style="[{top:CustomBar + 'px'}]">
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input type="text" :placeholder="i18n.tip.searchpeople" v-model="searchText" confirm-type="search"></input>
			</view>
			<view class="action">
				<button class="cu-btn bg-gradual-purple shadow round" @tap.stop="starttosearch">{{i18n.base.scrollto}}</button>
			</view>
		</view>
		
		<!-- 成员列表 -->
		<scroll-view scroll-y class="indexes" :scroll-into-view="'indexes-'+ listCurID.toString()" :style="[{top:'calc('+(CustomBar + 50)+ 'px'}]"
		 :scroll-with-animation="true" :enable-back-to-top="true">
		 
		 
			<view class="cu-list menu-avatar comment solids-bottom">
				
				<view class="cu-item" v-for="(member,index) in memberlist" :key="index" :id=" 'indexes-' + index.toString() " @tap.stop="editmember(member)">
					
					<template>
						<view v-if=" member.img && member.img !== '' " class="cu-avatar round" :style="{backgroundImage: 'url('+(imgUrl + member.img)+')'}"></view>
						<view v-else class="cu-avatar round">{{member.customer.substr(0,1)}}</view>
					</template>
					
					<view class="content">
						<view class="text-grey">{{member.customer}}</view>
						
						<view v-if="member.company && member.company.length > 0" class="text-gray text-df">{{i18n.me.customer.companyname}}:{{ member.company }}</view>
						<view v-if="member.phone && member.phone.length > 0" class="text-gray text-df">{{i18n.me.customer.customerphone}}:{{ member.phone }}</view>

						<view class="text-grey margin-top-sm">最新动态:</view>
						<view class="bg-grey padding-sm radius margin-top-sm text-sm">
							<view class="flex">
								<view>出库人名称：</view>
								<view class="flex-sub">2020年5月22日出库了100件</view>
							</view>
						</view>
						
					</view>
				
				</view>

			</view>
		 
			<!-- <view class="cu-list menu-avatar margin-top" v-for="(member,index) in memberlist" :key="index" :id=" 'indexes-' + index.toString() ">
				<view class="cu-item" @tap.stop="editmember(member)">
					
					<template>
						<view v-if=" member.img && member.img !== '' " class="cu-avatar round lg" :style="{backgroundImage: 'url('+(imgUrl + member.img)+')'}"></view>
						<view v-else class="cu-avatar round lg">{{member.customer.substr(0,1)}}</view>
					</template>
					
					<view class="content">
						<view>
							<view class="text-black text-bold text-cut margin-right-sm">{{member.customer}}</view>
							<view v-if="member.remark && member.remark.length > 0" class="cu-tag bg-orange round">{{member.remark}}</view>
						</view>
						
						<view class="text-gray text-sm text-cut">{{member.company || ''}}</view>
					</view>
					<view class="action">
						<text class="text-grey">{{ member.phone }}</text>
					</view>
				</view>
			</view> -->
			
			
		</scroll-view>
		
		<!-- 添加按钮 悬浮 -->
		<view class="addmemberbtn cu-btn round bg-gradual-purple shadow-blur cuIcon lg" @tap.stop="addmember">
			<text class="cuIcon-add" style="font-size: 100upx;"></text>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				
				searchText: '', // 搜索文字
				
				memberlist: [], // 成员列表
				listCurID: -1, // 当前子视图索引ID
				
			};
		},
		
		onLoad() {
			
			const _this = this
			// 设置监听
			uni.$on('updatecustomer', function(data){
				// 更新客户列表
				_this.getcustomerlist()
			})
			
			// 获取客户列表
			this.getcustomerlist()
			
		},
		
		destroyed() {
			// 注销事件监听
			uni.$off('updatecustomer')
		},
		
		methods: {
			
			// 获取客户列表
			getcustomerlist() {
				let data = {
					searchText: this.searchText,
					pageSize: 500,
					pageNum: 1,
				}
				
				this.$api.customerapi.getcustomerlist(data).then(response => {
					// 获取成员成功
					let memberlist = response.data.list
					this.memberlist = memberlist
					
				}).catch(error => {
					// 获取成员失败
					uni.showToast({
						title: this.i18n.error.getmemberlisterror,
						icon: 'none'
					});
				})
			},
			
			// 添加成员
			addmember() {
				uni.navigateTo({
					url: '/pages/customer/handlemember?type=add'
				});
			},
			
			// 编辑成员
			editmember(member) {
				uni.navigateTo({
					url: `/pages/customer/handlemember?type=edit&customerId=${member.customerId}`
				});
			},
			
			// 搜索成员
			starttosearch() {
				
				if(this.searchText === '') {
					return
				}
				
				const _this = this
				// 从成员列表中找到包含有该关键字的第一个成员
				let currentIndex = this.memberlist.findIndex((member, index) => {
					return member.customer.indexOf(_this.searchText) != -1
				})
				
				this.listCurID = currentIndex
				
			},
		},
		
	}
</script>

<style lang="scss" scoped>
	page {
		padding-top: 100upx;
	}
	
	.indexes {
		position: fixed;
		bottom: 0;
	}
	
	.indexBar {
		position: fixed;
		right: 0px;
		bottom: 0px;
		padding: 20upx 20upx 20upx 60upx;
		display: flex;
		align-items: center;
	}
	
	.indexBar .indexBar-box {
		width: 40upx;
		height: auto;
		background: #fff;
		display: flex;
		flex-direction: column;
		box-shadow: 0 0 20upx rgba(0, 0, 0, 0.1);
		border-radius: 10upx;
	}
	
	.indexBar-item {
		flex: 1;
		width: 40upx;
		height: 40upx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24upx;
		color: #888;
	}
	
	movable-view.indexBar-item {
		width: 40upx;
		height: 40upx;
		z-index: 9;
		position: relative;
	}
	
	movable-view.indexBar-item::before {
		content: "";
		display: block;
		position: absolute;
		left: 0;
		top: 10upx;
		height: 20upx;
		width: 4upx;
		background-color: #f37b1d;
	}
	
	.indexToast {
		position: fixed;
		top: 0;
		right: 80upx;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		width: 100upx;
		height: 100upx;
		border-radius: 10upx;
		margin: auto;
		color: #fff;
		line-height: 100upx;
		text-align: center;
		font-size: 48upx;
	}
	
	.customerview{
		.addmemberbtn{
			position: fixed;
			z-index: 999;
			width: 100upx;
			height: 100upx;
			bottom: 50upx;
			right: 50upx;
		}
		/deep/.cu-list.menu-avatar>.cu-item .action{
			width: auto !important;
		}
	}
</style>
