const zh = {
	
	// 基础语言包
	base: {
		
		hello: "你好",
		tip: "提示",
		admin: "超级管理员",
		normaladmin: "普通用户",
		female: "女",
		male: "男",
		edit: "编辑",
		del: "删除",
		save: "保存",
		add: "新增",
		refuse: "拒绝",
		agree: "同意",
		copy: "复制",
		paste: "粘贴",
		preview: "预览",
		select: "请选择",
		cancel: "取消",
		confirm: "确定",
		print: "打印",
		download: "下载",
		click: "点击",
		here: "此处",
		toaddmore: "去添加更多",
		other: "其他",
		search: "搜索",
		scrollto: "滚动至",
		success: "成功",
		fail: "失败",
		needtowait: "敬请期待……",
		choosable: "可选",
		all: "全部",
		other: "其他",
		onekeyclone: "一键克隆",
		fix: "修改",
		week: {
			Monday: "周一",
			Tuesday: "周二",
			Wednesday: "周三",
			Thursday: "周四",
			Friday: "周五",
			Saturday: "周六",
			Sunday: "周日"
		},
		time: {
			everyday: "每天",
			workingday: "工作日",
		},
		
	
	},
	
	// 导航栏主分类
	nav: {
		homepage: "主页",
		scan: "扫一扫",
		goodstype: "分类管理",
		goodslist: "商品列表",
		goodsdetail: "商品详情",
		handlerpriceandstock: "修改价格",
		addgoods: "上传商品",
		editgoods: "编辑商品",
		stock: "库存管理",
		customer: "客户关系",
		addcustomer: "添加客户",
		editcustomer: "编辑客户",
		operationlog: "操作日志",
		me: "个人中心",
		resetpwd: "修改密码",
		persondetail: "个人资料",
		logistic: "物流管理",
		checklogistic: "物流查询",
		wishlist: "心愿单",
	},
	
	// 提示
	tip: {
		
		useinapp: "请在APP中使用该功能",
		loadingstr: "加载中",
		loginsuccess: "登录成功",
		logoutsuccess: "登出成功",
		addsuccess: "添加成功",
		fixsuccess: "修改成功",
		savesuccess: "保存成功",
		deletesuccess: "删除成功",
		resetsuccess: "重置成功",
		pleaselogin: "请登录",
		defaultusername: "默认用户",
		exitconfirm: "确定退出吗?",
		freezeconfirm: "确定冻结/解冻该用户吗？",
		deleteconfirm: "确定删除吗?",
		resetconfirm: "确定重置吗?",
		searchpeople: "输入成员名称进行搜索",
		searchtype: "输入分类名称进行搜索",
		searchproduct: "输入商品名称进行搜索",
		deletetypecontent: "删除分类后该分类下的所有商品将自动转为其他分类,后续需要您手动设置",
		pleaseselectgoodstype: "请选择商品分类",
		lackstocktip: "请点击预览并补充商品的价格和库存信息",
		pleaseselectgoodspec: "请先选择商品规格",
		pleasescangoodsbarcode: "请扫描商品上的二维码",
		ifsuretofixstock: "确定进行出库/入库操作吗?",
		findnewversion: "发现新版本,点击下载",
		notinworkingtime: "您不在工作时间范围内",
		loginotherplace: "您的账号已经在其他地方登录,请重新登录",
		pleaseselectpricetype: "价格类型  (出库时选择)",
	},
	
	// 错误提示
	error: {
		networkerror: "网络错误",
		loaderror: "获取失败",
		configerror: "获取配置文件失败",
		picuploaderror: "上传图片失败",
		chooseimgovererror: "图片数量超出限制",
		scanerror: "扫描失败,暂未获取有效内容",
		qrcodewithoutgoods: "该二维码未关联商品",
		adderror: "添加失败",
		fixerror: "修改失败",
		deleteerror: "删除失败",
		reseterror: "重试失败",
		account: "请输入正确的账号",
		password: "请输入正确的密码",
		oldpwd: "请输入正确的原始密码",
		newpwd: "请输入正确的新密码",
		newpwdagain: "两次密码输入不一致",
		loginerror: "登录失败",
		logouterror: "登出失败",
		getmemberlisterror: "获取成员列表失败",
		deleteusererror: "删除人员失败",
		getgoodstypeerror: "获取分类失败",
		lacktypenameerror: "缺少分类名称",
		lacktyperemarkerror: "缺少分类描述",
		lackspec: "缺少商品规格参数",
		getspecserror: "获取商品规格失败",
		lackgoodsmainpic: "请上传商品图片",
		lackgoodstitle: "请输入商品标题",
		lackgoodstype: "请选择商品分类",
		lackgoodsdes: "请输入商品描述",
		uploaderror: "上传失败",
		lackemail: "您还未补充邮箱,是否前往补充邮箱地址?",
		overtimeerror: "开始时间不能晚于结束时间",
		
		
	},
	
	// 业务相关
	
	// 登录页面
	login: {
		account: "账号",
		password: "密码",
		loginstr: "登录",
	},
	
	// 首页
	homepage: {
		title: "主页",
	},
	
	// 成员管理
	managepeople: {
		
		handlemember: {
			addmember: "添加人员",
			editmember: "编辑人员",
			name: "人员名称",
			account: "账号信息",
			remark: "人员备注",
			remarkplaceholder: "请描述一下该人员的职责和角色分工",
			freezemember: "冻结用户",
			freeze: "冻结",
			unfreeze: "解冻",
			userfreeze: "已冻结,该用户无法进行一切操作",
			userunfreeze: "未冻结,该用户可以进行操作",
			resetmemberpwd: "重置用户密码",
			resetmemberpwdtip: "重置后该人员登录密码为初始密码123456,重置之后该人员可自行修改密码",
			deleteuser: "删除用户",
		},
		
	},
	
	// 我的
	me: {
		
		appversion: "版本号",
		exit: "退出登录",
		
		panel: {
			proqrcode: "商品二维码",
			mytask: "我的任务",
			managepeople: "人员管理",
			feedback: "反馈",
			workingtime: "工作时间",
			notice: "公告栏",
			more: "更多",
		},
		
		// 修改密码
		resetpwd: {
			oldpwd: "旧密码",
			newpwd: "请输入新密码",
			newpwdagain: "确认新密码"
		},
		
		persondetail: {
			avatar: "头像",
			nickname: "昵称",
			realname: "真实姓名",
			account: "账号",
			phone: "手机号",
			email: "邮箱",
			gender: "性别",
			usertype: "用户身份",
			signature: "个人简介",
		},
		
		buildqrcode: {
			qrcodenum: "二维码数量",
			tips: "输入您想要生成的商品二维码数量,我们会在稍后将文件发送至您的邮箱,请在查收后下载打印并张贴到您的商品上。",
		},
		
		workingtime: {
			starttime: "开始时间",
			endtime: "结束时间",
		},
		
		customer: {
			customerId: "客户id",
			customerimg: "客户头像",
			customername: "客户姓名",
			customerremark: "客户备注",
			customerremarkplaceholder: "可以在这里添加客户备注",
			companyname: "公司名称",
			customerphone: "客户电话",
			deletecustomer: "删除该客户",
		},
		
		notice: {
			publishnotice: "发布公告",
			editnotice: "编辑公告",
			noticeplaceholder: "请输入公告内容,发布后所有成员均可见"
		}
		
	},
	
	// 商品分类相关
	goodstype: {
		currenttype: "当前选中的分类",
		addtype: "添加分类",
		edittype: "编辑分类",
		addtypenametitle: "分类名称",
		addtypenameplaceholder: "请输入商品分类名称",
		addtypedesplaceholder: "请描述一下该商品分类",
	},
	
	// 商品相关
	goods: {
		pricestr: "价格",
		costprice: "成本价",
		price: "平台售价",
		agentprice: "代理价",
		creditprice: "授信价",
		
		stock: "库存",
		sellnum: "日销量",
		specindex: "规格索引",
		filter: {
			goodstype: "商品分类",
			sortway: "排序方式",
			defaultsort: "默认排序",
			stockascend: "按库存量升序",
			stockdecrease: "按库存量降序",
			sellnumascend: "按销量升序",
			sellnumdecrease: "按销量降序"
		},
		
		handlegoods: {
			goodspic: "商品图片",
			goodstitle: "商品标题",
			goodsdes: "商品简介",
			goodsdesplaceholder: "请简要描述一下该商品的特性和内容",
			goodsbarcode: "商品标识码",
			goodstype: "商品分类",
			goodsspec: "商品规格",
			goodsspeclist: "规格列表",
			addspecname: "新增规格",
			addspecnameholder: "属性名,如: 颜色",
			addspecvalueholder: "属性值,如: 红色",
			tabletip: "向左滑动可查看完整数据",
			clonetip: "点击clone可复制第一个规格数据到其他规格",
			deletegoods: "删除商品",
			
		},
		
		goodsdetail: {
			selected: "已选",
			fixcostprice: "修改成本价",
			fixprice: "修改售价",
			stockrecord: "库存记录",
			
		}
		
	},
	
	// 库存相关
	stock: {
		todaystocksituation: "今日出入库数据",
		recentlystocksituation: "最近库存数据",
		until: "截止至",
		protitle: "商品名称",
		amount: "数量",
		customer: "客户信息",
		pricetype: "价格类型",
		operatime: "操作时间",
		operapeople: "操作人",
		
		typestocknumplacholder: "请输入出/入库数量",
		stockin: "入库",
		stockout: "出库",
	},
	
	// 数据汇总相关
	report: {
		
		// 库存相关数据汇总
		stockreport: {
			outstockcount: "出库量",
			instockcount: "入库量",
			paytotalnum: "总出账",
			earntotalnum: "总入账",
			
		},
		
		
	},
	
	// 心愿单相关
	wishlist: {
		
		producttitle: "商品标题",
		sourcelink: "源网站链接",
		targetlink: "网站链接",
		sourceprice: "源网站价格",
		targetprice: "目标价格",
		targetamount: "目标数量",
		hurrylevel: "紧急程度",
		hurryleveldata: {
			level1: "一级(无限制)",
			level2: "二级(1个月内)",
			level3: "三级(2周内)",
			level4: "四级(1周内)",
			level5: "五级(3天内)"
		},
		uploadimg: "图片上传",
		remark: "备注",
		found: "我发现",
		wishdetail: "心愿详情",
		achieveFlag: {
			finish: "已完成",
			waittoconfirm: "待确认",
			ing: "进行中",
		},
		timeline: {
			title: "时间轴",
			updatetimeline: "更新时间轴",
			targetpriceerror: "请输入目标价格",
			timelinecontenterror: "请输入更新内容",
			startsign: "心愿单开始"
		},
		
		
	},
	
	
}

export default zh