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
		},
		onChangeOther: function () {
			var quantity = this.getOwnerComponent().getModel("oProductModel").getProperty("/ProductID/0/quantity");
			var price = this.getOwnerComponent().getModel("oProductModel").getProperty("/ProductID/0/price");
			var cart = this.getOwnerComponent().getModel("oProductModel").getProperty("/Cart");
			var iAmount = quantity * price;
			var Amount = iAmount.toFixed(2);
			iAmount = parseFloat(Amount);

			for (var i = 0; i < cart.length; i++) {
				if (cart[i].productid == this.getOwnerComponent().getModel("oProductModel").getProperty("/ProductID/0/productid")) {
					this.getOwnerComponent().getModel("oProductModel").setProperty("/Cart/" + i + "/amount", iAmount);

				}
			}

			this.fnTotalCalc();

		},
		fnTotalCalc: function () {
			var total = 0;
			var oEmptyModel = this.getOwnerComponent().getModel("oProductModel").getProperty("/Cart");
			for (var j = 0; j < oEmptyModel.length; j++) {
				total += this.getOwnerComponent().getModel("oProductModel").getProperty("/Cart/" + j + "/amount");

			}

			this.getOwnerComponent().getModel("oProductModel").setProperty("/Total", total);
		},
	fnCart: function (oEvent) {
			
			MessageToast.show("Product Added To Cart ");

			var cartId = this.getOwnerComponent().getModel("oProductModel").getProperty("/Cart");
			var oData=this.getOwnerComponent().getModel("oProductModel").getProperty("/ProductID/0");

		 for (var i = 0; i < cartId.length; i++) {
            if(cartId[i].productid == oData.productid&&this.getOwnerComponent().getModel("oProductModel").getProperty("/ProductID/0/quantity")==0)
            {
                oEvent.getSource().getParent().getItems()[0].setVisible(true);
                oEvent.getSource().getParent().getItems()[1].setVisible(false);
                //var cartId = this.getOwnerComponent().getModel("oProductModel").getProperty(Path+"/productid");   
                cartId.splice(i,1);
                    this.fnTotalCalc();
                return;
            }
                if (cartId[i].productid == oData.productid) {
                    oEvent.getSource().getParent().getItems()[0].setVisible(false);
                    oEvent.getSource().getParent().getItems()[1].setVisible(true);
                    var iQuantity = this.getOwnerComponent().getModel("oProductModel").getProperty("/ProductID/0/quantity");
                    this.getOwnerComponent().getModel("oProductModel").setProperty("/Cart/" + i + "/quantity", iQuantity);
                    this.onChangeOther(Path);
                    return;
                }
            }

			oEvent.getSource().getParent().getItems()[0].setVisible(false);
			oEvent.getSource().getParent().getItems()[1].setVisible(true);
			this.getOwnerComponent().getModel("oProductModel").setProperty("/ProductID/0/quantity", 1);
			this.getOwnerComponent().getModel("oProductModel").getProperty("/Cart").unshift(oData);
			var price = this.getOwnerComponent().getModel("oProductModel").getProperty("/ProductID/0/price");
			this.getOwnerComponent().getModel("oProductModel").setProperty("/ProductID/0/amount", price);
			console.log(this.getOwnerComponent().getModel("oProductModel").getProperty("/ProductID/0"));
			//	this.fnProductUpdate();
			this.getOwnerComponent().getModel("oProductModel").refresh();
			this.onChangeOther();

			//this.fnOnAddToCart();
		},
		 fnCateFooter:function(oEvent){
        		var sPath = oEvent.getSource().getSelectedItem().getBindingContext("oProductModel").sPath;
			var id = this.getOwnerComponent().getModel("oProductModel").getProperty(sPath + "/categoryid");
			this.getRouter().navTo("Product", {
				CategoryId: id
			});
        },
        	onPressProduct :function(oEvent){
			var sPath = oEvent.getSource().getBindingContext("oProductModel").getPath();
			var pId=this.getOwnerComponent().getModel("oProductModel").getProperty(sPath + "/productid");
			this.getRouter().navTo("productDescription", {
				ProductId: pId
				
			});
		}
	});

});