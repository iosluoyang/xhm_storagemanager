(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-home-index"],{"02f5":function(n,t,e){"use strict";var i;e("7db0"),e("a9e3"),Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var a={data:function(){return{elements:[],languageArr:[],ifshowmodal:!1,homenotice:null,ifshownotice:!1}},onLoad:function(){i=this,this.setlanguage(),this.setmainoption(),this.gethomenotice()},computed:{currentlanguage:function(){return this._i18n.locale},showlanguagestr:function(){var n=this.languageArr.find((function(n,t){return n.id===i.currentlanguage}));return n?n.name:""}},methods:{setlanguage:function(){var n=[{name:"中文",id:"zh"},{name:"English",id:"en"},{name:"ภาษาไทย",id:"th"}];this.languageArr=n},setmainoption:function(){var n={title:this.i18n.nav.scan,id:"scan",name:"Scan the QR",color:"cyan",cuIcon:"scan"},t={title:this.i18n.nav.goodstype,id:"producttype",name:"Different Types",color:"red",cuIcon:"sort",url:"/pages/goodstype/newindex"},e={title:this.i18n.nav.goodslist,id:"productlist",name:"All the Product",color:"blue",cuIcon:"goodsfavor",url:"/pages/goods/goodslist"},i={title:this.i18n.nav.customer,id:"customer",name:"My Customer",color:"purple",cuIcon:"peoplelist",url:"/pages/customer/index"},a={title:this.i18n.nav.stock,id:"stockinout",name:"Stock",color:"green",cuIcon:"order",url:"/pages/stock/index"},o={title:this.i18n.nav.me,id:"me",name:"Personal",color:"orange",cuIcon:"people",url:"/pages/me/index"},s=[];s=this.$basejs.ifloginflag()&&0===this.user.type?[n,t,e,i,a,o]:[n,t,e,i,o],this.elements=s},clickitem:function(n){i.$basejs.checklogin().then((function(){if(n.url)uni.navigateTo({url:n.url});else switch(n.id){case"scan":i.$basejs.scanQR().then((function(n){i.$api.goodsapi.getpidbyqrcode({barCode:n}).then((function(n){var t=n.data.pid;t?uni.navigateTo({url:"/pages/goods/goodsdetail?pid=".concat(t)}):uni.showModal({title:i.i18n.base.tip,content:i.i18n.error.qrcodewithoutgoods,showCancel:!1,confirmText:i.i18n.base.confirm})})).catch((function(n){uni.showModal({title:i.i18n.base.tip,content:i.i18n.error.scanerror,showCancel:!1,confirmText:i.i18n.base.confirm})}))})).catch((function(n){uni.showModal({content:n,showCancel:!1,confirmText:i.i18n.base.confirm})}));break;default:break}}))},changelanguage:function(n){var t=n.detail.value;console.log("当前选中的语言为:".concat(JSON.stringify(t)));var e=this._i18n;e.locale=t,uni.setStorageSync("lang",t),this.ifshowmodal=!1,this.setmainoption()},gethomenotice:function(){var n=this;this.$api.noticeapi.gethomenotice().then((function(t){var e=t.data.notice;n.homenotice=e;var i=uni.getStorageSync("homepagenoticeid");i&&Number(i)===Number(e.id)||(n.ifshownotice=!0,uni.setStorageSync("homepagenoticeid",e.id))})).catch((function(t){uni.showToast({title:n.i18n.error.loaderror,icon:"none"})}))}}};t.default=a},"04b1":function(n,t,e){var i=e("24fb");t=i(!1),t.push([n.i,'@charset "UTF-8";\n/**\n * 这里是uni-app内置的常用样式变量\n *\n * uni-app 官方扩展插件及插件市场（https://ext.dcloud.net.cn）上很多三方插件均使用了这些样式变量\n * 如果你是插件开发者，建议你使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\n *\n */\n/**\n * 如果你是App开发者（插件使用者），你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\n *\n * 如果你的项目同样使用了scss预处理，你也可以直接在你的 scss 代码中使用如下变量，同时无需 import 这个文件\n */\n/* 颜色变量 */\n/* 行为相关颜色 */\n/* 文字基本颜色 */\n/* 背景颜色 */\n/* 边框颜色 */\n/* 尺寸变量 */\n/* 文字尺寸 */\n/* 图片尺寸 */\n/* Border Radius */\n/* 水平间距 */\n/* 垂直间距 */\n/* 透明度 */\n/* 文章场景相关 */uni-page-body[data-v-543dc97a]{background:#fff}.home[data-v-543dc97a]{height:100vh}.home .languagebtn[data-v-543dc97a]{position:fixed;top:%?200?%;right:%?20?%}body.?%PAGE?%[data-v-543dc97a]{background:#fff}',""]),n.exports=t},"2fda":function(n,t,e){"use strict";var i=e("9a72"),a=e.n(i);a.a},3912:function(n,t,e){"use strict";e.r(t);var i=e("02f5"),a=e.n(i);for(var o in i)"default"!==o&&function(n){e.d(t,n,(function(){return i[n]}))}(o);t["default"]=a.a},"4cfd":function(n,t,e){"use strict";e.r(t);var i=e("9d8e"),a=e("3912");for(var o in a)"default"!==o&&function(n){e.d(t,n,(function(){return a[n]}))}(o);e("2fda");var s,c=e("f0c5"),u=Object(c["a"])(a["default"],i["b"],i["c"],!1,null,"543dc97a",null,!1,i["a"],s);t["default"]=u.exports},"9a72":function(n,t,e){var i=e("04b1");"string"===typeof i&&(i=[[n.i,i,""]]),i.locals&&(n.exports=i.locals);var a=e("4f06").default;a("2926ab34",i,!0,{sourceMap:!1,shadowMode:!1})},"9d8e":function(n,t,e){"use strict";var i,a=function(){var n=this,t=n.$createElement,e=n._self._c||t;return e("v-uni-view",{staticClass:"home"},[e("v-uni-scroll-view",{staticClass:"page",attrs:{"scroll-y":!0}},[e("v-uni-image",{staticClass:"response",attrs:{src:"/static/bgimgs/bg-sky.png",mode:"widthFix"}}),e("v-uni-view",{staticClass:"nav-list"},[n._l(n.elements,(function(t,i){return[e("v-uni-view",{key:i+"_0",staticClass:"jumpitem nav-li",class:"bg-"+t.color,style:[{animation:"show "+(.2*(i+1)+1)+"s 1"}],on:{click:function(e){e.stopPropagation(),arguments[0]=e=n.$handleEvent(e),n.clickitem(t)}}},[e("v-uni-view",{staticClass:"nav-title"},[n._v(n._s(t.title))]),e("v-uni-view",{staticClass:"nav-name"},[n._v(n._s(t.name))]),e("v-uni-text",{class:"cuIcon-"+t.cuIcon})],1)]}))],2)],1),e("v-uni-button",{staticClass:"languagebtn xl cu-btn radius bg-white text-black",on:{click:function(t){t.stopPropagation(),arguments[0]=t=n.$handleEvent(t),n.ifshowmodal=!0}}},[n._v(n._s(n.showlanguagestr))]),e("v-uni-view",{staticClass:"cu-modal",class:n.ifshowmodal?"show":"",on:{click:function(t){t.stopPropagation(),arguments[0]=t=n.$handleEvent(t),n.ifshowmodal=!1}}},[e("v-uni-view",{staticClass:"cu-dialog",on:{click:function(t){t.stopPropagation(),arguments[0]=t=n.$handleEvent(t)}}},[e("v-uni-radio-group",{staticClass:"block",on:{change:function(t){arguments[0]=t=n.$handleEvent(t),n.changelanguage.apply(void 0,arguments)}}},[e("v-uni-view",{staticClass:"cu-list menu text-left"},n._l(n.languageArr,(function(t,i){return e("v-uni-view",{key:i,staticClass:"cu-item"},[e("v-uni-label",{staticClass:"flex justify-between align-center flex-sub"},[e("v-uni-view",{staticClass:"flex-sub"},[n._v(n._s(t.name))]),e("v-uni-radio",{staticClass:"round",class:n.currentlanguage===t.id?"checked":"",attrs:{checked:n.currentlanguage===t.id,value:t.id}})],1)],1)})),1)],1)],1)],1),e("v-uni-view",{staticClass:"cu-modal",class:n.ifshownotice&&n.homenotice&&n.homenotice.content?"show":""},[e("v-uni-view",{staticClass:"cu-dialog"},[e("v-uni-view",{staticClass:"cu-bar bg-white justify-center"},[e("v-uni-view",{staticClass:"content text-bold text-xl"},[n._v(n._s(n.i18n.me.panel.notice))])],1),n.homenotice&&n.homenotice.content&&n.homenotice.content.length>0?e("v-uni-view",{staticClass:"padding-xl text-light"},[n._v(n._s(n.homenotice.content))]):n._e(),e("v-uni-view",{staticClass:"cu-bar bg-gradual-purple"},[e("v-uni-view",{staticClass:"action flex-sub",on:{click:function(t){t.stopPropagation(),arguments[0]=t=n.$handleEvent(t),n.ifshownotice=!1}}},[n._v(n._s(n.i18n.base.confirm))])],1)],1)],1)],1)},o=[];e.d(t,"b",(function(){return a})),e.d(t,"c",(function(){return o})),e.d(t,"a",(function(){return i}))}}]);