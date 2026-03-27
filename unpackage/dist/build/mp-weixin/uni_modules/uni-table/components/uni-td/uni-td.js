(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["uni_modules/uni-table/components/uni-td/uni-td"],{"3ccb":function(t,n,e){},"6c3e":function(t,n,e){"use strict";e.d(n,"b",(function(){return r})),e.d(n,"c",(function(){return u})),e.d(n,"a",(function(){}));var r=function(){var t=this.$createElement;this._self._c},u=[]},"8b4a":function(t,n,e){"use strict";var r=e("3ccb"),u=e.n(r);u.a},"91be":function(t,n,e){"use strict";e.r(n);var r=e("9c75"),u=e.n(r);for(var i in r)["default"].indexOf(i)<0&&function(t){e.d(n,t,(function(){return r[t]}))}(i);n["default"]=u.a},"9c75":function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var r={name:"uniTd",options:{virtualHost:!0},props:{width:{type:[String,Number],default:""},align:{type:String,default:"left"},rowspan:{type:[Number,String],default:1},colspan:{type:[Number,String],default:1}},data:function(){return{border:!1}},created:function(){this.root=this.getTable(),this.border=this.root.border},methods:{getTable:function(){var t=this.$parent,n=t.$options.name;while("uniTable"!==n){if(t=t.$parent,!t)return!1;n=t.$options.name}return t}}};n.default=r},a9da:function(t,n,e){"use strict";e.r(n);var r=e("6c3e"),u=e("91be");for(var i in u)["default"].indexOf(i)<0&&function(t){e.d(n,t,(function(){return u[t]}))}(i);e("8b4a");var a=e("828b"),o=Object(a["a"])(u["default"],r["b"],r["c"],!1,null,null,null,!1,r["a"],void 0);n["default"]=o.exports}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'uni_modules/uni-table/components/uni-td/uni-td-create-component',
    {
        'uni_modules/uni-table/components/uni-td/uni-td-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('df3c')['createComponent'](__webpack_require__("a9da"))
        })
    },
    [['uni_modules/uni-table/components/uni-td/uni-td-create-component']]
]);
