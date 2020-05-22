<template>
	<view class="managepeople">
		
		<!-- 自定义导航栏 -->
		<cu-custom bgColor="bg-gradual-orange" isBack>
			<block slot="content">{{i18n.me.panel.managepeople}}</block>
		</cu-custom>
		
		<!-- 搜索框 -->
		<view class="cu-bar bg-white search fixed" :style="[{top:CustomBar + 'px'}]">
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input type="text" :placeholder="i18n.tip.searchpeople" v-model="searchText" confirm-type="search"></input>
			</view>
			<view class="action">
				<button class="cu-btn bg-gradual-orange shadow round" @tap.stop="starttosearch">{{i18n.base.scrollto}}</button>
			</view>
		</view>
		
		<!-- 成员列表 -->
		<!-- :style="[{height:'calc(100vh - '+ CustomBar + 'px - 50px)'}]" -->
		<scroll-view scroll-y class="indexes" :scroll-into-view="'indexes-'+ listCurID.toString()" :style="[{top:'calc('+(CustomBar + 50)+ 'px'}]"
		 :scroll-with-animation="true" :enable-back-to-top="true">
			<view class="cu-list menu-avatar margin-top" v-for="(member,index) in memberlist" :key="index" :id=" 'indexes-' + index.toString() ">
				<view class="cu-item" @tap.stop="editmember(member)">
					<!-- 头像 -->
					<template>
						<view v-if=" member.avatar && member.avatar !== '' " class="cu-avatar round lg" :style="{backgroundImage: 'url('+(imgUrl + member.avatar)+')'}"></view>
						<view v-else class="cu-avatar round lg">{{member.realName.substr(0,1)}}</view>
					</template>
					
					<view class="content">
						<view>
							<view class="text-black text-bold text-cut margin-right-sm">{{member.realName}}</view>
							<view class="cu-tag round" :class="[member.type===0 ? 'bg-blue' : 'bg-orange']">{{member.type === 0 ? i18n.base.admin : i18n.base.normaladmin}}</view>
						</view>
						
						<view class="text-gray text-sm text-cut">{{member.remark || ''}}</view>
					</view>
					<view class="action">
						<!-- 显示冻结状态 -->
						<text :class="[member.freezeFlag === 1 ? 'cuIcon-lock text-gray' : '' ]"></text>
					</view>
				</view>
			</view>
		</scroll-view>
		
		<!-- 添加按钮 悬浮 -->
		<view class="addmemberbtn cu-btn round bg-gradual-orange shadow-blur cuIcon lg" @tap.stop="addmember">
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
			uni.$on('updatemember', function(data){
				// 更新成员列表
				_this.getmemberlist()
			})
			
			// 获取成员列表
			this.getmemberlist()
			
		},
		
		destroyed() {
			// 注销事件监听
			uni.$off('updatemember')
		},
		
		methods: {
			
			// 获取成员列表
			getmemberlist() {
				
				this.$api.managepeopleapi.getmemberlist().then(response => {
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
					url: '/pages/managepeople/handlemember?type=add'
				});
			},
			
			// 编辑成员
			editmember(member) {
				// 将当前成员的信息存储到本地
				uni.setStorageSync('editmember', member)
				uni.navigateTo({
					url: '/pages/managepeople/handlemember?type=edit'
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
					return member.realName.indexOf(_this.searchText) != -1
				})
				
				this.listCurID = currentIndex
				
			},
		},
	}
</script>

<style scoped lang="scss">
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
	
	.managepeople{
		.addmemberbtn{
			position: fixed;
			z-index: 999;
			width: 100upx;
			height: 100upx;
			bottom: 50upx;
			right: 50upx;
		}
	}
</style>
