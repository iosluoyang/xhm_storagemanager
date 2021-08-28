<!-- 二维码弹出框 -->
<template>
	
	<view class="alertqrcode">
		
		<u-popup class="alertqrcodepopview" mode="center" v-model="show" height="auto" border-radius="20" :closeable="false" z-index="999">
			
			<view class="maincontentview" :style="{ width: qrcodeSize + 'px'}">
				
				<!-- 二维码图片 -->
				<image v-if="qrcodeImgSrc" class="qrcodeimg" :style="{width: qrcodeSize + 'px', height: qrcodeSize + 'px'}" :src="qrcodeImgSrc" mode="aspectFit"></image>
				
				<view class="text-sm text-wrap u-line-2 padding-sm">
					{{ qrCodeContent }}
					<text class="cuIcon cuIcon-copy margin-left-sm" @tap.stop="$basejs.copytoclipboard(qrCodeContent)"></text>
				</view>
				
				<!-- <view class="optionbtnview">
					
					
				</view> -->
				
			</view>
			
		</u-popup>
		
		<!-- 画布 -->
		<canvas class="canvasview" :style="{width: qrcodeSize + 'px', height: qrcodeSize + 'px'}" id="customqrcode" canvas-id="customqrcode" />
		
	</view>
	
</template>

<script>
	
	import uQRCode from '@/uni_modules/Sansnn-uQRCode/components/uqrcode/common/uqrcode.js'
	
	var _this
	
	export default {
		
			name:'alertqrcode',
			
			components:{
				
			},
			
			props: {
				
				// 是否显示二维码弹框
				ifshow: {
					type: Boolean,
					default: false,
				},
				
				// 二维码内容
				qrCodeContent: {
					type: String,
					default: ''
				},
				
				// 二维码尺寸 单位px
				qrcodeSize: {
					type: Number,
					default: 200
				},
				
				// 二维码内边距
				qrcodeMargin: {
					type: Number,
					default: 10
				},
				
				//

			},
			
			data() {
				return {
					
					show: this.ifshow, // 是否显示弹框
					
					qrcodeImgSrc: '/static/publicicon/logo.png', // 二维码图片地址
				}
			},
			
			watch: {
				
				ifshow(newValue, oldValue) {
					if(newValue !== oldValue) {
						// console.log(`检测到父组件参数ifshow发生变化-${newValue}`);
						this.show = newValue
						if(this.show) {
							_this.makeCustom()
							// _this.makeQR()
						}
					}
				},
				
				show(newValue, oldValue) {
					if(newValue !== oldValue) {
						// console.log(`检测到组件自身data值show状态发生变化-${newValue}`);
						// 更新props参数保持一致
						this.$emit('update:ifshow', newValue)
					}
				},
				
				// qrCodeContent: {
				// 	handler: function(newValue, oldValue) {
				// 		console.log(newValue, oldValue);
				// 		if(newValue !== oldValue) {
				// 			_this.makeCustom()
				// 		}
				// 	},
				// 	deep: true,
				// 	immediate: true
				// }
				
				qrCodeContent(newValue, oldValue) {
					if(newValue !== oldValue) {
						
					}
				}
				
			},
			
			computed: {
				
			
			},
			
			created() {
				
				_this = this
				
			},
			
			methods: {
	
				// 渲染二维码
				makeQR() {
					
					uQRCode.make({
						canvasId: 'customqrcode',
						componentInstance: this,
						text: _this.qrCodeContent,
						size: _this.qrcodeSize,
						margin: _this.qrcodeMargin,
						backgroundColor: '#ffffff',
						foregroundColor: '#000000',
						fileType: 'png',
						errorCorrectLevel: uQRCode.errorCorrectLevel.H,
						enableDelay: false
					})
					.then(res => {
						console.log(`成功`);
						console.log(res)
						
						let qrcodeImgSrc = res.tempFilePath
						_this.qrcodeImgSrc = qrcodeImgSrc
					})
					.catch(err => {
						console.log(err);
					})
					
				},
				
				makeCustom() {
					
					let qrCodeContent = this.qrCodeContent
				
					// 得到矩阵，可根据返回的矩阵信息自行实现二维码生成，甚至是样式。以下为示例
					var modules = uQRCode.getModules({
						text: qrCodeContent,
						errorCorrectLevel: uQRCode.errorCorrectLevel.H
					})
					
					// 定义样式信息
					var size = _this.qrcodeSize
					var margin = _this.qrcodeMargin
					var tileW = (size - margin * 2) / modules.length
					var tileH = tileW
					var foregroundColor = '#39b54a'
					var backgroundColor = '#ffffff'
				
					// canvas实例
					var canvasId = 'customqrcode'
					var ctx = uni.createCanvasContext(canvasId, this)
					
					// 获取到数据和画布为
					console.log('获取到数据和画布为');
					console.log(modules, ctx);
					
					ctx.setFillStyle(backgroundColor)
					ctx.fillRect(0, 0, size, size)
					for (var row = 0; row < modules.length; row++) {
						for (var col = 0; col < modules.length; col++) {
							// 计算每一个小块的位置
							var x = col * tileW + margin
							var y = row * tileH + margin
							var w = tileW
							var h = tileH
				
							// 画圆，随机颜色
							var style = modules[row][col] ? this.getRandomColor() : backgroundColor
							ctx.setFillStyle(style)
							ctx.beginPath()
							ctx.arc(x + 4, y + 4, w / 2, 0, 2 * Math.PI)
							ctx.fill()
				
							// 画方
							// var style = modules[row][col] ? foregroundColor : backgroundColor
							// ctx.setFillStyle(style)
							// ctx.fillRect(x, y, w, h)
						}
					}
					ctx.draw()
					
					_this.getImage()
					
				},
				
				getImage() {
					
					console.log(`开始转换图片`);
					uni.canvasToTempFilePath({
						x: 0,
						y: 0,
						width: _this.qrcodeSize,
						height: _this.qrcodeSize,
						destWidth: _this.qrcodeSize,
						destHeight: _this.qrcodeSize,
						canvasId: 'customqrcode',
						success: function(res) {
							// 在H5平台下，tempFilePath 为 base64
							console.log(`转换图片成功`);
							// console.log(res.tempFilePath)
							let qrcodeImgSrc = res.tempFilePath
							_this.qrcodeImgSrc = qrcodeImgSrc
						},
						fail: function(err) {
							console.log(`转换图片失败`);
							console.log(err);
						},
						complete:function(res){
							console.log(`转换图片完成`);
							console.log(res);
						}
					}, _this) // 注意此处使用_this代表组件内的实例
					
				},
				
				getRandomColor() {
					const rgb = []
					for (let i = 0; i < 3; ++i) {
						let color = Math.floor(Math.random() * 256).toString(16)
						color = color.length == 1 ? '0' + color : color
						rgb.push(color)
					}
					return '#' + rgb.join('')
				},
				
				saveCustom() {
					uni.canvasToTempFilePath({
						canvasId: 'customqrcode',
						fileType: 'png',
						width: this.qrcodeSize,
						height: this.qrcodeSize,
						destWidth: this.qrcodeSize,
						destHeight: this.qrcodeSize,
						success: (res) => {
							uni.saveImageToPhotosAlbum({
								filePath: res.tempFilePath,
								success: (res) => {
									uni.showToast({
										icon: 'success',
										title: '保存成功'
									})
								},
								fail: (err) => {
									uni.showToast({
										icon: 'none',
										title: JSON.stringify(err)
									})
								}
							})
						},
						fail: (err) => {
							uni.showToast({
								icon: 'none',
								title: JSON.stringify(err)
							})
						}
					}, this)
				},
				
			},
		
	}
	
</script>

<style lang="scss" scope>
	
	.alertqrcode{
		
		.canvasview{
			position: fixed;
			right: 100vw;
			bottom: 100vh;
			z-index: -9999;
			opacity: 0;
		}
		
	}
	
</style>
