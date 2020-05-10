import store from '@/store'
import Exif from '@/common/js/upload/exif.js'


//图片压缩配置的参数
var limitimgobj = {
	maxwidth: 1000,
	maxheight: 1000,
	ql: 0.92
}

//获取随机数
function random_string(len) {
	 
    len = len || 32;
    var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';   
    var maxPos = chars.length;
    var pwd = '';
    for (let i = 0; i < len; i++) {
		pwd += chars.charAt(Math.floor(Math.random() * maxPos));
	}
    return pwd;
}

//oss图片上传
function ossuploadmultipleimgs(templeFilesArr){
	
	return new Promise((finalresolve,finalreject) => {
		
		//如果上传图片数组为空数组则直接返回成功
		if(!templeFilesArr || templeFilesArr.length === 0){
			finalresolve([])
			return
		}
		
		//开始获取上传签名
		store.dispatch('app/getosssignobj').then(osssignobj => {
			//获取oss签名信息成功
			
			//开始压缩图片 传入本地文件数组  处理完之后返回每一张图片的信息对象
			compressImages(templeFilesArr).then(compressedimgobjarr => {
				
				var promiseArr = []
				var totaltip = ''
				
				// 首先循环初始化上传图片的promise
				for (var i = 0; i < compressedimgobjarr.length; i++) {
					
					// 创建promise
					var promise = new Promise((uploadresolve,uploadreject) => {
						
						// 图片信息
						let imageinfo = compressedimgobjarr[i].imageinfo
						// 最终图片路径
						let finalpath = compressedimgobjarr[i].finalpath
						// 最终图片尺寸
						let finalwidth = imageinfo.ifcompress ? parseInt(imageinfo.compressedWidth).toString() : parseInt(imageinfo.originalWidth).toString()
						let finalheight = imageinfo.ifcompress ? parseInt(imageinfo.compressedHeight).toString() : parseInt(imageinfo.originalHeight).toString()
						
						// 打印图片信息
						let str1 = `第${i + 1}张图片：\n压缩前: ${(imageinfo.originalSize / 1024).toFixed(2)}kb\n`
						let str2 = `是否压缩：${imageinfo.ifcompress}\n`
						let str3 = imageinfo.ifcompress ? `压缩后: ${(imageinfo.compressedSize / 1024).toFixed(2)}kb \n压缩率: ${ ((imageinfo.originalSize - imageinfo.compressedSize) / imageinfo.originalSize * 100).toFixed(2) }%\n` : '\n'
						let imgstr = str1 + str2 + str3
						totaltip += imgstr
						
						//文件名称 = _w宽_h高_32位随机数.文件后缀
						let imgname = '_w' + finalwidth + '_h' + finalheight + random_string() + '.' + imageinfo.ext
						//文件名称
						let filename = osssignobj.fileprefix + imgname
						//文件完成路径
						let filepath = osssignobj.dir + filename
						
						//开始上传
						const upload_task = uni.uploadFile({
							url: osssignobj.host,
							filePath: finalpath,
							name: 'file',
							formData:{
							    'key': filepath,
							    'policy': osssignobj.policy,
							    'OSSAccessKeyId': osssignobj.accessid, 
							    'success_action_status': '200', //让服务端返回200,不然，默认会返回204
							    'signature': osssignobj.signature,
							},
							success(res) {
								if (res.statusCode == 200) {
									uploadresolve(filepath)
								}
								else{
									//接口返回错误  则清空当前的oss签名信息
									uni.removeStorageSync('osssignobj')
									uploadreject('上传失败,请重试')
								}
							},
							fail(err) {
								uploadreject(`上传失败,${err.errMsg}`)
							}
						})
					
					})
					
					promiseArr.push(promise)
					
				}
				
				Promise.all(promiseArr).then(imgUrlArr => {
					uni.hideLoading()
					finalresolve(imgUrlArr)
				}).catch(error => {
					uni.hideLoading()
					finalreject(JSON.stringify(error))
				})
				
			}).catch(error => {
				uni.hideLoading()
				//压缩图片失败
				finalreject(JSON.stringify(error))
			})
			
		}).catch(error => {
			//获取oss签名信息失败 直接返回失败
			finalreject(JSON.stringify(error))
		})
		
	})
	
}

