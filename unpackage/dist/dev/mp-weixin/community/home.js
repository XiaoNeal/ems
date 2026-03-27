require('./common/vendor.js');(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["community/home"],{

/***/ 939:
/*!**************************************************!*\
  !*** D:/ems/main.js?{"page":"community%2Fhome"} ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(wx, createPage) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
__webpack_require__(/*! uni-pages */ 26);
var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 25));
var _home = _interopRequireDefault(__webpack_require__(/*! ./community/home.vue */ 940));
// @ts-ignore
wx.__webpack_require_UNI_MP_PLUGIN__ = __webpack_require__;
createPage(_home.default);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/wx.js */ 1)["default"], __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["createPage"]))

/***/ }),

/***/ 940:
/*!*********************************!*\
  !*** D:/ems/community/home.vue ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _home_vue_vue_type_template_id_92203c5a_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./home.vue?vue&type=template&id=92203c5a&scoped=true& */ 941);
/* harmony import */ var _home_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./home.vue?vue&type=script&lang=js& */ 943);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _home_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _home_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _home_vue_vue_type_style_index_0_id_92203c5a_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./home.vue?vue&type=style&index=0&id=92203c5a&lang=scss&scoped=true& */ 948);
/* harmony import */ var _HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js */ 70);

var renderjs





/* normalize component */

var component = Object(_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _home_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _home_vue_vue_type_template_id_92203c5a_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _home_vue_vue_type_template_id_92203c5a_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "92203c5a",
  null,
  false,
  _home_vue_vue_type_template_id_92203c5a_scoped_true___WEBPACK_IMPORTED_MODULE_0__["components"],
  renderjs
)

component.options.__file = "community/home.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ 941:
/*!****************************************************************************!*\
  !*** D:/ems/community/home.vue?vue&type=template&id=92203c5a&scoped=true& ***!
  \****************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_home_vue_vue_type_template_id_92203c5a_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./home.vue?vue&type=template&id=92203c5a&scoped=true& */ 942);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_home_vue_vue_type_template_id_92203c5a_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_home_vue_vue_type_template_id_92203c5a_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return _HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_home_vue_vue_type_template_id_92203c5a_scoped_true___WEBPACK_IMPORTED_MODULE_0__["recyclableRender"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "components", function() { return _HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_home_vue_vue_type_template_id_92203c5a_scoped_true___WEBPACK_IMPORTED_MODULE_0__["components"]; });



/***/ }),

/***/ 942:
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/ems/community/home.vue?vue&type=template&id=92203c5a&scoped=true& ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return recyclableRender; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "components", function() { return components; });
var components
try {
  components = {
    qiunDataCharts: function () {
      return Promise.all(/*! import() | uni_modules/qiun-data-charts/components/qiun-data-charts/qiun-data-charts */[__webpack_require__.e("common/vendor"), __webpack_require__.e("uni_modules/qiun-data-charts/components/qiun-data-charts/qiun-data-charts")]).then(__webpack_require__.bind(null, /*! @/uni_modules/qiun-data-charts/components/qiun-data-charts/qiun-data-charts.vue */ 1204))
    },
  }
} catch (e) {
  if (
    e.message.indexOf("Cannot find module") !== -1 &&
    e.message.indexOf(".vue") !== -1
  ) {
    console.error(e.message)
    console.error("1. 排查组件名称拼写是否正确")
    console.error(
      "2. 排查组件是否符合 easycom 规范，文档：https://uniapp.dcloud.net.cn/collocation/pages?id=easycom"
    )
    console.error(
      "3. 若组件不符合 easycom 规范，需手动引入，并在 components 中注册该组件"
    )
  } else {
    throw e
  }
}
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  if (!_vm._isMounted) {
    _vm.e0 = function ($event, tab) {
      var _temp = arguments[arguments.length - 1].currentTarget.dataset,
        _temp2 = _temp.eventParams || _temp["event-params"],
        tab = _temp2.tab
      var _temp, _temp2
      return _vm.updatePhotoChart(tab)
    }
  }
}
var recyclableRender = false
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ 943:
/*!**********************************************************!*\
  !*** D:/ems/community/home.vue?vue&type=script&lang=js& ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_home_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/babel-loader/lib!../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./home.vue?vue&type=script&lang=js& */ 944);
