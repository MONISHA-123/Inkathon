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

], function (BaseController, Controller, UIComponent, MessageToast, BusyIndicator, JSONModel, Fragment, Filter, FilterOperator, Device,
	Popup, History) {
	"use strict";
	return BaseController.extend("com.ink.Essentiaries.controller.Home", {

		onInit: function (oEvent) {
			this.token = "";
			var oEmptyModel = new JSONModel();
			this.getOwnerComponent().getModel("oProductModel").setProperty("/Cart", []);
			oEmptyModel.setProperty("/Currency", {
				"currency": "₹"
			});
			this.getView().setModel(oEmptyModel, "oEmptyModel");
			this.GETMethod_CATE();
			this.GETMethod_Prod();
			this.GETMethod_ProdOffers();
			this.GETMethod_PROMO();

		},

		fnCategorySelect: function (oEvent) {
			var sPath = oEvent.getSource().getBindingContext("oProductModel").getPath();
			var id = this.getOwnerComponent().getModel("oProductModel").getProperty(sPath + "/categoryid");
			this.getRouter().navTo("Product", {
				CategoryId: id
			});
		},
	
		onSearch: function (oEvent) {

			var sKey = oEvent.getSource().getSelectedKey();
			var sName = oEvent.getParameters().value;
			var pId = oEvent.getSource().getSuggestionItemByKey(sKey).getDescription();
			console.log(sName, sKey, pId);
			this.getOwnerComponent().getModel("oProductModel").setProperty("/ProductSearch", pId);
			this.getRouter().navTo("productDescription", {
				ProductId: pId
					//	Productname: sName
			});

		},
	
		onSuggest: function (oEvent) {
			var sTerm = oEvent.getParameter("suggestValue");
			var aFilters = [];
			if (sTerm) {
				/*aFilters.push(new Filter("productname", FilterOperator.StartsWith, sTerm));*/
				aFilters = [
					new Filter([
						new Filter("productname", function (sText) {
							return (sText || "").toUpperCase().indexOf(sTerm.toUpperCase()) > -1;
						}),
						new Filter("brandname", function (sDes) {
							return (sDes || "").toUpperCase().indexOf(sTerm.toUpperCase()) > -1;
						})
					], false)
				];
			}

			oEvent.getSource().getBinding("suggestionItems").filter(aFilters);
		},
		hideBusyIndicator: function () {
			BusyIndicator.hide();
		},

		showBusyIndicator: function (iDuration, iDelay) {
			BusyIndicator.show(iDelay);

			if (iDuration && iDuration > 0) {
				if (this._sTimeoutId) {
					clearTimeout(this._sTimeoutId);
					this._sTimeoutId = null;
				}

				this._sTimeoutId = setTimeout(function () {
					this.hideBusyIndicator();
				}.bind(this), iDuration);
			}
		},
		busyIndicator: function (sec) {
			this.showBusyIndicator(sec);
		},
		GETMethod_Prod: function () {
			var that = this;

			var sUrl = "/AdminModule/api/product";
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

					

				},
				type: "GET"
			}).always(function (data, status, xhr) {
				that.token = xhr.getResponseHeader("x-CSRF-Token");
				//console.log(that.token);
			});
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

		GETMethod_PROMO: function () {
			var that = this;

			var sUrl = "/AdminModule/api/promotion";
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
					MessageToast.show("Category Fetch Destination Failed");
				},
				success: function (data, status, xhr) {

					that.getOwnerComponent().getModel("oProductModel").setProperty("/Promotion", data);

				},
				type: "GET"
			}).always(function (data, status, xhr) {
				that.token = xhr.getResponseHeader("x-CSRF-Token");

			});
		},

		getRouter: function () {
			return UIComponent.getRouterFor(this);
		},
		fnCart: function (oEvent) {
			MessageToast.show("Product Added To Cart ");
	
			this.id = this.getOwnerComponent().getModel("oProductModel").getProperty("/LoginUser/userid");
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
					return;
				}
			}
			if (this.id) {
				oEvent.getSource().getParent().getItems()[0].setVisible(false);
				oEvent.getSource().getParent().getItems()[1].setVisible(true);
				this.getOwnerComponent().getModel("oProductModel").setProperty(Path + "/quantity", 1);
				//	this.getOwnerComponent().getModel("oProductModel").getProperty("/Cart").unshift(oData);
				var price = this.getOwnerComponent().getModel("oProductModel").getProperty(Path + "/price");
				this.getOwnerComponent().getModel("oProductModel").setProperty(Path + "/amount", price);
				console.log(this.getOwnerComponent().getModel("oProductModel").getProperty(Path));
				this.getOwnerComponent().getModel("oProductModel").refresh();
				this.onChangeOther(Path);
				console.log(oData);
				this.fnPostCart(oData);

			}
			oEvent.getSource().getParent().getItems()[0].setVisible(false);
			oEvent.getSource().getParent().getItems()[1].setVisible(true);
			this.getOwnerComponent().getModel("oProductModel").setProperty(Path + "/quantity", 1);
			this.getOwnerComponent().getModel("oProductModel").getProperty("/Cart").unshift(oData);
			var price = this.getOwnerComponent().getModel("oProductModel").getProperty(Path + "/price");
			this.getOwnerComponent().getModel("oProductModel").setProperty(Path + "/amount", price);
			console.log(this.getOwnerComponent().getModel("oProductModel").getProperty(Path));

			this.getOwnerComponent().getModel("oProductModel").refresh();
			this.onChangeOther(Path);

			//this.fnOnAddToCart();
		},
		onPressPromotion: function (oEvent) {
			var sPath = oEvent.getSource().getBindingContext("oProductModel").getPath();
			var refID = this.getOwnerComponent().getModel("oProductModel").getProperty(sPath + "/referenceid");
			//console.log(refID);
			this.byId("homePage").scrollTo(0, 1000);
		},
		OnPressOffers: function () {
			this.getRouter().navTo("offers");
		}
	});

});