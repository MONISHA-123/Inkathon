sap.ui.define([
	"com/ink/Essentiaries/controller/BaseController",
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast"
], function (BaseController, Controller, UIComponent, History, MessageToast) {
	"use strict";

	return BaseController.extend("com.ink.Essentiaries.controller.About", {

		onInit: function () {
			var oRouter = this.getRouter();
			oRouter.getRoute("About").attachMatched(this._onRouteMatched, this);
		},
		_onRouteMatched: function (oEvent) {
			
			var key = oEvent.getParameter("arguments").KEY;
			this.byId("IconTabBar").setSelectedKey(key);
			
		}

	});

});