/* harmony import */ var _HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_home_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_home_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_home_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_home_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_home_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 944:
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/ems/community/home.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _regenerator = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/regenerator */ 123));
var _toConsumableArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ 18));
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ 125));
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ 11));
var _nyz_new = _interopRequireDefault(__webpack_require__(/*! @/api/nyz_new */ 945));
var _energy = _interopRequireDefault(__webpack_require__(/*! @/api/energy */ 946));
var _energy_new = _interopRequireDefault(__webpack_require__(/*! @/api/energy_new */ 947));
var _dateFormat = __webpack_require__(/*! @/utils/date-format */ 135);
var _vuex = __webpack_require__(/*! vuex */ 72);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var _default = {
  data: function data() {
    return {
      canvas2d: this.$Config.ISCANVAS2D,
      carbonStats: [{
        title: '本年碳减排总量',
        key: 'carbonReduction',
        unit: '千克',
        color: '#00ffaa'
      }, {
        title: '本年碳排放总量',
        key: 'carbonEmission',
        unit: '千克',
        color: '#ff6666'
      }],
      energyDataTabs: [{
        type: 'date',
        label: '日',
        color: '#00ffff'
      }, {
        type: 'month',
        label: '月',
        color: '#00ffaa'
      }, {
        type: 'year',
        label: '年',
        color: '#0099ff'
      }],
      energyConsumptionData: {
        title: '本年能源总能耗',
        value: 'yearTotalData.energyConsumption',
        unit: '吨标准煤',
        color: '#00ffff'
      },
      energyStats: [{
        key: 'generation',
        title: '本年新能源发电',
        unit: 'kWh'
      }, {
        key: 'storageCharge',
        title: '本年储能充电',
        unit: 'kWh'
      }, {
        key: 'storageDischarge',
        title: '本年储能放电',
        unit: 'kWh'
      }],
      energyItems: [{
        label: '电网',
        key: 'grid',
        unit: 'kWh',
        color: '#00ffff',
        icon: './static/images/power-grid.png'
      }, {
        label: '光伏',
        key: 'greenElectricity',
        unit: 'kWh',
        color: '#00ffaa',
        icon: './static/images/PV.png'
      }, {
        label: '用电',
        key: 'consumption',
        unit: 'kWh',
        color: '#0099ff',
        icon: './static/images/load.png'
      }, {
        label: '储能',
        key: 'soc',
        unit: 'kWh',
        color: '#ff9900',
        icon: './static/images/ES.png'
      }, {
        label: '备电',
        key: 'bankup',
        unit: 'kWh',
        color: '#ff9900',
        icon: './static/images/backup-power.png'
      }],
      // 定时器
      dataInterval: null,
      nowYear: new Date().getFullYear(),
      // 日期类型
      dateType: "date",
      // 本年数据
      yearTotalData: {
        energyConsumption: {
          int: '--',
          dec: ''
        },
        generation: {
          int: '--',
          dec: ''
        },
        storageCharge: {
          int: '--',
          dec: ''
        },
        storageDischarge: {
          int: '--',
          dec: ''
        },
        carbonEmission: {
          int: '--',
          dec: ''
        },
        carbonReduction: {
          int: '--',
          dec: ''
        },
        gridForward: {
          int: '--',
          dec: ''
        },
        gridReverse: {
          int: '--',
          dec: ''
        }
      },
      // 用能结构
      energyStructure: {
        grid: "--",
        greenElectricity: "--",
        consumption: "--",
        soc: "--",
        bankup: '--'
      },
      // 碳排因子
      carbonFactor: {},
      // 碳排放量
      carbonEmission: {
        electricity: "--",
        electricityPercent: 0,
        oil: "--",
        oilPercent: 0
      },
      // 社会贡献
      contribution: {
        coalSaving: "--",
        plantingAmout: "--"
      },
      // 图表
      radarChartOption: {
        color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
        padding: [0, 0, 0, 0],
        dataLabel: true,
        dataPointShape: false,
        enableScroll: false,
        fontSize: 10,
        legend: {
          show: false
        },
        extra: {
          radar: {
            gridType: "radar",
            gridColor: "#CCCCCC",
            gridCount: 2,
            opacity: 1,
            max: 1,
            labelShow: true,
            linearType: "custom",
            border: false,
            axisLabel: true
          }
        }
      },
      radarChartData: {},
      dashboardChartOption: {},
      dashboardChartData: {},
      photoChartOption: (0, _defineProperty2.default)({
        extra: {
          column: {
            type: "group",
            width: 10,
            activeBgColor: "#CDF8F0",
            activeBgOpacity: 0.3,
            linearType: "custom"
          }
        },
        color: ["#CDF8F0", "#00ffaa"],
        padding: [15, 15, 0, 15],
        legend: {
          show: true,
          position: "top",
          float: "center",
          fontSize: 12,
          margin: 5,
          itemGap: 10
        },
        xAxis: {
          disableGrid: true,
          axisLineColor: "#0d2b60",
          axisLabelColor: "#ffffff",
          labelCount: 12,
          fontSize: 10
        },
        yAxis: {
          gridType: "dash",
          dashLength: 2,
          gridColor: "#CDF8F0",
          splitNumber: 5,
          showTitle: true,
          data: [{
            title: "单位:kWh"
          }],
          axisLabelColor: "#ffffff",
          fontSize: 10
        },
        dataLabel: false
      }, "extra", {
        column: {
          // type: "group",
          // width: 10,
          // activeBgColor: "#00aaff",
          // activeBgOpacity: 1,
          // linearType: "custom"

          type: "group",
          width: 10,
          // activeBgColor: "#000000",
          activeBgOpacity: 0.08
          // customColor: ["#CDF8F0", "#F7CB6B"]
        }
      }),

      photoChartData: {},
      storageChartData: {},
      storageChartOption: {
        color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
        padding: [15, 15, 0, 15],
        enableScroll: false,
        legend: {},
        xAxis: {
          disableGrid: true,
          // boundaryGap: "justify",
          // format: "xAxisDemo2",
          labelCount: 6
        },
        yAxis: {
          gridType: "dash",
          dashLength: 2,
          showTitle: true,
          data: [{
            position: "left",
            title: "单位:kWh"
          }]
        },
        extra: {
          area: {
            type: "curve",
            opacity: 0.2,
            addLine: false,
            width: 2
            // gradient: true,
            // activeType: "hollow"
          }
        },

        dataLabel: false
      },
      carbonChartData: {},
      carbonChartOption: {
        dataLabel: false,
        color: ["#CDF8F0", "#F7CB6B", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
        padding: [15, 15, 0, 5],
        enableScroll: false,
        legend: {},
        xAxis: {
          disableGrid: true
        },
        yAxis: {
          gridType: "dash",
          dashLength: 2,
          showTitle: true,
          data: [{
            min: 0,
            title: '单位:千克'
          }]
        },
        extra: {
          column: {
            type: "group",
            width: 10,
            activeBgColor: "#000000",
            activeBgOpacity: 0.08,
            customColor: ["#CDF8F0", "#F7CB6B"]
          }
        }
      },
      photoData: {},
      activeChartTab: '光伏发电',
      storageBatteryRemain: 0,
      nyzStorageBatteryData: {
        charge: 53,
        discharge: 53,
        batterySum: 0 // 初始化 batterySum 属性
      }
    };
  },

  computed: _objectSpread(_objectSpread({
    // 运行时长
    runningDates: function runningDates() {
      var startDate = this.currentSystem ? this.currentSystem.startDate : new Date().toISOString().split('T')[0];
      var days = this.$moment().diff(this.$moment(startDate), "day");
      return days.toString().padStart(4, '0').split('');
    }
  }, (0, _vuex.mapGetters)(['currentSystem'])), {}, {
    ammeterList: function ammeterList() {
      return this.currentSystem ? this.currentSystem.ammeterList : [];
    }
  }),
  methods: {
    // 初始化
    initPage: function initPage() {
      var _this = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
        var opt, opt2;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _this.getYearData();
                _context.next = 3;
                return _this.handleData(_this.dateType);
              case 3:
                opt = _context.sent;
                _context.next = 6;
                return _this.handleNyzSolarData(_this.dateType);
              case 6:
                opt2 = _context.sent;
                _context.next = 9;
                return _this.getStorageBatteryData();
              case 9:
                _this.getEnergyData(opt, opt2);
                _this.getCarbonData(opt, opt2);
                _this.getCarbonIndexData(opt);
                _this.getStorageRemainEnergy();

                // this.handleNyzSolarData('date')
              case 13:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }))();
    },
    // 更新光伏图表数据
    updatePhotoChart: function updatePhotoChart(type) {
      var _this2 = this;
      this.activeChartTab = type;
      var data = [];
      this.photoChartData.categories.map(function (item, index) {
        if (_this2.dateType === 'date') {
          data[item] = type === '光伏发电' ? _this2.photoData.solar[index] : _this2.photoData.electricity[index];
          ;
        } else {
          data[item - 1] = type === '光伏发电' ? _this2.photoData.solar[index] : _this2.photoData.electricity[index];
        }
      });
      this.photoChartData.series[0].name = type === '光伏发电' ? '光伏发电' : '用电';
      this.photoChartData.series[0].data = data;
    },
    getYearData: function getYearData() {
      var _this3 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
        var boxids, date, result, sum, nyzResult, _nyzSolarResult, _nyzConsumResult, nyzGridResult, nyzSum, _factorELE, factorELE, temp, nyzConsumResult, nyzSolarResult, xAxis, solarArr, electricityArr, solarData, electricityData;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                boxids = _this3.currentSystem.boxidsbyYear;
                date = _this3.$moment().format('YYYY-MM-DD');
                _context2.next = 4;
                return _energy_new.default.findYearStatisticsDetailsByLevelIdsAndYear(boxids, date);
              case 4:
                result = _context2.sent;
                // 能源数据
                sum = result.data.reduce(function (pre, curr) {
                  pre.solar += parseFloat(curr.total_provide_q);
                  pre.charge += parseFloat(curr.total_storage_forward_q);
                  pre.discharge += parseFloat(curr.total_storage_reverse_q);
                  pre.electricity += parseFloat(curr.total_consume_electricity_q);
                  pre.gridForward += parseFloat(curr.total_grid_forward_q);
                  pre.gridReverse += parseFloat(curr.total_grid_reverse_q);
                  return pre;
                }, {
                  solar: 0,
                  charge: 0,
                  discharge: 0,
                  electricity: 0,
                  gridForward: 0,
                  gridReverse: 0
                });
                _context2.prev = 6;
                _context2.next = 9;
                return _this3.handleNyzData('year');
              case 9:
                nyzResult = _context2.sent;
                _context2.next = 12;
                return _this3.handleNyzSolarData('year');
              case 12:
                _nyzSolarResult = _context2.sent;
                _context2.next = 15;
                return _this3.handleNyzConsumData('year');
              case 15:
                _nyzConsumResult = _context2.sent;
                _context2.next = 18;
                return _this3.handleNyzGridData('year');
              case 18:
                nyzGridResult = _context2.sent;
                nyzSum = {
                  charge: nyzResult.charge.reduce(function (pre, curr) {
                    return pre += curr;
                  }, 0),
                  discharge: nyzResult.discharge.reduce(function (pre, curr) {
                    return pre += curr;
                  }, 0),
                  solar: _nyzSolarResult.solar.reduce(function (pre, curr) {
                    return pre += curr;
                  }, 0),
                  electricity: _nyzConsumResult.electricity.reduce(function (pre, curr) {
                    return pre += curr;
                  }, 0),
                  gridForward: nyzGridResult.gridForward.reduce(function (pre, curr) {
                    return pre += curr;
                  }, 0),
                  gridReverse: nyzGridResult.gridReverse.reduce(function (pre, curr) {
                    return pre += curr;
                  }, 0)
                };
                _this3.yearTotalData.storageCharge = _this3.getIntAndDec((sum.charge + nyzSum.charge).toFixed(2));
                _this3.yearTotalData.storageDischarge = _this3.getIntAndDec((sum.discharge + nyzSum.discharge).toFixed(2));
                _this3.yearTotalData.generation = _this3.getIntAndDec((sum.solar + nyzSum.solar).toFixed(2));
                _factorELE = _this3.carbonFactor.factorELE;
                _this3.yearTotalData.carbonReduction = _this3.getIntAndDec(((sum.solar + nyzSum.solar) * _factorELE).toFixed(2));
                _this3.yearTotalData.carbonEmission = _this3.getIntAndDec(((sum.electricity + nyzSum.electricity) * _factorELE).toFixed(2));
                _this3.yearTotalData.energyConsumption = _this3.getIntAndDec((sum.electricity + nyzSum.electricity).toFixed(2));
                _this3.yearTotalData.gridForward = _this3.getIntAndDec((sum.gridForward + nyzSum.gridForward).toFixed(2));
                _this3.yearTotalData.gridReverse = _this3.getIntAndDec((sum.gridReverse + nyzSum.gridReverse).toFixed(2));
                _context2.next = 36;
                break;
              case 31:
                _context2.prev = 31;
                _context2.t0 = _context2["catch"](6);
                console.error(_context2.t0);
                _this3.yearTotalData.storageCharge = _this3.getIntAndDec(sum.charge.toFixed(2));
                _this3.yearTotalData.storageDischarge = _this3.getIntAndDec(sum.discharge.toFixed(2));
              case 36:
                console.log(result);
                // 碳排数据
                // let carbonOpt = new options.carbonOptions('year')
                factorELE = _this3.carbonFactor.factorELE; // this.yearTotalData.carbonEmission = this.getIntAndDec((sum.electricity*factorELE).toFixed(2))
                temp = result.data.reduce(function (pre, curr) {
                  pre.time.push(curr.month);
                  pre.solar.push(curr.total_provide_q);
                  pre.electricity.push(curr.total_consume_electricity_q);
                  return pre;
                }, {
                  time: [],
                  solar: [],
                  electricity: []
                });
                _context2.next = 41;
                return _this3.handleNyzConsumData('year');
              case 41:
                nyzConsumResult = _context2.sent;
                // 合并 nyzConsumResult.electricity 和 temp.electricity 的值
                if (nyzConsumResult && nyzConsumResult.electricity) {
                  temp.electricity = temp.electricity.map(function (value, index) {
                    var nyzValue = nyzConsumResult.electricity[index] || 0;
                    return parseFloat(value) + parseFloat(nyzValue);
                  });
                }
                _context2.next = 45;
                return _this3.handleNyzSolarData('year');
              case 45:
                nyzSolarResult = _context2.sent;
                // 合并 nyzSolarResult.solar 和 temp.solar 的值
                if (nyzSolarResult && nyzSolarResult.solar) {
                  temp.solar = temp.solar.map(function (value, index) {
                    var nyzValue = nyzSolarResult.solar[index] || 0;
                    return parseFloat(value) + parseFloat(nyzValue);
                  });
                }
                xAxis = _this3.xAxisFormat(temp.time, 'year');
                solarArr = temp.solar.map(function (item) {
                  return (item * factorELE).toFixed(2);
                });
                electricityArr = temp.electricity.map(function (item) {
                  return (item * factorELE).toFixed(2);
                });
                solarData = [];
                electricityData = [];
                xAxis.map(function (item, index) {
                  solarData[item - 1] = solarArr[index];
                  electricityData[item - 1] = electricityArr[index];
                });
                _this3.carbonChartData = {
                  categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                  series: [{
                    name: '碳减排',
                    data: solarData
                  }, {
                    name: '碳排放',
                    data: electricityData
                  }]
                };
                console.log(_this3.carbonChartData, "-----", solarArr, electricityArr, temp);
                return _context2.abrupt("return");
              case 56:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[6, 31]]);
      }))();
    },
    handleNyzConsumData: function handleNyzConsumData(dateType) {
      var _this4 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3() {
        var consumIdOne, consumIdTwo, consumIds, result, nyzData, timeMap;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                consumIdOne = _this4.ammeterList.find(function (item) {
                  return item.deviceName == '1#负载DC直流表';
                }).deviceId;
                consumIdTwo = _this4.ammeterList.find(function (item) {
                  return item.deviceName == '2#负载DC直流表';
                }).deviceId;
                consumIds = [consumIdOne, consumIdTwo];
                result = [];
                nyzData = [];
                timeMap = {
                  'date': 'hour',
                  'month': 'date',
                  'year': 'month'
                };
                if (!(dateType == 'date')) {
                  _context3.next = 13;
                  break;
                }
                _context3.next = 10;
                return _energy_new.default.findEveryHourByDeviceIds({
                  deviceIds: consumIds,
                  day: _this4.$moment().format("YYYY-MM-DD")
                });
              case 10:
                result = _context3.sent;
                _context3.next = 23;
                break;
              case 13:
                if (!(dateType == 'month')) {
                  _context3.next = 19;
                  break;
                }
                _context3.next = 16;
                return _energy_new.default.findEveryDayByDeviceIds({
                  deviceIds: consumIds,
                  year: new Date().getFullYear(),
                  month: new Date().getMonth() + 1
                });
              case 16:
                result = _context3.sent;
                _context3.next = 23;
                break;
              case 19:
                if (!(dateType == 'year')) {
                  _context3.next = 23;
                  break;
                }
                _context3.next = 22;
                return _energy_new.default.findEveryMonthByDeviceIds({
                  deviceIds: consumIds,
                  year: new Date().getFullYear()
                });
              case 22:
                result = _context3.sent;
              case 23:
                console.log(result, "123123123112313213");
                nyzData = result.data.reduce(function (pre, curr) {
                  pre.time.push(curr[timeMap[dateType]]);
                  pre.electricity.push(curr.total_consume_electricity_q);
                  return pre;
                }, {
                  time: [],
                  electricity: []
                });
                return _context3.abrupt("return", nyzData);
              case 28:
                _context3.prev = 28;
                _context3.t0 = _context3["catch"](0);
                console.error(_context3.t0);
              case 31:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[0, 28]]);
      }))();
    },
    getStorageRemainEnergy: function getStorageRemainEnergy() {
      var _this5 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4() {
        var result, chartData;
        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return _nyz_new.default.getStorageRemainEnergy({
                  deviceId: _this5.currentSystem.storageDeviceid,
                  start: _this5.$moment().format("YYYY-MM-DD 00:00:00"),
                  end: _this5.$moment().format("YYYY-MM-DD 23:59:59"),
                  intervalMinutes: 1,
                  aggregationType: 'LAST'
                });
              case 2:
                result = _context4.sent;
                if (result.data) {
                  // this.storageChartOption = new options.storageOptions();
                  chartData = result.data.reduce(function (pre, curr) {
                    pre.xAxis.push(_this5.$moment(curr.time).format('HH:mm'));
                    pre.battery.push(curr.battery_stack_power_available_electricity);
                    return pre;
                  }, {
                    xAxis: [],
                    battery: []
                  }); // this.storageChartOption.xAxis[0].data = chartData.xAxis
                  // this.storageChartOption.series[0].data = chartData.battery
                  _this5.storageChartData = {
                    categories: chartData.xAxis,
                    series: [{
                      name: '剩余电量',
                      data: chartData.battery
                    }]
                  };
                  // 获取 battery 数组的最后一个元素赋值给 storageBatteryRemain
                  _this5.storageBatteryRemain = chartData.battery.at(-1) || 0;
                }
              case 4:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }))();
    },
    getStorageBatteryData: function getStorageBatteryData() {
      var _this6 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee5() {
        var storageIdOne, storageIdTwo, storageIds, result, dateType, _sumData, xAxisData, chargeData, dischargeData, daysInMonth, i, _i, validDataPoints, timeMapKey, sumData;
        return _regenerator.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                console.log(11111111111111111111);
                storageIdOne = _this6.ammeterList.find(function (item) {
                  return item.deviceName == '1#储能DC直流表';
                }).deviceId;
                storageIdTwo = _this6.ammeterList.find(function (item) {
                  return item.deviceName == '2#储能DC直流表';
                }).deviceId;
                storageIds = [storageIdOne, storageIdTwo];
                result = [];
                dateType = _this6.dateType;
                if (!(dateType == 'date')) {
                  _context5.next = 21;
                  break;
                }
                _context5.next = 10;
                return _this6.getStorageRemainEnergy();
              case 10:
                _context5.next = 12;
                return _energy_new.default.findEveryHourByDeviceIds({
                  deviceIds: storageIds,
                  day: _this6.$moment().format("YYYY-MM-DD")
                });
              case 12:
                result = _context5.sent;
                _sumData = result.data.reduce(function (pre, curr) {
                  pre.charge += parseFloat(curr.total_storage_forward_q);
                  pre.discharge += parseFloat(curr.total_storage_reverse_q);
                  return pre;
                }, {
                  charge: 0,
                  discharge: 0
                });
                _this6.nyzStorageBatteryData.charge = _this6.getIntAndDec(_sumData.charge.toFixed(2));
                _this6.nyzStorageBatteryData.discharge = _this6.getIntAndDec(_sumData.discharge.toFixed(2));
                // 计算电池充放电差值
                _this6.nyzStorageBatteryData.batterySum = parseFloat((_sumData.charge - _sumData.discharge).toFixed(2));
                _this6.energyStructure.soc = parseFloat((_sumData.charge - _sumData.discharge).toFixed(2));
                return _context5.abrupt("return");
              case 21:
                if (!(dateType == 'month')) {
                  _context5.next = 27;
                  break;
                }
                _context5.next = 24;
                return _energy_new.default.findEveryDayByDeviceIds({
                  deviceIds: storageIds,
                  year: new Date().getFullYear(),
                  month: new Date().getMonth() + 1
                });
              case 24:
                result = _context5.sent;
                _context5.next = 31;
                break;
              case 27:
                if (!(dateType == 'year')) {
                  _context5.next = 31;
                  break;
                }
                _context5.next = 30;
                return _energy_new.default.findEveryMonthByDeviceIds({
                  deviceIds: storageIds,
                  year: new Date().getFullYear()
                });
              case 30:
                result = _context5.sent;
              case 31:
                // --- “月”和“年”视图的新逻辑开始 ---
                // 1. 初始化X轴标签和数据数组
                xAxisData = [];
                chargeData = [];
                dischargeData = [];
                if (!(_this6.dateType === 'month')) {
                  _context5.next = 42;
                  break;
                }
                // 使用 moment.js 获取当前月份的天数，能正确处理闰年2月
                daysInMonth = _this6.$moment().daysInMonth();
                for (i = 1; i <= daysInMonth; i++) {
                  xAxisData.push("".concat(i, "\u65E5"));
                  chargeData.push(0); // 填充0作为默认值
                  dischargeData.push(0); // 填充0作为默认值
                }
                _context5.next = 39;
                return _energy_new.default.findEveryDayByDeviceIds({
                  deviceIds: storageIds,
                  year: new Date().getFullYear(),
                  month: new Date().getMonth() + 1
                });
              case 39:
                result = _context5.sent;
                _context5.next = 47;
                break;
              case 42:
                if (!(_this6.dateType === 'year')) {
                  _context5.next = 47;
                  break;
                }
                for (_i = 1; _i <= 12; _i++) {
                  xAxisData.push("".concat(_i, "\u6708"));
                  chargeData.push(0); // 填充0作为默认值
                  dischargeData.push(0); // 填充0作为默认值
                }
                _context5.next = 46;
                return _energy_new.default.findEveryMonthByDeviceIds({
                  deviceIds: storageIds,
                  year: new Date().getFullYear()
                });
              case 46:
                result = _context5.sent;
              case 47:
                // --- 核心修改开始 ---
                // 1. 创建一个 Set，用来存储从API返回的真实数据所对应的日期标签
                validDataPoints = new Set();
                if (result.data) {
                  timeMapKey = _this6.dateType === 'month' ? 'date' : 'month';
                  result.data.forEach(function (item) {
                    var index;
                    var label;
                    if (timeMapKey === 'date') {
                      var dayOfMonth = _this6.$moment(item.date).date();
                      index = dayOfMonth - 1;
                      label = "".concat(dayOfMonth, "\u65E5");
                    } else {
                      index = item.month - 1;
                      label = "".concat(item.month, "\u6708");
                    }

                    // 2. 将这个标签添加到我们的“有效数据点”集合中
                    validDataPoints.add(label);
                    if (index >= 0 && index < xAxisData.length) {
                      chargeData[index] = parseFloat(item.total_storage_forward_q.toFixed(2));
                      dischargeData[index] = parseFloat(item.total_storage_reverse_q.toFixed(2));
                    }
                  });
                }

                // 3. 在创建图表配置实例时，将这个“有效数据点”集合传递过去
                // const storageOpt = new options.storageBarOptions(this.dateType, validDataPoints);

                // storageOpt.series[0].data = chargeData;
                // storageOpt.series[1].data = dischargeData;
                // storageOpt.xAxis[0].data = xAxisData;
                // this.storageChartOption = storageOpt;
                _this6.storageChartData = {
                  categories: xAxisData,
                  series: [{
                    name: '充电量',
                    data: chargeData
                  }, {
                    name: '放电量',
                    data: dischargeData
                  }]
                };
                sumData = result.data.reduce(function (pre, curr) {
                  pre.charge += parseFloat(curr.total_storage_forward_q);
                  pre.discharge += parseFloat(curr.total_storage_reverse_q);
                  return pre;
                }, {
                  charge: 0,
                  discharge: 0
                });
                _this6.nyzStorageBatteryData.charge = _this6.getIntAndDec(sumData.charge.toFixed(2));
                _this6.nyzStorageBatteryData.discharge = _this6.getIntAndDec(sumData.discharge.toFixed(2));
                // 计算电池充放电差值
                _this6.nyzStorageBatteryData.batterySum = parseFloat((sumData.charge - sumData.discharge).toFixed(2));
                _this6.energyStructure.soc = parseFloat((sumData.charge - sumData.discharge).toFixed(2));
                _context5.next = 60;
                break;
              case 57:
                _context5.prev = 57;
                _context5.t0 = _context5["catch"](0);
                console.error(_context5.t0);
              case 60:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, null, [[0, 57]]);
      }))();
    },
    getEnergyData: function getEnergyData(opt, opt2) {
      var _this7 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee6() {
        var nyzSolar, filteredSolar, totalGreenEle, opt1, opt3, nyzConsum, opt4, filteredElectricity, totalEle, filteredGridForward, totalGrid, totalWater, xAxis, solarData, consumData, solarOpt, storageOpt, nyzdata, _xAxis2, _chargeData, _dischargeData, _opt, _opt2, mergedata, timeArr, _xAxis, chargeArr, dischargeArr, chargeData, dischargeData;
        return _regenerator.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                // let opt = await this.handleData(this.dateType)
                // let opt2 = await this.handleNyzSolarData(this.dateType)
                nyzSolar = [];
                opt2.time.map(function (item, index) {
                  nyzSolar.push({
                    time: item,
                    solar: opt2.solar[index]
                  });
                });
                // opt.time.map((item, index) => {
                //     let idx = nyzSolar.findIndex(e => e.time == item)
                //     if (idx > -1) {
                //         opt.solar[index] = parseFloat((opt.solar[index] + nyzSolar[idx].solar).toFixed(2))
                //     }
                // })
                console.log(opt, opt2, "99999");
                opt.time.map(function (item, index) {
                  var idx = nyzSolar.findIndex(function (e) {
                    return e.time == item;
                  });
                  if (idx > -1) {
                    opt.solar[index] = parseFloat((opt.solar[index] + nyzSolar[idx].solar).toFixed(2));
                  }
                });
                filteredSolar = opt2.solar.filter(function (value) {
                  return value !== null;
                });
                totalGreenEle = [].concat((0, _toConsumableArray2.default)(opt.solar), (0, _toConsumableArray2.default)(filteredSolar)).reduce(function (pre, curr) {
                  return pre + parseFloat(curr);
                }, 0);
                _context6.next = 8;
                return _this7.handleData(_this7.dateType);
              case 8:
                opt1 = _context6.sent;
                _context6.next = 11;
                return _this7.handleNyzConsumData(_this7.dateType);
              case 11:
                opt3 = _context6.sent;
                nyzConsum = [];
                opt3.time.map(function (item, index) {
                  nyzConsum.push({
                    time: item,
                    electricity: opt3.electricity[index]
                  });
                });
                opt.time.map(function (item, index) {
                  var idx = nyzConsum.findIndex(function (e) {
                    return e.time == item;
                  });
                  if (idx > -1) {
                    opt.electricity[index] = parseFloat((opt.electricity[index] + nyzConsum[idx].electricity).toFixed(2));
                  }
                });
                _this7.photoData = opt;
                _context6.next = 18;
                return _this7.handleNyzGridData(_this7.dateType);
              case 18:
                opt4 = _context6.sent;
                // 过滤 opt3.electricity 中的 null 值
                filteredElectricity = opt3.electricity.filter(function (value) {
                  return value !== null;
                });
                totalEle = [].concat((0, _toConsumableArray2.default)(opt1.electricity), (0, _toConsumableArray2.default)(filteredElectricity)).reduce(function (pre, curr) {
                  return pre + parseFloat(curr);
                }, 0); // const totalEle =  [...opt1.electricity, ...opt3.electricity].reduce((pre, curr) => {
                //     return pre + parseFloat(curr)
                // }, 0)
                filteredGridForward = opt4.gridForward.filter(function (value) {
                  return value !== null;
                });
                totalGrid = [].concat((0, _toConsumableArray2.default)(opt.grid), (0, _toConsumableArray2.default)(filteredGridForward)).reduce(function (pre, curr) {
                  return pre + parseFloat(curr);
                }, 0); // 用能结构
                // const totalGreenEle = opt.solar.reduce((pre, curr) => pre += curr, 0)
                totalWater = opt.water.reduce(function (pre, curr) {
                  return pre += curr;
                }, 0);
                _this7.energyStructure.grid = totalGrid.toFixed(2);
                _this7.energyStructure.greenElectricity = totalGreenEle.toFixed(2);
                // this.energyStructure.water = totalWater.toFixed(2)
                _this7.energyStructure.consumption = totalEle.toFixed(2);
                xAxis = _this7.xAxisFormat(opt.time, _this7.dateType);
                solarData = [];
                consumData = [];
                xAxis.map(function (item, index) {
                  if (_this7.dateType == 'date') {
                    solarData[item] = opt.solar[index];
                    consumData[item] = opt.electricity[index];
                  } else {
                    solarData[item - 1] = opt.solar[index];
                    consumData[item - 1] = opt.electricity[index];
                  }
                });

                // 光伏图表
                solarOpt = {
                  categories: xAxis,
                  series: [{
                    name: '光伏',
                    data: []
                    // color: '#91cc75'
                  }]
                };

                solarOpt.series[0].data = solarData;
                // solarOpt.series[1].data = consumData
                // this.photoChartOption = solarOpt

                // solarOpt.series[0].data = solarData
                _this7.photoChartData = solarOpt;
                console.log(111111111111111111111, _this7.photoChartData);
                storageOpt = {
                  categories: [],
                  series: [{
                    name: '充电',
                    data: []
                    // color: '#91cc75'
                  }, {
                    name: '放电',
                    data: []
                    // color: '#ee6666'
                  }]
                }; // 储能图表
                // let storageOpt = new options.storageOptions(this.dateType)
                _context6.prev = 36;
                _context6.next = 39;
                return _this7.handleNyzData(_this7.dateType);
              case 39:
                nyzdata = _context6.sent;
                if (!nyzdata) {
                  _xAxis2 = _this7.xAxisFormat(opt.time, _this7.dateType);
                  _chargeData = [];
                  _dischargeData = [];
                  _xAxis2.map(function (item, index) {
                    // this.storageChartOption.series[0].data[item] = opt.charge[index]
                    // this.storageChartOption.series[1].data[item] = opt.discharge[index]
                    if (_this7.dateType == 'date') {
                      _chargeData[item] = opt.charge[index];
                      _dischargeData[item] = opt.discharge[index];
                    } else {
                      _chargeData[item - 1] = opt.charge[index];
                      _dischargeData[item - 1] = opt.discharge[index];
                    }
                  });
                }
                _opt = [];
                _opt2 = [];
                opt.time.map(function (item, index) {
                  _opt.push({
                    time: item,
                    charge: opt.charge[index],
                    discharge: opt.discharge[index]
                  });
                });
                nyzdata.time.map(function (item, index) {
                  _opt2.push({
                    time: item,
                    charge: nyzdata.charge[index],
                    discharge: nyzdata.discharge[index]
                  });
                });
                mergedata = [].concat(_opt, _opt2).reduce(function (pre, curr) {
                  var existing = pre.find(function (item) {
                    return item.time == curr.time;
                  });
                  if (existing) {
                    existing.charge += curr.charge;
                    existing.discharge += curr.discharge;
                  } else {
                    pre.push(_objectSpread({}, curr));
                  }
                  return pre;
                }, []);
                timeArr = mergedata.map(function (item) {
                  return item.time;
                });
                _xAxis = _this7.xAxisFormat(timeArr, _this7.dateType);
                chargeArr = mergedata.map(function (item) {
                  return item.charge;
                });
                dischargeArr = mergedata.map(function (item) {
                  return item.discharge;
                });
                chargeData = [];
                dischargeData = [];
                _xAxis.map(function (item, index) {
                  // this.storageChartOption.series[0].data[item] = chargeArr[index]
                  // this.storageChartOption.series[1].data[item] = dischargeArr[index]
                  if (_this7.dateType == 'date') {
                    chargeData[item] = chargeArr[index];
                    dischargeData[item] = dischargeArr[index];
                  } else {
                    chargeData[item - 1] = chargeArr[index];
                    dischargeData[item - 1] = dischargeArr[index];
                  }
                });

                // storageOpt.categories = xAxis
                // storageOpt.series[0].data = chargeData
                // storageOpt.series[1].data = dischargeData
                // this.storageChartData = storageOpt
                _context6.next = 58;
                break;
              case 55:
                _context6.prev = 55;
                _context6.t0 = _context6["catch"](36);
                console.error(_context6.t0);
              case 58:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, null, [[36, 55]]);
      }))();
    },
    handleNyzGridData: function handleNyzGridData(dateType) {
      var _this8 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee7() {
        var gridId, gridIds, result, nyzData, timeMap;
        return _regenerator.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.prev = 0;
                gridId = _this8.ammeterList.find(function (item) {
                  return item.deviceName == '1#电网AC交流表';
                }).deviceId;
                gridIds = [gridId];
                result = [];
                nyzData = [];
                timeMap = {
                  'date': 'hour',
                  'month': 'date',
                  'year': 'month'
                };
                if (!(dateType == 'date')) {
                  _context7.next = 12;
                  break;
                }
                _context7.next = 9;
                return _energy_new.default.findEveryHourByDeviceIds({
                  deviceIds: gridIds,
                  day: _this8.$moment().format("YYYY-MM-DD")
                });
              case 9:
                result = _context7.sent;
                _context7.next = 22;
                break;
              case 12:
                if (!(dateType == 'month')) {
                  _context7.next = 18;
                  break;
                }
                _context7.next = 15;
                return _energy_new.default.findEveryDayByDeviceIds({
                  deviceIds: gridIds,
                  year: new Date().getFullYear(),
                  month: new Date().getMonth() + 1
                });
              case 15:
                result = _context7.sent;
                _context7.next = 22;
                break;
              case 18:
                if (!(dateType == 'year')) {
                  _context7.next = 22;
                  break;
                }
                _context7.next = 21;
                return _energy_new.default.findEveryMonthByDeviceIds({
                  deviceIds: gridIds,
                  year: new Date().getFullYear()
                });
              case 21:
                result = _context7.sent;
              case 22:
                nyzData = result.data.reduce(function (pre, curr) {
                  pre.time.push(curr[timeMap[dateType]]);
                  pre.gridForward.push(curr.total_grid_forward_q);
                  pre.gridReverse.push(curr.total_grid_reverse_q);
                  return pre;
                }, {
                  time: [],
                  gridForward: [],
                  gridReverse: []
                });
                return _context7.abrupt("return", nyzData);
              case 26:
                _context7.prev = 26;
                _context7.t0 = _context7["catch"](0);
                console.error(_context7.t0);
              case 29:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, null, [[0, 26]]);
      }))();
    },
    getCarbonData: function getCarbonData(opt, opt2) {
      var _this9 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee8() {
        var opt1, filteredElectricity, totalEle, factorELE, carbon_electricity, carbon_oil, nyzSolar, totalSolar, caculatorCoefficient, treeFactor, totalSaving, totalSavingKg;
        return _regenerator.default.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
                return _this9.handleNyzConsumData(_this9.dateType);
              case 2:
                opt1 = _context8.sent;
                // 过滤 opt1.electricity 中的 null 值
                filteredElectricity = opt1.electricity.filter(function (value) {
                  return value !== null;
                });
                totalEle = [].concat((0, _toConsumableArray2.default)(opt.electricity), (0, _toConsumableArray2.default)(filteredElectricity)).reduce(function (pre, curr) {
                  return pre + parseFloat(curr);
                }, 0); // const totalEle =  [...opt.electricity, ...opt1.electricity].reduce((pre, curr) => {
                //     return pre + parseFloat(curr)
                // }, 0)
                factorELE = _this9.carbonFactor.factorELE;
                carbon_electricity = totalEle * factorELE;
                carbon_oil = 0;
                _this9.carbonEmission.electricity = carbon_electricity.toFixed(2);
                _this9.carbonEmission.electricityPercent = (carbon_electricity / (carbon_electricity + carbon_oil) * 100).toFixed(1);

                // let opt2 = await this.handleNyzSolarData(this.carbonDataType)
                nyzSolar = [];
                opt2.time.map(function (item, index) {
                  nyzSolar.push({
                    time: item,
                    solar: opt2.solar[index]
                  });
                });
                opt.time.map(function (item, index) {
                  var idx = nyzSolar.findIndex(function (e) {
                    return e.time == item;
                  });
                  if (idx > -1) {
                    opt.solar[index] = parseFloat((opt.solar[index] + nyzSolar[idx].solar).toFixed(2));
                  }
                });
                totalSolar = opt.solar.reduce(function (pre, curr) {
                  return pre + parseFloat(curr);
                }, 0); // 等效植树量相关系数
                caculatorCoefficient = 0.785; // 单棵树日吸收CO₂量=5
                treeFactor = 5;
                totalSaving = totalSolar * 400 / 1000; //节约标准煤量（kgce）=发电量（kWh）×标准煤折算系数（kgce/kWh）
                totalSavingKg = totalSolar * 400 / 1000000 * 1000;
                _this9.contribution.coalSaving = totalSavingKg.toFixed(2);
                //等效植树数（棵）= (日均发电量（kWh/天）× 排放因子（kg CO₂/kWh）× 1000)/ 单棵树日吸收CO₂量(g/天)
                _this9.contribution.plantingAmout = (totalSolar * caculatorCoefficient / treeFactor).toFixed(2);
              case 20:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8);
      }))();
    },
    // 获取系统低碳指标
    getCarbonIndexData: function getCarbonIndexData(optl) {
      var _this10 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee9() {
        var opt, opt1, opt2, nyzSolar, total_solar, filteredElectricity, total_electricity, dailyCharge, percent, finalPercent, cleanRate, radarData;
        return _regenerator.default.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.next = 2;
                return _this10.handleData(_this10.dateType);
              case 2:
                opt = _context9.sent;
                console.log(opt, optl, "111343434341111111111111111");
                _context9.next = 6;
                return _this10.handleNyzConsumData(_this10.dateType);
              case 6:
                opt1 = _context9.sent;
                _context9.next = 9;
                return _this10.handleNyzSolarData(_this10.dateType);
              case 9:
                opt2 = _context9.sent;
                nyzSolar = [];
                opt2.time.map(function (item, index) {
                  nyzSolar.push({
                    time: item,
                    solar: opt2.solar[index]
                  });
                });
                opt.time.map(function (item, index) {
                  var idx = nyzSolar.findIndex(function (e) {
                    return e.time == item;
                  });
                  if (idx > -1) {
                    opt.solar[index] = parseFloat((opt.solar[index] + nyzSolar[idx].solar).toFixed(2));
                  }
                });
                total_solar = opt.solar.reduce(function (pre, curr) {
                  return pre += parseFloat(curr);
                }, 0); // 过滤 opt1.electricity 中的 null 值
                filteredElectricity = opt1.electricity.filter(function (value) {
                  return value !== null;
                });
                total_electricity = [].concat((0, _toConsumableArray2.default)(opt.electricity), (0, _toConsumableArray2.default)(filteredElectricity)).reduce(function (pre, curr) {
                  return pre + parseFloat(curr);
                }, 0);
                dailyCharge = _this10.nyzStorageBatteryData.charge.int + parseFloat(_this10.nyzStorageBatteryData.charge.dec);
                console.log(dailyCharge, _this10.nyzStorageBatteryData.charge);
                percent = total_solar / (total_electricity + dailyCharge) * 100;
                console.log(dailyCharge, total_solar, total_electricity, _this10.nyzStorageBatteryData.charge);
                finalPercent = percent > 100 ? 100 : percent; // const percent = total_solar / total_electricity * 100
                _this10.dashboardChartOption = {
                  color: ["red", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
                  padding: [30, 30, 30, 30],
                  fontSize: 10,
                  dataLabel: false,
                  title: {
                    name: finalPercent.toFixed(2) + "%",
                    fontSize: 10,
                    color: "#2fc25b",
                    offsetY: 40
                  },
                  subtitle: {
                    name: "自给自足率",
                    fontSize: 10,
                    color: "#666666",
                    offsetY: 40
                  },
                  extra: {
                    gauge: {
                      type: "default",
                      width: 30,
                      labelColor: "#666666",
                      startAngle: 0.75,
                      endAngle: 0.25,
                      startNumber: 0,
                      endNumber: 100,
                      labelFormat: "",
                      splitLine: {
                        fixRadius: 0,
                        splitNumber: 10,
                        width: 30,
                        color: "#FFFFFF",
                        childNumber: 5,
                        childWidth: 12
                      },
                      pointer: {
                        width: 24,
                        color: "auto"
                      }
                    }
                  }
                };
                _this10.dashboardChartData = {
                  categories: [{
                    value: 0.15,
                    color: "#f2f047"
                  },
                  // 起始黄色
                  {
                    value: 0.30,
                    color: "#d8e043"
                  }, {
                    value: 0.45,
                    color: "#b3d13f"
                  }, {
                    value: 0.60,
                    color: "#7fc23a"
                  }, {
                    value: 1,
                    color: "#1ed94f"
                  }],
                  series: [{
                    name: '自给自足率',
                    data: finalPercent / 100
                  }]
                };
                cleanRate = (total_solar / total_electricity).toFixed(2); // this.radarChartData.radar[0].indicator[0].name = "清洁度\n" + cleanRate
                radarData = [cleanRate, 0.7, 0.75, 0.7, 0.8];
                _this10.radarChartData = {
                  categories: ['清洁度', '安全度', '可靠度', '智慧度', '高效度'],
                  series: [{
                    name: '',
                    data: radarData
                  }]
                };
              case 26:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9);
      }))();
    },
    handleData: function handleData(dateType) {
      var _this11 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee10() {
        var boxids, yearBoxids, date, timeMap, result, fullTimeRange, daysInMonth, fullData, opt;
        return _regenerator.default.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                boxids = _this11.currentSystem.boxidsbyDay;
                yearBoxids = _this11.currentSystem.boxidsbyYear;
                date = _this11.$moment().format('YYYY-MM-DD');
                timeMap = {
                  'date': 'hour',
                  'month': 'date',
                  'year': 'month'
                };
                result = null;
                if (!(dateType == 'date')) {
                  _context10.next = 11;
                  break;
                }
                _context10.next = 8;
                return _energy_new.default.findDayStatisticsDetailsByLevelIdsAndDay(boxids, date);
              case 8:
                result = _context10.sent;
                _context10.next = 21;
                break;
              case 11:
                if (!(dateType == 'month')) {
                  _context10.next = 17;
                  break;
                }
                _context10.next = 14;
                return _energy_new.default.findMonthStatisticsDetailsByLevelIdsAndMonth(boxids, date);
              case 14:
                result = _context10.sent;
                _context10.next = 21;
                break;
              case 17:
                if (!(dateType == 'year')) {
                  _context10.next = 21;
                  break;
                }
                _context10.next = 20;
                return _energy_new.default.findYearStatisticsDetailsByLevelIdsAndYear(yearBoxids, date);
              case 20:
                result = _context10.sent;
              case 21:
                fullTimeRange = [];
                if (dateType === 'date') {
                  fullTimeRange = Array.from({
                    length: 24
                  }, function (_, i) {
                    return i.toString();
                  });
                } else if (dateType === 'month') {
                  daysInMonth = _this11.$moment().daysInMonth();
                  fullTimeRange = Array.from({
                    length: daysInMonth
                  }, function (_, i) {
                    return (i + 1).toString();
                  });
                } else if (dateType === 'year') {
                  fullTimeRange = Array.from({
                    length: 12
                  }, function (_, i) {
                    return (i + 1).toString();
                  });
                }
                fullData = [];
                console.log(result, "99999999999999999999999999999999999999");
                fullTimeRange.map(function (item) {
                  if (!result.data.find(function (e) {
                    return e[timeMap[dateType]] == item;
                  })) {
                    fullData.push({
                      time: item,
                      electricity: 0,
                      solar: 0,
                      charge: 0,
                      discharge: 0,
                      grid: 0,
                      gridForward: 0,
                      gridReverse: 0,
                      water: 0
                    });
                  } else {
                    var curr = result.data.find(function (e) {
                      return e[timeMap[dateType]] == item;
                    });
                    fullData.push({
                      time: item,
                      electricity: curr.total_consume_electricity_q,
                      solar: curr.total_provide_q,
                      charge: curr.total_storage_forward_q,
                      discharge: curr.total_storage_reverse_q,
                      grid: parseFloat(curr.total_grid_forward_q) - parseFloat(curr.total_grid_reverse_q),
                      gridForward: curr.total_grid_forward_q,
                      gridReverse: curr.total_grid_reverse_q,
                      water: curr.total_consume_water_q
                    });
                  }
                });
                opt = fullData.reduce(function (pre, curr) {
                  pre.time.push(curr.time);
                  pre.electricity.push(curr.electricity);
                  pre.solar.push(curr.solar);
                  pre.charge.push(curr.charge);
                  pre.discharge.push(curr.discharge);
                  pre.grid.push(curr.grid);
                  pre.gridForward.push(curr.gridForward);
                  pre.gridReverse.push(curr.gridReverse);

                  // pre.electricity.push(curr.total_consume_electricity_q)
                  // pre.solar.push(curr.total_provide_q)
                  // pre.charge.push(curr.total_storage_forward_q)
                  // pre.discharge.push(curr.total_storage_reverse_q)
                  // pre.grid.push(parseFloat(curr.total_grid_forward_q) - parseFloat(curr.total_grid_reverse_q))
                  // pre.gridForward.push(curr.total_grid_forward_q)
                  // pre.gridReverse.push(curr.total_grid_reverse_q)
                  // pre.water.push(curr.total_consume_water_q)
                  return pre;
                }, {
                  time: [],
                  electricity: [],
                  solar: [],
                  charge: [],
                  discharge: [],
                  grid: [],
                  gridForward: [],
                  gridReverse: [],
                  water: []
                });
                console.log(opt, "opt");
                return _context10.abrupt("return", opt);
              case 29:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10);
      }))();
    },
    // 处理能源站数据
    handleNyzData: function handleNyzData(dateType) {
      var _this12 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee11() {
        var storageIdOne, storageIdTwo, storageIds, result, nyzData, timeMap;
        return _regenerator.default.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _context11.prev = 0;
                storageIdOne = _this12.ammeterList.find(function (item) {
                  return item.deviceName == '1#储能DC直流表';
                }).deviceId;
                storageIdTwo = _this12.ammeterList.find(function (item) {
                  return item.deviceName == '2#储能DC直流表';
                }).deviceId;
                storageIds = [storageIdOne, storageIdTwo];
                result = [];
                nyzData = [];
                timeMap = {
                  'date': 'hour',
                  'month': 'date',
                  'year': 'month'
                };
                if (!(dateType == 'date')) {
                  _context11.next = 13;
                  break;
                }
                _context11.next = 10;
                return _energy_new.default.findEveryHourByDeviceIds({
                  deviceIds: storageIds,
                  day: (0, _dateFormat.dateStandardFormat)(new Date())
                });
              case 10:
                result = _context11.sent;
                _context11.next = 23;
                break;
              case 13:
                if (!(dateType == 'month')) {
                  _context11.next = 19;
                  break;
                }
                _context11.next = 16;
                return _energy_new.default.findEveryDayByDeviceIds({
                  deviceIds: storageIds,
                  year: new Date().getFullYear(),
                  month: new Date().getMonth() + 1
                });
              case 16:
                result = _context11.sent;
                _context11.next = 23;
                break;
              case 19:
                if (!(dateType == 'year')) {
                  _context11.next = 23;
                  break;
                }
                _context11.next = 22;
                return _energy_new.default.findEveryMonthByDeviceIds({
                  deviceIds: storageIds,
                  year: new Date().getFullYear()
                });
              case 22:
                result = _context11.sent;
              case 23:
                nyzData = result.data.reduce(function (pre, curr) {
                  pre.time.push(curr[timeMap[dateType]]);
                  pre.charge.push(curr.total_storage_forward_q);
                  pre.discharge.push(curr.total_storage_reverse_q);
                  return pre;
                }, {
                  time: [],
                  charge: [],
                  discharge: []
                });
                return _context11.abrupt("return", nyzData);
              case 27:
                _context11.prev = 27;
                _context11.t0 = _context11["catch"](0);
                console.error(_context11.t0);
              case 30:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, null, [[0, 27]]);
      }))();
    },
    // 能源站光伏数据
    handleNyzSolarData: function handleNyzSolarData(dateType) {
      var _this13 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee12() {
        var solarIdOne, solarIdTwo, solarIds, result, nyzData, timeMap;
        return _regenerator.default.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                _context12.prev = 0;
                solarIdOne = _this13.ammeterList.find(function (item) {
                  return item.deviceName == '1#光伏DC直流表';
                }).deviceId;
                solarIdTwo = _this13.ammeterList.find(function (item) {
                  return item.deviceName == '2#光伏DC直流表';
                }).deviceId;
                solarIds = [solarIdOne, solarIdTwo];
                result = [];
                nyzData = [];
                timeMap = {
                  'date': 'hour',
                  'month': 'date',
                  'year': 'month'
                };
                if (!(dateType == 'date')) {
                  _context12.next = 13;
                  break;
                }
                _context12.next = 10;
                return _energy_new.default.findEveryHourByDeviceIds({
                  deviceIds: solarIds,
                  day: (0, _dateFormat.dateStandardFormat)(new Date())
                });
              case 10:
                result = _context12.sent;
                _context12.next = 23;
                break;
              case 13:
                if (!(dateType == 'month')) {
                  _context12.next = 19;
                  break;
                }
                _context12.next = 16;
                return _energy_new.default.findEveryDayByDeviceIds({
                  deviceIds: solarIds,
                  year: new Date().getFullYear(),
                  month: new Date().getMonth() + 1
                });
              case 16:
                result = _context12.sent;
                _context12.next = 23;
                break;
              case 19:
                if (!(dateType == 'year')) {
                  _context12.next = 23;
                  break;
                }
                _context12.next = 22;
                return _energy_new.default.findEveryMonthByDeviceIds({
                  deviceIds: solarIds,
                  year: new Date().getFullYear()
                });
              case 22:
                result = _context12.sent;
              case 23:
                nyzData = result.data.reduce(function (pre, curr) {
                  pre.time.push(curr[timeMap[dateType]]);
                  pre.solar.push(curr.total_provide_q);
                  return pre;
                }, {
                  time: [],
                  solar: []
                });
                return _context12.abrupt("return", nyzData);
              case 27:
                _context12.prev = 27;
                _context12.t0 = _context12["catch"](0);
                console.error(_context12.t0);
              case 30:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, null, [[0, 27]]);
      }))();
    },
    // 切换能源数据结构
    changeEnergyDataType: function changeEnergyDataType(dateType) {
      var _this14 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee13() {
        var opt, opt2;
        return _regenerator.default.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                _this14.dateType = dateType;
                // this.getEnergyData()
                // this.getCarbonData()
                // this.getCarbonIndexData()
                // let opt = await this.handleData(this.dateType)
                // this.getEnergyData(opt)
                // this.getCarbonData(opt)
                // this.getCarbonIndexData(opt)
                console.log(11111);
                _context13.next = 4;
                return _this14.getStorageBatteryData();
              case 4:
                _context13.next = 6;
                return _this14.handleData(_this14.dateType);
              case 6:
                opt = _context13.sent;
                _context13.next = 9;
                return _this14.handleNyzSolarData(_this14.dateType);
              case 9:
                opt2 = _context13.sent;
                _this14.getEnergyData(opt, opt2);
                _this14.getCarbonData(opt, opt2);
                _this14.getCarbonIndexData(opt);
              case 13:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13);
      }))();
    },
    // 查询碳排因子
    getCarbonFactor: function getCarbonFactor() {
      var _this15 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee14() {
        var carbonFactorData;
        return _regenerator.default.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                carbonFactorData = {
                  factorELE: 0.785
                };
                _this15.carbonFactor = carbonFactorData;
              case 2:
              case "end":
                return _context14.stop();
            }
          }
        }, _callee14);
      }))();
    },
    // 获取整数和小数部分
    getIntAndDec: function getIntAndDec(num) {
      var integerPart = Math.floor(num);
      var decimalPart = (num - integerPart).toFixed(2).replace(/^0/, '');
      return {
        int: integerPart,
        dec: decimalPart
      };
    },
    // 图表时间格式化
    xAxisFormat: function xAxisFormat(arr, dateType) {
      if (dateType == 'date') {
        return arr.map(function (item) {
          return item;
        });
      } else if (dateType == 'month') {
        return arr.map(function (item) {
          var date = new Date(item);
          return String(date.getDate()).padStart(2, '0'); // 保持两位数格式
        });
      } else if (dateType == 'year') {
        return arr.map(function (item) {
          return item;
        });
      }
      return arr;
    },
    refresh: function refresh() {
      console.log('Home组件刷新数据');
      // 这里实现具体的刷新逻辑，例如重新调用API获取数据
      this.getCarbonFactor();
      this.initPage();
    }
  },
  mounted: function mounted() {
    var _this16 = this;
    this.getCarbonFactor();
    this.dataInterval = setInterval(function () {
      _this16.initPage();
    }, 1000 * 60 * 10);
    this.initPage();
  },
  unmounted: function unmounted() {
    this.dataInterval && clearInterval(this.dataInterval);
  }
};
exports.default = _default;

