sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/core/BusyIndicator",
	"sap/ui/core/Fragment",
	"sap/ui/model/Filter",
	"sap/ui/model/Sorter",
	"sap/ui/model/FilterOperator"
], function (Controller,History, UIComponent, JSONModel, MessageToast, BusyIndicator, Fragment, Filter, Sorter,
	FilterOperator) {
	"use strict";

	return Controller.extend("com.ink.Essentiaries.controller.productDescription", {

		onInit: function () {
				this.token = "";
				
				var oRouter = this.getRouter();
			oRouter.getRoute("productDescription").attachMatched(this._onRouteMatched, this);
			this.GETMethod_PROD();
		},

		getRouter: function () {
			return UIComponent.getRouterFor(this);
		},
		_onRouteMatched: function (oEvent) {

			this.id = oEvent.getParameter("arguments").ProductId;
		//	console.log(this.id);
			this.GETMethod_PRODID();
		},
			fnToHome: function () {
			UIComponent.getRouterFor(this).navTo("Home");
		
		},
		GETMethod_PRODID: function () {
			var that = this;

			var sUrl = "/AdminModule/api/productbyid/"+ that.id;
			$.ajax({
				url: sUrl,
				data: null,
				async: true,
				dataType: "json",
				contentType: "application/json; charset=utf-8",
				headers: {
					"x-CSRF-Token": "fetch"
				},
				error: function (err) {
					MessageToast.show("Product Fetch Destination Failed");
				},
				success: function (data, status, xhr) {


					that.prodCount = data.length;

					that.getOwnerComponent().getModel("oProductModel").setProperty("/ProductID", data);
					
				//	console.log(data);

				},
				type: "GET"
			}).always(function (data, status, xhr) {
				that.token = xhr.getResponseHeader("x-CSRF-Token");
				//console.log(that.token);
			});
		},
		GETMethod_PROD: function () {
			var that = this;

			var sUrl = "/AdminModule/api/product/";
			$.ajax({
				url: sUrl,
				data: null,
				async: true,
				dataType: "json",
				contentType: "application/json; charset=utf-8",
				headers: {
					"x-CSRF-Token": "fetch"
				},
				error: function (err) {
					MessageToast.show("Product Fetch Destination Failed");
				},
				success: function (data, status, xhr) {


					that.prodCount = data.length;

					that.getOwnerComponent().getModel("oProductModel").setProperty("/Product", data);
					
				//	console.log(data);

				},
				type: "GET"
			}).always(function (data, status, xhr) {
				that.token = xhr.getResponseHeader("x-CSRF-Token");
				//console.log(that.token);
			});
		}
	});

});