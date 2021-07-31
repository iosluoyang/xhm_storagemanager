<template>
	<view class="handlenoticeview">
		
		<!-- 自定义导航栏 -->
		<cu-custom bgColor="bg-gradual-orange" isBack isBackConfirm>
			<block slot="content">{{ i18n.nav.notice }}</block>
		</cu-custom>
		
		<view class="noticecontent bg-white">
			
			<!-- 标题区域 -->
			<view class="cu-item padding">
				<view class="content text-xxl">
					<text class="cuIcon-notice text-orange margin-right"></text>
					<text class="text-black text-bold text-xl">{{ navtitle }}</text>
				</view>
				<view class="action">
					<uni-dateformat v-if="time" class="text-grey text-sm" :date="time" />
				</view>
			</view>
			
			<!-- 公告标题 -->
			<view class="cu-form-group">
				
				<view class="title">{{ i18n.me.notice.title }}</view>
				<input class="text-xl text-bold" type="text" v-model="title" :placeholder="i18n.placeholder.me.notice.title" />
				
			</view>
			
			<!-- 公告内容区域 -->
			<view class="cu-form-group">
				<textarea maxlength="-1" v-model="content" :placeholder="i18n.placeholder.me.notice.content"></textarea>
			</view>
			
			<!-- 公告图片 -->
			<view class="bg-white padding">
				<uni-file-picker ref="filepickerref" v-model="imgArr" :limit="mainpiclimitnum"
				return-type="array" :del-icon="true" :auto-upload="false" mode='grid' :disable-preview="false" file-mediatype="image" 
				@select="fileselect" @delete="filedelete" @progress="fileprogress" @success="filesuccess" @fail="filefail">
				</uni-file-picker>
			</view>
			
		</view>
		
		<!-- 确定按钮 -->
		<view class="btnview padding flex flex-direction">
			<button class="cu-btn bg-gradual-orange round shadow lg"
					:class="[ifshowbtnanimation ? 'animation-shake' : '']"
					@tap.stop="confirm">{{i18n.base.confirm}}
			</button>
		</view>
		
	</view>
</template>

<script>
	
	var _this
	
	export default {
		data() {
			return {
				type: 'add', // 页面类型 add为新增  edit为编辑
				navtitle: '', // 导航栏标题
				id: null, // 公告id  编辑下有
				
				title: '', // 公告标题
				content: '', // 公告内容
				time: null,// 公告时间
				
				mainpiclimitnum: 1, // 图片上传的数量限制
				imgArr: [], // 图片数组
				
				ifshowbtnanimation: false, // 是否显示按钮摇动动画  默认为否
			};
		},
		
		onLoad(option) {
			
			_this = this
			
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
				
				const db = uniCloud.database();
				db.collection('notice').doc(_this.id).get({getOne: true})
				.then(response => {
					
					// 获取成功
					if(response.result.code == 0) {
						
						let noticedata = response.result.data
						let title = noticedata.title
						let content = noticedata.content
						let time = noticedata.creatDate
						let image = noticedata.image
						_this.title = title
						_this.content = content
						_this.time = time
						if(image) {
							let imgsArr = image.split(',') // 图片
							this.imgArr = imgsArr.map(item => ({url: item}))
						}
						
					}
					// 获取失败
					else{
						uni.showToast({
							title: _this.i18n.error.loaderror,
							icon: 'none'
						});
					}
				})
				.catch(error => {
					uni.showToast({
						title: _this.i18n.error.loaderror,
						icon: 'none'
					});
				})
				
			},
			
			// 选择图片成功
			fileselect(e) {
				this.imgArr.push.apply(this.imgArr, e.tempFiles)
				// this.imgArr =  this.imgArr.concat(e.tempFiles)
				console.log(`选择图片成功`);
			},
			
			// 图片删除
			filedelete(e) {
				let deleteIndex = this.imgArr.findIndex(item => {
					return e.tempFilePath == item.path
				})
				if(deleteIndex > -1) {
					this.imgArr.splice(deleteIndex,1)
				}
			},
			
			// 图片上传
			fileprogress(e) {
				console.log(`上传图片中`);
				console.log(e);
			},
			
			// 上传图片成功
			filesuccess(e) {
				console.log(`上传图片成功,`);
				console.log(e);
				
				uni.hideLoading()
				
				// 继续提交数据
				this.confirm()
			},
			
			// 上传图片失败
			filefail(e) {
				// 上传图片失败
				console.log(`上传图片失败`);
				console.log(e);
				
				uni.hideLoading()
				uni.showToast({
					title: this.i18n.error.uploaderror,
					icon: 'none'
				});
			},
			
			// 查看大图
			previewImg(index) {
				
				// 组装预览图的数据
				let previewimgArr = this.imgArr.map(item => (item.path))
				// 开始预览
				uni.previewImage({
					urls: previewimgArr,
					current: index
				})
				
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
				
				// 内容校验
				let content = _this.content
				// if(!_this.content) {
				// 	_this.showbtnanimation()
				// 	return
				// }
				
				// 开始上传
				// 检查是否需要上传图片
				if(this.imgArr.find(item => { return item.progress == 0 })) {
					// 开始上传图片
					uni.showLoading()
					
					this.$refs.filepickerref.upload()
					return
				}
				
				// 上传图片已经成功 此时开始提交其他数据
				let imgs = this.imgArr.map(item => (item.url)).join(',')
				
				const db = uniCloud.database();
				let data = {
					title: _this.title,
					content: _this.content,
					image: imgs
				}
				
				// 新增
				if(_this.type === 'add') {
					
					
					db.collection('notice').add(data).then(response => {
						if(response.result.code == 0) {
							
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
							
						}
						else {
							uni.showToast({
								title: _this.i18n.error.optionerror,
								icon: 'none'
							});
						}
					}).catch(error => {
						uni.showToast({
							title: error.message,
							icon: 'none'
						});
					})
					
				}
				// 编辑
				else if(_this.type === 'edit') {
					
					
					db.collection('notice').doc(_this.id).update(data)
					.then(response => {
						if(response.result.code == 0) {
							
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
							
						}
						else {
							uni.showToast({
								title: _this.i18n.error.optionerror,
								icon: 'none'
							});
						}
					}).catch(error => {
						uni.showToast({
							title: error.message,
							icon: 'none'
						});
					})
					
				}
				
			},
		
		},
	}
</script>

<style lang="scss" scoped>

</style>
