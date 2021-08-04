<template>
	<view class="pagecontent confirmreceiptpage">
		
		<!-- 导航栏 -->
		<cu-custom bgColor="bg-cyan" isBack>
			<block slot="content">{{ i18n.nav.confirmreceipt }}</block>
		</cu-custom>
		
		<!-- 其他的内容视图 -->
		<view v-if="wishinfo" class="contentview">
			{{ JSON.stringify(wishinfo) }}
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
				ifloading: false, // 是否正在加载
				
				
				wishId: null, // 心愿id
				wishinfo: null, // 心愿详情数据
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
			
			let wishId = option.wishId
			if(wishId) {
				_this.wishId = wishId
				// 获取心愿详情信息
				_this.loadwishdetail()
			}
			else {
				uni.showToast({
					title: _this.i18n.error.loaderror,
					icon: 'none'
				});
			}
			
		},
		
		methods: {
			
			// 获取心愿详情
			loadwishdetail() {
				
				_this.ifloading = true // 开始缓冲动画
				
				// 使用openDB获取详情信息
				const db = uniCloud.database();
				db.collection('wishlist,uni-id-users')
					.doc(_this.wishId)
					.field('creatUser{nickname,avatar},agentUser{avatar,nickname},agentFlag,productTitle,aliasName,imgs,targetPrice,targetAmount,targetMoneyType,sourcePrice,sourceMoneyType,sourceLink,achieveFlag,hurryLevel,remark,creatTime,productExt,specPropInfo,thirdPidType,thirdPid')
					.get({
						getOne:true
					})
					.then(res => {
						
						_this.ifloading = false // 结束缓冲动画
						
						if(res.result.code == 0) {
							let detaildata = res.result.data
							detaildata.creatUser = detaildata.creatUser[0]
							detaildata.agentUser = detaildata.agentUser && detaildata.agentUser.length > 0 ? detaildata.agentUser[0] : null
							_this.wishinfo = detaildata
							
						}
					})
					.catch(error => {
						_this.ifloading = false // 结束缓冲动画
					})
				
			},
			
			//
			
		}
	}
</script>

<style lang="scss" scoped>
	
	.content {
		
	}
	
</style>
