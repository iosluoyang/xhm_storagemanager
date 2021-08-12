<script>
	import Vue from 'vue';
	
	//设置colorUI中导航栏的高度
	function setcolorUIcustomnavheight() {
		uni.getSystemInfo({
		        success: function(e) {
		            // #ifndef MP
		            Vue.prototype.StatusBar = e.statusBarHeight;
		            if (e.platform == 'android') {
		                Vue.prototype.CustomBar = e.statusBarHeight + 50;
		            } else {
		                Vue.prototype.CustomBar = e.statusBarHeight + 45;
		            };
		            // #endif
		            // #ifdef MP-WEIXIN
		            Vue.prototype.StatusBar = e.statusBarHeight;
		            let custom = wx.getMenuButtonBoundingClientRect();
		            Vue.prototype.Custom = custom;
		            Vue.prototype.CustomBar = custom.bottom
					 + custom.top - e.statusBarHeight;
		            // #endif       
		            // #ifdef MP-ALIPAY
		            Vue.prototype.StatusBar = e.statusBarHeight;
		            Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
		            // #endif
		        }
		    })
	}

	//设置colorUI中的颜色
	function setcolorUIcolor() {
		Vue.prototype.ColorList = [{
				title: '嫣红',
				name: 'red',
				color: '#e54d42'
			},
			{
				title: '桔橙',
				name: 'orange',
				color: '#f37b1d'
			},
			{
				title: '明黄',
				name: 'yellow',
				color: '#fbbd08'
			},
			{
				title: '橄榄',
				name: 'olive',
				color: '#8dc63f'
			},
			{
				title: '森绿',
				name: 'green',
				color: '#39b54a'
			},
			{
				title: '天青',
				name: 'cyan',
				color: '#1cbbb4'
			},
			{
				title: '海蓝',
				name: 'blue',
				color: '#0081ff'
			},
			{
				title: '姹紫',
				name: 'purple',
				color: '#6739b6'
			},
			{
				title: '木槿',
				name: 'mauve',
				color: '#9c26b0'
			},
			{
				title: '桃粉',
				name: 'pink',
				color: '#e03997'
			},
			{
				title: '棕褐',
				name: 'brown',
				color: '#a5673f'
			},
			{
				title: '玄灰',
				name: 'grey',
				color: '#8799a3'
			},
			{
				title: '草灰',
				name: 'gray',
				color: '#aaaaaa'
			},
			{
				title: '墨黑',
				name: 'black',
				color: '#333333'
			},
			{
				title: '雅白',
				name: 'white',
				color: '#ffffff'
			},
		]
	}
	
	export default {
		onLaunch: function() {
			
			// 设置colorUI中导航栏的高度
			setcolorUIcustomnavheight()
			// 设置colorUI中的颜色
			setcolorUIcolor()
			
			this.setGlobalInterceptor()
			
			// 初始化完成时  加载配置信息
			this.$store.dispatch('app/setConfigData').then(response => {
				// 此时配置信息已经加载成功并且保存到本地
			}).catch(error => {
				// 配置信息加载失败,提示用户
				uni.showToast({
					title: this.i18n.error.configerror,
					icon: 'none'
				});
			})
			
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			
			// 设置全局拦截器
			setGlobalInterceptor() {
				
				const _this = this
				
				let interceptor = {
					
				  invoke(param) {
					  // console.log(`拦截器获取到的API参数为:`);
					  // console.log(param);
				    // param为拦截Api的参数 例 {name: 'functionName', data: {'functionParam1': 1, 'functionParam2': 2}}
				    // 此处返回错误可终止api执行
				  },
				  success(res) {
					  // res为callFunction的返回值，此处可以对返回值进行修改
					  // console.log(`接口调用的返回值为:${JSON.stringify(res)}`);
					  let code = res.result.code
					  // console.log(`接口调用错误码为:${code}`);
					  
					  // 返回成功
					  if(code == 0) {
					  	return res
					  }
					  // token过期则提示用户重新登录
					  else if(code == 30203) {
					  	_this.havetologin()
					  }
					  // token 不合法
					  else if(code == 30202) {
					  	_this.havetologin()
					  }
					  // 查询用户信息不存在
					  else if(code == 80301) {
					  	_this.havetologin()
					  }
					  // 非法token
					  else if(code == 30204) {
					  	_this.havetologin()
					  }
					  
					  // 系统错误
					  else if(code == 'SYSTEM_ERROR' || code == 'FUNCTION_EXCUTE_ERROR') {
						  uni.showToast({
						  	title: _this.i18n.tip.pleasechecknetwork,
						  	icon: 'none'
						  });
					  }
					  
					  // 其他情况一律报加载失败
					  else {
						// uni.showToast({
						// 	title: _this.i18n.error.loaderror,
						// 	icon: 'none'
						// });
					  }
					  
					  return res
				  },
				  fail(err) {
					  // err为callFunction抛出的错误
					  console.log(`接口调用失败`);
					  console.log(err.message);
					  return err
				  },
				  complete(res){
					  // complete内res为上面的res或err
					  // console.log(`接口调用完成`)
					  // console.log(res)
				  }
				
				}
				
				// 增加全局拦截器
				uniCloud.addInterceptor('callFunction', interceptor)
				uniCloud.addInterceptor('database', interceptor)
				
				
			},
			
			// 强制登录
			havetologin() {
				
				const _this = this
				_this.$store.dispatch('user/resettoken').then(() => {
					
					uni.navigateTo({
						url: '/pages/base/login'
					});
					setTimeout(function() {
						
						uni.showToast({
							title: _this.i18n.tip.pleaselogin,
							icon: 'none'
						});
						
					}, 1000);
					
				})
				
			},
			
		},
	}
</script>

<style lang="scss">
	@import "@/common/style/index.scss";
</style>
