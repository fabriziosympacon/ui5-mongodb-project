sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (Controller, JSONModel, MessageToast) {
    "use strict";
    
    return Controller.extend("sap.ui.demo.mongodb.controller.Main", {
        onInit: function () {
            var oModel = new JSONModel({
                showEN: false,
                showDE: true,
                data: []
            });
            this.getView().setModel(oModel, "dataModel");
            this.loadData();
        },
        
        loadData: function (filter) {
            var oModel = this.getView().getModel("dataModel");
            if (!oModel) {
                MessageToast.show("Data model is not set");
                return;
            }

            // Use environment-aware URL
            var sUrl = window.location.hostname === "localhost" 
                ? "http://localhost:3000/api/data"
                : "https://ui5-mongodb-project.vercel.app/api/data";

            if (filter) {
                sUrl += "?filter=" + encodeURIComponent(JSON.stringify(filter));
            }
            

            
            $.ajax({
                url: sUrl,
                method: "GET",
                success: function(data) {
                    console.log("Data loaded successfully:", data);
                    oModel.setProperty("/data", data);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.error("Failed to load data:", textStatus, errorThrown);
                    MessageToast.show("Failed to load data");
                }
            });
        },
        onApplyFilter: function () {
            var sArchivierungsobjekt = this.byId("archivierungsobjektInput").getValue();
            var sArchivierungsobjekttext = this.byId("textarchivierungsobjekt").getValue();
            var oFilter = {};
            if (sArchivierungsobjekt) {
                oFilter.Archivierungsobjekt = sArchivierungsobjekt;
            }
            if (sArchivierungsobjekttext) {
                var oModel = this.getView().getModel("dataModel");
                if (oModel.getProperty("/showEN")) {
                    oFilter.O_EN = sArchivierungsobjekttext;
                } else {
                    oFilter.O_DE = sArchivierungsobjekttext;
                }
            }
            this.loadData(oFilter);
        },
        
        onShowEN: function () {
            console.log("Show EN button pressed");
            this.getView().getModel("dataModel").setProperty("/showEN", true);
            this.getView().getModel("dataModel").setProperty("/showDE", false);
        },
        
        onShowDE: function () {
            console.log("Show DE button pressed");
            this.getView().getModel("dataModel").setProperty("/showEN", false);
            this.getView().getModel("dataModel").setProperty("/showDE", true);
        },

        onToggleTable: function () {
            var oPanel = this.byId("tablePanel");
            oPanel.setExpanded(!oPanel.getExpanded());
        },

        onSelectionChange: function (oEvent) {
            var oTable = oEvent.getSource();
            var oSelectedItem = oTable.getSelectedItem();
            if (oSelectedItem) {
                var oContext = oSelectedItem.getBindingContext("dataModel");
                var sArchivierungsobjekt = oContext.getProperty("Archivierungsobjekt");
                console.log("Selected Archivierungsobjekt:", sArchivierungsobjekt);
                // Assign the selected value to a variable
                this._selectedArchivierungsobjekt = sArchivierungsobjekt;
            }
        }
    });
});