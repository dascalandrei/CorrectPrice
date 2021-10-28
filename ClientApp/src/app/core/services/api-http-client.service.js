"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ApiHttpClient = /** @class */ (function () {
    function ApiHttpClient(httpClient) {
        this.httpClient = httpClient;
    }
    ApiHttpClient.prototype.get = function (relativeUrl) {
        return this.httpClient.get(this.getBaseUrl() + relativeUrl);
    };
    ApiHttpClient.prototype.post = function (relativeUrl, body) {
        return this.httpClient.post(this.getBaseUrl() + relativeUrl, body);
    };
    ApiHttpClient.prototype.getBaseUrl = function () {
        return document.getElementsByTagName('base')[0].href;
    };
    return ApiHttpClient;
}());
exports.ApiHttpClient = ApiHttpClient;
//# sourceMappingURL=api-http-client.service.js.map