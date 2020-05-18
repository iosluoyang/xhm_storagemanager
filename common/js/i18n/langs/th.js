const th = {
	
	// 基础语言包
	base: {
		
		hello: "สวัสดีครับ",	
		tip: "เตือนภัย",
		admin: "ผู้ดูแล",
		normaladmin: "ผู้ดูแลทั่วไป",
		female: "เพศหญิง",
		male: "เพศชาย",
		edit: "แก้ไข",
		save: "บันทึก",
		add: "เพิ่ม",
		preview: "แสดงผล",
		select: "โปรดเลือก",
		cancel: "ยกเลิก",
		confirm: "ยืนยัน",
		click: "Click",
		here: "Here",
		toaddmore: "to add more",
		all: "ทั้งหมด",
		other: "อื่นๆ",
		search: "ค้นหา",
		scrollto: "เลื่อนไปที่",
		success: "สำเร็จ",
		fail: "ผิดพลาด",
		needtowait: "โปรดรอสักครู่……",
		choosable: "Optional",
		all: "All",
		other: "Other",
		onekeyclone: "Clone",
		fix: "Fix",
	
	},
	
	// 导航栏主分类
	nav: {
		homepage: "หน้าหลัก",
		scan: "สแกน",
		goodstype: "ประเภท",
		goodslist: "รายการสินค้า",
		goodsdetail: "ข้อมูลสินค้า",
		handlerpriceandstock: "Edit Price",
		addgoods: "เพิ่มสินค้า",
		editgoods: "แก้ไขสินค้า",
		stock: "จัดการคลังสินค้า",
		managepeople: "รายการชื่อผู้ดูแล",
		addmember: "เพิ่มผู้ดูแล",
		editmember: "แก้ไขรายชื่อ",
		operationlog: "ประวัติการเข้าใช้งาน",
		me: "ฉัน",
		resetpwd: "ตั้งค่า",
		persondetail: "ข้อมูลส่วนตัว"
	},
	
	// 提示
	tip: {
		
		useinapp: "โปรดเข้าใช้งานในแอปพลิเคชั่น",
		loadingstr: "โปรดรอระบบกำลังทำงาน",
		loginsuccess: "การเข้าใช้งานสำเร็จ",
		logoutsuccess: "การออกจากระบบสำเร็จ",
		addsuccess: "การเพิ่มสำเร็จ",
		fixsuccess: "การแก้ไขสำเร็จ",
		deletesuccess: "การลบข้อมูลเสร็จสิ้น",
		resetsuccess: "การเริ่มต้นใหม่เสร็จสิ้น",
		pleaselogin: "กรุณาเข้าสู่ระบบ",
		defaultusername: "ผู้ใช้ทั่วไป",
		exitconfirm: "คุณแน่ใจว่า ต้องการจะออกจากระบบ",
		datawillcleartip: "ข้อมูลจะหายไป หากคุณยืนยันการออกจากระบบ",
		freezeconfirm: "คุณแน่ใจว่าต้องการระงับ/ ยกเลิกการระงับผู้ใช้งาน",
		deleteconfirm: "คุณต้องการยืนยันการลบข้อมูล",
		resetconfirm: "คุณต้องการยืนยันการรีเซ็ต",
		searchpeople: "ค้นหาจาก ชื่อผู้ใช้งาน",
		searchtype: "ค้นหาจาก ประเภทสินค้า",
		searchproduct: "ค้นหาจาก ชื่อสินค้า",
		deletetypecontent: "สินค้าที่ถูกจัดในหมวดนี้จะถูกย้ายไปในหมวดอื่น คุณสามารถตั้งค่าประเภทได้ภายหลัง",
		pleaseselectgoodstype: "โปรดเลือกประเภทสินค้า",
		lackstocktip: "Please click preview button and fill up the stock and price infos",
		pleaseselectgoodspec: "กรุณาเลือกรายละเอียดสินค้า",
		pleasescangoodsbarcode: "Please scan the QR Code",
		ifsuretofixstock: "Are you sure to do the stock IN/OUT ?",
		
	},
	
	// 错误提示
	error: {
		networkerror: "เครือข่ายอินเตอร์เน็ตขัดข้อง",
		loaderror: "การโหลดขัดข้อง",
		configerror: "การดึงแฟ้มข้อมูลขัดข้อง",
		picuploaderror: "การเพิ่มภาพขัดข้อง",
		chooseimgovererror: "ภาพเกินจำนวนที่กำหนด",
		scanerror: "หาข้อมูลไม่พบ",
		qrcodewithoutgoods: "ไม่พบผลิตภัณฑ์",
		adderror: "การเพิ่มขัดข้อง",
		fixerror: "การแก้ไขขัดข้อง",
		deleteerror: "การลบข้อมูลขัดข้อง",
		reseterror: "การรีเซ็ตขัดข้อง",
		account: "กรุณาใส่ข้อมูลบัญชีผู้ใช้",
		password: "กรุณาใส่พาสเวิร์ด",
		oldpwd: "กรุณาใส่พาสเวิร์ดเก่า",
		newpwd: "กรุณาใส่พาสเวิร์ดใหม่",
		newpwdagain: "รหัสไม่ตรงกัน",
		loginerror: "การเข้าระบบขัดข้อง",
		logouterror: "การออกจากระบบขัดข้อง",
		getmemberlisterror: "การดึงข้อมูลรายชื่อผู้ใช้งานขัดข้อง",
		deleteusererror: "การลบรายชื่อผู้ใช้ขัดข้อง",
		getgoodstypeerror: "การดึงข้อมูลจากประเภทขัดข้อง",
		lacktypenameerror: "ไม่มีข้อมูลที่ค้นหา",
		lacktyperemarkerror: "ไม่มีข้อมูลที่ค้นหา",
		lackspec: "ไม่มีข้อมูลที่ค้นหา",
		getspecserror: "การค้นหาแบบเจาะจง ขัดข้อง",
		lackgoodsmainpic: "โปรดเพิ่มข้อมูลรูปภาพ",
		lackgoodstitle: "กรุณาใส่ชื่อสินค้า",
		lackgoodstype: "กรุณาเลือกประเภทสินค้า",
		lackgoodsdes: "Please enter the description",
		uploaderror: "การเพิ่มข้อมูลขัดข้อง",
		lackemail: "We have not know your Email, would you like to fill up the Email first ?",
		
	},
	
	// 业务相关
	
	// 登录页面
	login: {
		account: "ชื่อบัญชี",
		password: "รหัส",
		loginstr: "เข้าระบบ",
	},
	
	// 首页
	homepage: {
		title: "หน้าหลัก",
	},
	
	// 成员管理
	managepeople: {
		
		handlemember: {
			name: "ชื่อผู้ใช้",
			account: "ชื่อบัญชี",
			remark: "ตำแหน่ง",
			remarkplaceholder: "คำอธิบายเพิ่มเติม",
			freezemember: "ระงับผู้ใช้งาน",
			freeze: "ระงับ",
			unfreeze: "ยกเลิกการระงับ",
			userfreeze: " ผู้ใช้ไม่สามารถเข้าใช้งานได้",
			userunfreeze: "ยกเลิกการระงับ",
			resetmemberpwd: "ตั้งค่ารหัสผู้ใช้งาน",
			resetmemberpwdtip: "รหัสใช้งานคือ 123456 หลังจากที่คุณตั้งค่าผู้ใช้งาน ผู้ใช้งานจะสามารถเปลี่ยนรหัสผ่าน",
			deleteuser: "ลบผู้ใช้งาน",
		},
		
	},
	
	// 我的
	me: {
		
		appversion: "รุ่น",
		exit: "ออก",
		
		panel: {
			proqrcode: "QR Code",
			mytask: "งานของฉัน",
			myupload: "การใส่ข้อมูล ของฉัน",
			feedback: "การตอบรับ",
			myoperation: "การปฏิบัติการ",
			more: "……"
		},
		
		// 修改密码
		resetpwd: {
			oldpwd: "รหัสเก่า",
			newpwd: "รหัสใหม่",
			newpwdagain: "ยืนยันรหัสใหม่"
		},
		
		persondetail: {
			avatar: "ภาพแทน",
			nickname: "ชื่อเล่น",
			realname: "ชื่อจริง",
			account: "บัญชีผู้ใช้",
			phone: "เบอร์โทรศัพท์",
			email: "อีเมล",
			gender: "เพศ",
			usertype: "ประเภทผู้ใช้งาน",
			signature: "ลายเซ็น",
		},
		
		buildqrcode: {
			qrcodenum: "QR code amount",
			tips: "Please enter the amounts of the qrcode which you want to build , we will soon send to your Email",
		},
		
	},
	
	// 商品分类相关
	goodstype: {
		currenttype: "ประเภทในปัจจุบัน",
		addtypetitle: "เพิ่มประเภท",
		addtypenametitle: "ชื่อประเภท",
		addtypenameplaceholder: "กรุณาใส่ชื่อประเภท",
		addtypedesplaceholder: "กรุณาใส่คำอธิบายประเภทของสินค้า",
	},
	
	// 商品相关
	goods: {
		
		pricestr: "Price",
		costprice: "ราคาทุน",
		price: "ราคาขาย",
		agentprice: "Agent Price",
		creditprice: "Credit Price",

		stock: "จำนวนในคลัง",
		sellnum: "จำนวนที่ขาย",
		specindex: "ดัชนี",
		filter: {
			goodstype: "ประเภทสินค้า",
			sortway: "จัดการรายการ",
			defaultsort: "รายการตั้งต้น",
			stockascend: "จำนวนในคลัง น้อย - มาก",
			stockdecrease: "จำวนวนในคลัง มาก - น้อย",
			sellnumascend: "จำนวนยอดขาย น้อย - มาก",
			sellnumdecrease: "จำนวนยอดขาย มาก - น้อย"
		},
		
		handlegoods: {
			goodspic: "ภาพ",
			goodstitle: "ชื่อสินค้า",
			goodsdes: "คำอธิบาย",
			goodsdesplaceholder: "กรุณาใส่คำบรรยายสินค้า",
			goodsbarcode: "บาร์โค้ด",
			goodstype: "ประเภท",
			goodsspec: "ลักษณะจำเพาะ",
			goodsspeclist: "รายการลักษณะจำเพาะ",
			addspecname: "เพิ่มลักษณะจำเพาะ",
			addspecnameholder: "เช่น สี, ขนาด, วัสดุ",
			addspecvalueholder: "เช่น สีแดง",
			tabletip: "เลื่อนไปทางซ้าย เพื่อตรวจสอบข้อมูลให้ครบถ้วน",
			clonetip: "Click clone and copy the first data to others",
			deletegoods: "ลบสินค้าตัวนี้",
			
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
		amount: "Amount",
		typestocknumplacholder: "Please enter the Amount",
		stockin: "Stock In",
		stockout: "Stock Out",
	},
	
	
}

export default th