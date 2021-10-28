"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ProjectCollectionConfigService = /** @class */ (function () {
    function ProjectCollectionConfigService(httpClient) {
        this.httpClient = httpClient;
    }
    ProjectCollectionConfigService.prototype.listAllProjectCollections = function () {
        return this.httpClient.get('ProjectConfiguration/ListAllProjectCollections');
    };
    ProjectCollectionConfigService.prototype.addProjectCollection = function (projectCollectionConfiguration) {
        return this.httpClient.post('ProjectConfiguration/AddProjectCollection', projectCollectionConfiguration);
    };
    return ProjectCollectionConfigService;
}());
exports.ProjectCollectionConfigService = ProjectCollectionConfigService;
//# sourceMappingURL=project-collection-config.service.js.map