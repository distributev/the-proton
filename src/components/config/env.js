import angular from 'angular';
export default angular.module("theProtonApp.environment", [])
.constant("name", "production")
.constant("description", "Add here any environment specific stuff you like.")
.constant("userData", "_internal/electronData")
.constant("configPath", "../../../../config/internal/config.json")
.constant("templatesPath", "templates");
