<template>
	<view class="noticeview">
		
		<!-- 自定义导航栏 -->
		<cu-custom bgColor="bg-gradual-orange" isBack>
			<block slot="content">{{ i18n.nav.notice }}</block>
		</cu-custom>
		
		<!-- 公告栏内容区域 -->
		<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="getnoticelist">
			
			<view class="noticelistview">
				
				<view class="eachnoticeview margin radius" v-for="(noticeinfo, index) in datalist" :key="index" :class="[ bgcolorlist[index%(bgcolorlist.length)] ]">
					
					<view class="title flex align-center justify-between padding margin-left margin-right" style="border-bottom: #FFFFFF solid 1rpx;">
						<uni-dateformat :date="noticeinfo.createDate" />
						<view class="btnview flex align-center text-xl">
							<text class="cuIcon cuIcon-deletefill text-white margin-right" @tap.stop="deletenotice(index)"></text>
							<text class="cuIcon cuIcon-edit text-white" @tap.stop="editnotice(noticeinfo)"></text>
						</view>
						
					</view>
					<view class="noticecontent padding-xl">
						{{ noticeinfo.content }}
					</view>
				</view>
				
			</view>
			
		</mescroll-body>
		
		<!-- 添加按钮 悬浮 -->
		<view class="addnoticebtn cu-btn round bg-gradual-orange shadow-blur cuIcon lg" @tap.stop="addnotice">
			<text class="cuIcon-add" style="font-size: 100rpx;"></text>
		</view>
		
	</view>
</template>

<script>
	
	var _this
	
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js" // 引入mescroll-mixins.js
	
	export default {
		
		mixins: [MescrollMixin], // 使用mixin
		
		data() {
			return {
				
				datalist: [], // 数据列表
				
				bgcolorlist: ['bg-gradual-red', 'bg-gradual-orange', 'bg-gradual-green', 'bg-gradual-blue', 'bg-gradual-purple', 'bg-gradual-pink']
				
			};
		},
		
		onLoad() {
			
			_this = this
			
			uni.$on('updatenoticelist', function() {
				_this.mescroll.resetUpScroll(true)
			})
			
		},
		
		onUnload() {
			uni.$off('updatenoticelist')
		},
		
		methods: {
			
			// 获取公告列表
			getnoticelist(mescroll) {
				
				let pageNum = mescroll.num; // 页码, 默认从1开始
				let pageSize = mescroll.size; // 页长, 默认每页10条
				let date = pageNum === 1 ? '' : mescroll.date // 请求时间标识
				let dataArr = _this.datalist
				
				const db = uniCloud.database();
				db.collection('notice')
					.skip((pageNum - 1) * pageSize)
					.limit(pageSize)
					.get()
					.then(response => {
						// 加载成功
						let list = response.result.data || []
						
						if(pageNum == 1) {
							dataArr = [] //清空数据源
							mescroll.scrollTo(0,0) // 如果是第一页则滑动到顶部
						} 
						//将请求的数据添加至现有数据源中
						dataArr = dataArr.concat(list)
						_this.datalist = dataArr
						
						// 如果渲染的数据较复杂,可延时隐藏下拉加载状态: 如
						_this.$nextTick(()=>{
							let hasNext = list.length === mescroll.size //如果当前页的数据量不等于每页请求的数据量  则说明已经没有下一页了
							mescroll.endSuccess(list.length,hasNext)
						})
					})
					.catch(err => {
						uni.showToast({
							title: _this.i18n.error.loaderror,
							icon: 'none'
						});
						// 失败隐藏下拉加载状态
						mescroll.endErr()
					})
				
			},
			
			// 添加公告
			addnotice() {
				uni.navigateTo({
					url: '/pages/notice/handlenotice?type=add'
				});
			},
			
			// 删除公告
			deletenotice(index) {
				uni.showModal({
					content: _this.i18n.tip.deleteconfirm,
					showCancel: true,
					cancelText: _this.i18n.base.cancel,
					confirmText: _this.i18n.base.confirm,
					success: res => {
						if(res.confirm) {
							// 开始删除
							let noticeinfo = _this.datalist[index]
							
							// 替换为云函数
							uniCloud.callFunction({
								name: 'notification',
								data: {
									type: 'delete',
									info: {
										_id: noticeinfo._id
									}
								}
							}).then(response => {
								// 删除成功
								_this.datalist.splice(index,1) // 更新数据源
								
							}).catch(error => {
								// 删除失败
								uni.showToast({
									title: _this.i18n.error.deleteerror,
									icon: 'none'
								});
							})
							
						}
					},
				})
			},
			
			// 编辑公告
			editnotice(noticeinfo) {
				uni.navigateTo({
					url: `/pages/notice/handlenotice?type=edit&id=${noticeinfo._id}`
				});
			},
		
		},
	}
</script>

<style lang="scss" scoped>
	.noticeview{
		
		
		.addnoticebtn{
			position: fixed;
			z-index: 999;
			width: 100rpx;
			height: 100rpx;
			bottom: 50rpx;
			right: 50rpx;
		}
	}
</style>
