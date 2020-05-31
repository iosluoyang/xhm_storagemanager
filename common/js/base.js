// 公共js类  封装一些常用的基础函数方法
import store from '@/store'
import md5 from 'js-md5'
import defaultconfig from '@/common/config/base.js'
import ossuploadjs from '@/common/js/upload/upload.js'
import jwxjs from '@/common/js/jwxjs.js'

// 返回供应商名称  用于生成二维码的前缀
export function storeName() {
	return 'มาริสาสัตว์เลี้ยง'
}

/**
 * 判断是否是H5的微信环境
 */
export function ifwxH5(){
	// #ifdef H5
	let ua = window.navigator.userAgent.toLowerCase();
	return ua.match(/MicroMessenger/i) == 'micromessenger';
	// #endif
	return false
}

// 只判断是否已经登录的标识 如果已经登录则返回true  如果没有登录则返回false
export function ifloginflag(){
	
	var user = store.getters.user
	if(!user || user === {}){
		//没有用户信息 表示还没有登录
		return false
	}
	else{
		return true
	}
}

// 判断是否登录  如果未登录则跳转至登录页面 返回一个promise
export function checklogin(){
	
	var promise = new Promise((resolve) => {
		var user = store.getters.user
		// 用户不存在
		if(!user || user === {}){
			// 首先记录当前的路由 以便于登录之后跳转至正确的原始页面
			// var currentpages = getCurrentPages()
			// var beforeloginroute = '/' + currentpages[currentpages.length - 1].route
			// // 本地存储记录登录之后要跳转的路由
			// uni.setStorageSync('beforeloginroute',currentroute)
			// 跳转至登录页面
			uni.navigateTo({
				url: '/pages/base/login'
			});
		}
		// 用户存在 说明是已经登录的页面 成功回调
		else{
			resolve()
		}
	})
	return promise
	
}

// 获取硬件设备码
function _getimei(){
	
	// 如果是 APP 平台则根据iOS和安卓的不同选择不同的设备码
	  
	// #ifdef APP-PLUS
	if (uni.getSystemInfoSync().platform == "ios") {
	return plus.device.uuid
	}
	else if (uni.getSystemInfoSync().platform == "android") {
		return plus.device.imei
	}
	else{
		return ''
	}
	// #endif
	// 如果是非APP端的话则返回空字符串
	return ''
	
}

// 获取请求客户端标识（“01”微信小程序，“02”wap商城，“03”安卓，“04”IOS）
function _getclient_flag(){
	// #ifdef MP-WEIXIN
	return '01'
	// #endif
	// #ifdef H5
	return '02'
	// #endif
	// #ifdef APP-PLUS
	if (uni.getSystemInfoSync().platform == "android") {
		return '03'
	} else if (uni.getSystemInfoSync().platform == "ios") {
		return '04'
	}
	// #endif
	return ''
}

