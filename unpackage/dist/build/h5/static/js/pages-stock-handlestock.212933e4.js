(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-stock-handlestock"],{"1f85":function(t,e,i){var n=i("24fb");e=n(!1),e.push([t.i,'@charset "UTF-8";\n/**\n * 这里是uni-app内置的常用样式变量\n *\n * uni-app 官方扩展插件及插件市场（https://ext.dcloud.net.cn）上很多三方插件均使用了这些样式变量\n * 如果你是插件开发者，建议你使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\n *\n */\n/**\n * 如果你是App开发者（插件使用者），你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\n *\n * 如果你的项目同样使用了scss预处理，你也可以直接在你的 scss 代码中使用如下变量，同时无需 import 这个文件\n */\n/* 颜色变量 */\n/* 行为相关颜色 */\n/* 文字基本颜色 */\n/* 背景颜色 */\n/* 边框颜色 */\n/* 尺寸变量 */\n/* 文字尺寸 */\n/* 图片尺寸 */\n/* Border Radius */\n/* 水平间距 */\n/* 垂直间距 */\n/* 透明度 */\n/* 文章场景相关 */.prodetailmodal[data-v-a2c25180]{z-index:888}.prodetailmodal .cu-dialog[data-v-a2c25180]{border-top-left-radius:%?20?%;border-top-right-radius:%?20?%}.prodetailmodal .cu-dialog .content[data-v-a2c25180]{min-height:%?300?%;max-height:%?600?%}',""]),t.exports=e},3578:function(t,e,i){"use strict";var n=i("ced3"),s=i.n(n);s.a},"3a66":function(t,e,i){"use strict";var n=i("d8c4"),s=i.n(n);s.a},5083:function(t,e,i){"use strict";var n,s=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-uni-view",{key:t.mykey,staticClass:"prodetailmodal cu-modal bottom-modal",class:t.ifshowpopup?"show":"",on:{click:function(e){e.stopPropagation(),arguments[0]=e=t.$handleEvent(e),t.hidepopup.apply(void 0,arguments)}}},[t.product?i("v-uni-view",{staticClass:"cu-dialog"},[i("v-uni-view",{staticClass:"cu-bar padding-bottom borderbottom"},[i("v-uni-view",{staticClass:"action proview margin-top flex"},[t.proimg?i("v-uni-view",{staticClass:"cu-avatar radius xl margin-right-sm",style:{backgroundImage:"url("+t.proimg+")"}}):t._e(),i("v-uni-view",{staticClass:"proinfoview text-left"},[i("v-uni-view",{staticClass:"proinfotitle text-black text-xl t_twoline margin-bottom-sm"},[t._v(t._s(t.product.title))]),i("v-uni-view",{staticClass:"proinfospec margin-bottom-sm"},[i("v-uni-text",{staticClass:"text-grey text-df"},[t._v(t._s(t.i18n.goods.goodsdetail.selected+": "))]),t.selectspecinfo?i("v-uni-text",{staticClass:"text-black text-bold text-df"},[t._v(t._s(t.showspecstr))]):t._e()],1),i("v-uni-view",{staticClass:"proinfoprice flex align-center"},[i("v-uni-view",{staticClass:"sellprice text-df flex align-center margin-right"},[i("v-uni-text",{staticClass:"text-grey"},[t._v(t._s(t.i18n.goods.price+":"))]),t.selectspecinfo?i("v-uni-text",{staticClass:"text-red margin-left-sm"},[t._v(t._s(t.selectspecinfo.salePrice))]):t._e()],1)],1)],1)],1),i("v-uni-view",{staticClass:"action self-start margin-left-sm"},[i("v-uni-text",{staticClass:"cuIcon cuIcon-close",on:{click:function(e){e.stopPropagation(),arguments[0]=e=t.$handleEvent(e),t.hidepopup.apply(void 0,arguments)}}})],1)],1),i("v-uni-scroll-view",{staticClass:"content padding text-left",attrs:{"scroll-y":!0}},[t.attributeList?i("v-uni-view",{staticClass:"attributesview"},t._l(t.attributeList,(function(e,n){return i("v-uni-view",{key:n,staticClass:"eachattributeview"},[i("v-uni-view",{staticClass:"attributenameview text-black text-lg"},[t._v(t._s(e.attributeName))]),i("v-uni-view",{staticClass:"attributevaluesview flex flex-wrap align-center padding"},t._l(e.attributeValues,(function(e,s){return i("v-uni-view",{key:s,staticClass:"eachvalue cu-btn radius margin-left-sm",class:e.selected?"bg-blue":"bg-gray",on:{click:function(e){e.stopPropagation(),arguments[0]=e=t.$handleEvent(e),t.selectattribute(n,s)}}},[t._v(t._s(e.attributeValue))])})),1)],1)})),1):t._e()],1),i("v-uni-view",{staticClass:"padding bordertop"},[i("v-uni-button",{staticClass:"cu-btn block shadow-blur lg bg-gradual-blue round",attrs:{disabled:!t.selectspecinfo},on:{click:function(e){e.stopPropagation(),arguments[0]=e=t.$handleEvent(e),t.confirmselectspec.apply(void 0,arguments)}}},[t._v(t._s(t.i18n.base.confirm))])],1)],1):t._e()],1)},a=[];i.d(e,"b",(function(){return s})),i.d(e,"c",(function(){return a})),i.d(e,"a",(function(){return n}))},"5a95":function(t,e,i){"use strict";i.r(e);var n=i("5083"),s=i("6296");for(var a in s)"default"!==a&&function(t){i.d(e,t,(function(){return s[t]}))}(a);i("3a66");var o,c=i("f0c5"),r=Object(c["a"])(s["default"],n["b"],n["c"],!1,null,"a2c25180",null,!1,n["a"],o);e["default"]=r.exports},6296:function(t,e,i){"use strict";i.r(e);var n=i("7c33"),s=i.n(n);for(var a in n)"default"!==a&&function(t){i.d(e,t,(function(){return n[t]}))}(a);e["default"]=s.a},"7a02":function(t,e,i){"use strict";var n=i("ee27");i("7db0"),i("4160"),i("a9e3"),i("e25e"),i("ac1f"),i("1276"),i("159b"),Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var s,a=n(i("5a95")),o={components:{goodsspecselector:a.default},data:function(){return{type:"",pid:null,specId:null,product:null,swiperData:[],priceTypeList:[],selectspecinfo:null,selectcustomer:null,ifshowmodal:!1,selectpriceinfo:null,typenumber:"",ifremindspec:!1,ifremindamount:!1,ifremindcustomer:!1,ifremindpricetype:!1}},onLoad:function(t){s=this;var e=t.pid;s.pid=e;var i=t.specId;s.specId=Number(i);var n=[{name:s.i18n.goods.price,type:2},{name:s.i18n.goods.agentprice,type:3},{name:s.i18n.goods.creditprice,type:4}];this.priceTypeList=n,s.loadprodetail(),uni.$on("selectcustomer",(function(t){s.selectcustomer=t}))},destroyed:function(){uni.$off("selectcustomer")},methods:{loadprodetail:function(){s.$api.goodsapi.getgoodsdetail({pid:s.pid}).then((function(t){var e=t.data.product;s.product=e;var i=[];if(e.imgs){var n=e.imgs.split(",");n.forEach((function(t){var e=s.imgUrl+t;i.push(e)}))}if(s.swiperData=i,s.product.specs&&s.product.specs.length>0){var a=s.product.specs.find((function(t){return t.specId===s.specId}));s.selectspecinfo=a}})).catch((function(t){uni.showToast({title:"".concat(s.i18n.error.loaderror),icon:"none"})}))},starttoselectcustomer:function(){uni.navigateTo({url:"/pages/customer/index?type=select"})},changepricetype:function(t){var e=Number(t.detail.value);this.selectpriceinfo=this.priceTypeList.find((function(t){return t.type===e})),console.log("".concat(JSON.stringify(this.selectpriceinfo))),this.ifshowmodal=!1},fixstock:function(t){if(!s.selectspecinfo)return uni.showToast({title:s.i18n.error.lackspec,icon:"none"}),s.ifremindspec=!0,void setTimeout((function(){s.ifremindspec=!1}),1500);var e=this.typenumber;if("in"===t){if(""===e||0===parseInt(e))return s.ifremindamount=!0,void setTimeout((function(){s.ifremindamount=!1}),1500)}else if("out"===t){if(parseInt(e)>s.selectspecinfo.stockCount||""===e||0===parseInt(e))return s.ifremindamount=!0,void setTimeout((function(){s.ifremindamount=!1}),1500);if(!s.selectpriceinfo)return s.ifremindpricetype=!0,void setTimeout((function(){s.ifremindpricetype=!1}),1500)}uni.showModal({title:s.i18n.base.tip,content:s.i18n.tip.ifsuretofixstock,showCancel:!0,cancelText:s.i18n.base.cancel,confirmText:s.i18n.base.confirm,success:function(i){if(i.confirm){var n={pid:s.pid,specId:s.selectspecinfo.specId,stockCount:parseInt(e),customerId:s.selectcustomer?s.selectcustomer.customerId:null,type:s.selectpriceinfo?s.selectpriceinfo.type:null};"in"===t?s.$api.goodsapi.stockin(n).then((function(t){uni.showToast({title:s.i18n.stock.stockin+s.i18n.base.success}),s.typenumber="",uni.$emit("updateprolist"),uni.$emit("updateprodetail"),setTimeout((function(){uni.navigateBack()}),2e3)})).catch((function(t){uni.showToast({title:s.i18n.error.loaderror,icon:"none"})})):"out"===t&&s.$api.goodsapi.stockout(n).then((function(t){uni.showToast({title:s.i18n.stock.stockout+s.i18n.base.success}),s.typenumber="",uni.$emit("updateprolist"),uni.$emit("updateprodetail"),setTimeout((function(){uni.navigateBack()}),2e3)})).catch((function(t){uni.showToast({title:s.i18n.error.loaderror,icon:"none"})}))}}})}}};e.default=o},"7c33":function(t,e,i){"use strict";var n;i("7db0"),i("c740"),i("4160"),i("a15b"),i("a9e3"),i("e25e"),i("ac1f"),i("1276"),i("159b"),Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0,Array.prototype.contains=function(t){var e=this.length;while(e--)if(this[e]===t)return!0;return!1};var s={name:"goodsspecselector",props:{mykey:{type:[String,Number],default:""},pid:{type:[String,Number],default:null,required:!0},defaultselectattributeIds:{type:Array,default:function(){return[]}},ifshowpopup:{type:Boolean,default:!1}},data:function(){return{product:null,proimg:null,attributeList:[]}},watch:{defaultselectattributeIds:function(t,e){console.log("检测到默认选中规格变更 开始重新计算数据源选中状态"),this.getproductspecdata()}},computed:{selectspecinfo:function(){if(0!==this.attributeList.length){var t=[];this.attributeList.forEach((function(e){e.attributeValues&&e.attributeValues.forEach((function(e){e.selected&&t.push(e.attributeId)}))}));var e=this.specs.find((function(e){if(0!==t.length&&e.attributeList&&0!==e.attributeList.length&&t.length===e.attributeList.length){var i=e.attributeList.findIndex((function(e,i){return!t.contains(e.attributeId)}));return-1===i}return!1}));return console.log("当前规格对象为:".concat(JSON.stringify(e))),e}},showspecstr:function(){var t=[],e=this.selectspecinfo;e&&e.attributeList.forEach((function(e){t.push(e.attributeValue)}));var i=t.join("、");return i},selectattributeIds:function(){var t=[],e=this.selectspecinfo;return e&&e.attributeList.forEach((function(e){t.push(e.attributeId)})),t}},created:function(){n=this,n.getproductspecdata()},methods:{getproductspecdata:function(){n.$api.goodsapi.getgoodsdetail({pid:n.pid}).then((function(t){var e=t.data.product;n.product=e;var i=e.imgs.split(",").length>0?n.imgUrl+e.imgs.split(",")[0]:null;n.proimg=i;var s=e.attributeList;n.setmapattributeArr(s);var a=e.specs;n.specs=a,n.confirmselectspec()})).catch((function(t){}))},setmapattributeArr:function(t){var e=[];t&&t.length>0&&t.forEach((function(t,i){var s=[];t.attributeValues&&t.attributeValues.length>0&&t.attributeValues.forEach((function(t,e){var i=-1!==n.defaultselectattributeIds.findIndex((function(e){return parseInt(t.attributeId)===parseInt(e)})),a={attributeId:t.attributeId,attributeValue:t.attributeValue,selected:i};s.push(a)}));var a={attributeName:t.attributeName,attributeValues:s};e.push(a)})),n.attributeList=e},selectattribute:function(t,e){var i=n.attributeList[t],s=i.attributeValues,a=s[e],o=a.selected;s.forEach((function(t,e){o||(t.selected=!1)})),a.selected=!a.selected,i.attributeValues=s,n.$set(n.attributeList,t,i)},confirmselectspec:function(){var t={specinfo:n.selectspecinfo,showspecstr:n.showspecstr,selectattributeIds:n.selectattributeIds};this.$emit("confirmselectspecinfo",t),this.hidepopup()},hidepopup:function(){this.$emit("hidepopup")}}};e.default=s},ac5d:function(t,e,i){"use strict";var n,s=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-uni-view",{staticClass:"handlestockview"},[i("cu-custom",{attrs:{bgColor:"bg-gradual-green",isBack:!0}},[i("template",{attrs:{slot:"content"},slot:"content"},[t._v(t._s(t.i18n.nav.stock))])],2),t.product?i("v-uni-view",{staticClass:"proinfoview margin padding radius shadow-warp bg-white"},[i("v-uni-view",{staticClass:"baseinfoview flex flex-direction"},[i("v-uni-view",{staticClass:"cu-avatar-group proimgsview margin-bottom-sm"},t._l(t.swiperData,(function(t,e){return i("v-uni-view",{key:e,staticClass:"cu-avatar round lg",style:[{backgroundImage:"url("+t+")"}]})})),1),i("v-uni-view",{staticClass:"t_threeline text-bold text-black margin-bottom-sm"},[t._v(t._s(t.product.title))]),i("v-uni-text",{staticClass:"stockview margin-bottom-sm"},[i("v-uni-text",{staticClass:"text-grey"},[t._v(t._s(t.i18n.goods.stock+": "))]),t.selectspecinfo?i("v-uni-text",{staticClass:"text-bold text-black"},[t._v(t._s(t.selectspecinfo.stockCount))]):t._e()],1),i("v-uni-view",{staticClass:"specsview margin-bottom-sm"},[i("v-uni-view",{staticClass:"text-grey margin-bottom-sm"},[t._v(t._s(t.i18n.goods.handlegoods.goodsspec+": "))]),t.product&&t.product.specs&&t.product.specs.length>0?i("v-uni-view",{staticClass:"allspecview flex flex-wrap align-center",class:t.ifremindspec?"animation-shake":""},t._l(t.product.specs,(function(e,n){return i("v-uni-view",{key:n,staticClass:"cu-tag round padding xl margin-bottom-sm",class:[t.selectspecinfo&&e.specId===t.selectspecinfo.specId?"bg-blue":"line-grey"],on:{click:function(i){i.stopPropagation(),arguments[0]=i=t.$handleEvent(i),t.selectspecinfo=e}}},[t._v(t._s(e.attributeList.map((function(t){return t.attributeValue})).join("、")))])})),1):t._e()],1)],1)],1):t._e(),i("v-uni-view",{staticClass:"cu-form-group margin-left margin-right"},[i("v-uni-view",{staticClass:"title"},[t._v(t._s(t.i18n.stock.amount)+":")]),i("v-uni-input",{class:t.ifremindamount?"animation-shake":"",attrs:{type:"number",placeholder:t.i18n.stock.typestocknumplacholder},model:{value:t.typenumber,callback:function(e){t.typenumber=e},expression:"typenumber"}})],1),i("v-uni-view",{staticClass:"cu-list menu margin-left margin-right solid-top"},[i("v-uni-view",{staticClass:"cu-item arrow",class:t.ifremindcustomer?"animation-shake":"",on:{click:function(e){e.stopPropagation(),arguments[0]=e=t.$handleEvent(e),t.starttoselectcustomer.apply(void 0,arguments)}}},[i("v-uni-view",{staticClass:"title"},[t._v(t._s(t.i18n.stock.customer)+":")]),i("v-uni-view",{staticClass:"action"},[t._v(t._s(t.selectcustomer?t.selectcustomer.customer:t.i18n.base.select))])],1),i("v-uni-view",{staticClass:"cu-item arrow",class:t.ifremindpricetype?"animation-shake":"",on:{click:function(e){e.stopPropagation(),arguments[0]=e=t.$handleEvent(e),t.ifshowmodal=!0}}},[i("v-uni-view",{staticClass:"title"},[t._v(t._s(t.i18n.stock.pricetype)+":")]),i("v-uni-view",{staticClass:"action"},[t._v(t._s(t.selectpriceinfo?t.selectpriceinfo.name:t.i18n.base.select))])],1)],1),i("v-uni-view",{staticClass:"cu-modal",class:t.ifshowmodal?"show":"",on:{click:function(e){e.stopPropagation(),arguments[0]=e=t.$handleEvent(e),t.ifshowmodal=!1}}},[i("v-uni-view",{staticClass:"cu-dialog",on:{click:function(e){e.stopPropagation(),arguments[0]=e=t.$handleEvent(e)}}},[i("v-uni-radio-group",{staticClass:"block",on:{change:function(e){arguments[0]=e=t.$handleEvent(e),t.changepricetype.apply(void 0,arguments)}}},[i("v-uni-view",{staticClass:"cu-list menu text-left"},t._l(t.priceTypeList,(function(e,n){return i("v-uni-view",{key:n,staticClass:"cu-item"},[i("v-uni-label",{staticClass:"flex justify-between align-center flex-sub"},[i("v-uni-view",{staticClass:"flex-sub"},[t._v(t._s(e.name))]),i("v-uni-radio",{staticClass:"round",class:t.selectpriceinfo&&t.selectpriceinfo.type===e.type?"checked":"",attrs:{checked:t.selectpriceinfo===e.type,value:e.type.toString()}})],1)],1)})),1)],1)],1)],1),i("v-uni-view",{staticClass:"cu-bar btn-group optionbtnview bg-white"},[i("v-uni-button",{staticClass:"cu-btn round lg shadow-blur bg-gradual-blue",on:{click:function(e){e.stopPropagation(),arguments[0]=e=t.$handleEvent(e),t.fixstock("in")}}},[t._v(t._s(t.i18n.stock.stockin))]),i("v-uni-button",{staticClass:"cu-btn round lg shadow-blur bg-gradual-green",on:{click:function(e){e.stopPropagation(),arguments[0]=e=t.$handleEvent(e),t.fixstock("out")}}},[t._v(t._s(t.i18n.stock.stockout))])],1)],1)},a=[];i.d(e,"b",(function(){return s})),i.d(e,"c",(function(){return a})),i.d(e,"a",(function(){return n}))},bd4f:function(t,e,i){var n=i("24fb");e=n(!1),e.push([t.i,'@charset "UTF-8";\n/**\n * 这里是uni-app内置的常用样式变量\n *\n * uni-app 官方扩展插件及插件市场（https://ext.dcloud.net.cn）上很多三方插件均使用了这些样式变量\n * 如果你是插件开发者，建议你使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\n *\n */\n/**\n * 如果你是App开发者（插件使用者），你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\n *\n * 如果你的项目同样使用了scss预处理，你也可以直接在你的 scss 代码中使用如下变量，同时无需 import 这个文件\n */\n/* 颜色变量 */\n/* 行为相关颜色 */\n/* 文字基本颜色 */\n/* 背景颜色 */\n/* 边框颜色 */\n/* 尺寸变量 */\n/* 文字尺寸 */\n/* 图片尺寸 */\n/* Border Radius */\n/* 水平间距 */\n/* 垂直间距 */\n/* 透明度 */\n/* 文章场景相关 */.handlestockview[data-v-a0f9ad64]{padding-bottom:100px}.handlestockview .proimgsview[data-v-a0f9ad64]{direction:ltr}.handlestockview .optionbtnview[data-v-a0f9ad64]{position:fixed;z-index:999;bottom:0;left:0;right:0}',""]),t.exports=e},ced3:function(t,e,i){var n=i("bd4f");"string"===typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);var s=i("4f06").default;s("d3f1df90",n,!0,{sourceMap:!1,shadowMode:!1})},d0fe:function(t,e,i){"use strict";i.r(e);var n=i("ac5d"),s=i("db73");for(var a in s)"default"!==a&&function(t){i.d(e,t,(function(){return s[t]}))}(a);i("3578");var o,c=i("f0c5"),r=Object(c["a"])(s["default"],n["b"],n["c"],!1,null,"a0f9ad64",null,!1,n["a"],o);e["default"]=r.exports},d8c4:function(t,e,i){var n=i("1f85");"string"===typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);var s=i("4f06").default;s("1f1c9a68",n,!0,{sourceMap:!1,shadowMode:!1})},db73:function(t,e,i){"use strict";i.r(e);var n=i("7a02"),s=i.n(n);for(var a in n)"default"!==a&&function(t){i.d(e,t,(function(){return n[t]}))}(a);e["default"]=s.a}}]);