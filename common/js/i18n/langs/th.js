const th = {
	
	// 公共参数
	base: {
		
		copy: "Copy",
		paste: "Paste",
		edit: "Edit",
		delete: "Delete",
		search: "Search",
		quotation: "Quotation",
		searchhistory: "Search Record",
		cancel: "Cancel",
		confirm: "Confirm",
		save: "Save",
		translate: "文/A",
		customerservice: "Service",
		favor: "Favor",
		addtocart: "Add to Box",
		buynow: "Buy Now",
		uploadimg: "Upload Images",
		share: "Share",
		setshareparam: "Set Share Content",
		refuse: "Refuse",
		agree: "Agree",
		sorttype: "SortType",
		defaultusername: "Default Username",
		needtowait: "Coming Soon",
		login: "Login",
		register: "Register",
		havequestion: "Need Help",
		tip: "Tips",
		unknown: "Unknown",
		male: "Male",
		female: "Female",
		add: "Add",
		default: "Default",
		pricedesc: "Price Desc",
		priceasc: "Price Asc",
		sellnumdesc: "SellNum Desc",
		paynow: "Pay Now",
		analysis: "Analysis",
		single: "Single Model",
		multiple: "Multiple Model",
		intotal: "In Total",
		checkall: "check all",
	},
	
	// 导航栏主分类
	nav: {
		
		wish: "Wish",
		wishlist: "WishList",
		profavor: "Favor List",
		procategory: "Category",
		prodetail: "Product Detail",
		shoppingcart: "ShoppingCart",
		makeorder: "Make Order",
		wishdetail: "Wish Detail",
		me: "Me",
		wallet: "Wallet",
		bill: "Bill",
		financialmanage: "Financial Manage",
		storemanage: "Store Manage",
		addressmanage: "Address Manage",
		shipping: "Shipping",
		notice: "Notice",
		resetpwd: "Reset Password",
		orderdetail: "Order Detail",
		payment: "Payment",
		scan: "Scan",

	},
	
	// 占位文本
	placeholder: {
		
		login: {
			account: "Input Account",
			password: "Input Password",
			passwordagain: "Input Password Again",
			selectrole: "Select Role",
		},
		
		handlewish: {
			link: "Please paste 1688 link",
			title: "Input Product Title",
			aliasname: "use for searching,eg: #LAL0716",
			amount: "Input Amount",
			warehouse: "Please select Warehouse & ShippingWay",
			shippingcode: "Please input shipping code",
			selectamount: "Select Amount",
			hurrylevel: "Select HurryLevel",
			remark: "Input Remark",
			image: "Upload Images",
		},
		
		wishlistlist: {
			search: "search by title/aliasname",
		},
		
		wishdetail: {
			typeinternationshippingfee: "Input Unit Shipping fee(TH)",
		},
		
		handletimeline: {
			typecontent: "Input Content",
			typedomesticshippingfee: "Input Shipping fee(CN)",
			typecommissionfee: "Input Commission Fee",
		},
		
		me: {
			notice: {
				title: "Input Notice Title",
				content: "Input Content, all the people will see it after publish",
			}
		}
		
		
	},
	
	// 正常提示
	tip: {
		
		loadingstr: "Loading…",
		deleteconfirm: "Are you sure to Delete?",
		exitconfirm: "Are you sure to Exit?",
		optionconfirm: "Are you sure to Operate?",
		addsuccess: "Add Success",
		copysuccess: "Copy Success",
		fixsuccess: "Edit Success",
		deletesuccess: "Delete Success",
		optionsuccess: "Operate Success",
		subsribewxmsg: "click Confirm and the option 'Always select above options ' to subscribe the notification, we will notifiy you once the status was changed",
		pleaselogin: "Please Login",
		loginsuccess: "Login Success",
		logoutsuccess: "Logout Success",
		needtoregister: "This account doesnt exist , do you want to register ?",
		pleasechecknetwork: "Please check your network",
		pleaseinputcontent: "Please input content",
		pleaseinputrightcontent: "Please input right content",
		
	},
	
	// 错误提示
	error: {
		
		loaderror: "Load Error",
		adderror: "Add Error",
		fixerror: "Edit Error",
		optionerror: "Operation Error",
		uploaderror: "Upload Error",
		
	},
	
	// 业务相关
	
	login: {
		
		typeoldpwd: "Input Original Password",
		typenewpwd: "Input New Password",
		typenewagainpwd: "Password and Confirm Password are not same",
		registerandlogin: "Register Success, Auto-Login Now",
		accountunbindwx:"Current account doesnt bind wechat yet, do you want to bind now ? \n You can Login by wechat once you bind .",
		bindwxalready: "Current account already bind wechat , will unbind the previous wechat and bind current wechat if you want to continue.",
		wxunbindaccount: "This wechat doesnt bind any account , please login by account first then bind the wechat",
		
	},
	
	// 心愿单相关
	wishlist: {
		
		common: {
			product: "Product",
			link: "Link",
			title: "Title",
			aliasname: "Alias Name",
			price: "Price",
			amount: "Amount",
			warehouse: "Warehouse",
			shippingcode: "ShippingCode",
			sellnum: "Sell Number",
			spec: "Specification",
			params: "Parameter",
			summary: "Summary",
			pricesummary: "Price Summary",
			remark: "Remark",
			hurrylevel: "Hurry Level",
			boxcontainernum: "Packing",
			boxsize: "Unit Size",
			boxlength: "Length",
			boxwidth: "Width",
			boxheight: "Height",
			boxvolume: "Unit Volume",
			boxamount: "Number of box",
			boxweight: "Unit Weight",
			thirdplatformtype: "Platform Type",
			thirdplatformordernum: "Platform OrderNum",
			domesticshippingfee: "Shippingfee(CN)",
			domesticshippingname: "Shipping Name(CN)",
			domesticshippingnum: "Shipping Number(CN)",
			internationalshippingunitfee: "Unit Shippingfee(TH)",
			internationalshippingfee: "Shipping Fee(TH)",
			internationalshippingname: "Shipping Name(TH)",
			internationalshippingcode: "Shipping Code(TH)",
			secretcodetip: "copy the code and recognize in 1688 (will expired soon in 7 days) ",
			pureurltip: "Copy the Link and open by system brower if 1688 cannot recognize the code",
			lackspectip: "Missing Specification",
			timeline: "TimeLine",
			hurryleveldata: {
				level1: "Level 1(UnLimited)",
				level2: "Level 2(1 Month)",
				level3: "Level 3(2 weeks)",
				level4: "Level 4(11 week)",
				level5: "Level 5(3 days)"
			},
			achieveflagdata: {
				all: "All",
				unbindwish: "Unbinding",
				ing: "On Process",
				waittoconfirm: "To Confirm",
				waittopay: "To pay",
				makeorder: "To Purchase",
				waitreceive: "To Receive",
				finish: "Finished",
				closed: "Closed",
			},
			buyagain: "Buy Again",
			agentbindwish: "Bind Wish",
			agentbindallwish: "Bind All Wish",
			tabledata: {
				index: "Index",
				title: "Name",
				attribute1: "Attr 1",
				image: "Image",
				spec: "Specification",
				attribute2: "Attr 2",
				price: "Price",
				amount: "Amount",
				summary: "Summary",
				totalsummary: "Total Summary",
				proprice: "Product Price",
				domesticshippingfee: "Shipping Fee(CN)",
				commissionfee: "Commission Fee",
				accrudeexpense: "Total Payment",
				
			}
			
		},
		
		// 心愿单首页页面index
		index: {
			searchplaceholder: "Paste 1688 link to search",
		},
		
		// 商品详情页面prodetail
		prodetail: {
			detail: "Detail",
			attribute: "Attribute",
			tradeprotocol: "Instruction",
			stock: "Stock",
			havenolinkprodata: "Cant find this product , Do you want to add it manually ?",
		},
		
		// 处理心愿单页面handlewish
		handlewish: {
			ifound: "I Found",
			iwant: "I Want",
		},
		
		// 我的心愿列表页面list
		list: {
			
			all: "All",
			agentstatus: {
				title: 'Bind Status',
				unbind: 'UnBind',
				bind: 'Bind'
			},
			paystatus: {
				title: 'Pay Status',
				unpay: 'unPay',
				pay: 'Paid'
			},
			purchasestatus: {
				title: 'Purchase Status',
				unpurchase: 'UnPurchase',
				purchase: 'Purchase'
			}
			
		},
		
		// 心愿详情页面wishdetail
		wishdetail: {
			internationalshippingcalculator: "Shipping Calculator",
			approximatefee: "Approximate Fee",
			calculatorresulttip: "Please input your unit shipping fee and box amount, system will calculate the approximate fee"
		},
		
		// 时间轴相关
		timeline: {
			
			title: "TimeLine",
			startsign: "Wish Start",
			editsign: "Wish Edit",
			finishsign: "Wish Finished",
			wishtitle: "WishList",
			addcomment: "Say Something",
			addext: "Fill Information",
			confirmquotation: "Confirm Quotation",
			addpurchaseinfo: "Fill Purchase Information",
			editquotation: "Edit Quotation",
			
			purchasetip: "Once you Confirm to import , customer will receive the notification , please make sure customer already paid",
			confirmquotationtip: "Once you Confirm the quotation , customer will receive the notification , Are you sure to continue ?",
			wishagentbindtip: "Hi, I am your Wish Agent , will do my best to offer the service",
			wishupdatequotationtip: "Already updated the newest quotation , please check the details above, agent will start to purchase once you click agree",
			wishconfirmquotationagenttip: "Customer already confirmed the quotation , please make the order ASAP",
			wishconfirmquotationcustomertip: "You already confirmed the quotation , the agent will make the order ASAP, please wait patiently(If you have not pay yet , please pay first)",
			agreequotation: "Already Agree the Quotation",
			refusequotation: "Already Refused the Quotation",
			importpro: "Purchase Product",
			paytime: "Pay Time",
			confirmproductreceive: "Confirm Product Receive",
			wishrefusequotationagenttip: "Customer refused the quotation , please make the new quotation",
			wishrefusequotationcustomertip: "You already refused the quotation , the agent will make the new quotation for you soon, please wait patiently",
			wishfinishpay: "Customer already paid",
			wishfinishpurchase: "Agent already Made the order , please notice the order status",
			
		},
		
		// 心愿订单相关
		wishorder: {
			
			status:{
				topay: 'pay',
				todelivery: 'delivery',
				toreceive: 'receive',
				done: 'done'
			},
			checkwishorder: "Check wish order",
			receiveall: "Receive All",
			receiveallconfirm: "Please make sure that you got all products",
			receiveparttip: "You just got some of the products, will continue recording later",
			receivealltip: "You got all the products, please check the total amount",
			receiveparts: "Receive Parts",
			shippinginfo: "Shipping Info",
			shipping: {
				shippingname: "Shipping Name",
				shippingnum: "Shipping Number",
				shippingremark: "Shipping Remark",
				shippingpic: "Shipping Picture"
			},
			purchaseinfo: "Purchase Info",
			orderinfo: "Order Info",
			confirminfo: "Confirm Info",
			pleaseinputthirdordernum: "Please input the order Number",
			totalproprice: "Product Price",
			totaldomesticshippingfee: "Shipping Fee(CN)",
			totalcommissionfee: "Commission Fee",
			totalorderprice: "Order Price",
			paytype: "pay Type",
			makeordertime: "Purchase Time",
			paytime: "Pay Time",
			deliverytime: "Delivery Time",
			receivetime: "Receive Time",
			purchase: "Purchase",
			delivery: "Delivery Order",
			receive: "Confirm received",
			rate: "Rate",
			timeupclosetip: "Payment time up, Do you want to close this order?",
			havetrackingnum: "With Tracking Num",
			havenotrackingnum: "Without Tracking Num",
			pleaseinputshippingname: "Please input Shipping Name",
			pleaseinputshippingnum: "Please input Shipping Number",
			pleaseinputmultipleshippingnum: "You can input multiple shipping number , click the tranfer button on the right to analysis",
			receiverecord: "Receive Record",
			pleasechoosereceivealltype: "System found that you already received all the products, please choose receive all",
		},
		
	},
	
	// 我的
	me: {
		
		appversion: "App Version",
		exit: "Logout",
		
		panel: {
			feedback: "Feedback",
			more: "More",
		},
		
		resetpwd: {
			oldpwd: "Original Password",
			newpwd: "New Password",
			newpwdagain: "Confirm New Password"
		},
		
		persondetail: {
			avatar: "Avatar",
			nickname: "Nick Name",
			realname: "Real Name",
			account: "Account",
			phone: "Phone",
			email: "Email",
			gender: "Gender",
			usertype: "User Role",
			wechat: "Wechat",
			signature: "Signature",
		},
		
		notice: {
			publishnotice: "Publist Notice",
			editnotice: "Edit Notice",
			title: "Title",
			content: "Content",
		},
		
		wallet: {
			income: "Income",
			expense: "Expense",
			charge: "Charge",
			balance: "Balance",
			openwallet: "Open Wallet Account",
			openwallettip: "You have not open the wallet account, please click confirm to open. You can pay with the wallet balance after, and we will have more discount and promotion to offer, come and open now !",
			balancetip: "The platform admin needs to confirm after you charged the wallet balance, balance will update once the admin confirmed, please wait a minute .",
			chargetip: "Please input charge amount or select charge packages",
			pleasetypepaypassword: "Please Input PayPassword",
			pleasetyenewpaypassword: "Please Input New PayPassword",
			pleasetypepaypasswordagain: "Please Input PayPassword Again",
			paypasswordwrong: "Wrong Password, please try again",
			changepaypassword: "Change PayPassword",
			closewallet: "Close Wallet Account",
			paymentimgtip: "Please Upload Payment Picture",
			billType: {
				0: "Normal Order",
				1: "Wish Order",
				2: "Customer charge",
				3: "Platform Gift"
			},
		},
		
		address: {
			name: "Name",
			mobile: "Mobile",
			address: "Address",
			shippingcode: "ShippingCode",
			alias: "Alias",
			setdefault: "Set Default",
		}
	},
	
	// 角色相关
	role: {
		
		admin: {
			title: 'Admin',
			des: 'All permission included'
		},
		MERCHANT_ADMIN: {
			title: 'Merchant Admin',
			des: 'Own store , can manage store and buy product'
		},
		PRODUCT_AGENT: {
			title: 'Product Agent',
			des: 'Everyone can make the money'
		},
		SHIPPING_ADMIN: {
			title: 'Shipping Admin',
			des: 'Manage the shipping stuff'
		},
		
	}
	
}

export default th