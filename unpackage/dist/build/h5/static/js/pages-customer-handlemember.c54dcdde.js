(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-customer-handlemember"],{"2b3c":function(t,n,e){var i=e("e283");"string"===typeof i&&(i=[[t.i,i,""]]),i.locals&&(t.exports=i.locals);var a=e("4f06").default;a("2efc0992",i,!0,{sourceMap:!1,shadowMode:!1})},"2d17":function(t,n,e){"use strict";var i=e("2b3c"),a=e.n(i);a.a},"393b":function(t,n,e){"use strict";e.r(n);var i=e("3c7d"),a=e.n(i);for(var o in i)"default"!==o&&function(t){e.d(n,t,(function(){return i[t]}))}(o);n["default"]=a.a},"3c7d":function(t,n,e){"use strict";var i=e("ee27");Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var a,o=i(e("f3f3")),s={data:function(){return{type:"add",navtitle:"",customerId:null,avatarfile:null,customeravatarimg:null,company:"",customer:"",remark:"",phone:"",ifshowloading:!1,btnanimationname:null}},onLoad:function(t){a=this;var n=t.type;n||uni.navigateBack(),this.type=n,this.navtitle="add"===this.type?this.i18n.nav.addcustomer:this.i18n.nav.editcustomer,uni.setNavigationBarTitle({title:this.navtitle}),"edit"===this.type&&(this.customerId=t.customerId,this.getcustomerdetail())},methods:{getcustomerdetail:function(){this.$api.customerapi.customerdetail({customerId:this.customerId}).then((function(t){var n=t.data.customerInfo;a.customerId=n.customerId,a.customeravatarimg=n.img,a.company=n.company,a.customer=n.customer,a.remark=n.remark,a.phone=n.phone})).catch((function(t){uni.showToast({title:a.i18n.error.loaderror,icon:"none"})}))},chooseimg:function(){a.$basejs.chooseImage({count:1,success:function(t){a.avatarfile=t.tempFiles[0]}})},deletemember:function(){uni.showModal({content:this.i18n.tip.deleteconfirm,showCancel:!0,cancelText:this.i18n.base.cancel,confirmText:this.i18n.base.confirm,success:function(t){if(t.confirm){var n={customerId:a.customerId};a.$api.customerapi.deletecustomer(n).then((function(t){uni.showToast({title:a.i18n.tip.deletesuccess,icon:"none",duration:1500}),uni.$emit("updatecustomer"),setTimeout((function(){uni.navigateBack()}),1500)})).catch((function(t){uni.showToast({title:a.i18n.error.deleteusererror,icon:"none"})}))}}})},showbtnerranimation:function(){a.btnanimationname="shake",setTimeout((function(){a.btnanimationname=null}),1e3)},confirm:function(){var t=this;this.customer&&""!==this.customer?(a.ifshowloading=!0,this.avatarfile?this.$basejs.uploadmultipleimgs([this.avatarfile]).then((function(n){var e=n[0];t.customeravatarimg=e,t.finalsubmit()})).catch((function(t){uni.showToast({title:a.i18n.error.uploaderror,icon:"none"}),a.ifshowloading=!1})):this.finalsubmit()):this.showbtnerranimation()},finalsubmit:function(){var t=this,n={company:this.company,customer:this.customer,remark:this.remark,phone:this.phone,customerId:this.customerId},e=this.customeravatarimg?{img:this.customeravatarimg}:{},i=(0,o.default)({},n,{},e);"add"===this.type?this.$api.customerapi.addcustomer(i).then((function(n){t.ifshowloading=!1,uni.showToast({title:t.i18n.tip.addsuccess,icon:"none",duration:1500}),uni.$emit("updatecustomer"),setTimeout((function(){uni.navigateBack()}),1500)})).catch((function(n){t.ifshowloading=!1,uni.showToast({title:t.i18n.error.adderror,icon:"none"}),t.btnanimationname="shake",setTimeout((function(){t.btnanimationname=null}),1e3)})):"edit"===this.type&&this.$api.customerapi.editcustomer(n).then((function(n){t.ifshowloading=!1,uni.showToast({title:t.i18n.tip.fixsuccess,icon:"none",duration:1500}),uni.$emit("updatecustomer"),setTimeout((function(){uni.navigateBack()}),1500)})).catch((function(n){t.ifshowloading=!1,uni.showToast({title:t.i18n.error.fixerror,icon:"none"}),t.btnanimationname="shake",setTimeout((function(){t.btnanimationname=null}),1e3)}))}}};n.default=s},"525c":function(t,n,e){"use strict";var i,a=function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("v-uni-view",{staticClass:"handlememberview"},[e("cu-custom",{attrs:{bgColor:"bg-gradual-purple",isBack:!0,isBackConfirm:!0}},[e("template",{attrs:{slot:"content"},slot:"content"},[t._v(t._s(t.navtitle))])],2),e("v-uni-form",[e("v-uni-view",{staticClass:"cu-form-group padding",on:{click:function(n){n.stopPropagation(),arguments[0]=n=t.$handleEvent(n),t.chooseimg.apply(void 0,arguments)}}},[e("v-uni-view",{staticClass:"title"},[t._v(t._s(t.i18n.me.customer.customerimg))]),[t.avatarfile||t.customeravatarimg?e("v-uni-view",{staticClass:"cu-avatar round lg",style:{backgroundImage:"url("+(t.avatarfile?t.avatarfile.path:t.imgUrl+t.customeravatarimg)+")"}}):e("v-uni-view",{staticClass:"cu-avatar round lg"},[e("v-uni-text",{staticClass:"cuIcon-people"})],1)]],2),e("v-uni-view",{staticClass:"cu-form-group"},[e("v-uni-view",{staticClass:"title"},[t._v(t._s(t.i18n.me.customer.customername))]),e("v-uni-input",{attrs:{type:"text"},model:{value:t.customer,callback:function(n){t.customer=n},expression:"customer"}})],1),"edit"===t.type?e("v-uni-view",{staticClass:"cu-form-group"},[e("v-uni-view",{staticClass:"title text-gray"},[t._v(t._s(t.i18n.me.customer.customerId))]),e("v-uni-input",{attrs:{disabled:!0,value:t.customerId}})],1):t._e(),e("v-uni-view",{staticClass:"cu-form-group"},[e("v-uni-view",{staticClass:"title"},[t._v(t._s(t.i18n.me.customer.companyname))]),e("v-uni-input",{attrs:{type:"text"},model:{value:t.company,callback:function(n){t.company=n},expression:"company"}})],1),e("v-uni-view",{staticClass:"cu-form-group"},[e("v-uni-view",{staticClass:"title"},[t._v(t._s(t.i18n.me.customer.customerphone))]),e("v-uni-input",{attrs:{type:"number",maxlength:"20"},model:{value:t.phone,callback:function(n){t.phone=n},expression:"phone"}})],1),e("v-uni-view",{staticClass:"cu-bar bg-white margin-top"},[e("v-uni-view",{staticClass:"action"},[t._v(t._s(t.i18n.me.customer.customerremark))])],1),e("v-uni-view",{staticClass:"cu-form-group"},[e("v-uni-textarea",{attrs:{maxlength:"-1",placeholder:t.i18n.me.customer.customerremarkplaceholder},model:{value:t.remark,callback:function(n){t.remark=n},expression:"remark"}})],1),"edit"===t.type?e("v-uni-view",{staticClass:"cu-form-group margin-top",on:{click:function(n){n.stopPropagation(),arguments[0]=n=t.$handleEvent(n),t.deletemember.apply(void 0,arguments)}}},[e("v-uni-view",{staticClass:"title text-red"},[t._v(t._s(t.i18n.me.customer.deletecustomer))])],1):t._e()],1),e("v-uni-view",{staticClass:"btnview padding flex flex-direction"},[e("v-uni-button",{staticClass:"cu-btn bg-gradual-purple round shadow lg",class:[t.btnanimationname?"animation-"+t.btnanimationname:""],attrs:{"data-class":t.btnanimationname?t.btnanimationname:""},on:{click:function(n){n.stopPropagation(),arguments[0]=n=t.$handleEvent(n),t.confirm.apply(void 0,arguments)}}},[t._v(t._s(t.i18n.base.save))])],1),e("loading",{attrs:{loadModal:t.ifshowloading}})],1)},o=[];e.d(n,"b",(function(){return a})),e.d(n,"c",(function(){return o})),e.d(n,"a",(function(){return i}))},bb3d:function(t,n,e){"use strict";e.r(n);var i=e("525c"),a=e("393b");for(var o in a)"default"!==o&&function(t){e.d(n,t,(function(){return a[t]}))}(o);e("2d17");var s,u=e("f0c5"),r=Object(u["a"])(a["default"],i["b"],i["c"],!1,null,"47d2910d",null,!1,i["a"],s);n["default"]=r.exports},e283:function(t,n,e){var i=e("24fb");n=i(!1),n.push([t.i,'@charset "UTF-8";\n/**\n * 这里是uni-app内置的常用样式变量\n *\n * uni-app 官方扩展插件及插件市场（https://ext.dcloud.net.cn）上很多三方插件均使用了这些样式变量\n * 如果你是插件开发者，建议你使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\n *\n */\n/**\n * 如果你是App开发者（插件使用者），你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\n *\n * 如果你的项目同样使用了scss预处理，你也可以直接在你的 scss 代码中使用如下变量，同时无需 import 这个文件\n */\n/* 颜色变量 */\n/* 行为相关颜色 */\n/* 文字基本颜色 */\n/* 背景颜色 */\n/* 边框颜色 */\n/* 尺寸变量 */\n/* 文字尺寸 */\n/* 图片尺寸 */\n/* Border Radius */\n/* 水平间距 */\n/* 垂直间距 */\n/* 透明度 */\n/* 文章场景相关 */.handlememberview[data-v-47d2910d] .cu-form-group .uni-input-wrapper{text-align:right}',""]),t.exports=n}}]);