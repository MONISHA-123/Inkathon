sap.ui.define([
	"com/ink/Essentiaries/controller/BaseController",
	"sap/ui/core/mvc/Controller",
		"sap/ui/core/UIComponent",
			"sap/ui/core/routing/History",
				"sap/m/MessageToast"
], function (BaseController,Controller,UIComponent,History,MessageToast) {
	"use strict";

	return BaseController.extend("com.ink.Essentiaries.controller.offers", {

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
		
		},
			fnCart: function (oEvent) {
			
			MessageToast.show("Product Added To Cart ");

			var cartId = this.getOwnerComponent().getModel("oProductModel").getProperty("/Cart");
			var Path = oEvent.getSource().getBindingContext("oProductModel").sPath;
			var oData = this.getOwnerComponent().getModel("oProductModel").getProperty(Path);

			for (var i = 0; i < cartId.length; i++) {
				if (cartId[i].productid == oData.productid) {
					oEvent.getSource().getParent().getItems()[0].setVisible(false);
					oEvent.getSource().getParent().getItems()[1].setVisible(true);
					var iQuantity = this.getOwnerComponent().getModel("oProductModel").getProperty(Path + "/quantity");
					this.getOwnerComponent().getModel("oProductModel").setProperty("/Cart/" + i + "/quantity", iQuantity);
					this.onChangeOther(Path);
						this.fnProductUpdate();
					return;
				}
			}

			oEvent.getSource().getParent().getItems()[0].setVisible(false);
			oEvent.getSource().getParent().getItems()[1].setVisible(true);
			this.getOwnerComponent().getModel("oProductModel").setProperty(Path + "/quantity", 1);
			this.getOwnerComponent().getModel("oProductModel").getProperty("/Cart").unshift(oData);
			var price = this.getOwnerComponent().getModel("oProductModel").getProperty(Path + "/price");
			this.getOwnerComponent().getModel("oProductModel").setProperty(Path + "/amount", price);
			console.log(this.getOwnerComponent().getModel("oProductModel").getProperty(Path));
				this.fnProductUpdate();
			this.getOwnerComponent().getModel("oProductModel").refresh();
			this.onChangeOther(Path);

			//this.fnOnAddToCart();
		}

		

	});

});