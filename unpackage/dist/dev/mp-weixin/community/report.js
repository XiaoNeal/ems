require('./common/vendor.js');(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["community/report"],{

/***/ 956:
/*!****************************************************!*\
  !*** D:/ems/main.js?{"page":"community%2Freport"} ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(wx, createPage) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
__webpack_require__(/*! uni-pages */ 26);
var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 25));
var _report = _interopRequireDefault(__webpack_require__(/*! ./community/report.vue */ 957));
// @ts-ignore
wx.__webpack_require_UNI_MP_PLUGIN__ = __webpack_require__;
createPage(_report.default);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/wx.js */ 1)["default"], __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["createPage"]))

/***/ }),

/***/ 957:
/*!***********************************!*\
  !*** D:/ems/community/report.vue ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _report_vue_vue_type_template_id_372008a8_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./report.vue?vue&type=template&id=372008a8&scoped=true& */ 958);
/* harmony import */ var _report_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./report.vue?vue&type=script&lang=js& */ 960);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _report_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _report_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _report_vue_vue_type_style_index_0_id_372008a8_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./report.vue?vue&type=style&index=0&id=372008a8&lang=scss&scoped=true& */ 964);
/* harmony import */ var _HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js */ 70);

var renderjs





/* normalize component */

var component = Object(_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _report_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _report_vue_vue_type_template_id_372008a8_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _report_vue_vue_type_template_id_372008a8_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "372008a8",
  null,
  false,
  _report_vue_vue_type_template_id_372008a8_scoped_true___WEBPACK_IMPORTED_MODULE_0__["components"],
  renderjs
)

component.options.__file = "community/report.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ 958:
/*!******************************************************************************!*\
  !*** D:/ems/community/report.vue?vue&type=template&id=372008a8&scoped=true& ***!
  \******************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_report_vue_vue_type_template_id_372008a8_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./report.vue?vue&type=template&id=372008a8&scoped=true& */ 959);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_report_vue_vue_type_template_id_372008a8_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_report_vue_vue_type_template_id_372008a8_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return _HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_report_vue_vue_type_template_id_372008a8_scoped_true___WEBPACK_IMPORTED_MODULE_0__["recyclableRender"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "components", function() { return _HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_report_vue_vue_type_template_id_372008a8_scoped_true___WEBPACK_IMPORTED_MODULE_0__["components"]; });



/***/ }),

/***/ 959:
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/ems/community/report.vue?vue&type=template&id=372008a8&scoped=true& ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return recyclableRender; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "components", function() { return components; });
var components
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
}
var recyclableRender = false
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ 960:
/*!************************************************************!*\
  !*** D:/ems/community/report.vue?vue&type=script&lang=js& ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_report_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/babel-loader/lib!../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./report.vue?vue&type=script&lang=js& */ 961);
