//@ui5-bundle sap/ui/demo/mongodb/Component-preload.js
sap.ui.predefine("sap/ui/demo/mongodb/Component", ["sap/ui/core/UIComponent","sap/ui/model/json/JSONModel"],function(t,e){"use strict";return t.extend("sap.ui.demo.mongodb.Component",{metadata:{manifest:"json"},init:function(){t.prototype.init.apply(this,arguments);var i=new e;this.setModel(i,"dataModel");this.getRouter().initialize()}})});
sap.ui.predefine("sap/ui/demo/mongodb/controller/App.controller", ["sap/ui/core/mvc/Controller"],function(n){"use strict";return n.extend("sap.ui.demo.mongodb.controller.App",{onInit:function(){}})});
sap.ui.predefine("sap/ui/demo/mongodb/controller/Main.controller", ["sap/ui/core/mvc/Controller","sap/ui/model/json/JSONModel","sap/m/MessageToast"],function(e,t,o){"use strict";return e.extend("sap.ui.demo.mongodb.controller.Main",{onInit:function(){var e=new t({showEN:false,showDE:true,data:[],vorgaengerData:[],selectedObject:null,vorgaengerPanelHeader:"Vorgängerobjekte"});this.getView().setModel(e,"dataModel");console.log("Model initialized and set to view");this.loadData(null,true,"data")},loadData:function(e,t,a,r){var l=this._getDataModel();if(!l){o.show("Data model is not set");return}l.setProperty("/selectedObject",null);l.setProperty("/vorgaengerData",[]);var n=window.location.hostname==="localhost"?"http://localhost:3000/api/":"https://ui5-mongodb-project.vercel.app/api/";var s=n+a;var i=[];if(t){i.push("groupByArchivierungsobjekt=true")}if(e){console.log("Filter for data:",e);i.push("filter="+encodeURIComponent(JSON.stringify(e)))}if(i.length>0){s+="?"+i.join("&")}console.log("Request URL:",s);$.ajax({url:s,method:"GET",success:function(t){console.log("Data loaded successfully:",t);console.log("All DB entries for data filter:",e,t);l.setProperty("/data",t);l.refresh(true);if(e&&t&&t.length>0){var o=t[0];l.setProperty("/selectedObject",o);var a="Vorgängerobjekt: "+o.Archivierungsobjekt;l.setProperty("/vorgaengerPanelHeader",a);console.log("Updated header text:",a)}if(r){r(t)}},error:function(e,t,a){console.error("Failed to load data:",t,a);o.show("Failed to load data")}})},onApplyFilter:function(){var e=this.byId("archivierungsobjektInput").getValue();var t=this.byId("textarchivierungsobjekt").getValue();var o={};var a=this;this._getDataModel().setProperty("/selectedObject",null);this._getDataModel().setProperty("/vorgaengerPanelHeader","Vorgängerobjekte");if(!e&&!t){this.loadData(null,true,"data");return}if(e){o.Archivierungsobjekt=e;this.loadData(o,true,"data",function(e){if(e&&e.length>0){console.log("All DB entries for data filter:",o,e);var t=e[0];console.log("Setting selected object:",t);a._getDataModel().setProperty("/selectedObject",t);console.log("Calling loadVorgaengerData with:",t.Archivierungsobjekt);a.loadData({archivierungsobjekt:t.Archivierungsobjekt},false,"vorgaenger");var r="Vorgängerobjekt: "+t.Archivierungsobjekt;a._getDataModel().setProperty("/vorgaengerPanelHeader",r);console.log("Updated header text:",r)}})}else if(t){var r=this._getDataModel();if(r.getProperty("/showEN")){o.O_EN=t}else{o.O_DE=t}this.loadData(o,true,"data")}},onShowEN:function(){console.log("Show EN button pressed");this.getView().getModel("dataModel").setProperty("/showEN",true);this.getView().getModel("dataModel").setProperty("/showDE",false)},onShowDE:function(){console.log("Show DE button pressed");this.getView().getModel("dataModel").setProperty("/showEN",false);this.getView().getModel("dataModel").setProperty("/showDE",true)},onToggleTable:function(){var e=this.byId("tablePanel");e.setExpanded(!e.getExpanded())},_getDataModel:function(){return this.getView().getModel("dataModel")},onSelectionChange:function(e){var t=e.getSource();var o=t.getSelectedIndices();if(o.length>0){var a=t.getContextByIndex(o[0]);var r=a.getObject();this._getDataModel().setProperty("/selectedObject",r);this.byId("archivierungsobjektInput").setValue(r.Archivierungsobjekt);this.loadData({archivierungsobjekt:r.Archivierungsobjekt},false,"vorgaenger")}}})});
sap.ui.require.preload({
	"sap/ui/demo/mongodb/i18n/i18n.properties":'# General messages\r\nwelcomeMessage=Welcome to the MongoDB Example\r\nerrorMessage=An error occurred\r\n\r\n# Button texts\r\nbuttonSubmit=Submit\r\nbuttonCancel=Cancel\r\n\r\n# Labels\r\nlabelName=Name\r\nlabelEmail=Email\r\nlabelPassword=Password\r\n\r\n# Form validation messages\r\nvalidationNameRequired=Name is required\r\nvalidationEmailRequired=Email is required\r\nvalidationEmailInvalid=Invalid email address\r\nvalidationPasswordRequired=Password is required\r\nvalidationPasswordTooShort=Password must be at least 8 characters long\r\n\r\n# Titles\r\ntitleHomePage=Home Page\r\ntitleLoginPage=Login Page\r\ntitleProfilePage=Profile Page\r\n\r\n# Miscellaneous\r\nloadingMessage=Loading...',
	"sap/ui/demo/mongodb/i18n/i18n_de.properties":'# General messages\r\nwelcomeMessage=Welcome to the MongoDB Example\r\nerrorMessage=An error occurred\r\n\r\n# Button texts\r\nbuttonSubmit=Submit\r\nbuttonCancel=Cancel\r\n\r\n# Labels\r\nlabelName=Name\r\nlabelEmail=Email\r\nlabelPassword=Password\r\n\r\n# Form validation messages\r\nvalidationNameRequired=Name is required\r\nvalidationEmailRequired=Email is required\r\nvalidationEmailInvalid=Invalid email address\r\nvalidationPasswordRequired=Password is required\r\nvalidationPasswordTooShort=Password must be at least 8 characters long\r\n\r\n# Titles\r\ntitleHomePage=Home Page\r\ntitleLoginPage=Login Page\r\ntitleProfilePage=Profile Page\r\n\r\n# Miscellaneous\r\nloadingMessage=Loading...',
	"sap/ui/demo/mongodb/i18n/i18n_en.properties":'# General messages\r\nwelcomeMessage=Welcome to the MongoDB Example\r\nerrorMessage=An error occurred\r\n\r\n# Button texts\r\nbuttonSubmit=Submit\r\nbuttonCancel=Cancel\r\n\r\n# Labels\r\nlabelName=Name\r\nlabelEmail=Email\r\nlabelPassword=Password\r\n\r\n# Form validation messages\r\nvalidationNameRequired=Name is required\r\nvalidationEmailRequired=Email is required\r\nvalidationEmailInvalid=Invalid email address\r\nvalidationPasswordRequired=Password is required\r\nvalidationPasswordTooShort=Password must be at least 8 characters long\r\n\r\n# Titles\r\ntitleHomePage=Home Page\r\ntitleLoginPage=Login Page\r\ntitleProfilePage=Profile Page\r\n\r\n# Miscellaneous\r\nloadingMessage=Loading...',
	"sap/ui/demo/mongodb/manifest.json":'{"sap.app":{"id":"sap.ui.demo.mongodb","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"1.0.0"},"title":"SAP UI5 MongoDB Example","description":"An example SAP UI5 application to read data from MongoDB."},"sap.ui":{"technology":"UI5","deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"rootView":{"viewName":"sap.ui.demo.mongodb.view.App","type":"XML","async":true,"id":"app"},"dependencies":{"minUI5Version":"1.60.0","libs":{"sap.m":{}}},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"sap.ui.demo.mongodb.i18n.i18n"}}},"componentPreload":"false","routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","viewPath":"sap.ui.demo.mongodb.view","controlId":"app","controlAggregation":"pages","async":true},"routes":[{"pattern":"","name":"main","target":"main"}],"targets":{"main":{"viewName":"Main","viewLevel":1}}},"contentDensities":{"compact":true,"cozy":true}}}',
	"sap/ui/demo/mongodb/view/App.view.xml":'<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" controllerName="sap.ui.demo.mongodb.controller.App"><App id="app"><pages><mvc:XMLView viewName="sap.ui.demo.mongodb.view.Main"/></pages></App></mvc:View>',
	"sap/ui/demo/mongodb/view/Main.view.xml":'<mvc:View controllerName="sap.ui.demo.mongodb.controller.Main"\r\n          xmlns:mvc="sap.ui.core.mvc"\r\n          xmlns="sap.m"\r\n          xmlns:table="sap.ui.table"\r\n          xmlns:core="sap.ui.core"><Page title="Netzplan Archivierungsobjekte"><content><VBox><HBox alignItems="Center"><Input id="archivierungsobjektInput" placeholder="Enter Archivierungsobjekt value"/><Input id="textarchivierungsobjekt" placeholder="Enter Name value"/><Button text="Apply Filter" press="onApplyFilter"/><Button text="Show EN" press="onShowEN"/><Button text="Show DE" press="onShowDE"/></HBox><Panel id="tablePanel" headerText="Archivierungsobjekte" expandable="true" expanded="true"><table:Table id="dataTable" rows="{dataModel>/data}" visibleRowCount="10" selectionMode="Single" selectionBehavior="Row" rowSelectionChange="onSelectionChange"><table:columns><table:Column><Label text="Archivierungsobjekt"/><table:template><Text text="{dataModel>Archivierungsobjekt}"/></table:template></table:Column><table:Column visible="{dataModel>/showEN}"><Label text="O_EN"/><table:template><Text text="{dataModel>O_EN}" visible="{dataModel>/showEN}"/></table:template></table:Column><table:Column visible="{dataModel>/showDE}"><Label text="O_DE"/><table:template><Text text="{dataModel>O_DE}" visible="{dataModel>/showDE}"/></table:template></table:Column></table:columns></table:Table></Panel><Panel id="vorgaengerPanel" \r\n                        headerText="{dataModel>/vorgaengerPanelHeader}"\r\n                        expandable="true" \r\n                        expanded="false"\r\n                        visible="{= !!${dataModel>/selectedObject}}"><table:Table id="vorgaengerTable" \r\n                                rows="{dataModel>/vorgaengerData}" \r\n                                visibleRowCount="5" \r\n                                selectionMode="MultiToggle" selectionBehavior="Row"><table:columns><table:Column><Label text="Vorgänger"/><table:template><Text text="{dataModel>Vorgaenger}"/></table:template></table:Column><table:Column visible="{dataModel>/showEN}"><Label text="V_EN"/><table:template><Text text="{dataModel>V_EN}"/></table:template></table:Column><table:Column visible="{dataModel>/showDE}"><Label text="V_DE"/><table:template><Text text="{dataModel>V_DE}"/></table:template></table:Column></table:columns></table:Table></Panel></VBox></content></Page></mvc:View>'
});
//# sourceMappingURL=Component-preload.js.map
