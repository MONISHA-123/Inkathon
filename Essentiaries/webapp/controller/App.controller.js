sap.ui.define([
	"com/ink/Essentiaries/controller/BaseController",
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/m/MessageToast",
	"sap/ui/core/BusyIndicator",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/Device",
	"sap/ui/core/Popup",
	"sap/ui/core/routing/History"

], function (BaseController,Controller, UIComponent, MessageToast, BusyIndicator, JSONModel, Fragment, Filter, FilterOperator, Device, Popup,History) {
	"use strict";
	return BaseController.extend("com.ink.Essentiaries.controller.App", {
		onInit: function () {
	this.forgotOTP = 0;
	this.oRegistration = {
				"email": "",
				"fname": "",
				"lname": "",
				"phoneno": "",
				"password": "",
				"role": "user"
			};

			var oEmptyModel = new JSONModel();
			oEmptyModel.setProperty("/ForgotPassword", {
				"email": ""
			});
			this.getOwnerComponent().getModel("oProductModel").setProperty("/Cart",[]);
			oEmptyModel.setProperty("/Currency", {"currency":"₹"});
			this.getView().setModel(oEmptyModel, "oEmptyModel");
		}
	
	
	});
});