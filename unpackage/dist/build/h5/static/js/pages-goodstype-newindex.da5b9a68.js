(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-goodstype-newindex"],{"0da5":function(t,e,i){"use strict";var a=i("ee27");i("99af"),i("4160"),i("c975"),i("45fc"),i("a434"),i("d3b7"),i("ac1f"),i("25f0"),i("159b"),Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var n,o=a(i("f3f3")),s=a(i("2ef0")),c=50,l={data:function(){return{StatusBar:this.StatusBar,CustomBar:this.CustomBar,searchText:"",typelist:[],navCurIndex:0,mainCurIndex:0,NavScrollTop:0,calculatescrollview:!0,optiontype:"",ifshowmodal:!1,temptypeinfo:null,addedtypeName:"",addedtypeRemark:"",modalName:null,listTouchStart:0,listTouchDirection:null}},watch:{searchText:function(t){this.searchgoodstype(t)}},onLoad:function(){n=this,this.loadgoodstypelist()},methods:{pageBack:function(){uni.navigateBack({delta:1})},loadgoodstypelist:function(){var t=this;this.ifshowloading=!0,this.$api.goodsapi.gettypelist().then((function(e){t.ifshowloading=!1;var i=e.data.list,a=[];i.forEach((function(t,e){t.typeName=1===t.sysFlag?n.i18n.base[t.typeName]:t.typeName,t.childList&&t.childList.length>0&&t.childList.forEach((function(t,e){t.typeName=1===t.sysFlag?n.i18n.base[t.typeName]:t.typeName})),a.push(t)})),n.typelist=a;var o=uni.getStorageSync("alreadyswipercell");o||n.$nextTick((function(){var t=null,e=n.typelist.some((function(e,i){return!!(e.childList&&e.childList.length>0)&&e.childList.some((function(e,i){return 0===e.sysFlag&&(t=e.typeId),0===e.sysFlag}))}));e&&setTimeout((function(){n.autoswipercell(t)}),300)}))})).catch((function(e){t.ifshowloading=!1,uni.showToast({title:t.i18n.error.getgoodstypeerror,icon:"none"})}))},autoswipercell:function(t){this.listTouchDirection="left",this.modalName="move-box-"+t.toString(),setTimeout((function(){n.listTouchDirection=null,n.modalName=null,uni.setStorageSync("alreadyswipercell",!0)}),1e3)},searchgoodstype:s.default.debounce((function(t){var e;console.log("当前搜索文本是:".concat(t));var i=n.typelist.some((function(i,a){return i.typeName.indexOf(t)>-1&&(e=a),i.typeName.indexOf(t)>-1}));if(i)n.NavScrollTop=50*(e-1),n.navCurIndex=e,n.mainCurIndex=e;else{var a=n.typelist.some((function(i,a){return!!(i.childList&&i.childList.length>-1)&&i.childList.some((function(i,n){return i.typeName.indexOf(t)>-1&&(e=a,n),i.typeName.indexOf(t)>-1}))}));a&&(n.NavScrollTop=50*(e-1),n.navCurIndex=e,n.mainCurIndex=e)}}),300),navTap:function(t){var e=t.currentTarget.dataset.index;this.NavScrollTop=50*(e-1),this.navCurIndex=e,this.mainCurIndex=e},ScrollMainView:function(t){this.calculatescrollview&&(this.calculateeachmainviewposition(),this.calculatescrollview=!1);for(var e=t.detail.scrollTop+10,i=0;i<this.typelist.length;i++)if(e>this.typelist[i].top&&e<this.typelist[i].bottom)return this.NavScrollTop=50*(i-1),this.navCurIndex=i,!1},calculateeachmainviewposition:function(){for(var t=this,e=0,i=function(i){var a=uni.createSelectorQuery().select("#main-"+i);a.fields({size:!0},(function(a){t.typelist[i].top=e,e+=a.height,t.typelist[i].bottom=e})).exec()},a=0;a<this.typelist.length;a++)i(a)},startaddgoodstype:function(t){this.addedtypeName="",this.addedtypeRemark="",this.temptypeinfo=t,this.optiontype="add",this.ifshowmodal=!0},starteditgoodstype:function(t,e){console.log("当前编辑的一级分类索引为:".concat(t,"----二级分类索引为:").concat(e));var i=null;null!==e?(i=this.typelist[t].childList[e],i.selectfirstIndex=t,i.selectsecondIndex=e,this.temptypeinfo=i):(i=this.typelist[t],i.selectfirstIndex=t,this.temptypeinfo=i),this.addedtypeName=this.temptypeinfo.typeName,this.addedtypeRemark=this.temptypeinfo.remark,this.optiontype="edit",this.ifshowmodal=!0},confirmModal:function(){var t=this.addedtypeName;this.addedtypeRemark;if(t&&""!==t){if("add"===this.optiontype){var e=this.temptypeinfo?this.temptypeinfo.typeId:0;this.addgoodstype(e)}else if("edit"===this.optiontype){var i=this.temptypeinfo;this.editgoodstype(i)}}else uni.showToast({title:this.i18n.error.lacktypenameerror,icon:"none",duration:1500})},addgoodstype:function(t){var e=this,i={typeName:this.addedtypeName,remark:this.addedtypeRemark,parentId:t};this.$api.goodsapi.addtype(i).then((function(t){uni.$emit("updategoodstype");var a=t.data.typeId,o=t.data.subTypeInfo;o&&(o.typeName=n.i18n.base[o.typeName]);var s={typeId:a,typeName:i.typeName,remark:i.remark,sysFlag:0,childList:o?[o]:[]};if(0===i.parentId)e.typelist.splice(-1,0,s);else{var c=e.temptypeinfo;if(c){var l=c.childList;l.splice(-1,0,s)}}e.addedtypeName="",e.addedtypeRemark="",e.temptypeinfo=null,e.ifshowmodal=!1,e.$nextTick((function(){this.calculateeachmainviewposition()}))})).catch((function(t){uni.showToast({title:e.i18n.error.adderror,icon:"none"})}))},editgoodstype:function(t){var e=this,i={typeName:this.addedtypeName,remark:this.addedtypeRemark,typeId:t.typeId};this.$api.goodsapi.updatetype(i).then((function(a){uni.$emit("updategoodstype");var n=t.selectfirstIndex,s=t.selectsecondIndex;if(0===s||s){var c=e.typelist[n],l=c.childList[s];l=(0,o.default)({},l,{},i),e.$set(c.childList,s,l),e.$set(e.typelist,n,c)}else{var d=e.typelist[n];d=(0,o.default)({},d,{},i),e.$set(e.typelist,n,d)}e.addedtypeName="",e.addedtypeRemark="",e.temptypeinfo=null,e.ifshowmodal=!1})).catch((function(t){uni.showToast({title:e.i18n.error.fixerror,icon:"none"})}))},delgoodstype:function(t,e){var i=this;console.log("当前删除的一级分类索引为:".concat(t,"----二级分类索引为:").concat(e));var a=null;a=0===e||e?this.typelist[t].childList[e]:this.typelist[t],uni.showModal({title:this.i18n.tip.deleteconfirm,content:this.i18n.tip.deletetypecontent,showCancel:!0,cancelText:this.i18n.base.cancel,confirmText:this.i18n.base.confirm,success:function(o){o.confirm&&i.$api.goodsapi.deletetype({typeId:a.typeId}).then((function(a){if(uni.$emit("updategoodstype"),0===e||e){var n=i.typelist[t];n.childList.splice(e,1)}else i.typelist.splice(t,1);i.$nextTick((function(){this.calculateeachmainviewposition()}))})).catch((function(t){uni.showToast({title:n.i18n.error.deleteerror,icon:"none"})}))}})},showtypedes:function(t){uni.showModal({title:t.typeName,content:t.remark,showCancel:!1,cancelText:"",confirmText:this.i18n.base.confirm})},jumptogoodslist:function(t,e){uni.navigateTo({url:"/pages/goods/goodslist?firstTypeId=".concat(t,"&secondTypeId=").concat(e)})},ListTouchStart:function(t){this.listTouchStart=t.touches[0].pageX},ListTouchMove:function(t){var e=t.touches[0].pageX,i=this.listTouchStart,a=Math.abs(e-i),n="not move";e<i&&a>c?n="left":e>i&&a>c&&(n="right"),this.listTouchDirection=n},ListTouchEnd:function(t){"left"==this.listTouchDirection?this.modalName=t.currentTarget.dataset.target:this.modalName=null,this.listTouchDirection=null}}};e.default=l},"1de5":function(t,e,i){"use strict";t.exports=function(t,e){return e||(e={}),t=t&&t.__esModule?t.default:t,"string"!==typeof t?t:(/^['"].*['"]$/.test(t)&&(t=t.slice(1,-1)),e.hash&&(t+=e.hash),/["'() \t\n]/.test(t)||e.needQuotes?'"'.concat(t.replace(/"/g,'\\"').replace(/\n/g,"\\n"),'"'):t)}},"5b0f":function(t,e,i){"use strict";var a,n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-uni-view",{staticClass:"goodstypeview"},[i("v-uni-view",{staticClass:"customnav",style:[{height:t.CustomBar+"px"}]},[i("v-uni-view",{staticClass:"fixed cu-bar search bg-gradual-red",style:[{height:t.CustomBar+"px",paddingTop:t.StatusBar+"px",minHeight:t.CustomBar+"px"}]},[i("v-uni-view",{staticClass:"action",on:{click:function(e){e.stopPropagation(),arguments[0]=e=t.$handleEvent(e),t.pageBack.apply(void 0,arguments)}}},[i("v-uni-text",{staticClass:"cuIcon-back"})],1),i("v-uni-view",{staticClass:"search-form round"},[i("v-uni-text",{staticClass:"cuIcon-search"}),i("v-uni-input",{attrs:{"adjust-position":!1,type:"text",placeholder:t.i18n.tip.searchtype,"confirm-type":"search"},model:{value:t.searchText,callback:function(e){t.searchText=e},expression:"searchText"}})],1)],1)],1),i("v-uni-view",{staticClass:"VerticalBox flex",style:{height:"calc(100vh - "+t.CustomBar+"px - 10px"}},[i("v-uni-scroll-view",{staticClass:"VerticalNav nav",staticStyle:{height:"100%"},attrs:{"scroll-y":!0,"scroll-with-animation":!0,"scroll-top":t.NavScrollTop}},[t._l(t.typelist,(function(e,a){return i("v-uni-view",{key:a,class:[a===t.navCurIndex?"text-red cur":"","cu-item"],attrs:{"data-index":a},on:{click:function(e){e.stopPropagation(),arguments[0]=e=t.$handleEvent(e),t.navTap.apply(void 0,arguments)}}},[i("v-uni-view",{staticClass:"text-cut text-sm"},[t._v(t._s(e.typeName))])],1)})),i("v-uni-view",{staticClass:"cu-item"},[i("v-uni-view",{staticClass:"addbtn text-xxl"},[i("v-uni-text",{staticClass:"cuIcon cuIcon-add text-bold",on:{click:function(e){e.stopPropagation(),arguments[0]=e=t.$handleEvent(e),t.startaddgoodstype()}}})],1)],1)],2),i("v-uni-scroll-view",{staticClass:"VerticalMain",staticStyle:{height:"100%"},attrs:{"scroll-y":!0,"scroll-with-animation":!0,"scroll-into-view":"main-"+t.mainCurIndex},on:{scroll:function(e){arguments[0]=e=t.$handleEvent(e),t.ScrollMainView.apply(void 0,arguments)}}},t._l(t.typelist,(function(e,a){return i("v-uni-view",{key:a,staticClass:"padding-top padding-lr",attrs:{id:"main-"+a}},[i("v-uni-view",{staticClass:"cu-bar solid-bottom bg-white"},[i("v-uni-view",{staticClass:"action"},[i("v-uni-text",{staticClass:"cuIcon-title text-red"}),i("v-uni-text",[t._v(t._s(e.typeName))])],1),0===e.sysFlag?i("v-uni-view",{staticClass:"action"},[i("v-uni-button",{staticClass:"cu-btn bg-grey round cuIcon cuIcon-edit margin-right-sm",on:{click:function(e){e.stopPropagation(),arguments[0]=e=t.$handleEvent(e),t.starteditgoodstype(a,null)}}}),i("v-uni-button",{staticClass:"cu-btn bg-red round cuIcon cuIcon-delete",on:{click:function(e){e.stopPropagation(),arguments[0]=e=t.$handleEvent(e),t.delgoodstype(a,null)}}})],1):t._e()],1),i("v-uni-view",{staticClass:"cu-list menu-avatar"},[t._l(e.childList,(function(n,o){return i("v-uni-view",{key:o,staticClass:"cu-item",class:t.modalName=="move-box-"+n.typeId.toString()&&0===n.sysFlag?"move-cur":"",attrs:{"data-target":"move-box-"+n.typeId.toString()},on:{touchstart:function(e){arguments[0]=e=t.$handleEvent(e),t.ListTouchStart.apply(void 0,arguments)},touchmove:function(e){arguments[0]=e=t.$handleEvent(e),t.ListTouchMove.apply(void 0,arguments)},touchend:function(e){arguments[0]=e=t.$handleEvent(e),t.ListTouchEnd.apply(void 0,arguments)},click:function(i){i.stopPropagation(),arguments[0]=i=t.$handleEvent(i),t.jumptogoodslist(e.typeId,n.typeId)}}},[i("v-uni-view",{staticClass:"cu-avatar round lg secondtypeimgview"}),i("v-uni-view",{staticClass:"content text-cut",staticStyle:{width:"calc(100% - 48px - 30px - 10px)"}},[i("v-uni-view",{staticClass:"text-black text-light"},[t._v(t._s(n.typeName))]),i("v-uni-view",{staticClass:"text-cut text-grey padding-left-sm padding-right-sm bg-gray radius",on:{longpress:function(e){arguments[0]=e=t.$handleEvent(e),t.showtypedes(n)}}},[t._v(t._s(n.remark))])],1),i("v-uni-view",{staticClass:"move"},[i("v-uni-view",{staticClass:"bg-grey",on:{click:function(e){e.stopPropagation(),arguments[0]=e=t.$handleEvent(e),t.starteditgoodstype(a,o)}}},[t._v(t._s(t.i18n.base.edit))]),i("v-uni-view",{staticClass:"bg-red",on:{click:function(e){e.stopPropagation(),arguments[0]=e=t.$handleEvent(e),t.delgoodstype(a,o)}}},[t._v(t._s(t.i18n.base.del))])],1)],1)})),0===e.sysFlag?i("v-uni-view",{staticClass:"cu-item text-black text-xxl",staticStyle:{"justify-content":"center",height:"40px"},on:{click:function(i){i.stopPropagation(),arguments[0]=i=t.$handleEvent(i),t.startaddgoodstype(e)}}},[i("v-uni-text",{staticClass:"cuIcon cuIcon-add text-bold"})],1):t._e()],2)],1)})),1)],1),i("v-uni-view",{staticClass:"cu-modal",class:t.ifshowmodal?"show":""},[i("v-uni-view",{staticClass:"cu-dialog"},[i("v-uni-view",{staticClass:"cu-bar bg-white"},[i("v-uni-view",{staticClass:"content"},[t._v(t._s("add"===t.optiontype?t.i18n.goodstype.addtype:t.i18n.goodstype.edittype))])],1),i("v-uni-view",{staticClass:"padding-xl text-left"},[i("v-uni-view",{staticClass:"cu-form-group"},[i("v-uni-view",{staticClass:"title"},[t._v(t._s(t.i18n.goodstype.addtypenametitle))]),i("v-uni-input",{attrs:{placeholder:t.i18n.goodstype.addtypenameplaceholder,maxlength:"50"},model:{value:t.addedtypeName,callback:function(e){t.addedtypeName=e},expression:"addedtypeName"}})],1),i("v-uni-view",{staticClass:"cu-form-group margin-top"},[i("v-uni-textarea",{attrs:{maxlength:"140",placeholder:t.i18n.goodstype.addtypedesplaceholder},model:{value:t.addedtypeRemark,callback:function(e){t.addedtypeRemark=e},expression:"addedtypeRemark"}})],1)],1),i("v-uni-view",{staticClass:"cu-bar bg-white flex justify-around"},[i("v-uni-button",{staticClass:"cu-btn round bg-gray text-grey",on:{click:function(e){e.stopPropagation(),arguments[0]=e=t.$handleEvent(e),t.ifshowmodal=!1}}},[t._v(t._s(t.i18n.base.cancel))]),i("v-uni-button",{staticClass:"cu-btn round bg-gradual-red",on:{click:function(e){e.stopPropagation(),arguments[0]=e=t.$handleEvent(e),t.confirmModal.apply(void 0,arguments)}}},[t._v(t._s(t.i18n.base.confirm))])],1)],1)],1),i("loading",{attrs:{loadModal:t.ifshowloading}})],1)},o=[];i.d(e,"b",(function(){return n})),i.d(e,"c",(function(){return o})),i.d(e,"a",(function(){return a}))},"5dd0":function(t,e,i){t.exports=i.p+"static/img/logo.ed617e54.png"},"72aa":function(t,e,i){var a=i("ec17");"string"===typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);var n=i("4f06").default;n("41717078",a,!0,{sourceMap:!1,shadowMode:!1})},"9d83f":function(t,e,i){"use strict";i.r(e);var a=i("5b0f"),n=i("9e8e");for(var o in n)"default"!==o&&function(t){i.d(e,t,(function(){return n[t]}))}(o);i("e0d2");var s,c=i("f0c5"),l=Object(c["a"])(n["default"],a["b"],a["c"],!1,null,"0946fb37",null,!1,a["a"],s);e["default"]=l.exports},"9e8e":function(t,e,i){"use strict";i.r(e);var a=i("0da5"),n=i.n(a);for(var o in a)"default"!==o&&function(t){i.d(e,t,(function(){return a[t]}))}(o);e["default"]=n.a},e0d2:function(t,e,i){"use strict";var a=i("72aa"),n=i.n(a);n.a},ec17:function(t,e,i){var a=i("24fb"),n=i("1de5"),o=i("5dd0");e=a(!1);var s=n(o);e.push([t.i,'@charset "UTF-8";\n/**\n * 这里是uni-app内置的常用样式变量\n *\n * uni-app 官方扩展插件及插件市场（https://ext.dcloud.net.cn）上很多三方插件均使用了这些样式变量\n * 如果你是插件开发者，建议你使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\n *\n */\n/**\n * 如果你是App开发者（插件使用者），你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\n *\n * 如果你的项目同样使用了scss预处理，你也可以直接在你的 scss 代码中使用如下变量，同时无需 import 这个文件\n */\n/* 颜色变量 */\n/* 行为相关颜色 */\n/* 文字基本颜色 */\n/* 背景颜色 */\n/* 边框颜色 */\n/* 尺寸变量 */\n/* 文字尺寸 */\n/* 图片尺寸 */\n/* Border Radius */\n/* 水平间距 */\n/* 垂直间距 */\n/* 透明度 */\n/* 文章场景相关 */uni-page-body[data-v-0946fb37]{padding-top:5px}.VerticalBox .VerticalNav[data-v-0946fb37]{width:%?200?%;white-space:normal}.VerticalBox .VerticalNav .cu-item[data-v-0946fb37]{width:100%;text-align:center;background-color:#fff;margin:0;border:none;height:50px;position:relative}.VerticalBox .VerticalNav .cu-item.cur[data-v-0946fb37]::after{content:"";width:%?8?%;height:%?30?%;border-radius:%?10?% 0 0 %?10?%;position:absolute;background-color:currentColor;top:0;right:%?0?%;bottom:0;margin:auto}.VerticalBox .VerticalMain[data-v-0946fb37]{background-color:#f1f1f1;-webkit-box-flex:1;-webkit-flex:1;flex:1}.VerticalBox .VerticalMain .secondtypeimgview[data-v-0946fb37]{background-image:url('+s+")}",""]),t.exports=e}}]);