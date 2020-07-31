sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/core/BusyIndicator"
	
], function (Controller, History, UIComponent, JSONModel, MessageToast,BusyIndicator) {
	"use strict";

	return Controller.extend("com.ink.Essentiaries.controller.userDashBoard", {

		
		onInit: function () {
			var oRouter = this.getRouter();
			oRouter.getRoute("userDashBoard").attachMatched(this._onRouteMatched, this);
			
	
		},
		getRouter: function () {
			return UIComponent.getRouterFor(this);
		},
		_onRouteMatched: function (oEvent) {
			
		
		}
	});

});