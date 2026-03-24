require('../common/vendor.js');(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["community/components/architecture-diagram"],{

/***/ 1466:
/*!************************************************************!*\
  !*** D:/ems/community/components/architecture-diagram.vue ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _architecture_diagram_vue_vue_type_template_id_3121b1ee_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./architecture-diagram.vue?vue&type=template&id=3121b1ee&scoped=true& */ 1467);
/* harmony import */ var _architecture_diagram_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./architecture-diagram.vue?vue&type=script&lang=js& */ 1469);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _architecture_diagram_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _architecture_diagram_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _architecture_diagram_vue_vue_type_style_index_0_id_3121b1ee_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./architecture-diagram.vue?vue&type=style&index=0&id=3121b1ee&scoped=true&lang=css& */ 1474);
/* harmony import */ var _HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js */ 70);

var renderjs





/* normalize component */

var component = Object(_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _architecture_diagram_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _architecture_diagram_vue_vue_type_template_id_3121b1ee_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _architecture_diagram_vue_vue_type_template_id_3121b1ee_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "3121b1ee",
  null,
  false,
  _architecture_diagram_vue_vue_type_template_id_3121b1ee_scoped_true___WEBPACK_IMPORTED_MODULE_0__["components"],
  renderjs
)

component.options.__file = "community/components/architecture-diagram.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ 1467:
/*!*******************************************************************************************************!*\
  !*** D:/ems/community/components/architecture-diagram.vue?vue&type=template&id=3121b1ee&scoped=true& ***!
  \*******************************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_architecture_diagram_vue_vue_type_template_id_3121b1ee_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!../../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!../../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!../../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./architecture-diagram.vue?vue&type=template&id=3121b1ee&scoped=true& */ 1468);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_architecture_diagram_vue_vue_type_template_id_3121b1ee_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_architecture_diagram_vue_vue_type_template_id_3121b1ee_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return _HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_architecture_diagram_vue_vue_type_template_id_3121b1ee_scoped_true___WEBPACK_IMPORTED_MODULE_0__["recyclableRender"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "components", function() { return _HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_architecture_diagram_vue_vue_type_template_id_3121b1ee_scoped_true___WEBPACK_IMPORTED_MODULE_0__["components"]; });



/***/ }),

/***/ 1468:
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/ems/community/components/architecture-diagram.vue?vue&type=template&id=3121b1ee&scoped=true& ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
      return Promise.all(/*! import() | uni_modules/qiun-data-charts/components/qiun-data-charts/qiun-data-charts */[__webpack_require__.e("common/vendor"), __webpack_require__.e("uni_modules/qiun-data-charts/components/qiun-data-charts/qiun-data-charts")]).then(__webpack_require__.bind(null, /*! @/uni_modules/qiun-data-charts/components/qiun-data-charts/qiun-data-charts.vue */ 1321))
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
  var g0 = (
    (_vm.currentStatus["600a29b2cdf9e30600897f26"]
      ? _vm.currentStatus["600a29b2cdf9e30600897f26"].P
      : 0) / 1000
  ).toFixed(1)
  var g1 = (
    (_vm.currentStatus["616e66f584c6e1930fa05917"]
      ? _vm.currentStatus["616e66f584c6e1930fa05917"].P
      : 0) / 1000
  ).toFixed(1)
  var g2 = (
    (_vm.currentStatus["616e670d84c6e1930fa05919"]
      ? _vm.currentStatus["616e670d84c6e1930fa05919"].P
      : 0) / 1000
  ).toFixed(1)
  var g3 = (
    (_vm.currentStatus["616e671a84c6e1930fa0591b"]
      ? _vm.currentStatus["616e671a84c6e1930fa0591b"].P
      : 0) / 1000
  ).toFixed(1)
  var g4 = (
    (_vm.currentStatus["616e672b84c6e1930fa0591d"]
      ? _vm.currentStatus["616e672b84c6e1930fa0591d"].P
      : 0) / 1000
  ).toFixed(1)
  var g5 = (
    (_vm.currentStatus["637dcbf0d326f0333863b971"]
      ? _vm.currentStatus["637dcbf0d326f0333863b971"].P
      : 0) / 1000
  ).toFixed(1)
  var g6 =
    _vm.electricityData.categories && _vm.electricityData.categories.length > 0
  if (!_vm._isMounted) {
    _vm.e0 = function ($event, tab) {
      var _temp = arguments[arguments.length - 1].currentTarget.dataset,
        _temp2 = _temp.eventParams || _temp["event-params"],
        tab = _temp2.tab
      var _temp, _temp2
      return _vm.handleDateTypeChange(tab)
    }
  }
  _vm.$mp.data = Object.assign(
    {},
    {
      $root: {
        g0: g0,
        g1: g1,
        g2: g2,
        g3: g3,
        g4: g4,
        g5: g5,
        g6: g6,
      },
    }
  )
}
var recyclableRender = false
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ 1469:
/*!*************************************************************************************!*\
  !*** D:/ems/community/components/architecture-diagram.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_architecture_diagram_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/babel-loader/lib!../../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!../../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!../../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./architecture-diagram.vue?vue&type=script&lang=js& */ 1470);
