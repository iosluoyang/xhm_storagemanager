<template>
	<view class="handlenoticeview">
		
		<!-- 自定义导航栏 -->
		<cu-custom bgColor="bg-gradual-orange" isBack isBackConfirm>
			<block slot="content">{{ navtitle }}</block>
		</cu-custom>
		
		<view class="noticecontent bg-white">
			
			<!-- 标题区域 -->
			<view class="cu-item padding">
				<view class="content text-xxl">
					<text class="cuIcon-notice text-orange margin-right"></text>
					<text class="text-black text-bold text-xl">{{ navtitle }}</text>
				</view>
				<view class="action">
					<text v-if="time" class="text-grey text-sm">{{ time }}</text>
				</view>
			</view>
			
			<!-- 公告内容区域 -->
			<view class="cu-form-group">
				<textarea maxlength="-1" v-model="content" :placeholder="i18n.me.notice.noticeplaceholder"></textarea>
			</view>
			
		</view>
		
		<!-- 确定按钮 -->
		<view class="btnview padding flex flex-direction">
			<button class="cu-btn bg-gradual-orange round shadow lg"
					:class="[ifshowbtnanimation ? 'animation-shake' : '']"
					@tap.stop="confirm">{{i18n.base.save}}</button>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: 'add', // 页面类型 add为新增  edit为编辑
				navtitle: '', // 导航栏标题
				id: null, // 公告id  编辑下有
				
				content: '', // 公告内容
				time: null,// 公告时间
				
				ifshowbtnanimation: false, // 是否显示按钮摇动动画  默认为否
			};
		},
		
		onLoad(option) {
			let type = option.type
			this.type = type
			
			// 新增
			if(this.type === 'add') {
				this.navtitle = this.i18n.me.notice.publishnotice
			}
			// 编辑
			else if(this.type === 'edit') {
				this.navtitle = this.i18n.me.notice.editnotice
				let id = option.id
				this.id = id
				// 获取公告详情
				this.getnoticedetail()
			}
			
		},
		
		methods: {
			
			// 获取公告详情
			getnoticedetail() {
				
				uniCloud.callFunction({
					name: 'notification',
					data: {
						type: 'getdetail',
						info: {
							_id: this.id
						}
					}
				}).then(response => {
					// 获取公告数据成功
					let noticeinfo = response.result.data[0]
					let noticetime = noticeinfo.createDate
					let noticecontent = noticeinfo.content
					
					this.content = noticecontent
					this.time = noticetime
				}).catch(error => {
					uni.showToast({
						title: this.i18n.error.loaderror,
						icon: 'none'
					});
				})
				
				// this.$api.noticeapi.noticedetail({id: this.id}).then(response => {
				// 	// 获取公告数据成功
				// 	let notice = response.data.notice
				// 	let noticetime = notice.createTime
				// 	let noticecontent = notice.content
					
				// 	this.content = noticecontent
				// 	this.time = noticetime
				// }).catch(error => {
				// 	uni.showToast({
				// 		title: this.i18n.error.loaderror,
				// 		icon: 'none'
				// 	});
				// })
				
			},
			
			// 显示按钮动画
			showbtnanimation() {
				const _this = this
				_this.ifshowbtnanimation = true
				setTimeout(function() {
					_this.ifshowbtnanimation = false
				}, 1000);
			},
			
			//点击确定
			confirm() {
				
				const _this = this
				// 内容校验
				let content = _this.content
				if(!content || content.length === 0) {
					_this.showbtnanimation()
					return
				}
				
				// 新增
				if(_this.type === 'add') {
					
					// 使用云函数
					uniCloud.callFunction({
						name:'notification',
						data: {
							type: 'add',
							info: {content}
						}
					}).then(response => {
						// 发布成功
						uni.$emit('updatenoticelist')
						uni.showToast({
							title: _this.i18n.tip.addsuccess,
							icon: 'none',
							duration: 1500
						});
						
						setTimeout(function() {
							uni.navigateBack();
						}, 1500);
					}).catch(error => {
						// 发布失败
						_this.showbtnanimation()
						uni.showToast({
							title: _this.i18n.error.adderror,
							icon: 'none'
						});
					})

					// _this.$api.noticeapi.addnotice({content}).then(response => {
					// 	// 发布成功
					// 	uni.$emit('updatenoticelist')
					// 	uni.showToast({
					// 		title: _this.i18n.tip.addsuccess,
					// 		icon: 'none',
					// 		duration: 1500
					// 	});
						
					// 	setTimeout(function() {
					// 		uni.navigateBack();
					// 	}, 1500);
					// }).catch(error => {
					// 	// 发布失败
					// 	_this.showbtnanimation()
					// 	uni.showToast({
					// 		title: _this.i18n.error.adderror,
					// 		icon: 'none'
					// 	});
					// })
					
				}
				else if(_this.type === 'edit') {
					
					uniCloud.callFunction({
						name: 'notification',
						data: {
							type: 'edit',
							info: {
								_id: _this.id,
								content: _this.content
							}
						}
					}).then(response => {
						// 编辑成功
	
						uni.$emit('updatenoticelist')
						uni.showToast({
							title: _this.i18n.tip.fixsuccess,
							icon: 'none',
							duration: 1500
						});
						
						setTimeout(function() {
							uni.navigateBack();
						}, 1500);
					}).catch(error => {
						// 编辑失败
						_this.showbtnanimation()
						uni.showToast({
							title: _this.i18n.error.fixerror,
							icon: 'none'
						});
						
					})
					
					// _this.$api.noticeapi.editnotice({content: content, id: _this.id}).then(response => {
					// 	// 编辑成功
					// 	uni.$emit('updatenoticelist')
					// 	uni.showToast({
					// 		title: _this.i18n.tip.fixsuccess,
					// 		icon: 'none',
					// 		duration: 1500
					// 	});
						
					// 	setTimeout(function() {
					// 		uni.navigateBack();
					// 	}, 1500);
					// }).catch(error => {
					// 	// 编辑失败
					// 	_this.showbtnanimation()
					// 	uni.showToast({
					// 		title: _this.i18n.error.fixerror,
					// 		icon: 'none'
					// 	});
						
					// })
					
				}
				
			},
		},
	}
</script>

<style lang="scss" scoped>

</style>
