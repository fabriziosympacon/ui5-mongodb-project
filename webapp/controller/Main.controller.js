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
                data: [],
                selectedObject: null,
                vorgaengerPanelHeader: "Vorgängerobjekte"
            });
            this.getView().setModel(oModel, "dataModel");
            console.log("Model initialized and set to view");
            this.loadData(null, true); // Initial load with grouping
        },
        
        loadData: function (filter, groupBy, callback) {
            var oModel = this._getDataModel();
            if (!oModel) {
                MessageToast.show("Data model is not set");
                return;
            }

            // Reset main data
            oModel.setProperty("/selectedObject", null);

            // Use environment-aware URL
            var sUrl = window.location.hostname === "localhost" 
                ? "http://localhost:3000/api/data"
                : "https://ui5-mongodb-project.vercel.app/api/data";

            // Add groupByArchivierungsobjekt parameter if needed
            var queryParams = [];
            if (groupBy) {
                queryParams.push("groupByArchivierungsobjekt=true");
            }

            if (filter) {
                console.log("Filter for data:", filter); // Debug log
                queryParams.push("filter=" + encodeURIComponent(JSON.stringify(filter)));
            }

            sUrl += "?" + queryParams.join("&");

            console.log("Request URL:", sUrl);
            $.ajax({
                url: sUrl,
                method: "GET",
                success: function(data) {
                    console.log("Data loaded successfully:", data);
                    // Log all database entries for the given filter
                    console.log("All DB entries for data filter:", filter, data);

                    // Only set main data
                    oModel.setProperty("/data", data);
                    
                    // Refresh the model to update the view
                    oModel.refresh(true);

                    // If it's a filter request with multiple results
                    if (filter && data && data.length > 0) {
                        var oSelectedObject = data[0];
                        oModel.setProperty("/selectedObject", oSelectedObject);

                        // Update header text directly
                        var sHeaderText = "Vorgängerobjekt: " + oSelectedObject.Archivierungsobjekt;
                        oModel.setProperty("/vorgaengerPanelHeader", sHeaderText);
                        console.log("Updated header text:", sHeaderText);
                    }

                    if (callback) {
                        callback(data);
                    }
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
            var that = this;

            // Reset Vorgänger data
            this._getDataModel().setProperty("/selectedObject", null);
            this._getDataModel().setProperty("/vorgaengerPanelHeader", "Vorgängerobjekte");

            if (!sArchivierungsobjekt && !sArchivierungsobjekttext) {
                // Load all data without filter
                this.loadData(null, true); // Use the initial load function with grouping
                return;
            }

            if (sArchivierungsobjekt) {
                oFilter.Archivierungsobjekt = sArchivierungsobjekt;
                this.loadData(oFilter, true, function(data) {
                    if (data && data.length > 0) {
                        console.log("All DB entries for data filter:", oFilter, data);
                        var oSelectedObject = data[0];
                        console.log("Setting selected object:", oSelectedObject);
                        that._getDataModel().setProperty("/selectedObject", oSelectedObject);

                        // Update header text directly
                        var sHeaderText = "Vorgängerobjekt: " + oSelectedObject.Archivierungsobjekt;
                        that._getDataModel().setProperty("/vorgaengerPanelHeader", sHeaderText);
                        console.log("Updated header text:", sHeaderText);
                    }
                });
            } else if (sArchivierungsobjekttext) {
                var oModel = this._getDataModel();
                if (oModel.getProperty("/showEN")) {
                    oFilter.O_EN = sArchivierungsobjekttext;
                } else {
                    oFilter.O_DE = sArchivierungsobjekttext;
                }
                this.loadData(oFilter, true);
            }
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

        _getDataModel: function() {
            return this.getView().getModel("dataModel");
        },

        onSelectionChange: function (oEvent) {
            var oTable = oEvent.getSource();
            var aSelectedIndices = oTable.getSelectedIndices();
            if (aSelectedIndices.length > 0) {
                var oContext = oTable.getContextByIndex(aSelectedIndices[0]);
                var oSelectedObject = oContext.getObject();
                
                // Set selected object to model
                this._getDataModel().setProperty("/selectedObject", oSelectedObject);
                
                // Set value to input field
                this.byId("archivierungsobjektInput").setValue(oSelectedObject.Archivierungsobjekt);
                
            }
        }
    });
});