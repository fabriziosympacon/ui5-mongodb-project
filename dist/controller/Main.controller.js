sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/model/json/JSONModel","sap/m/MessageToast"],function(e,t,o){"use strict";return e.extend("sap.ui.demo.mongodb.controller.Main",{onInit:function(){var e=new t({showEN:false,showDE:true,data:[]});this.getView().setModel(e,"dataModel");this.loadData()},loadData:function(e){var t=this.getView().getModel("dataModel");if(!t){o.show("Data model is not set");return}var a=window.location.hostname==="localhost"?"http://localhost:3000/api/data":"https://ui5-mongodb-project.vercel.app/api/data";if(e){a+="?filter="+encodeURIComponent(JSON.stringify(e))}$.ajax({url:a,method:"GET",success:function(e){console.log("Data loaded successfully:",e);t.setProperty("/data",e)},error:function(e,t,a){console.error("Failed to load data:",t,a);o.show("Failed to load data")}})},onApplyFilter:function(){var e=this.byId("archivierungsobjektInput").getValue();var t=this.byId("textarchivierungsobjekt").getValue();var o={};if(e){o.Archivierungsobjekt=e}if(t){var a=this.getView().getModel("dataModel");if(a.getProperty("/showEN")){o.O_EN=t}else{o.O_DE=t}}this.loadData(o)},onShowEN:function(){console.log("Show EN button pressed");this.getView().getModel("dataModel").setProperty("/showEN",true);this.getView().getModel("dataModel").setProperty("/showDE",false)},onShowDE:function(){console.log("Show DE button pressed");this.getView().getModel("dataModel").setProperty("/showEN",false);this.getView().getModel("dataModel").setProperty("/showDE",true)},onToggleTable:function(){var e=this.byId("tablePanel");e.setExpanded(!e.getExpanded())},onSelectionChange:function(e){var t=e.getSource();var o=t.getSelectedItem();if(o){var a=o.getBindingContext("dataModel");var s=a.getProperty("Archivierungsobjekt");console.log("Selected Archivierungsobjekt:",s);this._selectedArchivierungsobjekt=s}}})});
//# sourceMappingURL=Main.controller.js.map