require('../common/vendor.js');(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["community/components/power-efficiency-analysis"],{

/***/ 1522:
/*!*****************************************************************!*\
  !*** D:/ems/community/components/power-efficiency-analysis.vue ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _power_efficiency_analysis_vue_vue_type_template_id_9d19c79a_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./power-efficiency-analysis.vue?vue&type=template&id=9d19c79a&scoped=true& */ 1523);
/* harmony import */ var _power_efficiency_analysis_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./power-efficiency-analysis.vue?vue&type=script&lang=js& */ 1525);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _power_efficiency_analysis_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _power_efficiency_analysis_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _power_efficiency_analysis_vue_vue_type_style_index_0_id_9d19c79a_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./power-efficiency-analysis.vue?vue&type=style&index=0&id=9d19c79a&scoped=true&lang=css& */ 1528);
/* harmony import */ var _HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js */ 70);

var renderjs





/* normalize component */

var component = Object(_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _power_efficiency_analysis_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _power_efficiency_analysis_vue_vue_type_template_id_9d19c79a_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _power_efficiency_analysis_vue_vue_type_template_id_9d19c79a_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "9d19c79a",
  null,
  false,
  _power_efficiency_analysis_vue_vue_type_template_id_9d19c79a_scoped_true___WEBPACK_IMPORTED_MODULE_0__["components"],
  renderjs
)

component.options.__file = "community/components/power-efficiency-analysis.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ 1523:
/*!************************************************************************************************************!*\
  !*** D:/ems/community/components/power-efficiency-analysis.vue?vue&type=template&id=9d19c79a&scoped=true& ***!
  \************************************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_power_efficiency_analysis_vue_vue_type_template_id_9d19c79a_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!../../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!../../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!../../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./power-efficiency-analysis.vue?vue&type=template&id=9d19c79a&scoped=true& */ 1524);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_power_efficiency_analysis_vue_vue_type_template_id_9d19c79a_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_power_efficiency_analysis_vue_vue_type_template_id_9d19c79a_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return _HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_power_efficiency_analysis_vue_vue_type_template_id_9d19c79a_scoped_true___WEBPACK_IMPORTED_MODULE_0__["recyclableRender"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "components", function() { return _HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_power_efficiency_analysis_vue_vue_type_template_id_9d19c79a_scoped_true___WEBPACK_IMPORTED_MODULE_0__["components"]; });



/***/ }),

/***/ 1524:
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/ems/community/components/power-efficiency-analysis.vue?vue&type=template&id=9d19c79a&scoped=true& ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
}
var recyclableRender = false
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ 1525:
/*!******************************************************************************************!*\
  !*** D:/ems/community/components/power-efficiency-analysis.vue?vue&type=script&lang=js& ***!
  \******************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_power_efficiency_analysis_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/babel-loader/lib!../../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!../../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!../../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./power-efficiency-analysis.vue?vue&type=script&lang=js& */ 1526);