/* harmony import */ var _HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_report_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_report_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_report_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_report_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_report_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 961:
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/ems/community/report.vue?vue&type=script&lang=js& ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _regenerator = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/regenerator */ 123));
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ 5));
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ 125));
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ 11));
var _center = _interopRequireDefault(__webpack_require__(/*! @/api/center */ 962));
var _statistic = _interopRequireDefault(__webpack_require__(/*! @/api/statistic */ 963));
var _vuex = __webpack_require__(/*! vuex */ 72);
var _nyz_new = _interopRequireDefault(__webpack_require__(/*! @/api/nyz_new */ 942));
var _energy_new = _interopRequireDefault(__webpack_require__(/*! @/api/energy_new */ 944));
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var DateReport = function DateReport() {
  __webpack_require__.e(/*! require.ensure | community/components/dateReport */ "community/components/dateReport").then((function () {
    return resolve(__webpack_require__(/*! ./components/dateReport */ 1516));
  }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
};
var WeekReport = function WeekReport() {
  __webpack_require__.e(/*! require.ensure | community/components/weekReport */ "community/components/weekReport").then((function () {
    return resolve(__webpack_require__(/*! ./components/weekReport */ 1521));
  }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
};
var MonthReport = function MonthReport() {
  __webpack_require__.e(/*! require.ensure | community/components/monthReport */ "community/components/monthReport").then((function () {
    return resolve(__webpack_require__(/*! ./components/monthReport */ 1526));
  }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
};
var YearReport = function YearReport() {
  __webpack_require__.e(/*! require.ensure | community/components/yearReport */ "community/components/yearReport").then((function () {
    return resolve(__webpack_require__(/*! ./components/yearReport */ 1531));
  }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
};
var dyDate = function dyDate() {
  __webpack_require__.e(/*! require.ensure | components/dy-Date/dy-Date */ "components/dy-Date/dy-Date").then((function () {
    return resolve(__webpack_require__(/*! @/components/dy-Date/dy-Date.vue */ 1536));
  }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
};
var _default = {
  name: "report",
  components: {
    DateReport: DateReport,
    WeekReport: WeekReport,
    MonthReport: MonthReport,
    YearReport: YearReport,
    dyDate: dyDate
  },
  data: function data() {
    return {
      current: "areaReport",
      // userInfo: JSON.parse(localStorage.getItem("userInfo")),
      loading: true,
      selectedReportType: "date",
      selectedAreaId: "",
      // 被选择区域的唯一标识id(mongo中区别任一对象的id)
      areaLevelId: [],
      selectedLevel: 0,
      selectedName: "",
      datePicker: new Date().toISOString().split('T')[0],
      monthPicker: this.$moment().format('YYYY-MM'),
      yearPicker: this.$moment().format('YYYY'),
      areaData: [],
      // 选择区域的数据

      reportTypeData: [{
        id: "001",
        value: "date",
        name: "日报表"
      }, {
        id: "002",
        value: "week",
        name: "周报表"
      }, {
        id: "003",
        value: "month",
        name: "月报表"
      }, {
        id: "004",
        value: "year",
        name: "年报表"
      }],
      dateReportData: [],
      // 日报表数据
      weekReportData: [],
      // 周报表数据
      monthReportData: [],
      // 月报表数据
      yearReportData: [],
      // 年报表数据
      ExportFlag: 0,
      // 是否导出: 只要该值发生改变,就进行导出操作
      // 每个箱子的Id => name
      boxIdName: {
        381: "1号箱",
        382: "2号箱",
        383: "3号箱",
        384: "4号箱",
        385: "5号箱",
        386: "6号箱",
        387: "7号箱",
        388: "8号箱",
        389: "9号箱",
        401: "10/11号箱",
        402: "12号箱",
        403: "13号箱",
        502: "14号箱",
        503: "15号箱",
        504: "16号箱",
        505: "17号箱",
        506: "18号箱",
        399: "光伏墙",
        400: "车库",
        545: "数据中心",
        566: "19号箱",
        567: "20号箱",
        568: "21号箱",
        569: "22号箱"
      },
      areaOptions: [],
      selectedIndex: 0,
      reportTypeIndex: 0,
      reportTypeOptions: []
    };
  },
  computed: _objectSpread(_objectSpread({
    userInfo: function userInfo() {
      return {
        _id: "60054086019dcc42e41c91f7",
        username: "homeAdmin",
        name: "NEIIC 国创联能",
        __v: 0,
        role: {
          _id: "60068a98fa3cf1513b206a74",
          name: "admin",
          description: "管理员"
        },
        level: "admin"
      };
    }
  }, (0, _vuex.mapGetters)(['currentSystem'])), {}, {
    nyzDeviceList: function nyzDeviceList() {
      return this.currentSystem ? this.currentSystem.ammeterList : [];
    }
  }),
  methods: {
    // 从后台koa获取下拉框的数据
    getAreaData: function getAreaData() {
      var _this = this;
      // 获取社区、分中心、全部箱子
      _center.default.getCenterList({
        roleId: this.userInfo.role._id
      }).then(function (result) {
        if (result && result.data) {
          _this.areaData = result.data;
          _this.areaData.sort(function (a, b) {
            if (a.level !== b.level) {
              return a.level - b.level;
            } else {
              return a.origin[0] - b.origin[0];
            }
          });
          _this.areaData.push({
            origin: [545],
            name: "数据中心",
            level: 2,
            _id: 0,
            role: "60068a98fa3cf1513b206a74"
          });
          // console.log(this.areaData);
          _this.selectedAreaId = _this.areaData[0]._id;
          _this.areaLevelId = _this.areaData[0].origin;
          _this.selectedLevel = _this.areaData[0].level;
          _this.selectedName = _this.areaData[0].name;
          _this.areaOptions = _this.areaData.map(function (item) {
            return item.name;
          });
        }
      });
    },
    // 获取能源站光伏储能数据
    getNyzData: function getNyzData() {
      var _this2 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
        var solarIds, storageIds, consumIds, gridIds, pMap, fieldMap, _yield$Promise$all, _yield$Promise$all2, solarResult, storageResult, consumResult, gridResult, data;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                // let solarIds = deviceConfig.nyzDeviceList.filter(item => item.type == 2).map(item => item.deviceId)
                // let storageIds = deviceConfig.nyzDeviceList.filter(item => item.type == 1).map(item => item.deviceId)
                // let consumIds = deviceConfig.nyzDeviceList.filter(item => item.type == 3).map(item => item.deviceId)
                // let gridIds = deviceConfig.nyzDeviceList.filter(item => item.type == 4).map(item => item.deviceId)
                solarIds = _this2.nyzDeviceList.filter(function (item) {
                  return item.type == 2;
                }).map(function (item) {
                  return item.deviceId;
                });
                storageIds = _this2.nyzDeviceList.filter(function (item) {
                  return item.type == 1;
                }).map(function (item) {
                  return item.deviceId;
                });
                consumIds = _this2.nyzDeviceList.filter(function (item) {
                  return item.type == 3;
                }).map(function (item) {
                  return item.deviceId;
                });
                gridIds = _this2.nyzDeviceList.filter(function (item) {
                  return item.type == 4;
                }).map(function (item) {
                  return item.deviceId;
                });
                pMap = {
                  'date': [_energy_new.default.findEveryHourByDeviceIds({
                    deviceIds: solarIds,
                    day: _this2.$moment(_this2.datePicker).format("YYYY-MM-DD")
                  }), _nyz_new.default.findEveryHourByDeviceIds({
                    deviceIds: storageIds,
                    day: _this2.$moment(_this2.datePicker).format("YYYY-MM-DD")
                  }), _energy_new.default.findEveryHourByDeviceIds({
                    deviceIds: consumIds,
                    day: _this2.$moment(_this2.datePicker).format("YYYY-MM-DD")
                  }), _energy_new.default.findEveryHourByDeviceIds({
                    deviceIds: gridIds,
                    day: _this2.$moment(_this2.datePicker).format("YYYY-MM-DD")
                  })],
                  'month': [_energy_new.default.findEveryDayByDeviceIds({
                    deviceIds: solarIds,
                    year: _this2.$moment(_this2.monthPicker).format("YYYY"),
                    month: _this2.$moment(_this2.monthPicker).format("MM")
                  }), _nyz_new.default.findEveryDayByDeviceIds({
                    deviceIds: storageIds,
                    year: _this2.$moment(_this2.monthPicker).format("YYYY"),
                    month: _this2.$moment(_this2.monthPicker).format("MM")
                  }), _energy_new.default.findEveryDayByDeviceIds({
                    deviceIds: consumIds,
                    year: _this2.$moment(_this2.monthPicker).format("YYYY"),
                    month: _this2.$moment(_this2.monthPicker).format("MM")
                  }), _energy_new.default.findEveryDayByDeviceIds({
                    deviceIds: gridIds,
                    year: _this2.$moment(_this2.monthPicker).format("YYYY"),
                    month: _this2.$moment(_this2.monthPicker).format("MM")
                  })],
                  'year': [_energy_new.default.findEveryMonthByDeviceIds({
                    deviceIds: solarIds,
                    year: _this2.$moment(_this2.yearPicker).format("YYYY")
                  }), _nyz_new.default.findEveryMonthByDeviceIds({
                    deviceIds: storageIds,
                    year: _this2.$moment(_this2.yearPicker).format("YYYY")
                  }), _energy_new.default.findEveryMonthByDeviceIds({
                    deviceIds: consumIds,
                    year: _this2.$moment(_this2.yearPicker).format("YYYY")
                  }), _energy_new.default.findEveryMonthByDeviceIds({
                    deviceIds: gridIds,
                    year: _this2.$moment(_this2.yearPicker).format("YYYY")
                  })]
                };
                fieldMap = {
                  'date': 'hour',
                  'month': 'date',
                  'year': 'month'
                };
                _context.next = 8;
                return Promise.all(pMap[_this2.selectedReportType]);
              case 8:
                _yield$Promise$all = _context.sent;
                _yield$Promise$all2 = (0, _slicedToArray2.default)(_yield$Promise$all, 4);
                solarResult = _yield$Promise$all2[0];
                storageResult = _yield$Promise$all2[1];
                consumResult = _yield$Promise$all2[2];
                gridResult = _yield$Promise$all2[3];
                data = solarResult.data.reduce(function (pre, curr) {
                  var time = curr[fieldMap[_this2.selectedReportType]];
                  // pre.time.push(time)
                  // pre.solar.push(curr.total_provide_q)
                  var idx = storageResult.data.findIndex(function (item) {
                    return item[fieldMap[_this2.selectedReportType]] == time;
                  });
                  var consumIdx = consumResult.data.findIndex(function (item) {
                    return item[fieldMap[_this2.selectedReportType]] == time;
                  });
                  var gridIndex = gridResult.data.findIndex(function (item) {
                    return item[fieldMap[_this2.selectedReportType]] == time;
                  });
                  if (idx > -1) {
                    pre.push({
                      time: time,
                      solar: curr.total_provide_q,
                      storageCharge: storageResult.data[idx].total_storage_forward_q,
                      storageDischarge: storageResult.data[idx].total_storage_reverse_q,
                      consum: consumResult.data[consumIdx].total_consume_electricity_q,
                      gridForwardQ: gridResult.data[gridIndex].total_grid_forward_q,
                      gridReverseQ: gridResult.data[gridIndex].total_grid_reverse_q
                    });
                    // pre.storageCharge.push(storageResult.data[idx].total_storage_forward_q)
                    // pre.storageDischarge.push(storageResult.data[idx].total_storage_reverse_q)
                  } else {
                    pre.push({
                      time: time,
                      solar: curr.total_provide_q,
                      storageCharge: null,
                      storageDischarge: null,
                      consum: null,
                      gridForwardQ: null,
                      gridReverseQ: null
                    });
                  }
                  return pre;
                }, []);
                return _context.abrupt("return", data);
              case 16:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }))();
    },
    // 从后台koa获取日报表数据
    getDateReportData: function getDateReportData() {
      var _this3 = this;
      this.loading = true;
      // 获取每个箱子的日报表数据
      if (this.selectedLevel === 2) {
        _statistic.default.findDayStatisticsDetailsByLevelIdAndDay({
          id: this.selectedAreaId,
          day: this.$moment(this.datePicker).format("YYYY-MM-DD")
        }).then(function (result) {
          if (result && result.data && result.data.dayStatisticsData) {
            result.data.dayStatisticsData.forEach(function (item) {
              var dailyData = {};
              dailyData.dailyAreaName = _this3.selectedName;
              dailyData.dailydate = item.date;
              dailyData.dailyHour = item.hour;
              dailyData.dailyGeneratingElectrical = item.total_provide_q;
              dailyData.dailyStorageDischarging = item.total_storage_forward_q;
              dailyData.dailyStorageCharging = item.total_storage_reverse_q;
              dailyData.dailyElectricityConsumption = item.total_consume_electricity_q !== undefined && item.total_consume_electricity_q !== null ? Math.max(item.total_consume_electricity_q, 0) : '--';
              dailyData.dailyPowerGridPowerSupply = item.total_grid_forward_q;
              dailyData.dailyPowerGridPowerFeed = item.total_grid_reverse_q;
              dailyData.dailyAirConditioner = "--";
              dailyData.dailyIllumination = "--";
              dailyData.dailyComputer = "--";
              dailyData.dailyOthers = "--";
              //车库目前仅安装了发电侧计量模块，储能及电网侧无计量，且车库无用电，发电=馈电，后续安装储能及电网侧计量后，相关代码需删除。
              if (item.areaLevelId == 400 || item.areaLevelId == 399) {
                dailyData.dailyElectricityConsumption = 0;
                dailyData.dailyPowerGridPowerFeed = item.total_consume_electricity_q;
              }
              _this3.dateReportData.push(dailyData);
            });
          } else {
            _this3.dateReportData = [];
          }
          _this3.loading = false;
        });
      } else {
        // 获取光伏未来社区、分中心的日报表数据
        _statistic.default.findDayStatisticsDetailsByLevelIdsAndDay({
          roleId: this.userInfo.role._id,
          id: this.selectedAreaId,
          date: this.$moment(this.datePicker).format("YYYY-MM-DD")
        }).then( /*#__PURE__*/function () {
          var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(result) {
            var _this3$areaData$, isDefaultArea, nyzData, createDailyData;
            return _regenerator.default.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    if (!(result !== null && result !== void 0 && result.data)) {
                      _context2.next = 14;
                      break;
                    }
                    isDefaultArea = _this3.selectedAreaId === ((_this3$areaData$ = _this3.areaData[0]) === null || _this3$areaData$ === void 0 ? void 0 : _this3$areaData$._id);
                    if (!isDefaultArea) {
                      _context2.next = 8;
                      break;
                    }
                    _context2.next = 5;
                    return _this3.getNyzData();
                  case 5:
                    _context2.t0 = _context2.sent;
                    _context2.next = 9;
                    break;
                  case 8:
                    _context2.t0 = null;
                  case 9:
                    nyzData = _context2.t0;
                    createDailyData = function createDailyData(item, nyzItem) {
                      var total_provide_q = item.total_provide_q,
                        total_storage_forward_q = item.total_storage_forward_q,
                        total_storage_reverse_q = item.total_storage_reverse_q,
                        total_consume_electricity_q = item.total_consume_electricity_q,
                        total_grid_forward_q = item.total_grid_forward_q,
                        total_grid_reverse_q = item.total_grid_reverse_q,
                        date = item.date,
                        hour = item.hour;
                      return {
                        dailyAreaName: _this3.selectedName,
                        dailydate: date,
                        dailyHour: hour,
                        dailyGeneratingElectrical: nyzItem ? Number((total_provide_q + nyzItem.solar).toFixed(2)) : total_provide_q,
                        dailyStorageDischarging: nyzItem ? Number((total_storage_forward_q + nyzItem.storageDischarge).toFixed(2)) : total_storage_forward_q,
                        dailyStorageCharging: nyzItem ? Number((total_storage_reverse_q + nyzItem.storageCharge).toFixed(2)) : total_storage_reverse_q,
                        dailyElectricityConsumption: nyzItem ? Number((total_consume_electricity_q + nyzItem.consum).toFixed(2)) : total_consume_electricity_q,
                        dailyPowerGridPowerSupply: nyzItem ? Number((total_grid_forward_q + nyzItem.gridForwardQ).toFixed(2)) : total_grid_forward_q,
                        dailyPowerGridPowerFeed: nyzItem ? Number((total_grid_reverse_q + nyzItem.gridReverseQ).toFixed(2)) : total_grid_reverse_q,
                        dailyAirConditioner: "--",
                        dailyIllumination: "--",
                        dailyComputer: "--",
                        dailyOthers: "--"
                      };
                    };
                    _this3.dateReportData = result.data.map(function (item) {
                      if (!isDefaultArea) return createDailyData(item);
                      var nyzIndex = nyzData.findIndex(function (e) {
                        return e.time === item.hour;
                      });
                      return createDailyData(item, nyzIndex > -1 ? nyzData[nyzIndex] : null);
                    });
                    _context2.next = 15;
                    break;
                  case 14:
                    _this3.dateReportData = [];
                  case 15:
                    _this3.loading = false;
                  case 16:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee2);
          }));
          return function (_x) {
            return _ref.apply(this, arguments);
          };
        }()).catch(function (err) {
          console.error(err);
        });
      }
    },
    // 从后台koa获取周报表数据
    // ... 已有代码 ...
    getWeekReportData: function getWeekReportData() {
      var _this4 = this;
      this.loading = true;
      this.width = "auto";
      var areaLevelIds = this.areaLevelId.sort();
      areaLevelIds.includes(545) || areaLevelIds.push(545);

      // 设置一周的起始日为周一
      this.$moment.locale('zh-cn', {
        week: {
          dow: 1 // 周一为一周的第一天
        }
      });

      // 获取当前周的周一和周日日期
      var currentDate = this.$moment(this.currentDate);
      var startOfWeek = currentDate.clone().startOf('week');
      var endOfWeek = currentDate.clone().endOf('week');
      var weekDates = [];
      for (var i = 0; i < 7; i++) {
        weekDates.push(startOfWeek.clone().add(i, 'days').format('YYYY-MM-DD'));
      }
      _energy_new.default.findStatisticsDayByLevelIdsAndDays({
        // roleId: this.userInfo.role._id,
        areaLevelIds: areaLevelIds,
        date: this.$moment(this.currentDate).format("YYYY-MM-DD")
      }).then(function (result) {
        // console.log(result);
        if (result && result.data) {
          // 过滤掉 areaLevelId 值为 372 的数据
          var filteredData = result.data.filter(function (element) {
            return element.length > 0 && element[0].areaLevelId !== 372;
          });
          _this4.weekReportData = [];
          filteredData.forEach(function (element) {
            var weekData = {};
            var areaLevelId = element[0].areaLevelId;
            weekData.weekAreaName = _this4.boxIdName[areaLevelId];

            // 初始化一周的数据为默认值
            weekDates.forEach(function (date, index) {
              var indexWeek = index + 1;
              weekData["GeneratingElectrical".concat(indexWeek)] = '--';
              weekData["StorageCharging".concat(indexWeek)] = '--';
              weekData["StorageDischarging".concat(indexWeek)] = '--';
              weekData["ElectricityConsumption".concat(indexWeek)] = '--';
              weekData["PowerGridPowerSupply".concat(indexWeek)] = '--';
              weekData["PowerGridPowerFeed".concat(indexWeek)] = '--';
            });

            // 用实际数据覆盖默认值
            element.forEach(function (item) {
              var dateIndex = weekDates.indexOf(item.date);
              if (dateIndex > -1) {
                var indexWeek = dateIndex + 1;
                // 判断数据是否为 0 或无数据
                weekData["GeneratingElectrical".concat(indexWeek)] = item.total_provide_q !== undefined && item.total_provide_q !== null ? item.total_provide_q : '--';
                weekData["StorageCharging".concat(indexWeek)] = item.total_storage_reverse_q !== undefined && item.total_storage_reverse_q !== null ? item.total_storage_reverse_q : '--';
                weekData["StorageDischarging".concat(indexWeek)] = item.total_storage_forward_q !== undefined && item.total_storage_forward_q !== null ? item.total_storage_forward_q : '--';
                // 判断数据是否为 undefined、null 或负值，负值显示 0
                weekData["ElectricityConsumption".concat(indexWeek)] = item.total_consume_electricity_q !== undefined && item.total_consume_electricity_q !== null ? Math.max(item.total_consume_electricity_q, 0) : '--';
                weekData["PowerGridPowerSupply".concat(indexWeek)] = item.total_grid_forward_q !== undefined && item.total_grid_forward_q !== null ? item.total_grid_forward_q : '--';
                weekData["PowerGridPowerFeed".concat(indexWeek)] = item.total_grid_reverse_q !== undefined && item.total_grid_reverse_q !== null ? item.total_grid_reverse_q : '--';
              }
            });
            _this4.weekReportData.push(weekData);
          });
        }
        _this4.loading = false;
        _this4.width = "3500";
      });
    },
    // ... 已有代码 ...
    // 从后台koa获取月报表数据
    getMonthReportData: function getMonthReportData() {
      var _this5 = this;
      this.loading = true;
      // 获取每个箱子的月报表数据
      if (this.selectedLevel === 2) {
        _statistic.default.findMonthStatisticsDetailsByLevelIdAndMonth({
          id: this.selectedAreaId,
          year: this.$moment(this.monthPicker).format("YYYY"),
          month: this.$moment(this.monthPicker).format("MM")
        }).then(function (result) {
          if (result && result.data) {
            result.data.forEach(function (item) {
              var monthData = {};
              monthData.monthAreaName = _this5.selectedName;
              monthData.month = item.month == null ? "--" : item.month;
              monthData.monthday = item.day == null ? "--" : item.day;
              monthData.monthGeneratingElectrical = item.provideQDetailModel.provideQ == null ? "--" : item.provideQDetailModel.provideQ;
              // monthData.monthGeneratingElectricalMonthByMonthPercent = item.provideQDetailModel.monthByMonthPercent==null ? "--" : item.provideQDetailModel.monthByMonthPercent;
              // monthData.monthGeneratingElectricalYearByYearPercent = item.provideQDetailModel.yearByYearPercent==null ? "--" : item.provideQDetailModel.yearByYearPercent;
              monthData.monthStorageCharging = item.storageQDetailModel.storageReverseQ == null ? "--" : item.storageQDetailModel.storageReverseQ;
              monthData.monthStorageDischarging = item.storageQDetailModel.storageForwardQ == null ? "--" : item.storageQDetailModel.storageForwardQ;
              // monthData.monthStorageSOC = item.storageQDetailModel.soc==null ? "--" : item.storageQDetailModel.soc;
              monthData.monthElectricityConsumption = item.consumptionQDetailModel.consumptionQ == null ? "--" : item.consumptionQDetailModel.consumptionQ;
              // monthData.monthElectricityConsumptionMonthByMonthPercent = item.consumptionQDetailModel.monthByMonthPercent==null ? "--" : item.consumptionQDetailModel.monthByMonthPercent;
              // monthData.monthElectricityConsumptionYearByYearPercent = item.consumptionQDetailModel.yearByYearPercent==null ? "--" : item.consumptionQDetailModel.yearByYearPercent;
              monthData.monthPowerGridPowerSupply = item.gridQDetailModel.gridForwardQ == null ? "--" : item.gridQDetailModel.gridForwardQ;
              monthData.monthPowerGridPowerFeed = item.gridQDetailModel.gridReverseQ == null ? "--" : item.gridQDetailModel.gridReverseQ;
              // monthData.monthPowerGridPeakToAverageRatio = item.gridQDetailModel.peakNormalRadio==null ? "--" : item.gridQDetailModel.peakNormalRadio;
              monthData.monthAirConditioner = "--";
              monthData.monthIllumination = "--";
              monthData.monthComputer = "--";
              monthData.monthOthers = "--";
              //车库目前仅安装了发电侧计量模块，储能及电网侧无计量，且车库无用电，发电=馈电，后续安装储能及电网侧计量后，相关代码需删除。
              if (result.selectedAreaId == 400 || result.selectedAreaId == 399) {
                monthData.monthElectricityConsumption = 0;
                // monthData.monthElectricityConsumptionMonthByMonthPercent = "--";
                // monthData.monthElectricityConsumptionYearByYearPercent = "--";
                monthData.monthPowerGridPowerFeed = item.consumptionQDetailModel.consumptionQ;
              }
              _this5.monthReportData.push(monthData);
            });
          } else {
            _this5.monthReportData = [];
          }
          _this5.loading = false;
        });
      } else {
        // 获取光伏未来社区、分中心的月报表数据
        _statistic.default.findMonthStatisticsDetailsByLevelIdsAndMonth({
          roleId: this.userInfo.role._id,
          id: this.selectedAreaId,
          year: this.$moment(this.monthPicker).format("YYYY"),
          month: this.$moment(this.monthPicker).format("MM")
        }).then( /*#__PURE__*/function () {
          var _ref2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3(result) {
            var nyzData;
            return _regenerator.default.wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    if (!(result && result.data)) {
                      _context3.next = 11;
                      break;
                    }
                    if (!(_this5.selectedAreaId == _this5.areaData[0]._id)) {
                      _context3.next = 8;
                      break;
                    }
                    _context3.next = 4;
                    return _this5.getNyzData();
                  case 4:
                    nyzData = _context3.sent;
                    result.data.forEach(function (item) {
                      var monthData = {};
                      var idx = nyzData.findIndex(function (e) {
                        return e.time == item.date;
                      });
                      if (idx > -1) {
                        monthData.monthGeneratingElectrical = ((item.total_provide_q == null ? 0 : item.total_provide_q) + nyzData[idx].solar).toFixed(2);
                        monthData.monthStorageDischarging = ((item.total_storage_forward_q == null ? 0 : item.total_storage_forward_q) + nyzData[idx].storageDischarge).toFixed(2);
                        monthData.monthStorageCharging = ((item.total_storage_reverse_q == null ? 0 : item.total_storage_reverse_q) + nyzData[idx].storageCharge).toFixed(2);
                        monthData.monthElectricityConsumption = ((item.total_consume_electricity_q == null ? "--" : item.total_consume_electricity_q) + nyzData[idx].consum).toFixed(2);
                        monthData.monthPowerGridPowerSupply = ((item.total_grid_forward_q == null ? 0 : item.total_grid_forward_q) + nyzData[idx].gridForwardQ).toFixed(2);
                        monthData.monthPowerGridPowerFeed = ((item.total_grid_reverse_q == null ? 0 : item.total_grid_reverse_q) + nyzData[idx].gridReverseQ).toFixed(2);
                      } else {
                        monthData.monthGeneratingElectrical = item.total_provide_q == null ? "--" : item.total_provide_q;
                        monthData.monthStorageDischarging = item.total_storage_forward_q == null ? "--" : item.total_storage_forward_q;
                        monthData.monthStorageCharging = item.total_storage_reverse_q == null ? "--" : item.total_storage_reverse_q;
                        monthData.monthElectricityConsumption = item.total_consume_electricity_q == null ? "--" : item.total_consume_electricity_q;
                        monthData.monthPowerGridPowerSupply = item.total_grid_forward_q == null ? "--" : item.total_grid_forward_q;
                        monthData.monthPowerGridPowerFeed = item.total_grid_reverse_q == null ? "--" : item.total_grid_reverse_q;
                      }
                      monthData.monthAreaName = _this5.selectedName;
                      monthData.monthday = item.date == null ? "--" : item.date;
                      // monthData.monthPowerGridPowerSupply =
                      //     item.total_grid_forward_q == null ? "--" : item.total_grid_forward_q;
                      // monthData.monthPowerGridPowerFeed =
                      //     item.total_grid_reverse_q == null ? "--" : item.total_grid_reverse_q;
                      monthData.monthAirConditioner = "--";
                      monthData.monthIllumination = "--";
                      monthData.monthComputer = "--";
                      monthData.monthOthers = "--";
                      _this5.monthReportData.push(monthData);
                    });
                    _context3.next = 9;
                    break;
                  case 8:
                    result.data.forEach(function (item) {
                      var monthData = {};
                      monthData.monthAreaName = _this5.selectedName;
                      monthData.monthday = item.date == null ? "--" : item.date;
                      monthData.monthGeneratingElectrical = item.total_provide_q == null ? "--" : item.total_provide_q;
                      // monthData.monthGeneratingElectricalMonthByMonthPercent = "--";
                      // monthData.monthGeneratingElectricalYearByYearPercent = "--";
                      monthData.monthStorageCharging = item.total_storage_reverse_q == null ? "--" : item.total_storage_reverse_q;
                      monthData.monthStorageDischarging = item.total_storage_forward_q == null ? "--" : item.total_storage_forward_q;
                      // monthData.monthStorageSOC = "--";
                      monthData.monthElectricityConsumption = item.total_consume_electricity_q == null ? "--" : item.total_consume_electricity_q;
                      // monthData.monthElectricityConsumptionMonthByMonthPercent = item.total_consume_gas_q==null ? "--" : item.total_consume_gas_q;
                      // monthData.monthElectricityConsumptionYearByYearPercent = item.total_consume_water_q==null ? "--" : item.total_consume_water_q;
                      monthData.monthPowerGridPowerSupply = item.total_grid_forward_q == null ? "--" : item.total_grid_forward_q;
                      monthData.monthPowerGridPowerFeed = item.total_grid_reverse_q == null ? "--" : item.total_grid_reverse_q;
                      // monthData.monthPowerGridPeakToAverageRatio = "--";
                      monthData.monthAirConditioner = "--";
                      monthData.monthIllumination = "--";
                      monthData.monthComputer = "--";
                      monthData.monthOthers = "--";
                      _this5.monthReportData.push(monthData);
                    });
                  case 9:
                    _context3.next = 12;
                    break;
                  case 11:
                    _this5.monthReportData = [];
                  case 12:
                    _this5.loading = false;
                  case 13:
                  case "end":
                    return _context3.stop();
                }
              }
            }, _callee3);
          }));
          return function (_x2) {
            return _ref2.apply(this, arguments);
          };
        }());
      }
    },
    // 从后台koa获取年报表数据
    getYearReportData: function getYearReportData() {
      var _this6 = this;
      this.loading = true;
      // 获取每个箱子的年报表数据
      if (this.selectedLevel === 2) {
        _statistic.default.findYearStatisticsDetailsByLevelIdAndYear({
          id: this.selectedAreaId,
          year: this.$moment(this.yearPicker).format("YYYY")
        }).then(function (result) {
          if (result && result.data) {
            result.data.forEach(function (item) {
              var yearData = {};
              yearData.yearAreaName = _this6.selectedName;
              yearData.yearMonth = item.month == null ? "--" : item.month;
              yearData.yearGeneratingElectrical = item.provideQDetailModel.provideQ == null ? "--" : item.provideQDetailModel.provideQ;
              // yearData.yearGeneratingElectricalMonthByMonthPercent = item.provideQDetailModel.monthByMonthPercent == null ? "--" : item.provideQDetailModel.monthByMonthPercent;
              // yearData.yearGeneratingElectricalYearByYearPercent = item.provideQDetailModel.yearByYearPercent == null ? "--" : item.provideQDetailModel.yearByYearPercent;
              yearData.yearStorageCharging = item.storageQDetailModel.storageReverseQ == null ? "--" : item.storageQDetailModel.storageReverseQ;
              yearData.yearStorageDischarging = item.storageQDetailModel.storageForwardQ == null ? "--" : item.storageQDetailModel.storageForwardQ;
              // yearData.yearStorageSOC = item.storageQDetailModel.soc == null ? "--" : item.storageQDetailModel.soc;
              yearData.yearElectricityConsumption = item.consumptionQDetailModel.consumptionQ == null ? "--" : item.consumptionQDetailModel.consumptionQ;
              // yearData.yearElectricityConsumptionMonthByMonthPercent = item.consumptionQDetailModel.monthByMonthPercent == null ? "--" : item.consumptionQDetailModel.monthByMonthPercent;
              // yearData.yearElectricityConsumptionYearByYearPercent = item.consumptionQDetailModel.yearByYearPercent == null ? "--" : item.consumptionQDetailModel.yearByYearPercent;
              yearData.yearPowerGridPowerSupply = item.gridQDetailModel.gridForwardQ == null ? "--" : item.gridQDetailModel.gridForwardQ;
              yearData.yearPowerGridPowerFeed = item.gridQDetailModel.gridReverseQ == null ? "--" : item.gridQDetailModel.gridReverseQ;
              // yearData.yearPowerGridPeakToAverageRatio = item.gridQDetailModel.peakNormalRadio == null ? "--" : item.gridQDetailModel.peakNormalRadio;
              yearData.yearAirConditioner = "--";
              yearData.yearIllumination = "--";
              yearData.yearComputer = "--";
              yearData.yearOthers = "--";
              //车库目前仅安装了发电侧计量模块，储能及电网侧无计量，且车库无用电，发电=馈电，后续安装储能及电网侧计量后，相关代码需删除。
              if (result.selectedAreaId == 400 || result.selectedAreaId == 399) {
                yearData.yearElectricityConsumption = 0;
                // yearData.yearElectricityConsumptionMonthByMonthPercent = "--";
                // yearData.yearElectricityConsumptionYearByYearPercent = "--";
                yearData.yearPowerGridPowerFeed = item.consumptionQDetailModel.consumptionQ;
              }
              _this6.yearReportData.push(yearData);
            });
          } else {
            _this6.yearReportData = [];
          }
          _this6.loading = false;
        });
      } else {
        // 获取光伏未来社区、分中心的年报表数据
        _statistic.default.findYearStatisticsDetailsByLevelIdsAndYear({
          roleId: this.userInfo.role._id,
          id: this.selectedAreaId,
          year: this.$moment(this.yearPicker).format("YYYY")
        }).then( /*#__PURE__*/function () {
          var _ref3 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4(result) {
            var nyzData;
            return _regenerator.default.wrap(function _callee4$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    if (!(result && result.data)) {
                      _context4.next = 11;
                      break;
                    }
                    if (!(_this6.selectedAreaId == _this6.areaData[0]._id)) {
                      _context4.next = 8;
                      break;
                    }
                    _context4.next = 4;
                    return _this6.getNyzData();
                  case 4:
                    nyzData = _context4.sent;
                    result.data.forEach(function (item) {
                      var yearData = {};
                      var idx = nyzData.findIndex(function (e) {
                        return e.time == item.month;
                      });
                      if (idx > -1) {
                        yearData.yearGeneratingElectrical = ((item.total_provide_q == null ? 0 : item.total_provide_q) + nyzData[idx].solar).toFixed(2);
                        yearData.yearStorageDischarging = ((item.total_storage_forward_q == null ? 0 : item.total_storage_forward_q) + nyzData[idx].storageDischarge).toFixed(2);
                        yearData.yearStorageCharging = ((item.total_storage_reverse_q == null ? 0 : item.total_storage_reverse_q) + nyzData[idx].storageCharge).toFixed(2);
                        yearData.yearElectricityConsumption = ((item.total_consume_electricity_q == null ? "--" : item.total_consume_electricity_q) + nyzData[idx].consum).toFixed(2);
                        yearData.yearPowerGridPowerSupply = ((item.total_grid_forward_q == null ? 0 : item.total_grid_forward_q) + nyzData[idx].gridForwardQ).toFixed(2);
                        yearData.yearPowerGridPowerFeed = ((item.total_grid_reverse_q == null ? 0 : item.total_grid_reverse_q) + nyzData[idx].gridReverseQ).toFixed(2);
                      } else {
                        yearData.yearGeneratingElectrical = item.total_provide_q == null ? "--" : item.total_provide_q;
                        yearData.yearStorageDischarging = item.total_storage_forward_q == null ? "--" : item.total_storage_forward_q;
                        yearData.yearStorageCharging = item.total_storage_reverse_q == null ? "--" : item.total_storage_reverse_q;
                        yearData.yearElectricityConsumption = item.total_consume_electricity_q == null ? "--" : item.total_consume_electricity_q;
                        yearData.yearPowerGridPowerSupply = item.total_grid_forward_q == null ? "--" : item.total_grid_forward_q;
                        yearData.yearPowerGridPowerFeed = item.total_grid_reverse_q == null ? "--" : item.total_grid_reverse_q;
                      }
                      yearData.yearAreaName = _this6.selectedName;
                      yearData.yearMonth = item.month == null ? "--" : item.month;
                      // yearData.yearPowerGridPowerSupply =
                      //     item.total_grid_forward_q == null
                      //         ? "--"
                      //         : item.total_grid_forward_q;
                      // yearData.yearPowerGridPowerFeed =
                      //     item.total_grid_reverse_q == null
                      //         ? "--"
                      //         : item.total_grid_reverse_q;
                      yearData.yearAirConditioner = "--";
                      yearData.yearIllumination = "--";
                      yearData.yearComputer = "--";
                      yearData.yearOthers = "--";
                      _this6.yearReportData.push(yearData);
                    });
                    _context4.next = 9;
                    break;
                  case 8:
                    result.data.forEach(function (item) {
                      var yearData = {};
                      yearData.yearAreaName = _this6.selectedName;
                      yearData.yearMonth = item.month == null ? "--" : item.month;
                      yearData.yearGeneratingElectrical = item.total_provide_q == null ? "--" : item.total_provide_q;
                      // yearData.yearGeneratingElectricalMonthByMonthPercent = "--";
                      // yearData.yearGeneratingElectricalYearByYearPercent = "--";
                      yearData.yearStorageCharging = item.total_storage_reverse_q == null ? "--" : item.total_storage_reverse_q;
                      yearData.yearStorageDischarging = item.total_storage_forward_q == null ? "--" : item.total_storage_forward_q;
                      // yearData.yearStorageSOC = "--";
                      yearData.yearElectricityConsumption = item.total_consume_electricity_q == null ? "--" : item.total_consume_electricity_q;
                      // yearData.yearElectricityConsumptionMonthByMonthPercent = item.total_consume_water_q == null ? "--" : item.total_consume_water_q;
                      // yearData.yearElectricityConsumptionYearByYearPercent = item.total_consume_gas_q == null ? "--" : item.total_consume_gas_q;
                      yearData.yearPowerGridPowerSupply = item.total_grid_forward_q == null ? "--" : item.total_grid_forward_q;
                      yearData.yearPowerGridPowerFeed = item.total_grid_reverse_q == null ? "--" : item.total_grid_reverse_q;
                      // yearData.yearPowerGridPeakToAverageRatio = "--";
                      yearData.yearAirConditioner = "--";
                      yearData.yearIllumination = "--";
                      yearData.yearComputer = "--";
                      yearData.yearOthers = "--";
                      _this6.yearReportData.push(yearData);
                    });
                  case 9:
                    _context4.next = 12;
                    break;
                  case 11:
                    _this6.yearReportData = [];
                  case 12:
                    _this6.loading = false;
                  case 13:
                  case "end":
                    return _context4.stop();
                }
              }
            }, _callee4);
          }));
          return function (_x3) {
            return _ref3.apply(this, arguments);
          };
        }());
      }
    },
    // 方法调整
    handleReportTypeChange: function handleReportTypeChange(e) {
      this.reportTypeIndex = e.detail.value;
      this.selectedReportType = this.reportTypeData[this.reportTypeIndex].value;
    },
    handleAreaChange: function handleAreaChange(e) {
      var index = e.detail.value;
      this.selectedIndex = index;
      this.selectedAreaId = this.areaData[index]._id;
      this.areaLevelId = this.areaData[index].origin;
      this.selectedLevel = this.areaData[index].level;
      this.selectedName = this.areaData[index].name;
    },
    // 当某日的日期改变时
    datePickerChange: function datePickerChange(e) {
      this.dateReportData = [];
      this.datePicker = e;
      this.getDateReportData(); // 从后台koa获取日报表数据
    },
    // 当某月的日期改变时
    monthPickerChange: function monthPickerChange(e) {
      this.monthReportData = [];
      this.monthPicker = e;
      this.getMonthReportData(); // 从后台koa获取月报表数据
    },
    // 当某年的日期改变时
    yearPickerChange: function yearPickerChange(e) {
      this.yearReportData = [];
      this.yearPicker = e;
      this.getYearReportData(); // 从后台koa获取年报表数据
    }
  },
  mounted: function mounted() {
    // this.loadAreaData();
    this.reportTypeOptions = this.reportTypeData.map(function (item) {
      return item.name;
    });
    this.getAreaData(); // 从后台koa获取下拉框的数据
  },
  beforeDestroy: function beforeDestroy() {},
  watch: {
    selectedReportType: {
      handler: function handler(newVal, oldVal) {
        if (this.selectedReportType === "date") {
          this.dateReportData = [];
          this.getDateReportData(); // 从后台koa获取日报表数据
        } else if (this.selectedReportType === "week") {
          this.weekReportData = [];
          this.getWeekReportData(); // 从后台koa获取周报表数据
        } else if (this.selectedReportType === "month") {
          this.monthReportData = [];
          this.getMonthReportData(); // 从后台koa获取月报表数据
        } else if (this.selectedReportType === "year") {
          this.yearReportData = [];
          this.getYearReportData(); // 从后台koa获取年报表数据
        }
      }
    },

    selectedAreaId: {
      handler: function handler(newVal, oldVal) {
        if (this.selectedReportType === "date") {
          this.dateReportData = [];
          this.getDateReportData(); // 从后台koa获取日报表数据
        } else if (this.selectedReportType === "month") {
          this.monthReportData = [];
          this.getMonthReportData(); // 从后台koa获取月报表数据
        } else if (this.selectedReportType === "year") {
          this.yearReportData = [];
          this.getYearReportData(); // 从后台koa获取年报表数据
        }
      }
    }
  }
};
exports.default = _default;

