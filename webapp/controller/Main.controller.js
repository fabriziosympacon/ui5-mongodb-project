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
                vorgaengerData: [],
                selectedObject: null,
                vorgaengerPanelHeader: "Vorgängerobjekte",
                graphlookusData: [] // Add property for graphlookus data
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
            this._getDataModel().setProperty("/vorgaengerData", []); // Clear Vorgänger data

            if (!sArchivierungsobjekt && !sArchivierungsobjekttext) {
                // Load all data without filter
                this.loadData(null, true); // Use the initial load function with grouping
                return;
            }

            if (sArchivierungsobjekt) {
                oFilter.Archivierungsobjekt = sArchivierungsobjekt;
                this.loadData(oFilter, true, function (data) {
                    if (data && data.length > 0) {
                        console.log("All DB entries for data filter:", oFilter, data);
                        var oSelectedObject = data[0];
                        console.log("Setting selected object:", oSelectedObject);
                        that._getDataModel().setProperty("/selectedObject", oSelectedObject);

                        console.log("Calling loadVorgaengerData with:", oSelectedObject.Archivierungsobjekt);
                        that.loadVorgaengerData(oSelectedObject.Archivierungsobjekt);

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

        loadVorgaengerData: function (archivierungsobjekt) {
            console.log("loadVorgaengerData called with:", archivierungsobjekt);

            // Use environment-aware URL
            var sUrl = window.location.hostname === "localhost"
                ? "http://localhost:3000/api/vorgaenger"
                : "https://ui5-mongodb-project.vercel.app/api/vorgaenger";

            sUrl += `?archivierungsobjekt=${encodeURIComponent(archivierungsobjekt)}`;

            fetch(sUrl)
                .then(response => response.json())
                .then(data => {
                    console.log("API response for vorgaenger:", data); // Log the API response

                    var oModel = this.getView().getModel("dataModel");
                    if (data.length > 0 && data[0].vorgaengerHierarchy) {
                        oModel.setProperty("/vorgaengerData", data[0].vorgaengerHierarchy);
                    } else {
                        oModel.setProperty("/vorgaengerData", []);
                    }
                    oModel.refresh(true); //force a model refresh.
                    console.log("vorgaengerData after update:", oModel.getProperty("/vorgaengerData")); // Log the updated model data
                })
                .catch(error => console.error('Error fetching data:', error));
                this.loadGraphlookusData(archivierungsobjekt);
        },

        loadGraphlookusData: function (archivierungsobjekt) {
            console.log("loadGraphlookusData called with:", archivierungsobjekt);

            // Use environment-aware URL
            var sUrl = window.location.hostname === "localhost"
                ? "http://localhost:3000/api/graphlookus"
                : "https://ui5-mongodb-project.vercel.app/api/graphlookus";

            sUrl += `?archivierungsobjekt=${encodeURIComponent(archivierungsobjekt)}`;

            fetch(sUrl)
                .then(response => response.json())
                .then(data => {
                    console.log("API response for graphlookus:", data); // Log the API response

                    var oModel = this.getView().getModel("dataModel");
                    if (data && data.length > 0) {
                        oModel.setProperty("/graphlookusData", data); // Set all graphlookus data
                    } else {
                        oModel.setProperty("/graphlookusData", []);
                    }
                    oModel.refresh(true); //force a model refresh.
                    console.log("graphlookusData after update:", oModel.getProperty("/graphlookusData")); // Log the updated model data
                    this.renderGraph(); //Render Graph
                })
                .catch(error => console.error('Error fetching graphlookus data:', error));
        },

        renderGraph: function() {
            //Get graph data from the model.
            var oModel = this.getView().getModel("dataModel");
            var graphData = oModel.getProperty("/graphlookusData");
            if(graphData.length === 0){
                return; //do not render if no data.
            }

            //Get the container for the graph.
            var graphContainer = document.getElementById("graphContainer");
            if(!graphContainer){
                console.error("Graph container not found.");
                return;
            }

            //Here you will need to add the code to render the graph.
            //This is where you would use a graph library like cytoscape.js or d3.js
            //Example using console.log to show the data.
            console.log("Rendering graph with data:", graphData);

            //Example using cytoscape.js
            if(typeof cytoscape !== 'undefined'){
                //Clear any existing graph.
                graphContainer.innerHTML = "";

                cytoscape({
                    container: graphContainer,
                    elements: graphData,
                    style: [
                        {
                            selector: 'node',
                            style: {
                                'background-color': '#666',
                                'label': 'data(id)'
                            }
                        },

                        {
                            selector: 'edge',
                            style: {
                                'width': 3,
                                'line-color': '#ccc',
                                'target-arrow-color': '#ccc',
                                'target-arrow-shape': 'triangle',
                                'curve-style': 'bezier'
                            }
                        }
                    ],
                    layout: {
                        name: 'breadthfirst',
                        directed: true,
                        padding: 10
                    }
                });
            } else {
                console.warn("cytoscape.js is not loaded.");
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
                // Fetch vorgaenger data
                this.loadVorgaengerData(oSelectedObject.Archivierungsobjekt);
            } else {
                // Clear Vorgänger data when selection is cleared
                this._getDataModel().setProperty("/vorgaengerData", []);
                this._getDataModel().setProperty("/selectedObject", null);
            }
        }
    });
});