// 压缩图片且矫正图片角度
async function compressImages (templeFilesArr) {
  var allpromise = []
  for (var i = 0; i < templeFilesArr.length; i++) {
	var tempfile = templeFilesArr[i]
    var filePath = tempfile.path
	var fileSize = tempfile.size

	// for循环中使用promise要加await以确保promise如期运行
    var promise = await new Promise((compressresolve, compressreject) => {
		
		// #ifdef H5
		// 只有H5平台下才会有file字段
		var file = tempfile.file
		
		// 获取图片元信息 解决ios及部分安卓手机图片旋转90度的问题
		let Orientation = null
		try{
			Exif.getData(file, function () {
				
				Orientation = Exif.getTag(file, 'Orientation')
				
				console.log(`当前图片的角度为:${Orientation}`)
				
				var image = new Image()
				image.onload = function() {
					// 将原图片传入  返回处理之后的图片信息
					var finalimgdic = compresseachimg(tempfile, this, Orientation)
					compressresolve(finalimgdic)
				}
				
				image.onerror = function(e) {
					compressreject(e)
				}
				image.src = filePath
			})
		}catch(e){
			//TODO handle the exception
			console.log(`该图片暂不能获取exif信息`);
		}
		
		
		
		// #endif
		
		// #ifndef H5
		// 获取原始图片的大小尺寸信息等
		
		uni.getImageInfo({
			src: filePath,
			success: function (originalinfores) {
				// 图片的相关信息
				var originalimageinfo = {
					originalWidth: parseInt(originalinfores.width), // 原始图片宽度
					originalHeight: parseInt(originalinfores.height), // 原始图片高度
					ext: originalinfores.type, // 图片类型(拓展名)
					ifcompress: true, // 图片是否压缩  默认为true
				}
				// 获取原始图片的内存大小
				uni.getFileInfo({
					filePath:filePath,
					success: originalfileres => {
						// 获取原始图片内存大小成功
						var originalimgsize = parseInt(originalfileres.size)
						originalimageinfo.originalSize = originalimgsize
						
						// 开始压缩图片 获取压缩图片的信息
						uni.compressImage({
							src:filePath,
							quality: limitimgobj.ql * 100, // 注意APP平台下压缩图片为0~100的数值
							success: compressimg => {
								// 压缩之后的图片路径
								var compressfilepath = compressimg.tempFilePath
								
								// 获取压缩图片的大小尺寸信息等
								uni.getImageInfo({
									src: compressfilepath,
									success(compressedinfores) {
										// 获取压缩图片的宽高信息
										var compressedimageinfo = {
											compressedWidth: parseInt(compressedinfores.width), // 压缩图片宽度
											compressedHeight: parseInt(compressedinfores.height), // 压缩图片高度
										}
										
										uni.getFileInfo({
											filePath: compressfilepath,
											success: compressedfileres => {
												
												//压缩图的大小
												var compressedimgsize = parseInt(compressedfileres.size)
												compressedimageinfo.compressedSize = compressedimgsize // 压缩图片存储大小
												
												var totalimageobj = Object.assign({}, originalimageinfo,compressedimageinfo)
												
												// 比较压缩之后和压缩之前的图片大小 进行是否压缩的选择
												var finalfile
												// 压缩之后的尺寸反而大于原始尺寸 则不用压缩
												if(compressedimgsize > originalimgsize){
													totalimageobj.ifcompress = false
													var comprossedobj = {
														finalpath: filePath,
														imageinfo: totalimageobj
													}
													compressresolve(comprossedobj)
												}
												else{
													totalimageobj.ifcompress = true
													var comprossedobj = {
														finalpath: compressfilepath,
														imageinfo: totalimageobj
													}
													compressresolve(comprossedobj)
												}
												
											},
											fail(error) {
												// 获取压缩图片大小信息失败之后也一样进入成功回调
												originalimageinfo.ifcompress = false
												var comprossedobj = {
													finalpath: filePath,
													imageinfo: originalimageinfo
												}
												compressresolve(comprossedobj)
											}
											
										})
						
									},
									fail(error) {
										// 获取压缩图片信息失败之后也一样进入成功回调
										originalimageinfo.ifcompress = false
										var comprossedobj = {
											finalpath: filePath,
											imageinfo: originalimageinfo
										}
										compressresolve(comprossedobj)
									}
								})
								
							},
							fail: error => {
								// 压缩图片失败也一样进行成功回调
								originalimageinfo.ifcompress = false
								var comprossedobj = {
									finalpath: filePath,
									imageinfo: originalimageinfo
								}
								compressresolve(comprossedobj)
							}
						})
						
					},
					fail: error => {
						// 获取原始图片内存大小失败也一样进行成功回调
						originalimageinfo.ifcompress = false // 设置为非压缩模式
						var comprossedobj = {
							finalpath: filePath,
							imageinfo: originalimageinfo
						}
						compressresolve(comprossedobj)
					}
					
				})
				
			},
			fail: function (e) {
				compressreject(`获取图片信息失败,无法进行oss文件名写入`)
			}
		})
		// #endif
		
    })
    allpromise.push(promise)
  }

  return Promise.all(allpromise)
}

