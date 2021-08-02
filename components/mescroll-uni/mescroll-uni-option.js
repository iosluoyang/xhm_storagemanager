// 全局配置
// mescroll-body 和 mescroll-uni 通用
const GlobalOption = {
	down: {
		use: true, // 是否启用下拉刷新; 默认true
		auto: true, // 是否在初始化完毕之后自动执行下拉刷新的回调; 默认true
		autoShowLoading: true,
		isLock: false, // 锁定
		
		// 其他down的配置参数也可以写,这里只展示了常用的配置:
		textInOffset: 'Pull Down', // 下拉的距离在offset范围内的提示文本
		textOutOffset: 'Release', // 下拉的距离大于offset范围的提示文本
		textLoading: 'Loading ...', // 加载中的提示文本
		offset: 80, // 在列表顶部,下拉大于80px,松手即可触发下拉刷新的回调
		native: false // 是否使用系统自带的下拉刷新; 默认false; 仅在mescroll-body生效 (值为true时,还需在pages配置enablePullDownRefresh:true;详请参考mescroll-native的案例)
	},
	up: {
		use: true, // 是否启用上拉加载; 默认true
		auto: false, // 是否在初始化完毕之后自动执行上拉加载的回调; 默认true
		page: {
			num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
			size: 10, // 每页数据的数量,默认10
			date: '', // 请求时间标识   后台在第一页数据中返回 之后原样返回给后台即可
		},
		
		// 其他up的配置参数也可以写,这里只展示了常用的配置:
		textLoading: 'Loading ...', // 加载中的提示文本
		textNoMore: '-- END --', // 没有更多数据的提示文本
		offset: 80, // 距底部多远时,触发upCallback
		isBounce: false, // 默认禁止橡皮筋的回弹效果, 必读事项: http://www.mescroll.com/qa.html?v=190725#q25
		toTop: {
			// 回到顶部按钮,需配置src才显示
			src: "http://www.mescroll.com/img/mescroll-totop.png?v=1", // 图片路径 (建议放入static目录, 如 /static/img/mescroll-totop.png )
			offset: 1000, // 列表滚动多少距离才显示回到顶部按钮,默认1000px
			right: 20, // 到右边的距离, 默认20 (支持"20rpx", "20px", "20%"格式的值, 纯数字则默认单位rpx)
			bottom: 120, // 到底部的距离, 默认120 (支持"20rpx", "20px", "20%"格式的值, 纯数字则默认单位rpx)
			width: 72 // 回到顶部图标的宽度, 默认72 (支持"20rpx", "20px", "20%"格式的值, 纯数字则默认单位rpx)
		},
		empty: {
			use: true, // 是否显示空布局
			icon: "http://www.mescroll.com/img/mescroll-empty.png?v=1", // 图标路径 (建议放入static目录, 如 /static/img/mescroll-empty.png )
			tip: '~ No Data ~' // 提示
		}
	}
}

export default GlobalOption