/* harmony import */ var _HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_power_efficiency_analysis_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_power_efficiency_analysis_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_power_efficiency_analysis_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_power_efficiency_analysis_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_power_efficiency_analysis_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 1526:
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/ems/community/components/power-efficiency-analysis.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _websocket = __webpack_require__(/*! @/service/websocket */ 1471);
var _storage = _interopRequireDefault(__webpack_require__(/*! @/service/config/storage */ 1527));
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var _default = {
  name: "power-efficiency-analysis",
  data: function data() {
    return {
      canvas2d: this.$Config.ISCANVAS2D,
      current: "power-efficiency-analysis",
      providePower: "--",
      lightPower: "--",
      gridPower: "--",
      nyzData: {
        storagePower1: "--",
        storagePower2: "--",
        SOC: "--",
        photovoltaicPower1: "--",
        photovoltaicPower2: "--",
        loadPower1: "--",
        loadPower2: "--",
        loadElectricity1: "--",
        loadElectricity2: "--",
        pcsIntputPower: "--",
        pcsOutputTotalPower: "--"
      },
      selectedEnergyData: {
        // 被选中光伏的数据
        I: 111,
        U: 111,
        P: 111,
        Q: 111
      },
      selectedStorageData: {
        // 被选中储能的数据
        I: 222,
        U: 222,
        soc: 68,
        chargeP: 222,
        // 充
        dischargeP: 222,
        // 放
        chargeQ: 222,
        // 充
        dischargeQ: 222 // 放
      },

      selectedGridData: {
        // 被选中电网的数据
        I: 333,
        U: 333,
        P: 333,
        forwardQ: 333,
        // 供电
        reverseQ: 333 // 馈电
      },

      eleConsumption: {
        // 被选中用电的数据
        Q: 555,
        P: 5.55
      },
      //多联机功率
      dljPower: {
        power1: "--",
        power2: "--"
      },
      dljElectricity: "--",
      batteryLoss: {
        PCSRectification: "--",
        PCSInverter: "--",
        storageDCCharge: "--",
        storageDCDischarge: "--",
        photovoltaicDC: "--"
      },
      powerLoss: {
        PCSRectification: "--",
        PCSInverter: "--",
        storageDCCharge: "--",
        storageDCDischarge: "--",
        photovoltaicDC: "--"
      },
      options: {
        color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
        padding: [15, 10, 0, 15],
        update: true,
        // 启用增量更新模式（核心）
        duration: 0,
        // 关闭动画过渡时间
        animation: false,
        enableScroll: false,
        dataLabel: false,
        dataPointShape: false,
        // 新增关键配置
        legend: {},
        xAxis: {
          disableGrid: true,
          boundaryGap: "justify",
          axisLabelUseCanvas: true // 启用Canvas渲染
        },

        yAxis: {
          gridType: "dash",
          dashLength: 2,
          axisLabelUseCanvas: true,
          // 启用Canvas渲染
          splitNumber: 5
        },
        extra: {
          line: {
            // 统一配置线型图表
            type: "curve",
            width: 2,
            activeType: "point"
          },
          column: {
            // 柱状图专用配置
            type: "group",
            width: 30,
            activeBgColor: "#00000010"
          }
        }
      },
      provideChartData: {
        categories: [],
        series: [{
          name: '光伏',
          data: [],
          color: "#1890FF"
        }]
      },
      storageChartData: {
        categories: [],
        series: [{
          name: '储能',
          data: [],
          type: 'line'
        }]
      },
      loadChartData: {
        categories: [],
        series: [{
          name: '用电',
          data: [],
          type: 'line'
        }]
      },
      gridChartData: {
        categories: [],
        series: [{
          name: '电网',
          data: [],
          type: 'line'
        }]
      },
      gridPArrayXaxis: [],
      gridPArrayYaxis: [],
      energyPArrayXaxis: [],
      energyPArrayYaxis: [],
      storagePArrayYaxis: [],
      // this.storageP2ArrayYaxis = [];
      storagePArrayXaxis: [],
      consumptionPArrayXaxis: [],
      consumptionPArrayYaxis: []
    };
  },
  computed: {
    // provideChartData() {
    //     return {
    //         categories: this.energyPArrayXaxis,
    //         series: [{
    //             name: '光伏',
    //             data: this.energyPArrayYaxis,
    //             color: "#1890FF"
    //         }]
    //     };
    // },
    // storageChartData() {
    //     return {
    //         categories: this.storageChartData.categories,
    //         series: [{
    //             name: '储能',
    //             data: this.storageChartData.series[0].data,
    //             type: 'line'
    //         }]
    //     };
    // },
    // loadChartData() {
    //     return {
    //         categories: this.consumptionPArrayXaxis,
    //         series: [{
    //             name: '负荷',
    //             data: this.loadChartData.series[0].data,
    //             type: 'line'
    //         }]
    //     };
    // },
    // gridChartData() {
    //     return {
    //         categories: this.gridChartData.categories,
    //         series: [{
    //             name: '电网',
    //             data: this.gridChartData.series[0].data,
    //             type: 'column'
    //         }]
    //     };
    // },
    storageData: function storageData() {
      var power = parseFloat(this.nyzData.storagePower1) + parseFloat(this.nyzData.storagePower2);
      var status = power == 0 ? "不充不放" : power > 0 ? "充电中" : "放电中";
      return {
        power: power.toFixed(2),
        status: status
      };
    },
    totalSolarData: function totalSolarData() {
      var power1 = this.nyzData.photovoltaicPower1 == '--' ? '--' : Math.abs(this.nyzData.photovoltaicPower1);
      var power2 = this.nyzData.photovoltaicPower2 == '--' ? '--' : Math.abs(this.nyzData.photovoltaicPower2);
      var power3 = parseFloat(this.selectedEnergyData.P / 1000).toFixed(2) == '--' ? '--' : parseFloat(this.selectedEnergyData.P / 1000).toFixed(2);
      var power = this.getSum([power1, power2, power3]);
      return {
        power: power
      };
    },
    totalElectricityData: function totalElectricityData() {
      var powerLoss = parseFloat(this.nyzData.loadPower1 + this.nyzData.loadPower2) - parseFloat(this.dljPower.power1 / 1000) * (parseFloat(this.dljPower.power1 / 1000) / parseFloat(this.nyzData.loadPower1 + this.nyzData.loadPower2));
      var power1 = this.nyzData.loadPower1 == '--' ? '--' : this.nyzData.loadPower1;
      var power2 = this.nyzData.loadPower2 == '--' ? '--' : this.nyzData.loadPower2;
      var power3 = this.gridPower == '--' ? '--' : this.gridPower;
      var power = this.getSum([power1, power2, power3]);
      return {
        power: power,
        powerLoss: powerLoss.toFixed(2)
      };
    },
    pcsData: function pcsData() {
      var pcsPowerLoss = parseFloat(this.nyzData.pcsIntputPower - this.nyzData.pcsOutputTotalPower);
      return {
        pcsPowerLoss: pcsPowerLoss.toFixed(2)
      };
    }
  },
  mounted: function mounted() {
    this.getRealData();
    this.getNyzRealTimeData();
    this.getDljRealTimeData();
  },
  methods: {
    //跳转页面
    // 获取数组元素和
    getSum: function getSum(arr) {
      if (arr.every(function (item) {
        return item == '--';
      })) return '--';
      var sum = arr.reduce(function (acc, curr) {
        if (curr == '--') {
          return acc;
        }
        return acc + parseFloat(curr);
      }, 0);
      return sum.toFixed(2);
    },
    updateCharts: function updateCharts() {
      var _this = this;
      this.$nextTick(function () {
        ['provideChart', 'storageChart', 'loadChart', 'gridChart'].forEach(function (chartId) {
          var _this2, _this2$series;
          if (_this.$refs[chartId] && (_this2 = _this["".concat(chartId, "Data")]) !== null && _this2 !== void 0 && (_this2$series = _this2.series) !== null && _this2$series !== void 0 && _this2$series.length) {
            _this.$refs[chartId].refresh();
          }
        });
      });
    },
    // 能源站实时数据
    getNyzRealTimeData: function getNyzRealTimeData() {
      var _this3 = this;
      this.storageChartData.series[0].data = [];
      this.storageChartData.categories = [];
      this.nyzStoragePower1 = "--";
      this.nyzStoragePower2 = "--";
      this.totalStoragePower = "--";
      (0, _websocket.getSocketinstance)().socket2.emit("register");
      (0, _websocket.getSocketinstance)().socket2.on("nyzData", function (jsonData) {
        var deviceType = jsonData.deviceType,
          address = jsonData.address,
          dataType = jsonData.dataType,
          data = jsonData.data;
        switch (deviceType) {
          case "1804_V2_2":
            if (address == "18" && dataType == "2") {
              _this3.nyzData.storagePower1 = parseFloat(data.B8).toFixed(2);
            } else if (address == "19" && dataType == "2") {
              _this3.nyzData.storagePower2 = parseFloat(data.B8).toFixed(2);
            } else if (address == "1A" && dataType == "2") {
              _this3.nyzData.photovoltaicPower1 = parseFloat(data.B8).toFixed(2);
            } else if (address == "1B" && dataType == "2") {
              _this3.nyzData.photovoltaicPower2 = parseFloat(data.B8).toFixed(2);
            } else if (address == "31" && dataType == "2") {
              _this3.nyzData.loadPower1 = parseFloat(data.B8).toFixed(2);
              _this3.nyzData.loadElectricity1 = parseFloat(data.B12).toFixed(2);
            } else if (address == "32" && dataType == "2") {
              _this3.nyzData.loadPower2 = parseFloat(data.B8).toFixed(2);
              _this3.nyzData.loadElectricity2 = parseFloat(data.B12).toFixed(2);
            }
            break;
          case "1704_V1_2":
            if (address == "02" && dataType == "2") {
              _this3.nyzData.SOC = parseFloat(data.B4).toFixed(2);
            }
            break;
          case "1710":
            if (address == "04" && dataType == "2") {
              _this3.batteryLoss.PCSRectification = parseFloat(data.B170).toFixed(2);
              _this3.batteryLoss.PCSInverter = parseFloat(data.B178).toFixed(2);
              _this3.batteryLoss.storageDCCharge = parseFloat(data.B186).toFixed(2);
              _this3.batteryLoss.storageDCDischarge = parseFloat(data.B194).toFixed(2);
              _this3.batteryLoss.photovoltaicDC = parseFloat(data.B202).toFixed(2);
              _this3.powerLoss.PCSRectification = parseFloat(data.B166).toFixed(2);
              _this3.powerLoss.PCSInverter = parseFloat(data.B174).toFixed(2);
              _this3.powerLoss.storageDCCharge = parseFloat(data.B182).toFixed(2);
              _this3.powerLoss.storageDCDischarge = parseFloat(data.B190).toFixed(2);
              _this3.powerLoss.photovoltaicDC = parseFloat(data.B198).toFixed(2);
            }
            break;
          case "170F":
            if (address == "03" && dataType == "2") {
              _this3.dljPower.power1 = parseFloat(data.B16).toFixed(2);
              _this3.dljPower.power2 = parseFloat(data.B20).toFixed(2);
            }
            break;
          default:
            break;
        }
        if (deviceType == "1804_V2_2" && address == "18") {
          _this3.nyzStoragePower1 = parseFloat(data.B8).toFixed(2);
        } else if (deviceType == "1804_V2_2" && address == "19") {
          _this3.nyzStoragePower2 = parseFloat(data.B8).toFixed(2);
        }
        // 往储能实时的P曲线中添加数据
        _this3.storageChartData.categories.push(new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds());
        _this3.totalStoragePower = (parseFloat(_this3.nyzStoragePower1) + parseFloat(_this3.nyzStoragePower2)).toFixed(2);
        _this3.storageChartData.series[0].data.push(Math.round(_this3.totalStoragePower * 100) / 100);
        // this.storageP2ArrayYaxis.push(
        //     Math.round(this.selectedStorageData.chargeP) / 1000
        // );
        if (_this3.storageChartData.series[0].data.length > 100) {
          _this3.storageChartData.series[0].data.shift();
          _this3.storageChartData.categories.shift();
        }
      });
    },
    //社区箱子实时数据
    getRealData: function getRealData() {
      var _this4 = this;
      this.gridChartData.categories = [];
      this.gridChartData.series[0].data = [];
      this.energyPArrayXaxis = [];
      this.energyPArrayYaxis = [];
      // this.storageChartData.series[0].data = [];
      // this.storageP2ArrayYaxis = [];
      // this.storageChartData.categories = [];
      this.consumptionPArrayXaxis = [];
      this.loadChartData.series[0].data = [];
      this.loadChartData.categories = [];
      this.gridPower = "--";
      this.selectedEnergyData = {
        I: 0,
        U: 0,
        P: 0,
        Q: 0
      };
      this.selectedStorageData = {
        I: 0,
        U: 0,
        dischargeP: 0,
        chargeP: 0,
        dischargeQ: 0,
        chargeQ: 0,
        soc: 0
      };
      this.selectedGridData = {
        I: 0,
        U: 0,
        P: 0,
        forwardQ: 0,
        reverseQ: 0
      };
      this.eleConsumption = {
        Q: 0,
        P: 0
      };
      // 获取社区的电网数据
      (0, _websocket.getSocketinstance)().socket.emit("register");
      (0, _websocket.getSocketinstance)().socket.on("Grid", function (data) {
        if (data.data.B56) {
          _this4.gridPower = (data.data.B56 / 1000).toFixed(3);
        }
        _this4.gridChartData.categories.push(new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds());
        _this4.gridChartData.series[0].data.push(parseFloat(_this4.totalElectricityData.power));
        if (_this4.gridChartData.series[0].data.length > 100) {
          _this4.gridChartData.series[0].data.shift();
          _this4.gridChartData.categories.shift();
        }
        _this4.$nextTick(function () {
          _this4.$refs.storageChart && _this4.$refs.storageChart.refresh();
        });
        // this.gridOptions.series[0].data = this.gridChartData.series[0].data;
        // this.gridOptions.xAxis[0].data = this.gridChartData.categories;
        // this.$nextTick(() => {
        //     this.gridChartData = {
        //         categories: this.gridChartData.categories,
        //         series: [{
        //             name: '电网',
        //             data: this.gridChartData.series[0].data,
        //             type: 'column',
        //         }]
        //     }
        // })
      });
      // 获取箱子全部据 和 社区的光伏、储能、用电数据
      (0, _websocket.getSocketinstance)().socket.on("box", function (data) {
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
              community.storage.surplus_storage += data[i].storage.soc * _storage.default[i]; // 剩余储能
              community.storage.rated_storage += _storage.default[i]; // 额定储能
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
        _this4.eleConsumption.P = _this4.selectedEnergyData.P + _this4.selectedGridData.P + _this4.selectedStorageData.dischargeP - _this4.selectedStorageData.chargeP;
        _this4.eleConsumption.Q = Math.abs(_this4.selectedEnergyData.Q + _this4.selectedGridData.forwardQ + _this4.selectedStorageData.dischargeQ - _this4.selectedGridData.reverseQ - _this4.selectedStorageData.chargeQ); // 计算用电量

        // 往发电实时的P曲线中添加数据
        // this.energyPArrayXaxis.push(
        //     new Date().getHours() +
        //     ":" +
        //     new Date().getMinutes() +
        //     ":" +
        //     new Date().getSeconds()
        // );

        _this4.provideChartData.categories.push(new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds());
        _this4.loadChartData.series[0].data.push(parseFloat(_this4.totalSolarData.power));
        if (_this4.loadChartData.series[0].data.length > 100) {
          // this.energyPArrayYaxis.shift();
          _this4.provideChartData.categories.shift();
          _this4.provideChartData.series[0].data.shift();
          // this.energyPArrayXaxis.shift();
        }

        // 往负荷实时的P曲线中添加数据
        // this.consumptionPArrayXaxis.push(
        //     new Date().getHours() +
        //     ":" +
        //     new Date().getMinutes() +
        //     ":" +
        //     new Date().getSeconds()
        // );
        _this4.loadChartData.categories.push(new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds());
        _this4.loadChartData.series[0].data.push(Math.round(_this4.eleConsumption.P) / 1000);
        if (_this4.loadChartData.series[0].data.length > 100) {
          // this.loadChartData.series[0].data.shift();
          // this.consumptionPArrayXaxis.shift();
          _this4.loadChartData.categories.shift();
          _this4.loadChartData.series[0].data.shift();
        }

        // this.provideOptions.series[0].data = this.energyPArrayYaxis;
        // this.provideOptions.xAxis[0].data = this.energyPArrayXaxis;

        // this.$nextTick(() => {
        //     this.provideChartData = {
        //         categories: this.energyPArrayXaxis,
        //         series: [{
        //             name: '光伏',
        //             data: this.energyPArrayYaxis,
        //             type: 'line',
        //         }]
        //     }
        //     this.loadChartData = {
        //         categories: this.consumptionPArrayXaxis,
        //         series: [{
        //             name: '用电',
        //             data: this.loadChartData.series[0].data,
        //             type: 'line',
        //         }]
        //     }
        // })

        // this.loadOptions.series[0].data = this.loadChartData.series[0].data;
        // this.loadOptions.xAxis[0].data = this.consumptionPArrayXaxis
      });
    },
    //柔性调控多联机实时数据
    getDljRealTimeData: function getDljRealTimeData() {
      var _this5 = this;
      (0, _websocket.getSocketinstance)().socket.emit("register");
      (0, _websocket.getSocketinstance)().socket.on("box", function (data) {});
      (0, _websocket.getSocketinstance)().socket2.on("nyzData", function (jsonData) {
        var deviceType = jsonData.deviceType,
          address = jsonData.address,
          dataType = jsonData.dataType,
          data = jsonData.data;
        switch (deviceType) {
          case "1707_V3_3":
            if (address == "01" && dataType == "2") {
              _this5.nyzData.pcsIntputPower = parseFloat(data.B46).toFixed(2);
              _this5.nyzData.pcsOutputTotalPower = parseFloat(data.B20).toFixed(2);
            }
            break;
          default:
            break;
        }
      });
    }
  }
};
exports.default = _default;