// H5中压缩并处理旋转每一个单独的图片
function compresseachimg (tempfile, image, Orientation) {

	// 原始尺寸大小
	var originalWidth = image.naturalWidth
	var originalHeight = image.naturalHeight
	
	let canvas = document.createElement('canvas')
	let ctx = canvas.getContext('2d')
	
	var maxWidth = limitimgobj.maxwidth, maxHeight = limitimgobj.maxheight
	// 目标尺寸 默认为原尺寸
	var targetWidth = originalWidth, targetHeight = originalHeight
	// 图片尺寸超过限制
	if (originalWidth > maxWidth || originalHeight > maxHeight) {
		
		if (originalWidth / originalHeight > maxWidth / maxHeight) {
			// 更宽，按照宽度限定尺寸
			targetWidth = maxWidth;
			targetHeight = Math.round(maxWidth * (originalHeight / originalWidth))
		} else {
			targetHeight = maxHeight;
			targetWidth = Math.round(maxHeight * (originalWidth / originalHeight))
		}
	}
	
	// canvas对图片进行同比例缩放
	canvas.width = targetWidth
	canvas.height = targetHeight
	
	// 铺底色
	ctx.fillStyle = '#fff'
	ctx.fillRect(0, 0, targetWidth, targetHeight)
	
	// 绘制图片
	ctx.drawImage(image, 0, 0, targetWidth, targetHeight)
	
	// 解决ios旋转90度的问题
	if(Orientation && Orientation !== 1){
		switch(Orientation){
			case 6:     // 旋转90度
				canvas.width = targetHeight;    
				canvas.height = targetWidth;    
				ctx.rotate(Math.PI / 2);
				// (0,-targetHeight) 从旋转原理图那里获得的起始点
				// 首先清除原画布内容
				ctx.clearRect(0, 0, targetWidth, targetHeight)
				ctx.drawImage(image, 0, -targetHeight, targetWidth, targetHeight)
				break;
			case 3:     // 旋转180度
				ctx.rotate(Math.PI)
				// 首先清除原画布内容
				ctx.clearRect(0, 0, targetWidth, targetHeight)
				ctx.drawImage(image -targetWidth, -targetHeight, targetWidth, targetHeight)
				break;
			case 8:     // 旋转-90度
				canvas.width = targetHeight  
				canvas.height = targetWidth 
				ctx.rotate(3 * Math.PI / 2)
				// 首先清除原画布内容
				ctx.clearRect(0, 0, targetWidth, targetHeight)
				ctx.drawImage(image, -targetWidth, 0, targetWidth, targetHeight)
				break;
		}
	}
	
	// 进行压缩转化
	let compressedbase64 = canvas.toDataURL(tempfile.file.type, limitimgobj.ql)
	
	// 获取压缩之后的图片大小
	var str = compressedbase64.replace(compressedbase64.split(',')[0] + ',', '')
	var strLength = str.length
	var compressedsize = parseInt(strLength - (strLength / 8) * 2)
	
	// 构建图片信息对象
	var imageinfo = {
		
		originalSize: tempfile.size, // 原始图片存储大小
		originalWidth: originalWidth, // 原始图片宽度
		originalHeight: originalHeight, // 原始图片高度
		
		compressedSize: compressedsize, // 压缩图片存储大小
		compressedWidth: canvas.width, // 压缩图片宽度
		compressedHeight: canvas.height, // 压缩图片高度
		
		ext: tempfile.file.name.split('.')[1], // 图片拓展名
		
		ifcompress: tempfile.size > compressedsize ? true : false, // 图片是否压缩
	}
	
	// 重置画布宽高
	canvas.width = canvas.height = 0
	
	var compressedimagedic = {
		// 当原始图片大小大于压缩图片大小时 返回压缩之后的base64地址 否则返回原文件地址
		finalpath: tempfile.size > compressedsize ? compressedbase64 : tempfile.path ,
		// 图片的相关信息
		imageinfo: imageinfo,
	}
	
	return compressedimagedic

}

export default {
	ossuploadmultipleimgs
}