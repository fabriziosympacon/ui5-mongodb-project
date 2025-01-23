sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel"
], function (UIComponent, JSONModel) {
    "use strict";
    return UIComponent.extend("sap.ui.demo.mongodb.Component", {
        metadata: {
            manifest: "json"
        },
        init: function () {
            UIComponent.prototype.init.apply(this, arguments);

            // Set the data model
            var oModel = new JSONModel();
            this.setModel(oModel, "dataModel");

            // Create the views based on the url/hash
            this.getRouter().initialize();
        }
    });
});