/* harmony import */ var _HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_architecture_diagram_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_architecture_diagram_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_architecture_diagram_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_architecture_diagram_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_architecture_diagram_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 1470:
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/ems/community/components/architecture-diagram.vue?vue&type=script&lang=js& ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ 11));
var _devices = __webpack_require__(/*! @/service/config/devices */ 118);
var _vuex = __webpack_require__(/*! vuex */ 72);
var _upgrade = _interopRequireDefault(__webpack_require__(/*! @/api/upgrade */ 1472));
var _nyz = _interopRequireDefault(__webpack_require__(/*! @/api/nyz */ 1473));
var _nyz_new = _interopRequireDefault(__webpack_require__(/*! @/api/nyz_new */ 916));
var _dateFormat = __webpack_require__(/*! @/utils/date-format */ 135);
var _sapi = _interopRequireDefault(__webpack_require__(/*! @/store/sapi */ 74));
var _energy = _interopRequireDefault(__webpack_require__(/*! @/api/energy */ 964));
var _energy_new = _interopRequireDefault(__webpack_require__(/*! @/api/energy_new */ 917));
var _websocket = __webpack_require__(/*! @/service/websocket */ 1471);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var dyDate = function dyDate() {
  __webpack_require__.e(/*! require.ensure | components/dy-Date/dy-Date */ "components/dy-Date/dy-Date").then((function () {
    return resolve(__webpack_require__(/*! @/components/dy-Date/dy-Date.vue */ 1459));
  }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
};
// 导入realtimeDataProvider
var _default = {
  components: {
    dyDate: dyDate // 注册日期选择器组件
  },

  name: "ArchitectureDiagram",
  data: function data() {
    return (0, _defineProperty2.default)({
      activeChartTab: '日',
      canvas2d: this.$Config.ISCANVAS2D,
      timeOptions: [{
        label: '日',
        value: 'hour'
      }, {
        label: '月',
        value: 'day'
      }, {
        label: '年',
        value: 'month'
      }],
      // timeType: 'hour',
      selectedDate: new Date(),
      areaData: [],
      modal: false,
      areaName: "",
      storageStatus: "放电中",
      current: "system-architecture",
      storagePower: "--",
      currentStatus: {},
      gridStatus: "供电中",
      gridPower: "--",
      // generateData: 153,
      type: "hour",
      powerDate: new Date(),
      date: new Date(),
      month: new Date(),
      year: new Date(),
      incomeLoading: false,
      totalProvideQ: "--",
      totalStorageDisChargeQ: "--",
      totalStorageChargeQ: "--",
      dayEnergyData: {
        totalProvideQ: 0,
        totalStorageForwardQ: 0,
        totalStorageReverseQ: 0,
        totalGridForwardQ: 0,
        totalGridReverseQ: 0,
        totalConsumeElectricityQ: 0
      },
      nyzData: {
        storagePower1: 0,
        storagePower2: 0,
        SOC: "--",
        photovoltaicPower1: "--",
        photovoltaicPower2: "--",
        loadPower1: "--",
        loadPower2: "--"
      },
      selectedEnergyData: {
        // 被选中光伏的数据
        I: "--",
        U: "--",
        P: "--",
        Q: "--"
      },
      incomeDate: new Date(),
      showModal: false,
      electricityOpts: {
        color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
        padding: [15, 20, 0, 15],
        dataLabel: false,
        dataPointShape: false,
        enableScroll: false,
        legend: {},
        xAxis: {
          labelCount: 6,
          disableGrid: true
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
            type: "straight",
            width: 2,
            activeType: "hollow",
            linearType: "custom"
          }
        }
      },
      electricityData: {
        categories: [],
        series: [{
          data: [],
          name: '发电功率'
        }]
      },
      incomeData: {
        categories: [],
        series: [{
          data: [],
          name: '储能收益'
        }, {
          data: [],
          name: '光伏收益'
        }]
      },
      incomeOptions: {
        dataLabel: false,
        color: ["#C4F0F1", '#F3DCD5'],
        padding: [15, 18, 0, 15],
        enableScroll: false,
        legend: {},
        xAxis: {
          disableGrid: true,
          // itemCount: 12,
          labelCount: 10
        },
        yAxis: {
          gridType: "dash",
          dashLength: 2,
          showTitle: true,
          data: [{
            position: "left",
            title: "单位:元"
          }]
        },
        extra: {
          column: {
            type: "group",
            width: 30
          }
        }
      },
      dateTypeIndex: 0,
      // 当前日期类型索引 0:日 1:月 2:年
      timeTypeIndex: 0
    }, "selectedDate", new Date().toISOString().split('T')[0]);
  },
  filters: {
    format: function format(value) {
      var num = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;
      return value ? value.toFixed(num) : 0;
    }
  },
  watch: {
    chartDataProps: {
      handler: function handler(newVal) {
        if (this.$refs.charts) {
          this.$refs.charts.updateData(newVal); // 使用updateData而不是直接调用draw
        }
      },

      deep: true
    }
  },
  computed: _objectSpread(_objectSpread({}, (0, _vuex.mapGetters)(['currentSystem'])), {}, {
    nyzDeviceList: function nyzDeviceList() {
      return this.currentSystem ? this.currentSystem.ammeterList : [];
    },
    storageData: function storageData() {
      var power1 = parseFloat(this.nyzData.storagePower1 || 0);
      var power2 = parseFloat(this.nyzData.storagePower2 || 0);
      var power = isNaN(power1) ? 0 : power1 + (isNaN(power2) ? 0 : power2);
      var status = power == 0 ? "不充不放" : power > 0 ? "充电中" : "放电中";
      return {
        power: power.toFixed(2),
        status: status
      };
    },
    totalLoadData: function totalLoadData() {
      var power1 = this.nyzData.loadPower1 == '--' ? '--' : parseFloat(this.nyzData.loadPower1) || 0;
      var power2 = this.nyzData.loadPower2 == '--' ? '--' : parseFloat(this.nyzData.loadPower2) || 0;
      var power3 = this.gridPower == '--' ? '--' : parseFloat(this.gridPower) || 0;
      var power = this.getSum([power1, power2, power3]);
      return {
        power: power
      };
    },
    totalConsumptionQ: function totalConsumptionQ() {
      var provideQ = parseFloat(this.totalProvideQ || 0) || 0;
      var storageDisChargeQ = parseFloat(this.totalStorageDisChargeQ || 0) || 0;
      var gridForwardQ = parseFloat(this.dayEnergyData.totalGridForwardQ || 0) || 0;
      var gridReverseQ = parseFloat(this.dayEnergyData.totalGridReverseQ || 0) || 0;
      var storageChargeQ = parseFloat(this.totalStorageChargeQ || 0) || 0;
      var consumptionQData = provideQ + storageDisChargeQ + gridForwardQ - gridReverseQ - storageChargeQ;
      return {
        consumptionQData: consumptionQData.toFixed(2)
      };
    },
    totalSolarData: function totalSolarData() {
      var power1 = this.nyzData.photovoltaicPower1 == '--' ? '--' : Math.abs(parseFloat(this.nyzData.photovoltaicPower1) || 0);
      var power2 = this.nyzData.photovoltaicPower2 == '--' ? '--' : Math.abs(parseFloat(this.nyzData.photovoltaicPower2) || 0);
      var power3 = '--';
      if (this.selectedEnergyData.P !== '--' && !isNaN(this.selectedEnergyData.P)) {
        power3 = Math.abs(parseFloat(this.selectedEnergyData.P) / 1000).toFixed(2);
      }
      var power = this.getSum([power1, power2, power3]);
      return {
        power: power
      };
    }
  }),
  mounted: function mounted() {
    var _this = this;
    // 初始化realtimeDataProvider
    _websocket.realtimeDataProvider.createScoket(uni.getStorageSync('currentTemplate'), uni.getStorageSync('urlPrefix'));
    this.getSqRealTimeData();
    this.getNyzRealTimeData();
    this.initPage();
    this.dataInterval = setInterval(function () {
      _this.initPage();
    }, 1000 * 60 * 5);
  },
  unmounted: function unmounted() {
    this.dataInterval && clearInterval(this.dataInterval);
  },
  created: function created() {},
  beforeDestroy: function beforeDestroy() {
    // 使用realtimeDataProvider替代getSocketinstance
    _websocket.realtimeDataProvider.unregister();
  },
  methods: {
    handleDateTypeChange: function handleDateTypeChange(e) {
      this.activeChartTab = e;
      if (e === '日') {
        this.dateTypeIndex = 0;
        this.timeTypeIndex = 0;
      } else if (e === '月') {
        this.dateTypeIndex = 1;
        this.timeTypeIndex = 1;
      } else if (e === '年') {
        this.dateTypeIndex = 2;
        this.timeTypeIndex = 2;
      }
      var currentDate = new Date();
      var year = currentDate.getFullYear();
      var month = String(currentDate.getMonth() + 1).padStart(2, '0');

      // 动态更新默认日期
      this.selectedDate = {
        0: currentDate.toISOString().split('T')[0],
        1: "".concat(year, "-").concat(month),
        2: "".concat(year)
      }[this.timeTypeIndex];
      this.handleDatePicker(this.selectedDate);
    },
    handleDatePicker: function handleDatePicker(value) {
      // 统一处理日期格式
      var dateMap = {
        0: {
          // 日模式
          dateType: 'hour',
          dateValue: value
        },
        1: {
          // 月模式
          dateType: 'day',
          dateValue: value
        },
        2: {
          // 年模式
          dateType: 'month',
          dateValue: value
        }
      };
      this.type = dateMap[this.dateTypeIndex].dateType;
      if (this.type === "hour") {
        this.getPowerData2();
      } else if (this.type === "day") {
        this.findMonthEnergyAndIncome();
      } else if (this.type === "month") {
        this.findYearEnergyAndIncome();
      }
      this.getStorageIncome();
    },
    //初始化
    initPage: function initPage() {
      this.getAreaData();
      this.getStatisticData();
      this.getProvideCurve();
      this.findDayStorageQAndPower();
      this.getPowerData2();
      this.getStorageIncome();
    },
    // 获取层级数据
    getAreaData: function getAreaData() {
      this.areaData = this.$store.state.centerList.filter(function (item) {
        return item.level == 0 || item.level == 2;
      });
      this.areaData.sort(function (a, b) {
        if (a.level !== b.level) {
          return a.level - b.level;
        } else {
          return a.origin[0] - b.origin[0];
        }
      });
    },
    //获取能源站加社区箱子总发电数据
    getProvideCurve: function getProvideCurve() {
      var _this2 = this;
      _upgrade.default.findDayProvideQAndPower({
        day: (0, _dateFormat.dateStandardFormat)(new Date())
      }).then(function (result) {
        var totallyProvideQ = result.data.provideQMap.reduce(function (acc, cur) {
          return acc + cur.provideQ;
        }, 0);
        var solarIds = _this2.nyzDeviceList.filter(function (item) {
          return item.type == 2;
        }).map(function (item) {
          return item.deviceId;
        });
        _energy_new.default.findEveryHourByDeviceIds({
          deviceIds: solarIds,
          day: (0, _dateFormat.dateStandardFormat)(new Date())
        }).then(function (result) {
          var totallyProvideQ1 = result.data.reduce(function (acc, cur) {
            return acc + cur.total_provide_q;
          }, 0);
          _this2.totalProvideQ = parseFloat(totallyProvideQ + totallyProvideQ1).toFixed(2);
        });
      }).catch(function (err) {
        console.error(err);
      });
    },
    // 获取能源站充放电量数据
    findDayStorageQAndPower: function findDayStorageQAndPower() {
      var _this3 = this;
      var storageIds = [352, 354];
      _nyz.default.findEveryHourByDeviceIds({
        deviceIds: storageIds,
        day: (0, _dateFormat.dateStandardFormat)(this.date)
      }).then(function (result) {
        var storageQ = result.data.reduce(function (acc, item) {
          acc.charge += item.total_storage_forward_q;
          acc.discharge += item.total_storage_reverse_q;
          return acc;
        }, {
          charge: 0,
          discharge: 0
        });
        _this3.totalStorageChargeQ = storageQ.charge;
        _this3.totalStorageDisChargeQ = storageQ.discharge;
      });
    },
    // 社区实时数据
    getSqRealTimeData: function getSqRealTimeData() {
      var _this4 = this;
      this.selectedEnergyData = {
        I: "--",
        U: "--",
        P: "--",
        Q: "--"
      };
      _websocket.realtimeDataProvider.emit("register");
      _websocket.realtimeDataProvider.on("center", function (data) {
        _this4.currentStatus = data;
      });

      // 总表电网实时数据
      this.gridPower = "--";
      // 获取社区的电网数据
      _websocket.realtimeDataProvider.on("Grid", function (data) {
        if (data.data.B56) {
          _this4.gridPower = (data.data.B56 / 1000).toFixed(3);
        }
      });

      // 获取箱子全部据 和 社区的光伏、储能、用电数据
      _websocket.realtimeDataProvider.on("box", function (data) {
        // 拿光伏未来社区的 光伏 和 储能 的数据
        var community = {
          energy: {
            I: 0.0,
            U: 0.0,
            P: 0.0,
            Q: 0.0
          },
          storage: {
            I: 0.0,
            U: 0.0,
            chargeP: 0.0,
            dischargeP: 0.0,
            chargeQ: 0.0,
            dischargeQ: 0.0,
            soc: 0,
            surplus_storage: 0.0,
            rated_storage: 0.0,
            chargeI: 0.0,
            dischargeI: 0.0,
            chargeU: 0.0,
            dischargeU: 0.0
          }
        };
        // 累加每个箱子的数据
        for (var i in data) {
          if (i != 524) {
            if (JSON.stringify(data[i].energy) != "{}") {
              community.energy.I += data[i].energy.I;
              community.energy.P += data[i].energy.P;
              community.energy.Q += data[i].energy.Q;
            }
            if (JSON.stringify(data[i].storage) != "{}" && i != 399 && i != 400 && i != 372) {
              // community.storage.I += data[i].storage.I;
              if (data[i].storage.chargeP > data[i].storage.dischargeP) {
                // 计算全部箱子 充电时的I的和
                community.storage.chargeI += data[i].storage.I;
              } else if (data[i].storage.chargeP < data[i].storage.dischargeP) {
                // 计算全部箱子 放电时的I的和
                community.storage.dischargeI += data[i].storage.I;
              }
              community.storage.chargeP += data[i].storage.chargeP;
              community.storage.dischargeP += data[i].storage.dischargeP;
              community.storage.chargeQ += data[i].storage.chargeQ;
              community.storage.dischargeQ += data[i].storage.dischargeQ;
            }
          }
        }
        if (community.energy.P === 0) {
          // P为0,则表示待机, 那么I和U就不需要计算,直接为0
          community.energy.U = 0;
          community.energy.I = 0;
        } else {
          community.energy.U = community.energy.P / community.energy.I;
        }
        community.storage.soc = Math.round(community.storage.surplus_storage / community.storage.rated_storage);
        if (community.storage.chargeP > community.storage.dischargeP) {
          community.storage.chargeU = community.storage.chargeP / community.storage.chargeI;
          community.storage.I = community.storage.chargeI;
          // community.storage.I = community.storage.chargeI - community.storage.dischargeI
          community.storage.U = community.storage.chargeU;
          // community.storage.chargeP = community.storage.chargeP - community.storage.dischargeP
        } else if (community.storage.chargeP < community.storage.dischargeP) {
          community.storage.dischargeU = community.storage.dischargeP / community.storage.dischargeI;
          community.storage.I = community.storage.dischargeI;
          // community.storage.I = community.storage.dischargeI - community.storage.chargeI
          community.storage.U = community.storage.dischargeU;
          // community.storage.dischargeP = community.storage.dischargeP - community.storage.chargeP
        }

        if (community.storage.I == 0) {
          community.storage.U = 0;
        }
        _this4.selectedEnergyData = community.energy;
        _this4.selectedStorageData = community.storage;
      });
    },
    // 能源站实时数据
    getNyzRealTimeData: function getNyzRealTimeData() {
      var _this5 = this;
      _websocket.realtimeDataProvider.emit("register");
      _websocket.realtimeDataProvider.on("nyzData", function (jsonData) {
        var deviceType = jsonData.deviceType,
          address = jsonData.address,
          dataType = jsonData.dataType,
          data = jsonData.data;
        switch (deviceType) {
          case "1804_V2_2":
            if (address == "18" && dataType == "2") {
              _this5.nyzData.storagePower1 = parseFloat(data.B8).toFixed(2);
            } else if (address == "19" && dataType == "2") {
              _this5.nyzData.storagePower2 = parseFloat(data.B8).toFixed(2);
            } else if (address == "1A" && dataType == "2") {
              _this5.nyzData.photovoltaicPower1 = parseFloat(data.B8).toFixed(2);
            } else if (address == "1B" && dataType == "2") {
              _this5.nyzData.photovoltaicPower2 = parseFloat(data.B8).toFixed(2);
            } else if (address == "31" && dataType == "2") {
              _this5.nyzData.loadPower1 = parseFloat(data.B8).toFixed(2);
            } else if (address == "32" && dataType == "2") {
              _this5.nyzData.loadPower2 = parseFloat(data.B8).toFixed(2);
            }
            break;
          case "1704_V1_2":
            if (address == "02" && dataType == "2") {
              var socValue = parseFloat(data.B4);
              // 确保SOC在0-100%之间
              if (isNaN(socValue)) {
                _this5.nyzData.SOC = "--";
              } else {
                var clampedSoc = Math.max(0, Math.min(100, socValue));
                _this5.nyzData.SOC = clampedSoc.toFixed(2);
              }
            } else if (address == "02" && dataType == "3") {
              _this5.storageStatus = _this5.enumStorageStatus(data.B2);
            }
            break;
          default:
            break;
        }
      });
    },
    enumStorageStatus: function enumStorageStatus(status) {
      if (status == 0) return "初始化";else if (status == 1) return "充电";else if (status == 2) return "放电";else if (status == 3) return "静置";else return "--";
    },
    getStatisticData: function getStatisticData() {
      var _this6 = this;
      Promise.all([this.findHomeCommunityCapacitySumByLevelIds()
      // this.getCenterMonthEnergyData(),
      // this.getCenterTotalEnergyData(),
      ]).then(function (result) {
        if (result) {
          _this6.dayEnergyData = result[0].data;
          // this.monthEnergyData = result[1].data;
          // this.totalEnergyData = result[2].data;
        }
      });
    },
    findHomeCommunityCapacitySumByLevelIds: function findHomeCommunityCapacitySumByLevelIds() {
      var origin = this.$store.state.centerList.filter(function (item) {
        return item.level == 0;
      })[0].origin;
      // return this.$api.statistic.findHomeCommunityCapacitySumByLevelIds({}
      return _sapi.default.findHomeCommunityCapacitySumByLevelIds({
        areaLevelIds: origin,
        date: (0, _dateFormat.dateStandardFormat)(new Date())
      });
    },
    // 当某日的日期改变时
    datePickerChange: function datePickerChange() {
      // this.findDayEnergyAndIncome();
      this.getPowerData2();
    },
    // 当某月的日期改变时
    monthPickerChange: function monthPickerChange() {
      this.findMonthEnergyAndIncome();
    },
    // 当某年的日期改变时
    yearPickerChange: function yearPickerChange() {
      this.findYearEnergyAndIncome();
    },
    // 当日、月、年按钮其中之一被选择时
    select: function select(buttonType) {
      this.type = buttonType;
      if (this.type === "hour") {
        // this.findDayEnergyAndIncome();
        // this.getNyzSolarData();
        this.getPowerData2();
      } else if (this.type === "day") {
        this.findMonthEnergyAndIncome();
      } else if (this.type === "month") {
        this.findYearEnergyAndIncome();
      }
    },
    // 当日、月、年按钮其中之一被选择时
    selectIncome: function selectIncome(buttonType) {
      this.type = buttonType;
      this.getStorageIncome();
    },
    onIncomeDateChange: function onIncomeDateChange() {
      this.getStorageIncome();
    },
    //日发用电及收益数据
    findDayEnergyAndIncome: function findDayEnergyAndIncome() {
      var _this7 = this;
      this.dayGenerationData = [];
      this.dayLoadData = [];
      var xAxisData = [];
      _upgrade.default.findDayEnergyAndIncome({
        day: (0, _dateFormat.dateStandardFormat)(this.date)
      }).then(function (result) {
        if (result && result.data) {
          result.data.forEach(function (item) {
            _this7.dayGenerationData.push(item.provideQ);
            _this7.dayLoadData.push(item.consumptionQ);
            xAxisData.push(item.hour);
          });
          _this7.electricityData = {
            categories: xAxisData,
            series: [{
              data: _this7.dayGenerationData,
              name: '发电'
            }, {
              data: _this7.dayLoadData,
              name: '用电'
            }]
          };
        }
      });
    },
    //月发用电及收益数据
    findMonthEnergyAndIncome: function findMonthEnergyAndIncome() {
      var _this8 = this;
      this.monthGenerationData = [];
      this.monthLoadData = [];
      var xAxisData = [];
      // this.electricityOptions.setConsumeSeries()
      // this.electricityOptions = new chartOptions.electricityOptions()
      _upgrade.default.findMonthEnergyAndIncome({
        month: (new Date(this.month).getMonth() + 1).toString().padStart(2, '0'),
        year: new Date(this.month).getFullYear()
      }).then(function (result) {
        if (result && result.data) {
          result.data.forEach(function (item) {
            _this8.monthGenerationData.push(item.provideQ);
            _this8.monthLoadData.push(item.consumptionQ);
            xAxisData.push(item.day);
          });

          // 能源站发电量
          var solarIds = _this8.nyzDeviceList.filter(function (item) {
            return item.type == 2;
          }).map(function (item) {
            return item.deviceId;
          });
          _nyz.default.findEveryDayByDeviceIds({
            deviceIds: solarIds,
            year: new Date(_this8.month).getFullYear(),
            month: (new Date(_this8.month).getMonth() + 1).toString().padStart(2, '0')
          }).then(function (res) {
            xAxisData.map(function (item, index) {
              var nyzIdx = res.data.findIndex(function (e) {
                return e.date == item;
              });
              if (nyzIdx > -1) {
                _this8.monthGenerationData[index] = (_this8.monthGenerationData[index] + res.data[nyzIdx].total_provide_q).toFixed(2);
              }
            });
            // this.electricityOptions.xAxis[0].data = this.xAxisData;
            // this.electricityOptions.series[0].data = this.monthGenerationData;
            // this.electricityOptions.series[1].data = this.monthLoadData;
            _this8.electricityData = {
              categories: xAxisData,
              series: [{
                data: _this8.monthGenerationData,
                name: '发电'
              }, {
                data: _this8.monthLoadData,
                name: '用电'
              }]
            };
          }).finally(function () {});
        }
      });
    },
    //年发用电及收益数据
    findYearEnergyAndIncome: function findYearEnergyAndIncome() {
      var _this9 = this;
      this.yearGenerationData = [];
      this.yearLoadData = [];
      var xAxisData = [];
      _upgrade.default.findYearEnergyAndIncome({
        year: new Date(this.year).getFullYear()
      }).then(function (result) {
        if (result && result.data) {
          result.data.forEach(function (item) {
            _this9.yearGenerationData.push(item.provideQ);
            _this9.yearLoadData.push(item.consumptionQ);
            xAxisData.push(item.month);
          });

          // 能源站发电量
          var solarIds = _this9.nyzDeviceList.filter(function (item) {
            return item.type == 2;
          }).map(function (item) {
            return item.deviceId;
          });
          _nyz.default.findEveryMonthByDeviceIds({
            deviceIds: solarIds,
            year: new Date(_this9.incomeDate).getFullYear()
          }).then(function (res) {
            xAxisData.map(function (item, index) {
              var nyzIdx = res.data.findIndex(function (e) {
                return e.month == item;
              });
              if (nyzIdx > -1) {
                _this9.yearGenerationData[index] = parseFloat(_this9.yearGenerationData[index] + res.data[nyzIdx].total_provide_q).toFixed(2);
              }
            });
            _this9.electricityData = {
              categories: xAxisData,
              series: [{
                data: _this9.yearGenerationData,
                name: '发电'
              }, {
                data: _this9.monthLoadData,
                name: '用电'
              }]
            };
          }).finally(function () {});
        }
      });
    },
    // 获取能源站收益
    getStorageIncome: function getStorageIncome() {
      var _this10 = this;
      this.incomeLoading = true;
      // this.incomeOptions.setXAxisData(this.type, this.incomeDate)
      var xAxisData = this.setXAxisData(this.type, this.incomeDate);
      this.incomeData.categories = xAxisData;
      var solarIncome = [];
      if (this.type == 'hour') {
        _upgrade.default.findDayEnergyAndIncome({
          day: (0, _dateFormat.dateStandardFormat)(this.incomeDate)
        }).then(function (result) {
          var solarIds = _this10.nyzDeviceList.filter(function (item) {
            return item.type == 2;
          }).map(function (item) {
            return item.deviceId;
          });
          _energy_new.default.findEveryHourByDeviceIds({
            deviceIds: solarIds,
            day: (0, _dateFormat.dateStandardFormat)(_this10.incomeDate)
          }).then(function (res) {
            // let solarIncome = []
            xAxisData.map(function (item) {
              var sqIdx = result.data.findIndex(function (e) {
                return e.hour == item;
              });
              var nyzIdx = res.data.findIndex(function (e) {
                return e.hour == item;
              });
              if (sqIdx > -1 || nyzIdx > -1) {
                var sqVal = sqIdx > -1 ? result.data[sqIdx].provideQ * 0.85 : 0;
                var nyzVal = nyzIdx > -1 ? res.data[nyzIdx].total_provide_q * 0.85 : 0;
                solarIncome.push((sqVal + nyzVal).toFixed(2));
              } else {
                solarIncome.push(0);
              }
            });
            _this10.incomeData.series[1].data = solarIncome;
          }).finally(function () {
            _this10.incomeLoading = false;
          });
        });
      } else if (this.type == 'day') {
        _upgrade.default.findMonthEnergyAndIncome({
          month: (new Date(this.month).getMonth() + 1).toString().padStart(2, '0'),
          year: new Date(this.month).getFullYear()
        }).then(function (result) {
          var solarIds = _this10.nyzDeviceList.filter(function (item) {
            return item.type == 2;
          }).map(function (item) {
            return item.deviceId;
          });
          _nyz.default.findEveryDayByDeviceIds({
            deviceIds: solarIds,
            year: new Date(_this10.incomeDate).getFullYear(),
            month: (new Date(_this10.incomeDate).getMonth() + 1).toString().padStart(2, '0')
          }).then(function (res) {
            // let solarIncome = []
            xAxisData.map(function (item) {
              var sqIdx = result.data.findIndex(function (e) {
                return new Date(e.day).getDate() == item;
              });
              var nyzIdx = res.data.findIndex(function (e) {
                return Number(new Date(e.date).getDate()) == item;
              });
              if (sqIdx > -1 || nyzIdx > -1) {
                var sqVal = sqIdx > -1 ? result.data[sqIdx].provideQ * 0.85 : 0;
                var nyzVal = nyzIdx > -1 ? res.data[nyzIdx].total_provide_q * 0.85 : 0;
                solarIncome.push((sqVal + nyzVal).toFixed(2));
              } else {
                solarIncome.push(0);
              }
            });
            // this.incomeOptions.series[1].data = solarIncome
            _this10.incomeData.series[1].data = solarIncome;
          }).finally(function () {
            _this10.incomeLoading = false;
          });
        });
      } else if (this.type == 'month') {
        _upgrade.default.findYearEnergyAndIncome({
          year: new Date(this.year).getFullYear()
        }).then(function (result) {
          // this.incomeOptions.setSolarIncome(this.type, result.data)

          var solarIds = _this10.nyzDeviceList.filter(function (item) {
            return item.type == 2;
          }).map(function (item) {
            return item.deviceId;
          });
          _nyz.default.findEveryMonthByDeviceIds({
            deviceIds: solarIds,
            year: new Date(_this10.incomeDate).getFullYear()
          }).then(function (res) {
            // let solarIncome = []
            xAxisData.map(function (item) {
              var nyzIdx = res.data.findIndex(function (e) {
                return e.month == item;
              });
              if (nyzIdx > -1) {
                solarIncome.push((res.data[nyzIdx].total_provide_q * 0.85).toFixed(2));
              } else {
                solarIncome.push(0);
              }
            });
            // this.incomeOptions.series[1].data = solarIncome
            _this10.incomeData.series[1].data = solarIncome;
          }).finally(function () {
            _this10.incomeLoading = false;
          });
        });
      }
    },
    setXAxisData: function setXAxisData(type, date) {
      var xAxisData = [];
      if (type === 'hour') {
        for (var i = 0; i < 24; i++) {
          xAxisData.push(i + ':00');
        }
      } else if (type === 'day') {
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var daysInMonth = new Date(year, month, 0).getDate();
        for (var _i = 1; _i <= daysInMonth; _i++) {
          xAxisData.push(_i);
        }
      } else if (type === 'month') {
        for (var _i2 = 1; _i2 <= 12; _i2++) {
          xAxisData.push(_i2);
        }
      }
      return xAxisData;
    },
    getSum: function getSum(arr) {
      if (arr.includes('--')) {
        return '--';
      }
      return arr.reduce(function (acc, val) {
        return acc + val;
      }, 0);
    },
    getPowerData2: function getPowerData2() {
      var _this11 = this;
      _upgrade.default.findDayEnergyAndIncome({
        day: (0, _dateFormat.dateStandardFormat)(this.powerDate)
      }).then(function (result) {
        if (result && result.data) {
          var generationData = [];
          var loadData = [];
          var xAxisData = [];
          result.data.forEach(function (item) {
            generationData.push(item.provideQ);
            loadData.push(item.consumptionQ);
            xAxisData.push(item.hour);
          });
          _this11.electricityData = {
            categories: xAxisData,
            series: [{
              data: generationData,
              name: '发电'
            }, {
              data: loadData,
              name: '用电'
            }]
          };
        }
      });
    },
    // 显示启动弹窗
    showStartModal: function showStartModal() {
      this.showModal = true;
    },
    // 关闭弹窗
    closeModal: function closeModal() {
      this.showModal = false;
    },
    // 确认启动
    confirmStart: function confirmStart() {
      this.showModal = false;
      uni.showToast({
        title: '系统已启动',
        icon: 'success'
      });
    }
  }
};
exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["default"]))

