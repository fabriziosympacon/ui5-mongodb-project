sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (Controller, JSONModel, MessageToast) {
    "use strict";
    
    return Controller.extend("sap.ui.demo.mongodb.controller.Main", {
        onInit: function () {
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

            // Environment-aware URL configuration
            var sUrl = window.location.hostname === "localhost" 
                ? "http://localhost:3000/api/data"
                : "https://ui5-mongodb-project.vercel.app/api/data";

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

        // Add any additional controller methods here
        onAfterRendering: function() {
            // Additional initialization if needed
        },

        onExit: function() {
            // Cleanup if needed
        }
    });
});