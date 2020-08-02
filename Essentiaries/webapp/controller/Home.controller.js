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
	return BaseController.extend("com.ink.Essentiaries.controller.Home", {


		onInit: function (oEvent) {
				this.token = "";
					var oEmptyModel = new JSONModel();
						this.getOwnerComponent().getModel("oProductModel").setProperty("/Cart",[]);
			oEmptyModel.setProperty("/Currency", {"currency":"₹"});
				this.getView().setModel(oEmptyModel, "oEmptyModel");
				this.GETMethod_CATE();
			this.GETMethod_Prod();
			this.GETMethod_ProdOffers();
			
			
		},
		
		fnCategorySelect:function(oEvent){
		var sPath=oEvent.getSource().getBindingContext("oProductModel").getPath();
		var id=this.getOwnerComponent().getModel("oProductModel").getProperty(sPath+"/categoryid");
		this.getRouter().navTo("Product", {
				CategoryId: id
			});
		},
	onSearch: function (event) {
			var oItem = event.getParameter("searchField");
			if (oItem) {
				MessageToast.show("Search for: " + oItem.getText());
			} else {
				MessageToast.show("Search is fired!");
			}
		},
		

		onSuggest: function (event) {
			this.oSF = this.getView().byId("searchField");
			var sValue = event.getParameter("suggestValue"),
				aFilters = [];
		if (sValue) {
				aFilters = [
					new Filter([
						new Filter("productid", function (sDes) {
							return (sDes || "").toUpperCase().indexOf(sValue.toUpperCase()) > -1;
						}),
						new Filter("productname", function (sText) {
							return (sText || "").toUpperCase().indexOf(sValue.toUpperCase()) > -1;
						}),
							new Filter("categoryname", function (sText) {
							return (sText || "").toUpperCase().indexOf(sValue.toUpperCase()) > -1;
						}),
							new Filter("brandname", function (sText) {
							return (sText || "").toUpperCase().indexOf(sValue.toUpperCase()) > -1;
						})
					], false)
				];
			}
		
			this.oSF.getBinding("suggestionItems").filter(aFilters);
			this.oSF.suggest();
			
/*			var aFilter = [];

			var sQuery = this.getView().byId("searchField").getValue();
			if (sQuery) {
				aFilter.push(new Filter("productname", FilterOperator.Contains, sQuery));
			}

			// filter binding
			var oList = this.getView().byId("searchField");
			var oBinding = oList.getBinding("suggestionItems");
			oBinding.filter(aFilter);
			//oBinding.suggest();
		*/
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

					MessageToast.show("Succussfully consumed destination from CF!");
					that.prodCount = data.length;

					that.getOwnerComponent().getModel("oProductModel").setProperty("/Product", data);
					
					//console.log(data);

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

					MessageToast.show("Succussfully consumed destination from CF!");
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
		GETMethod_CATE: function () {
			var that = this;

			var sUrl = "/AdminModule/api/category";
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

					MessageToast.show("Succussfully consumed destination from CF!");
					that.cateCount = data.length;

					that.getOwnerComponent().getModel("oProductModel").setProperty("/Category", data);

				},
				type: "GET"
			}).always(function (data, status, xhr) {
				that.token = xhr.getResponseHeader("x-CSRF-Token");

			});
		},
		getRouter: function () {
			return UIComponent.getRouterFor(this);
		},
			fnCart :function(oEvent){
			MessageToast.show("Product Added To Cart ");
			oEvent.getSource().getParent().getItems()[0].setVisible(false);
			oEvent.getSource().getParent().getItems()[1].setVisible(true);
			
			var Path=oEvent.getSource().getBindingContext("oProductModel").sPath;
			var oData=this.getOwnerComponent().getModel("oProductModel").getProperty(Path);
			this.getOwnerComponent().getModel("oProductModel").setProperty(Path+"/quantity",1);
			this.getOwnerComponent().getModel("oProductModel").getProperty("/Cart").unshift(oData);
			var price=this.getOwnerComponent().getModel("oProductModel").getProperty(Path+"/price");
			 this.getOwnerComponent().getModel("oProductModel").setProperty(Path+"/amount",price);
			console.log(this.getOwnerComponent().getModel("oProductModel").getProperty(Path));
			
			
			this.getOwnerComponent().getModel("oProductModel").refresh();
		this.fnTotalCalc();
		
			
			 //this.fnOnAddToCart();
		},
		onCheck1:function(oEvent){
			console.log(oEvent);
		//	this.onCheck(oEvent);
			this.fnOnAddToCart(oEvent);                  
		}
	});

});