/***/ }),

/***/ 964:
/*!*********************************************************************************************!*\
  !*** D:/ems/community/report.vue?vue&type=style&index=0&id=372008a8&lang=scss&scoped=true& ***!
  \*********************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_report_vue_vue_type_style_index_0_id_372008a8_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/mini-css-extract-plugin/dist/loader.js??ref--8-oneOf-1-0!../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/css-loader/dist/cjs.js??ref--8-oneOf-1-1!../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-2!../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/postcss-loader/src??ref--8-oneOf-1-3!../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/sass-loader/dist/cjs.js??ref--8-oneOf-1-4!../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-5!../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./report.vue?vue&type=style&index=0&id=372008a8&lang=scss&scoped=true& */ 965);
/* harmony import */ var _HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_report_vue_vue_type_style_index_0_id_372008a8_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_report_vue_vue_type_style_index_0_id_372008a8_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_report_vue_vue_type_style_index_0_id_372008a8_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_report_vue_vue_type_style_index_0_id_372008a8_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_report_vue_vue_type_style_index_0_id_372008a8_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 965:
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??ref--8-oneOf-1-0!./node_modules/css-loader/dist/cjs.js??ref--8-oneOf-1-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-2!./node_modules/postcss-loader/src??ref--8-oneOf-1-3!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/sass-loader/dist/cjs.js??ref--8-oneOf-1-4!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-5!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/ems/community/report.vue?vue&type=style&index=0&id=372008a8&lang=scss&scoped=true& ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
    if(false) { var cssReload; }
  

/***/ })

},[[956,"common/runtime","common/vendor","community/common/vendor"]]]);
//# sourceMappingURL=../../.sourcemap/mp-weixin/community/report.js.map