/***/ }),

/***/ 1528:
/*!**************************************************************************************************************************!*\
  !*** D:/ems/community/components/power-efficiency-analysis.vue?vue&type=style&index=0&id=9d19c79a&scoped=true&lang=css& ***!
  \**************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_power_efficiency_analysis_vue_vue_type_style_index_0_id_9d19c79a_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-oneOf-1-0!../../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/css-loader/dist/cjs.js??ref--6-oneOf-1-1!../../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!../../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--6-oneOf-1-2!../../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/postcss-loader/src??ref--6-oneOf-1-3!../../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./power-efficiency-analysis.vue?vue&type=style&index=0&id=9d19c79a&scoped=true&lang=css& */ 1529);
/* harmony import */ var _HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_power_efficiency_analysis_vue_vue_type_style_index_0_id_9d19c79a_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_power_efficiency_analysis_vue_vue_type_style_index_0_id_9d19c79a_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_power_efficiency_analysis_vue_vue_type_style_index_0_id_9d19c79a_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_power_efficiency_analysis_vue_vue_type_style_index_0_id_9d19c79a_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_4_76_2025082103_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_power_efficiency_analysis_vue_vue_type_style_index_0_id_9d19c79a_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 1529:
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-oneOf-1-0!./node_modules/css-loader/dist/cjs.js??ref--6-oneOf-1-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--6-oneOf-1-2!./node_modules/postcss-loader/src??ref--6-oneOf-1-3!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/ems/community/components/power-efficiency-analysis.vue?vue&type=style&index=0&id=9d19c79a&scoped=true&lang=css& ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
    if(false) { var cssReload; }
  

/***/ })

}]);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/community/components/power-efficiency-analysis.js.map
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'community/components/power-efficiency-analysis-create-component',
    {
        'community/components/power-efficiency-analysis-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('2')['createComponent'](__webpack_require__(1522))
        })
    },
    [['community/components/power-efficiency-analysis-create-component']]
]);
