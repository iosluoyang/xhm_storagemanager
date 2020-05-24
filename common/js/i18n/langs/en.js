const en = {
	
	// 基础语言包
	base: {
		
		hello: "Hello",
		tip: "Tips",
		admin: "Admin",
		normaladmin: "Normal Admin",
		female: "female",
		male: "male",
		edit: "Edit",
		save: "Save",
		add: "Add",
		preview: "Preview",
		select: "Please Select",
		cancel: "Cancel",
		confirm: "Confirm",
		print: "Print",
		download: "DownLoad",
		click: "Click",
		here: "Here",
		toaddmore: "to add more",
		all: "All",
		other: "Other",
		search: "Search",
		scrollto: "Scrollto",
		success: "success",
		fail: "fail",
		needtowait: "Coming soon……",
		choosable: "Optional",
		all: "All",
		other: "Other",
		onekeyclone: "Clone",
		fix: "Fix",
		week: {
			Monday: "Monday",
			Tuesday: "Tuesday",
			Wednesday: "Wednesday",
			Thursday: "Thursday",
			Friday: "Friday",
			Saturday: "Saturday",
			Sunday: "Sunday"
		},
		time: {
			everyday: "Every Day",
			workingday: "Working Day",
		},
		
		
		
	
	},
	
	// 导航栏主分类
	nav: {
		homepage: "Homepage",
		scan: "Scan",
		goodstype: "Classification",
		goodslist: "Product List",
		goodsdetail: "Product Detail",
		handlerpriceandstock: "Edit Price",
		addgoods: "Upload Product",
		editgoods: "Edit Product",
		stock: "Stock",
		customer: "Customer",
		addcustomer: "Add Customer",
		editcustomer: "Edit Customer",
		operationlog: "Operation Log",
		me: "Me",
		resetpwd: "Reset",
		persondetail: "Personal Detail",
		
	},
	
	// 提示
	tip: {
		
		useinapp: "Please use in App",
		loadingstr: "Loading",
		loginsuccess: "login success",
		logoutsuccess: "logout success",
		addsuccess: "add success",
		fixsuccess: "edit success",
		savesuccess: "save success",
		deletesuccess: "delete success",
		resetsuccess: "reset success",
		pleaselogin: "please login",
		defaultusername: "Default Name",
		exitconfirm: "Are you sure to exit?",
		freezeconfirm: "Are you sure to freeze/unfreeze this user ?",
		deleteconfirm: "Are you sure to delete?",
		resetconfirm: "Are you sure to reset?",
		searchpeople: "Search by the User Name",
		searchtype: "Search by the Classification",
		searchproduct: "Search by the Product Name",
		deletetypecontent: "the products which belong to this classification will be moved to the other classification, you can set their classification later",
		pleaseselectgoodstype: "Please select the product type",
		lackstocktip: "Please click preview button and fill up the stock and price infos",
		pleaseselectgoodspec: "Please select the specification",
		pleasescangoodsbarcode: "Please scan the QR Code",
		ifsuretofixstock: "Are you sure to do the stock IN/OUT ?",
		findnewversion: "New Version coming , Download now ?",
		notinworkingtime: "You are not in the working time",
		loginotherplace: "You've logined in other platform, please login again",
		pleaseselectpricetype: "Please select the type of price(Optional)",
	},
	
	// 错误提示
	error: {
		networkerror: "network error",
		loaderror: "load error",
		configerror: "get the config file error",
		picuploaderror: "upload pictures error",
		chooseimgovererror: "exceed the maxinum of the picture",
		scanerror: "nothing valid",
		qrcodewithoutgoods: "Cannot find the product by this QR code",
		adderror: "add error",
		fixerror: "edit error",
		deleteerror: "delete error",
		reseterror: "reset error",
		account: "please enter the account",
		password: "please enter the password",
		oldpwd: "please enter the original password",
		newpwd: "please enter the new password",
		newpwdagain: "the password is not same",
		loginerror: "login error",
		logouterror: "logout error",
		getmemberlisterror: "get the memberlist error",
		deleteusererror: "delete user error",
		getgoodstypeerror: "get the classification error",
		lacktypenameerror: "lack the classification name",
		lacktyperemarkerror: "lack the classification description",
		lackspec: "lack the specification params",
		getspecserror: "get specification error",
		lackgoodsmainpic: "please upload the picture",
		lackgoodstitle: "please enter the title",
		lackgoodstype: "Please select the classification",
		lackgoodsdes: "Please enter the description",
		uploaderror: "upload error",
		lackemail: "We have not know your Email, would you like to fill up the Email first ?",
		overtimeerror: "Start time cannot later then End time",
		
		
	},
	
	// 业务相关
	
	// 登录页面
	login: {
		account: "Account",
		password: "Password",
		loginstr: "Login",
	},
	
	// 首页
	homepage: {
		title: "Homepage",
	},
	
	// 成员管理
	managepeople: {
		
		handlemember: {
			addmember: "Add Member",
			editmember: "Edit Member",
			name: "Member name",
			account: "Account",
			remark: "Member Remark",
			remarkplaceholder: "Please descripe this member",
			freezemember: "Freeze this member",
			freeze: "freeze",
			unfreeze: "unfreeze",
			userfreeze: "Frozen, this member can do nothing",
			userunfreeze: "Unfrozen",
			resetmemberpwd: "Reset Member Password",
			resetmemberpwdtip: "the password will be 123456 after you reset it , they can modify the password after you reset it",
			deleteuser: "deleter this member",
		},
		
	},
	
	// 我的
	me: {
		
		appversion: "Version",
		exit: "Exit",
		
		panel: {
			proqrcode: "QR Code",
			mytask: "My Task",
			managepeople: "Member",
			feedback: "Feedback",
			workingtime: "Working Time",
			notice: "Notification",
			more: "More",
		},
		
		// 修改密码
		resetpwd: {
			oldpwd: "Original Password",
			newpwd: "New password",
			newpwdagain: "Confirm New password"
		},
		
		persondetail: {
			avatar: "Avatar",
			nickname: "Nickname",
			realname: "RealName",
			account: "Account",
			phone: "Phone",
			email: "Email",
			gender: "Gender",
			usertype: "User Type",
			signature: "Signature",
		},
		
		buildqrcode: {
			qrcodenum: "QR code amount",
			tips: "Please enter the amounts of the qrcode which you want to build , we will soon send to your Email",
		},
		
		workingtime: {
			starttime: "Start Time",
			endtime: "End Time",
		},
		
		customer: {
			customerId: "Customer ID",
			customerimg: "Avatar",
			customername: "Name",
			customerremark: "Remark",
			customerremarkplaceholder: "You can enter some remark for this customer",
			companyname: "Company Name",
			customerphone: "Phone",
			deletecustomer: "Delete Customer",
			
		},
		
		notice: {
			publishnotice: "Add Notification",
			editnotice: "Edit Notification",
			noticeplaceholder: "Please enter the notification content"
		}
		
	},
	
	// 商品分类相关
	goodstype: {
		currenttype: "Current Classification",
		addtypetitle: "Add Classification",
		addtypenametitle: "Name",
		addtypenameplaceholder: "Enter the name of Classification",
		addtypedesplaceholder: "Enter the description of Classification",
	},
	
	// 商品相关
	goods: {
		
		pricestr: "Price",
		costprice: "Cost Price",
		price: "Sale Price",
		agentprice: "Agent Price",
		creditprice: "Credit Price",
		
		stock: "Stock",
		sellnum: "Selling",
		specindex: "Index",
		filter: {
			goodstype: "Product Classification",
			sortway: "Sort Order",
			defaultsort: "Default Sort",
			stockascend: "Stock Number Ascending",
			stockdecrease: "Stock Number Decreasing",
			sellnumascend: "Selling Number Ascending",
			sellnumdecrease: "Selling Number Decreasing"
		},
		
		handlegoods: {
			goodspic: "Picture",
			goodstitle: "Title",
			goodsdes: "Description",
			goodsdesplaceholder: "Please enter the description of the product",
			goodsbarcode: "BarCode",
			goodstype: "Classification",
			goodsspec: "Specification",
			goodsspeclist: "Specification List",
			addspecname: "Add Spec",
			addspecnameholder: "eg: Color",
			addspecvalueholder: "eg: Red",
			tabletip: "Scroll to Left can check all the data",
			clonetip: "Click clone and copy the first data to others",
			deletegoods: "Delete this product",
			
		},
		
		goodsdetail: {
			selected: "Selected",
			fixcostprice: "Edit CostPrice",
			fixprice: "Edit Price",
			stockrecord: "Stock Record",
			
		},
		
	},
	
	// 库存相关
	stock: {
		todaystocksituation: "Stock Data Today",
		until: "Until",
		protitle: "Title",
		amount: "Amount",
		customer: "Customer",
		pricetype: "Price Type",
		operatime: "Time",
		operapeople: "Employee",
		
		typestocknumplacholder: "Please enter the Amount",
		stockin: "Stock In",
		stockout: "Stock Out",
	},
	
	// 数据汇总相关
	report: {
		
		// 库存相关数据汇总
		stockreport: {
			outstockcount: "Stock Out",
			instockcount: "Stock In",
			paytotalnum: "Money Out",
			earntotalnum: "Money In"
		},
		
		
	},	
	
}

export default en