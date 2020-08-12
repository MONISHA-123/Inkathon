sap.ui.define([
	"sap/ui/core/mvc/Controller",
		"sap/ui/core/UIComponent",
			"sap/ui/core/routing/History",
				"sap/m/MessageToast"
], function (Controller,UIComponent,History,MessageToast) {
	"use strict";

	return Controller.extend("com.ink.Essentiaries.controller.offers", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.ink.Essentiaries.view.offers
		 */
		onInit: function () {
				this.GETMethod_ProdOffers();
		},
		GETMethod_ProdOffers: function () {
			var that = this;

			var sUrl = "/AdminModule/api/offers";
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

				
					that.offerCount = data.length;

					that.getOwnerComponent().getModel("oProductModel").setProperty("/offers", data);
					
					//console.log(data);

				},
				type: "GET"
			}).always(function (data, status, xhr) {
				that.token = xhr.getResponseHeader("x-CSRF-Token");
				//console.log(that.token);
			});
		},
		
		getRouter: function () {
			return UIComponent.getRouterFor(this);
		},
		fnToHome: function () {
			UIComponent.getRouterFor(this).navTo("Home");
		
		}

		

	});

});