// 获取基础接口请求的参数包装
export function getrequestbasepara(requestdata){
	
	/**
	 * 格式化为指定格式的时间字符串
	 * @param {(Object|string|number)} time
	 * @param {string} cFormat
	 * @returns {string}
	 */
	function parseTime(time, cFormat) {
	  if (arguments.length === 0) {
	    return null
	  }
	  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
	  let date
	  if (typeof time === 'object') {
	    date = time
	  } else {
	    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
	      time = parseInt(time)
	    }
	    if ((typeof time === 'number') && (time.toString().length === 10)) {
	      time = time * 1000
	    }
	    date = new Date(time)
	  }
	  const formatObj = {
	    y: date.getFullYear(),
	    m: date.getMonth() + 1,
	    d: date.getDate(),
	    h: date.getHours(),
	    i: date.getMinutes(),
	    s: date.getSeconds(),
	    a: date.getDay()
	  }
	  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
	    let value = formatObj[key]
	    // Note: getDay() returns 0 on Sunday
	    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
	    if (result.length > 0 && value < 10) {
	      value = '0' + value
	    }
	    return value || 0
	  })
	  return time_str
	}
	
	
	// 添加必传参数的数据
	var originaldata = {}
	// 时间戳 格式为2019-01-01 03:07:50
	var timestampstr = parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}')
	originaldata.timestamp = timestampstr
	// 业务参数 如果没有业务参数则传{}空对象
	originaldata.info = JSON.stringify(requestdata || {})
	// auth信息
	
	// 设备信息
	var systeminfo = uni.getSystemInfoSync()
	
	var authdic = {
		
		uid: store.getters.user ? store.getters.user.uid  : '', // 用户uid
		account: store.getters.user ? store.getters.user.account : '', // 用户账号
		imei: _getimei(), //硬件设备码
		os: systeminfo.platform,		// 设备的操作系统，如：iphone
		os_version: systeminfo.system,		// 系统版本号
		devicetype: systeminfo.brand + systeminfo.model,	// 设备类型(手机品牌-手机型号)例如”SM-N9006”
		app_version: defaultconfig.app_version(),	// App当前版本号信息
		client_flag: _getclient_flag(), // 请求客户端标识（“01”微信小程序，“02”wap商城，“03”安卓，“04”IOS）
		config_version: store.getters.configVersion || '', // 配置文件的版本号记录
		
	}
	
	originaldata.auth = JSON.stringify(authdic)
	
	// 签名字符串 使用MD5的方式进行签名，待签名字符串为， timestamp=xxx&app_key 其中app_key为后台提供
	var originalsign = 'timestamp=' + timestampstr + '&' + defaultconfig.app_key()
	var sign = md5(originalsign)
	originaldata.sign = sign.toUpperCase()
	// 应用id
	originaldata.app_id = defaultconfig.app_id()
	
	return originaldata
	
}

// OSS直传方式上传图片 传入本地图片文件(以数组的形式)， 注意要上传图片文件而不是地址，因为在H5平台要进行exif的测试,需要拿到文件内容
export function uploadmultipleimgs(templeFilesArr){
	
	return ossuploadjs.ossuploadmultipleimgs(templeFilesArr)
	
}

// 对象或者数组的深拷贝
export function deepCopy(obj) {
	
    var result = Array.isArray(obj) ? [] : {};
	
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
		  
        if (typeof obj[key] === 'object' && obj[key]!==null) {
          result[key] = deepCopy(obj[key]);   //递归复制
        } else {
          result[key] = obj[key];
        }
		
      }
    }
    return result;
}

// 完善之后的获取本地图片
let imageInput = null;
export function chooseImage({ count, sizeType, sourceType, success }) {
  
  if (!count) {
	  count = 1
  }
  if (!sizeType) {
	  sizeType = ['original', 'compressed']
  }
  if (!sourceType) {
	  sourceType = ['album','camera']
  }
  
  // 如果是H5端则通过document来进行操作
  // #ifdef H5
  // TODO handle sizeType 尝试通过 canvas 压缩
  
  // 创建上传input框
  const _createInput = function(options) {
    let inputEl = document.createElement("input");
    inputEl.type = "file";
    inputEl.accept = "image/*";
	inputEl.style.display='none';
    if (options.count > 1) {
      inputEl.multiple = "multiple";
    }
    // 经过测试，仅能限制只通过相机拍摄，不能限制只允许从相册选择。
    if (options.sourceType.length === 1 && options.sourceType[0] === "camera") {
      inputEl.capture = "camera";
    }
  
    return inputEl;
  };
  
  if (imageInput) {
    document.body.removeChild(imageInput);
    imageInput = null;
  }
  
  imageInput = _createInput({
    count: count,
    sourceType: sourceType
  });
  
  document.body.appendChild(imageInput);
  
  imageInput.addEventListener("change", function(event) {
    const tempFilePaths = [];
    const tempFiles = [];
    const fileCount = event.target.files.length;
    for (let i = 0; i < fileCount; i++) {
      const file = event.target.files[i];
      const filePath = fileToUrl(file);
  
      tempFilePaths.push(filePath);
      tempFiles.push({
        path: filePath,
        file: file,
        size: file.size
      });
    }
  
    success({
      errMsg: "chooseImage:ok",
      tempFilePaths: tempFilePaths,
      tempFiles: tempFiles
    });
  
    // TODO 用户取消选择时，触发 fail，目前尚未找到合适的方法。
  });
  
  imageInput.click();
  
  // #endif
  
  // #ifndef H5
  uni.chooseImage({
  	count:count,
	sizeType: sizeType,
	sourceType:sourceType,
	success: success
  })
  // #endif
  
}

