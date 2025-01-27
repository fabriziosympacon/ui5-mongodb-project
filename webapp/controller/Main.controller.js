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
                vorgaengerData: [],
                vorgaengerPanelHeader: "Vorgängerobjekte"
            });
            this.getView().setModel(oModel, "dataModel");
            this.loadData();
        },
        
        loadData: function (filter, callback) {
            var oModel = this._getDataModel();
            if (!oModel) {
                MessageToast.show("Data model is not set");
                return;
            }

             // Reset vorgaengerData
             oModel.setProperty("/selectedObject", null);
             oModel.setProperty("/vorgaengerData", null);

            // Use environment-aware URL
            var sUrl = window.location.hostname === "localhost" 
                ? "http://localhost:3000/api/data"
                : "https://ui5-mongodb-project.vercel.app/api/data";

                if (filter) {
                    console.log("Filter:", filter); // Debug log
                    sUrl += "?filter=" + encodeURIComponent(JSON.stringify(filter));
                }
            

            
                $.ajax({
                    url: sUrl,
                    method: "GET",
                    success: function(data) {
                        console.log("Data loaded successfully:", data);
                        // Only set main data
                        oModel.setProperty("/data", data);
                        
                        // If it's a filter request with single result
                        if (filter && data && data.length === 1) {
                            var oSelectedObject = data[0];
                            oModel.setProperty("/selectedObject", oSelectedObject);
                            
                            // Set Vorgänger data only if Vorgaenger exists
                            if (oSelectedObject.Vorgaenger) {
                                oModel.setProperty("/vorgaengerData", [{
                                    Vorgaenger: oSelectedObject.Vorgaenger,
                                    V_EN: oSelectedObject.V_EN,
                                    V_DE: oSelectedObject.V_DE
                                }]);
                            }
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
            this._getDataModel().setProperty("/vorgaengerData", null);
            this._getDataModel().setProperty("/vorgaengerPanelHeader", "Vorgängerobjekte");
        
            if (!sArchivierungsobjekt && !sArchivierungsobjekttext) {
                // Load all data without filter
                this.loadData();
                return;
            }
        
            if (sArchivierungsobjekt) {
                oFilter.Archivierungsobjekt = sArchivierungsobjekt;
                this.loadData(oFilter, false, function(data) {
                    if (data && data.length > 0) {
                        var oSelectedObject = data[0];
                        console.log("Setting selected object:", oSelectedObject);
                        that._getDataModel().setProperty("/selectedObject", oSelectedObject);
                        that._getDataModel().setProperty("/vorgaengerData", [{
                            Vorgaenger: oSelectedObject.Vorgaenger,
                            V_EN: oSelectedObject.V_EN,
                            V_DE: oSelectedObject.V_DE
                        }]);
        
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
                this.loadData(oFilter);
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