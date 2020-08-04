sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/core/BusyIndicator",
	"sap/uxap/BlockBase"
	
], function (Controller, History, UIComponent, JSONModel, MessageToast,BusyIndicator,BlockBase) {
	"use strict";

	return Controller.extend("com.ink.Essentiaries.controller.OrderDetail", {
	onInit: function () {
			console.log("InsideController");	
		},
		getRouter: function () {
			return UIComponent.getRouterFor(this);
		},
		onNavBack: function () {
			// UIComponent.getRouterFor(this).navTo("adminDashboard");
			var oHistory, sPreviousHash;

			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				// this.getOwnerComponent().getRouter().navTo("Home");
				this.getRouter().navTo("Home", {}, true);

			}
		},
		
	fnToTrackOrder: function(){
			this.getRouter().navTo("Invoice");
		}
	});
});