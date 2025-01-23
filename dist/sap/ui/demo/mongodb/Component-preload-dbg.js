sap.ui.define(['sap/ui/core/Core', 'sap/ui/core/Component'], function(Core, Component) {
    "use strict";
    Core.initLibrary({
        name: "sap.ui.demo.mongodb",
        dependencies: ["sap.ui.core", "sap.m"],
        controls: [],
        elements: [],
        noLibraryCSS: true // if you don't want to load the library CSS
    });

    // Preload the resources
    sap.ui.require.preload({
        "sap/ui/demo/mongodb/Component.js": "sap.ui.define([\n\t\"sap/ui/core/UIComponent\",\n\t\"sap/ui/model/json/JSONModel\"\n], function (UIComponent, JSONModel) {\n\t\"use strict\";\n\treturn UIComponent.extend(\"sap.ui.demo.mongodb.Component\", {\n\t\tmetadata: {\n\t\t\tmanifest: \"json\"\n\t\t},\n\t\tinit: function () {\n\t\t\tUIComponent.prototype.init.apply(this, arguments);\n\n\t\t\t// Set the data model\n\t\t\tvar oModel = new JSONModel();\n\t\t\tthis.setModel(oModel, \"dataModel\");\n\n\t\t\t// Create the views based on the url/hash\n\t\t\tthis.getRouter().initialize();\n\t\t}\n\t});\n});\n",
        "sap/ui/demo/mongodb/controller/Main.controller.js": "..."
        // Add other resources here
    });
});