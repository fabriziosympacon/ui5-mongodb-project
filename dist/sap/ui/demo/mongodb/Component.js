sap.ui.define(["sap/ui/core/UIComponent","sap/ui/model/json/JSONModel"],function(t,e){"use strict";return t.extend("sap.ui.demo.mongodb.Component",{metadata:{manifest:"json"},init:function(){t.prototype.init.apply(this,arguments);var i=new e;this.setModel(i,"dataModel");this.getRouter().initialize()}})});
//# sourceMappingURL=Component.js.map