// 将获取本地文件的url 仅H5端生效
export function fileToUrl(file) {
	
	// #ifdef H5
	var url = (window.URL || window.webkitURL).createObjectURL(file);
	return url;
	// #endif
	return null
}

// 扫描二维码
export function scanQR() {
	
	let scanpromise = new Promise((resolve,reject) => {
		
		// 开始扫一扫
		
		// H5平台
		// #ifdef H5
		
		// 如果是微信H5环境则调用jwxjs功能
		if(ifwxH5()) {
			jwxjs.configjwxjs((wx) => {
				// 调用扫一扫功能
				console.log(`获取到了wx对象`);
				// 开始扫一扫
				wx.checkJsApi({
					jsApiList: ['scanQRCode', 'chooseImage', 'openLocation'],
					success: function(res) {
						console.log(`检查结果为:${JSON.stringify(res.checkResult)}`);
						// 如果支持扫一扫
						if(res.checkResult['scanQRCode']) {
							
							wx.scanQRCode({
							  needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
							  scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
							  success: function (res) {
								  
							    var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
								if(result.indexOf(storeName()) !== -1) {
									// 找到了有效的内容  截取标识字符串
									let vaildcontent = result.replace(storeName(),'')
									resolve(vaildcontent)
								}
								else{
									// 不是规范的扫码内容 返回当前非规范的扫码内容
									reject(result)
								}
								
							  }
							});
							
						}
					}
				})
			})
		}
		// 其他环境提示用户使用APP
		else{
			uni.showToast({
				title: 'Please open in App',
				icon: 'none',
			});
		}
		// #endif
				
		// 如果是非H5平台则直接调用扫一扫
		// #ifndef H5
		// 调用扫码功能
		uni.scanCode({
			onlyFromCamera: false,
			scanType: ['qrCode','barCode','datamatrix','pdf417'],
			success(res) {
				// 扫描成功 检测扫码的结果
				if(res.result) {
					let result = res.result
					if(result.indexOf(storeName()) !== -1) {
						// 找到了有效的内容  截取标识字符串
						let vaildcontent = result.replace(storeName(),'')
						resolve(vaildcontent)
					}
					else{
						// 不是规范的扫码内容 返回当前非规范的扫码内容
						reject(result)
					}
				}
				// 没有扫描结果
				else{
					
				}
			},
			fail() {
				// 识别失败，用户取消的时候均进入fail回调 此时不进行任何的操作
			}
		})
		// #endif
		
	})
	
	return scanpromise
}

export default {
	storeName, // 返回供应商名称  用于生成二维码的前缀
	ifwxH5, // 是否是微信H5环境
	ifloginflag,//判断是否登录 仅仅返回是否登录的状态标识 返回true或者false
	checklogin,//判断是否登录  如果未登录则跳转至登录页面 返回一个promise
	getrequestbasepara,//获取基础接口请求的参数包装
	uploadmultipleimgs,//上传图片
	deepCopy, //深拷贝方法
	chooseImage, //完善之后的获取图片方法
	fileToUrl, //将获取本地文件的url 仅H5端生效
	scanQR, // 开始扫描二维码
}