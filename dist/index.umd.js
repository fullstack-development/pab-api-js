(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('axios')) :
  typeof define === 'function' && define.amd ? define(['exports', 'axios'], factory) :
  (global = global || self, factory(global.pabApiJs = {}, global.axios));
}(this, (function (exports, axios) {
  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var axios__default = /*#__PURE__*/_interopDefaultLegacy(axios);

  function _extends() {
    _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    return _extends.apply(this, arguments);
  }

  /** Class representing a PAB (Plutus Application Backend) API. */

  var Pab =
  /**
   * @param {string} host - The host of PAB.
   * @param {Object} [axiosConfig={}] - A custom config for the axios instance.
   */
  function Pab(host, axiosConfig) {
    var _this = this;

    if (axiosConfig === void 0) {
      axiosConfig = {};
    }

    this.axios = void 0;

    this.checkPabExists = function () {
      return _this.axios.get('api/healthcheck').then(function () {
        return true;
      })["catch"](function () {
        return false;
      });
    };

    this.getFullReport = function () {
      return _this.axios.get('api/fullreport').then(function (res) {
        return res.data;
      });
    };

    this.activateContract = function (contractName, walletNumber) {
      return _this.axios.post('api/contract/activate', {
        caID: contractName,
        caWallet: {
          getWallet: walletNumber
        }
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(function (res) {
        return res.data.unContractInstanceId;
      });
    };

    this.getContractStatus = function (contractInstanceId) {
      return _this.axios.get("api/contract/instance/" + contractInstanceId + "/status").then(function (res) {
        return res.data;
      });
    };

    this.getContractSchema = function (contractInstanceId) {
      return _this.axios.get("api/contract/instance/" + contractInstanceId + "/schema").then(function (res) {
        return res.data;
      });
    };

    this.callContractEndpoint = function (contractInstanceId, endpointName, data) {
      if (data === void 0) {
        data = {};
      }

      return _this.axios.post("api/contract/instance/" + contractInstanceId + "/endpoint/" + endpointName, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(function (res) {
        return res.data;
      });
    };

    this.stopContract = function (contractInstanceId) {
      return _this.axios.put("api/contract/instance/" + contractInstanceId + "/stop");
    };

    this.getContractsByWallet = function (walletNumber) {
      return _this.axios.get("api/contract/instances/wallet/" + walletNumber).then(function (res) {
        return res.data;
      });
    };

    this.getContracts = function () {
      return _this.axios.get('api/contract/instances').then(function (res) {
        return res.data;
      });
    };

    this.getContractsDefinitions = function () {
      return _this.axios.get('api/contract/definitions').then(function (res) {
        return res.data;
      });
    };

    this.axios = axios__default['default'].create(_extends({}, axiosConfig, {
      baseURL: host
    }));
  }
  /**
   * Checks, if the PAB instance exists.
   * @return {Promise<boolean>} - Promise fulfilled by boolean.
   */
;

  exports.Pab = Pab;

})));
