!function(t,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports,require("axios"),require("isomorphic-ws")):"function"==typeof define&&define.amd?define(["exports","axios","isomorphic-ws"],n):n((t||self).pabApiJs={},t.axios,t.isomorphicWs)}(this,function(t,n,e){function o(t){return t&&"object"==typeof t&&"default"in t?t:{default:t}}var r=o(n),a=o(e);function i(){return i=Object.assign?Object.assign.bind():function(t){for(var n=1;n<arguments.length;n++){var e=arguments[n];for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o])}return t},i.apply(this,arguments)}t.Pab=function(t,n){var e=this;void 0===n&&(n={}),this.axios=void 0,this.sockets={},this.socketURL=void 0,this.checkPabExists=function(){return e.axios.get("api/healthcheck").then(function(){return!0}).catch(function(){return!1})},this.getFullReport=function(){return e.axios.get("api/fullreport").then(function(t){return t.data})},this.activateContract=function(t,n){return e.axios.post("api/contract/activate",{caID:t,caWallet:{getWalletId:n}},{headers:{"Content-Type":"application/json"}}).then(function(t){return t.data.unContractInstanceId})},this.getContractStatus=function(t){return e.axios.get("api/contract/instance/"+t+"/status").then(function(t){return t.data})},this.getContractState=function(t){return e.getContractStatus(t).then(function(t){return t.cicCurrentState.observableState})},this.getContractSchema=function(t){return e.axios.get("api/contract/instance/"+t+"/schema").then(function(t){return t.data})},this.callContractEndpoint=function(t){return function(n,o){return e.axios.post("api/contract/instance/"+t+"/endpoint/"+n,o,{headers:{"Content-Type":"application/json"}})}},this.stopContract=function(t){return e.axios.put("api/contract/instance/"+t+"/stop")},this.getContractsByWallet=function(t){return e.axios.get("api/contract/instances/wallet/"+t).then(function(t){return t.data})},this.getContracts=function(){return e.axios.get("api/contract/instances").then(function(t){return t.data})},this.getContractsDefinitions=function(){return e.axios.get("api/contract/definitions").then(function(t){return t.data})},this.setSocketURL=function(t){e.socketURL=t},this.createSocket=function(t){void 0===t&&(t="");var n=t||"root";return e.sockets[n]||(e.sockets[n]=new a.default(e.socketURL+"/"+t)),e.sockets[n]},this.getSocket=function(t){return void 0===t&&(t=""),e.sockets[t||"root"]},this.addSocketMessageHandler=function(t){return function(n){if(""===t)throw new Error("Contract id should not be empty");var o=e.getSocket(t),r=function(t){var e=JSON.parse(String(t.data));n(e)};return o.addEventListener("message",r),function(){return o.removeEventListener("message",r)}}},this.axios=r.default.create(i({},n,{baseURL:t}))},t.withInstanceId=function(t){return function(n){return{getStatus:function(){return t.getContractStatus(n)},getState:function(){return t.getContractState(n)},getSchema:function(){return t.getContractSchema(n)},callEndpoint:t.callContractEndpoint(n),stop:function(){return t.stopContract(n)},createSocket:function(){return t.createSocket(n)},getSocket:function(){return t.getSocket(n)},subscribe:t.addSocketMessageHandler(n)}}}});
