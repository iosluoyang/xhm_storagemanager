(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-me-index"],{"2e33":function(e,t,n){"use strict";n.r(t);var i=n("f8a2"),a=n("77d1");for(var s in a)"default"!==s&&function(e){n.d(t,e,(function(){return a[e]}))}(s);n("54ba");var o,r=n("f0c5"),c=Object(r["a"])(a["default"],i["b"],i["c"],!1,null,"21369e8f",null,!1,i["a"],o);t["default"]=c.exports},"54ba":function(e,t,n){"use strict";var i=n("df7b"),a=n.n(i);a.a},"56e2":function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var i={data:function(){return{panelList:[]}},onLoad:function(){var e={cuIcon:"qr_code",color:"blue",badge:0,name:this.i18n.me.panel.proqrcode,url:"/pages/me/buildqrcode"},t={id:"member",cuIcon:"lightfill",color:"red",badge:0,name:this.i18n.me.panel.managepeople,url:"/pages/managepeople/index"},n={id:"workingtime",cuIcon:"timefill",color:"yellow",badge:0,name:this.i18n.me.panel.workingtime,url:"/pages/me/workingtime"},i={id:"notice",cuIcon:"notificationfill",color:"cyan",badge:0,name:this.i18n.me.panel.notice,url:"/pages/notice/index"},a={cuIcon:"settingsfill",color:"brown",badge:0,name:this.i18n.nav.resetpwd,url:"/pages/me/resetpwd"},s=(this.i18n.me.panel.feedback,{cuIcon:"favorfill",color:"grey",badge:0,name:this.i18n.me.panel.more}),o=[];0===this.user.type?o=[e,t,n,i,a,s]:1===this.user.type&&(o=[a,s]),this.panelList=o,this.iflogin&&this.loadpersondetail()},methods:{loadpersondetail:function(){var e=this;e.$api.userapi.getuserdetail().then((function(t){var n=t.data.user;e.$store.dispatch("user/updateuserdetail",n).then((function(){})).catch((function(t){uni.showToast({title:e.i18n.error.networkerror,icon:"none"})}))})).catch((function(t){uni.showToast({title:e.i18n.error.networkerror,icon:"none"})}))},jumptopersondetail:function(){var e=this.iflogin?"/pages/me/persondetail":"/pages/base/login";uni.navigateTo({url:e})},clickpanel:function(e){e.url?uni.navigateTo({url:e.url}):uni.showToast({title:this.i18n.base.needtowait,icon:"none"})},exit:function(){var e=this,t=this;uni.showModal({content:t.i18n.tip.exitconfirm,showCancel:!0,cancelText:t.i18n.base.cancel,confirmText:t.i18n.base.confirm,success:function(n){n.confirm&&e.$store.dispatch("user/logout").then((function(){uni.showToast({title:t.i18n.tip.logoutsuccess,icon:"none",duration:1500}),setTimeout((function(){uni.reLaunch({url:"/pages/home/index"})}),1500)})).catch((function(e){uni.showToast({title:t.i18n.error.logouterror,icon:"none"})}))}})}}};t.default=i},"69c1":function(e,t,n){var i=n("24fb");t=i(!1),t.push([e.i,'@charset "UTF-8";\n/**\n * 这里是uni-app内置的常用样式变量\n *\n * uni-app 官方扩展插件及插件市场（https://ext.dcloud.net.cn）上很多三方插件均使用了这些样式变量\n * 如果你是插件开发者，建议你使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\n *\n */\n/**\n * 如果你是App开发者（插件使用者），你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\n *\n * 如果你的项目同样使用了scss预处理，你也可以直接在你的 scss 代码中使用如下变量，同时无需 import 这个文件\n */\n/* 颜色变量 */\n/* 行为相关颜色 */\n/* 文字基本颜色 */\n/* 背景颜色 */\n/* 边框颜色 */\n/* 尺寸变量 */\n/* 文字尺寸 */\n/* 图片尺寸 */\n/* Border Radius */\n/* 水平间距 */\n/* 垂直间距 */\n/* 透明度 */\n/* 文章场景相关 */uni-page-body[data-v-21369e8f]{background:#ededed}body.?%PAGE?%[data-v-21369e8f]{background:#ededed}',""]),e.exports=t},"77d1":function(e,t,n){"use strict";n.r(t);var i=n("56e2"),a=n.n(i);for(var s in i)"default"!==s&&function(e){n.d(t,e,(function(){return i[e]}))}(s);t["default"]=a.a},df7b:function(e,t,n){var i=n("69c1");"string"===typeof i&&(i=[[e.i,i,""]]),i.locals&&(e.exports=i.locals);var a=n("4f06").default;a("3b591c73",i,!0,{sourceMap:!1,shadowMode:!1})},f8a2:function(e,t,n){"use strict";var i,a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("v-uni-view",{staticClass:"me"},[n("cu-custom",{staticClass:"menavbar",attrs:{bgColor:"bg-gradual-orange",isBack:!0}},[n("template",{attrs:{slot:"content"},slot:"content"},[e._v(e._s(e.i18n.nav.me))])],2),n("v-uni-view",{staticClass:"headerview padding-sm margin-sm bg-gradual-orange radius shadow-blur flex align-center justify-between",on:{click:function(t){t.stopPropagation(),arguments[0]=t=e.$handleEvent(t),e.jumptopersondetail.apply(void 0,arguments)}}},[n("v-uni-view",{staticClass:"flex align-center"},[[e.user&&e.user.avatar?n("v-uni-view",{staticClass:"cu-avatar xl round margin-right",style:{backgroundImage:"url("+e.imgUrl+e.user.avatar+")"}}):n("v-uni-view",{staticClass:"cu-avatar xl round margin-right"},[n("v-uni-text",{staticClass:"cuIcon-people"})],1)],n("v-uni-view",{staticClass:"contentview"},[n("v-uni-view",{staticClass:"flex align-center margin-bottom-sm"},[n("v-uni-view",{staticClass:"username text-white text-bold text-xl margin-right-sm"},[e._v(e._s(e.iflogin?e.user&&e.user.userName?e.user.userName:e.i18n.tip.defaultusername:e.i18n.tip.pleaselogin))]),e.iflogin?n("v-uni-view",{staticClass:"usertag"},[n("v-uni-view",{staticClass:"usertag cu-tag radius margin-right-sm",class:[0===e.user.type?"bg-blue":"bg-cyan"]},[e._v(e._s(0===e.user.type?e.i18n.base.admin:e.i18n.base.normaladmin))])],1):e._e()],1),n("v-uni-view",{staticClass:"text-white text-xs text-cut",staticStyle:{width:"400upx"}},[e._v(e._s(e.user&&e.user.signature?e.user.signature:""))])],1)],2),n("v-uni-text",{staticClass:"cuIcon-right"})],1),n("v-uni-view",{staticClass:"cu-list grid col-3 no-border"},e._l(e.panelList,(function(t,i){return n("v-uni-view",{key:i,staticClass:"cu-item",on:{click:function(n){n.stopPropagation(),arguments[0]=n=e.$handleEvent(n),e.clickpanel(t)}}},[n("v-uni-view",{class:["cuIcon-"+t.cuIcon,"text-"+t.color]},[0!=t.badge?n("v-uni-view",{staticClass:"cu-tag badge"},[1!=t.badge?[e._v(e._s(t.badge>99?"99+":t.badge))]:e._e()],2):e._e()],1),n("v-uni-text",[e._v(e._s(t.name))])],1)})),1),n("v-uni-view",{staticClass:"cu-list menu sm-border card-menu margin-top"},[n("v-uni-view",{staticClass:"cu-item"},[n("v-uni-view",{staticClass:"content"},[n("v-uni-image",{staticClass:"png",attrs:{src:"/static/publicicon/logo.png",mode:"aspectFit"}}),n("v-uni-text",{staticClass:"text-grey"},[e._v(e._s(e.i18n.me.appversion))])],1),n("v-uni-view",{staticClass:"action"},[n("v-uni-text",{staticClass:"text-grey text-sm"},[e._v(e._s(this.$config.app_version()))])],1)],1),e.iflogin?n("v-uni-view",{staticClass:"cu-item arrow",on:{click:function(t){t.stopPropagation(),arguments[0]=t=e.$handleEvent(t),e.exit.apply(void 0,arguments)}}},[n("v-uni-view",{staticClass:"content"},[n("v-uni-text",{staticClass:"cuIcon-circlefill text-grey"}),n("v-uni-text",{staticClass:"text-grey"},[e._v(e._s(e.i18n.me.exit))])],1)],1):e._e()],1)],1)},s=[];n.d(t,"b",(function(){return a})),n.d(t,"c",(function(){return s})),n.d(t,"a",(function(){return i}))}}]);