/***/ }),

/***/ 948:
/*!*******************************************************************************************!*\
  !*** D:/ems/community/home.vue?vue&type=style&index=0&id=92203c5a&lang=scss&scoped=true& ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_home_vue_vue_type_style_index_0_id_92203c5a_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/mini-css-extract-plugin/dist/loader.js??ref--8-oneOf-1-0!../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/css-loader/dist/cjs.js??ref--8-oneOf-1-1!../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-2!../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/postcss-loader/src??ref--8-oneOf-1-3!../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/sass-loader/dist/cjs.js??ref--8-oneOf-1-4!../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-5!../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./home.vue?vue&type=style&index=0&id=92203c5a&lang=scss&scoped=true& */ 949);
/* harmony import */ var _HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_home_vue_vue_type_style_index_0_id_92203c5a_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_home_vue_vue_type_style_index_0_id_92203c5a_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_home_vue_vue_type_style_index_0_id_92203c5a_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_home_vue_vue_type_style_index_0_id_92203c5a_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_home_vue_vue_type_style_index_0_id_92203c5a_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 949:
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??ref--8-oneOf-1-0!./node_modules/css-loader/dist/cjs.js??ref--8-oneOf-1-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-2!./node_modules/postcss-loader/src??ref--8-oneOf-1-3!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/sass-loader/dist/cjs.js??ref--8-oneOf-1-4!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-5!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/ems/community/home.vue?vue&type=style&index=0&id=92203c5a&lang=scss&scoped=true& ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
    if(false) { var cssReload; }
  

/***/ })

},[[939,"common/runtime","common/vendor","community/common/vendor"]]]);
//# sourceMappingURL=../../.sourcemap/mp-weixin/community/home.js.map