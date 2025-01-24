sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/demo/mongodb/config/config" // Ensure the correct path to the config file
], function (Controller, JSONModel, MessageToast, config) {
    "use strict";
    
    return Controller.extend("sap.ui.demo.mongodb.controller.Main", {
        onInit: function () {
            // Log the API URL to verify it is set correctly
            console.log("API URL:", config.apiUrl);

            // Initialize the model and set it to the view
            var oModel = new JSONModel({
                showEN: false, // Initialize the property for toggling columns to show DE columns by default
                showDE: true, // Initialize the property for toggling columns to show DE columns by default
                data: [] // Initialize data array
            });
            this.getView().setModel(oModel, "dataModel");
            
            // Load initial data
            this.loadData();
        },
        
        loadData: function (filter) {
            var oModel = this.getView().getModel("dataModel");
            if (!oModel) {
                MessageToast.show("Data model is not set");
                return;
            }
            var sUrl = config.apiUrl; // Use the API URL from the configuration file
            if (filter) {
                sUrl += "?filter=" + encodeURIComponent(JSON.stringify(filter));
            }
            // Use jQuery to load the data
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