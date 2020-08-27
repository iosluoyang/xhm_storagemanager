<template>
	<view class="noticeview">
		
		<!-- 自定义导航栏 -->
		<cu-custom bgColor="bg-gradual-orange" isBack>
			<block slot="content">{{ i18n.me.panel.notice }}</block>
		</cu-custom>
		
		<!-- 公告栏内容区域 -->
		<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="getnoticelist">
			
			<view class="noticelistview">
				
				<view class="eachnoticeview margin radius" v-for="(noticeinfo, index) in datalist" :key="index" :class="[ bgcolorlist[index%(bgcolorlist.length)] ]">
					
					<view class="title flex align-center justify-between padding margin-left margin-right" style="border-bottom: #FFFFFF solid 1rpx;">
						<view class="noticetime">{{ noticeinfo.createDate }}</view>
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
			<text class="cuIcon-add" style="font-size: 100upx;"></text>
		</view>
		
	</view>
</template>

<script>
	
	var _this
	
	import MescrollBody from "@/components/mescroll-uni/mescroll-body.vue"
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js" // 引入mescroll-mixins.js
	
	export default {
		
		mixins: [MescrollMixin], // 使用mixin
		
		components: {
			MescrollBody,
		},
		
		data() {
			return {
				
				datalist: [], // 数据列表
				
				bgcolorlist: ['bg-gradual-red', 'bg-gradual-orange', 'bg-gradual-green', 'bg-gradual-blue', 'bg-gradual-purple', 'bg-gradual-pink']
				
			};
		},
		
		onLoad() {
			
			_this = this
			
			uni.$on('updatenoticelist', function() {
				_this.mescroll.resetUpScroll()
			})
			
		},
		
		destroyed() {
			uni.$off('updatenoticelist')
		},
		
		methods: {
			
			// 获取公告列表
			getnoticelist(page) {
				
				// 更换为云函数获取公告列表
				uniCloud.callFunction({
					name: 'notification',
					data: {
						type: 'getlist',
						info: {
							pageSize: page.size,
							pageNum: page.num,
							date: page.num === 1 ? '' : page.date
						}
					},
					
				}).then(response => {
					console.log(`当前获取的数据为:${JSON.stringify(response)}`);
					// 加载成功
					let date = response.result.data.date
					let curdatalist = response.result.data || []
					
					if(page.num == 1) {
						this.datalist = []; //如果是第一页需手动置空列表
						page.date = date
					} 
					this.datalist = this.datalist.concat(curdatalist); //追加新数据
					let hasNext = curdatalist.length === page.size //如果当前页的数据量不等于每页请求的数据量  则说明已经没有下一页了
					_this.mescroll.endSuccess(curdatalist.length,hasNext)
					
				}).catch(error => {
					uni.showToast({
						title: _this.i18n.error.loaderror,
						icon: 'none'
					});
					// 失败隐藏下拉加载状态
					_this.mescroll.endErr()
				})
				
				
				// let data = {
				// 	pageSize: page.size,
				// 	pageNum: page.num,
				// 	date: page.num === 1 ? '' : page.date
				// }
				// this.$api.noticeapi.getnoticelist(data).then(response => {
				// 	// 加载成功
					
				// 	let date = response.data.date
				// 	let curdatalist = response.data.list || []
					
				// 	if(page.num == 1) {
				// 		this.datalist = []; //如果是第一页需手动置空列表
				// 		page.date = date
				// 	} 
				// 	this.datalist = this.datalist.concat(curdatalist); //追加新数据
				// 	let hasNext = curdatalist.length === page.size //如果当前页的数据量不等于每页请求的数据量  则说明已经没有下一页了
				// 	_this.mescroll.endSuccess(curdatalist.length,hasNext)
					
				// }).catch(error => {
				// 	uni.showToast({
				// 		title: _this.i18n.error.loaderror,
				// 		icon: 'none'
				// 	});
				// 	// 失败隐藏下拉加载状态
				// 	_this.mescroll.endErr()
				// })
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
							
							// _this.$api.noticeapi.deletenotice({id: noticeinfo.id}).then(response =>{
							// 	// 删除成功
							// 	_this.datalist.splice(index,1) // 更新数据源
								
							// }).catch(error => {
							// 	// 删除失败
							// 	uni.showToast({
							// 		title: _this.i18n.error.deleteerror,
							// 		icon: 'none'
							// 	});
							// })
							
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
			width: 100upx;
			height: 100upx;
			bottom: 50upx;
			right: 50upx;
		}
	}
</style>