/***/ }),

/***/ 1474:
/*!*********************************************************************************************************************!*\
  !*** D:/ems/community/components/architecture-diagram.vue?vue&type=style&index=0&id=3121b1ee&scoped=true&lang=css& ***!
  \*********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_architecture_diagram_vue_vue_type_style_index_0_id_3121b1ee_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-oneOf-1-0!../../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/css-loader/dist/cjs.js??ref--6-oneOf-1-1!../../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!../../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--6-oneOf-1-2!../../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/postcss-loader/src??ref--6-oneOf-1-3!../../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./architecture-diagram.vue?vue&type=style&index=0&id=3121b1ee&scoped=true&lang=css& */ 1475);
/* harmony import */ var _HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_architecture_diagram_vue_vue_type_style_index_0_id_3121b1ee_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_architecture_diagram_vue_vue_type_style_index_0_id_3121b1ee_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_architecture_diagram_vue_vue_type_style_index_0_id_3121b1ee_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_architecture_diagram_vue_vue_type_style_index_0_id_3121b1ee_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_architecture_diagram_vue_vue_type_style_index_0_id_3121b1ee_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 1475:
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-oneOf-1-0!./node_modules/css-loader/dist/cjs.js??ref--6-oneOf-1-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--6-oneOf-1-2!./node_modules/postcss-loader/src??ref--6-oneOf-1-3!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/ems/community/components/architecture-diagram.vue?vue&type=style&index=0&id=3121b1ee&scoped=true&lang=css& ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
    if(false) { var cssReload; }
  

/***/ })

}]);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/community/components/architecture-diagram.js.map
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'community/components/architecture-diagram-create-component',
    {
        'community/components/architecture-diagram-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('2')['createComponent'](__webpack_require__(1466))
        })
    },
    [['community/components/architecture-diagram-create-component']]
]);
