(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-managepeople-index"],{"4a17":function(t,e,i){"use strict";var a,n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-uni-view",{staticClass:"managepeople"},[i("cu-custom",{attrs:{bgColor:"bg-gradual-orange",isBack:!0}},[i("template",{attrs:{slot:"content"},slot:"content"},[t._v(t._s(t.i18n.me.panel.managepeople))])],2),i("v-uni-view",{staticClass:"cu-bar bg-white search fixed",style:[{top:t.CustomBar+"px"}]},[i("v-uni-view",{staticClass:"search-form round"},[i("v-uni-text",{staticClass:"cuIcon-search"}),i("v-uni-input",{attrs:{type:"text",placeholder:t.i18n.tip.searchpeople,"confirm-type":"search"},model:{value:t.searchText,callback:function(e){t.searchText=e},expression:"searchText"}})],1),i("v-uni-view",{staticClass:"action"},[i("v-uni-button",{staticClass:"cu-btn bg-gradual-orange shadow round",on:{click:function(e){e.stopPropagation(),arguments[0]=e=t.$handleEvent(e),t.starttosearch.apply(void 0,arguments)}}},[t._v(t._s(t.i18n.base.scrollto))])],1)],1),i("v-uni-scroll-view",{staticClass:"indexes",style:[{top:"calc("+(t.CustomBar+50)+"px"}],attrs:{"scroll-y":!0,"scroll-into-view":"indexes-"+t.listCurID.toString(),"scroll-with-animation":!0,"enable-back-to-top":!0}},t._l(t.memberlist,(function(e,a){return i("v-uni-view",{key:a,staticClass:"cu-list menu-avatar margin-top",attrs:{id:"indexes-"+a.toString()}},[i("v-uni-view",{staticClass:"cu-item",on:{click:function(i){i.stopPropagation(),arguments[0]=i=t.$handleEvent(i),t.editmember(e)}}},[[e.avatar&&""!==e.avatar?i("v-uni-view",{staticClass:"cu-avatar round lg",style:{backgroundImage:"url("+(t.imgUrl+e.avatar)+")"}}):i("v-uni-view",{staticClass:"cu-avatar round lg"},[t._v(t._s(e.realName.substr(0,1)))])],i("v-uni-view",{staticClass:"content"},[i("v-uni-view",[i("v-uni-view",{staticClass:"text-black text-bold text-cut margin-right-sm"},[t._v(t._s(e.realName))]),i("v-uni-view",{staticClass:"cu-tag round",class:[0===e.type?"bg-blue":"bg-orange"]},[t._v(t._s(0===e.type?t.i18n.base.admin:t.i18n.base.normaladmin))])],1),i("v-uni-view",{staticClass:"text-gray text-sm text-cut"},[t._v(t._s(e.remark||""))])],1),i("v-uni-view",{staticClass:"action"},[i("v-uni-text",{class:[1===e.freezeFlag?"cuIcon-lock text-gray":""]})],1)],2)],1)})),1),i("v-uni-view",{staticClass:"addmemberbtn cu-btn round bg-gradual-orange shadow-blur cuIcon lg",on:{click:function(e){e.stopPropagation(),arguments[0]=e=t.$handleEvent(e),t.addmember.apply(void 0,arguments)}}},[i("v-uni-text",{staticClass:"cuIcon-add",staticStyle:{"font-size":"100upx"}})],1)],1)},s=[];i.d(e,"b",(function(){return n})),i.d(e,"c",(function(){return s})),i.d(e,"a",(function(){return a}))},"4c59":function(t,e,i){"use strict";var a=i("bb03"),n=i.n(a);n.a},6511:function(t,e,i){"use strict";i.r(e);var a=i("cc5a"),n=i.n(a);for(var s in a)"default"!==s&&function(t){i.d(e,t,(function(){return a[t]}))}(s);e["default"]=n.a},7652:function(t,e,i){var a=i("24fb");e=a(!1),e.push([t.i,'@charset "UTF-8";\n/**\n * 这里是uni-app内置的常用样式变量\n *\n * uni-app 官方扩展插件及插件市场（https://ext.dcloud.net.cn）上很多三方插件均使用了这些样式变量\n * 如果你是插件开发者，建议你使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\n *\n */\n/**\n * 如果你是App开发者（插件使用者），你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\n *\n * 如果你的项目同样使用了scss预处理，你也可以直接在你的 scss 代码中使用如下变量，同时无需 import 这个文件\n */\n/* 颜色变量 */\n/* 行为相关颜色 */\n/* 文字基本颜色 */\n/* 背景颜色 */\n/* 边框颜色 */\n/* 尺寸变量 */\n/* 文字尺寸 */\n/* 图片尺寸 */\n/* Border Radius */\n/* 水平间距 */\n/* 垂直间距 */\n/* 透明度 */\n/* 文章场景相关 */uni-page-body[data-v-4ed7b020]{padding-top:%?100?%}.indexes[data-v-4ed7b020]{position:fixed;bottom:0}.indexBar[data-v-4ed7b020]{position:fixed;right:0;bottom:0;padding:%?20?% %?20?% %?20?% %?60?%;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-align:center;-webkit-align-items:center;align-items:center}.indexBar .indexBar-box[data-v-4ed7b020]{width:%?40?%;height:auto;background:#fff;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;flex-direction:column;box-shadow:0 0 %?20?% rgba(0,0,0,.1);border-radius:%?10?%}.indexBar-item[data-v-4ed7b020]{-webkit-box-flex:1;-webkit-flex:1;flex:1;width:%?40?%;height:%?40?%;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-align:center;-webkit-align-items:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;font-size:%?24?%;color:#888}uni-movable-view.indexBar-item[data-v-4ed7b020]{width:%?40?%;height:%?40?%;z-index:9;position:relative}uni-movable-view.indexBar-item[data-v-4ed7b020]::before{content:"";display:block;position:absolute;left:0;top:%?10?%;height:%?20?%;width:%?4?%;background-color:#f37b1d}.indexToast[data-v-4ed7b020]{position:fixed;top:0;right:%?80?%;bottom:0;background:rgba(0,0,0,.5);width:%?100?%;height:%?100?%;border-radius:%?10?%;margin:auto;color:#fff;line-height:%?100?%;text-align:center;font-size:%?48?%}.managepeople .addmemberbtn[data-v-4ed7b020]{position:fixed;z-index:999;width:%?100?%;height:%?100?%;bottom:%?50?%;right:%?50?%}',""]),t.exports=e},ad29:function(t,e,i){"use strict";i.r(e);var a=i("4a17"),n=i("6511");for(var s in n)"default"!==s&&function(t){i.d(e,t,(function(){return n[t]}))}(s);i("4c59");var o,r=i("f0c5"),c=Object(r["a"])(n["default"],a["b"],a["c"],!1,null,"4ed7b020",null,!1,a["a"],o);e["default"]=c.exports},bb03:function(t,e,i){var a=i("7652");"string"===typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);var n=i("4f06").default;n("dfa011ca",a,!0,{sourceMap:!1,shadowMode:!1})},cc5a:function(t,e,i){"use strict";i("c740"),i("c975"),Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var a={data:function(){return{StatusBar:this.StatusBar,CustomBar:this.CustomBar,searchText:"",memberlist:[],listCurID:-1}},onLoad:function(){var t=this;uni.$on("updatemember",(function(e){t.getmemberlist()})),this.getmemberlist()},destroyed:function(){uni.$off("updatemember")},methods:{getmemberlist:function(){var t=this;this.$api.managepeopleapi.getmemberlist().then((function(e){var i=e.data.list;t.memberlist=i})).catch((function(e){uni.showToast({title:t.i18n.error.getmemberlisterror,icon:"none"})}))},addmember:function(){uni.navigateTo({url:"/pages/managepeople/handlemember?type=add"})},editmember:function(t){uni.setStorageSync("editmember",t),uni.navigateTo({url:"/pages/managepeople/handlemember?type=edit"})},starttosearch:function(){if(""!==this.searchText){var t=this,e=this.memberlist.findIndex((function(e,i){return-1!=e.realName.indexOf(t.searchText)}));this.listCurID=e}}}};e.default=a}}]);