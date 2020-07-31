sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/core/BusyIndicator"
	
], function (Controller, History, UIComponent, JSONModel, MessageToast,BusyIndicator) {
	"use strict";

	return Controller.extend("com.ink.Essentiaries.controller.productDetails", {

	
		onInit: function () {
			var oRouter = this.getRouter();
			oRouter.getRoute("productDetails").attachMatched(this._onRouteMatched, this);
			
	
		},
		getRouter: function () {
			return UIComponent.getRouterFor(this);
		},
		_onRouteMatched: function (oEvent) {
			
			this.id = oEvent.getParameter("arguments").ProductId;
			this.GETMethod_PROD();
				this.GETMethod_CATE();
			this.GETMethod_BRAND();
		},
		_onBindingChange: function (oEvent) {

		},
		onNavBack: function () {
			// UIComponent.getRouterFor(this).navTo("adminDashboard");
			var oHistory, sPreviousHash;

			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("Admin", {}, true);

			}
		},
		onEditBtnPressed: function () {
			this.byId("ProdDisplay").setVisible(false);
			this.byId("ProdChange").setVisible(true);
			this.byId("idBtnEdit").setVisible(false);
			this.byId("idBtnSave").setVisible(true);
			this.byId("idBtnCancel").setVisible(true);

		},
		onCancelBtnPressed: function () {
			this.GETMethod_BRAND();
			this.GETMethod_PROD();
		
			
			this.byId("ProdDisplay").setVisible(true);
			this.byId("ProdChange").setVisible(false);
			this.byId("idBtnEdit").setVisible(true);
			this.byId("idBtnSave").setVisible(false);
			this.byId("idBtnCancel").setVisible(false);
		},
		GETMethod_PROD: function () {
			this.busyIndicator (2000);
			var that = this;
			$.ajax({
				url: "/AdminModule/api/product",
				data: null,
				async: true,
				dataType: "json",
				contentType: "application/json; charset=utf-8",
				headers: {
					"x-CSRF-Token": "fetch"
				},
				error: function (err) {
					sap.m.MessageToast.show("Product Destination Failed");
				},
				success: function (data, status, xhr) {
						
					// sap.m.MessageToast.show("Hi  Congtz! you succussfully consumed destination from CF!");
					that.prodCount = data.length;
					that.getOwnerComponent().getModel("oProductModel").setProperty("/Product", data);

				},
				complete: function () {
					for (var i = 0; i < that.prodCount; i++) {

						if (that.id == that.getOwnerComponent().getModel("oProductModel").getProperty("/Product/" + i + "/productid")) {
							var oData = that.getOwnerComponent().getModel("oProductModel").getProperty("/Product/" + i);
								that.getOwnerComponent().getModel("oProductModel").setProperty("/oChangeRow", oData);
								console.log(that.getOwnerComponent().getModel("oProductModel").getProperty("/oChangeRow"));
							that.getOwnerComponent().getModel("oProductModel").setProperty("/oSelectedRow", oData);
							 that.byId("SelectedProdTitle").setText(that.getOwnerComponent().getModel("oProductModel").getProperty("/Product/" + i+"/productname"));
								
							break;
						}
					}

				},
				type: "GET"
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

					// MessageToast.show("Hi  Congtz! you succussfully consumed destination from CF!");
					that.cateCount = data.length;
					that.getOwnerComponent().getModel("oProductModel").setProperty("/Category", data);

				},
				type: "GET"
			}).always(function (data, status, xhr) {
				that.token = xhr.getResponseHeader("x-CSRF-Token");

			});
		},
		GETMethod_BRAND: function () {
			var that = this;
			$.ajax({
				url: "/AdminModule/api/brand",
				data: null,
				async: true,
				dataType: "json",
				contentType: "application/json; charset=utf-8",
				headers: {
					"x-CSRF-Token": "fetch"
				},
				error: function (err) {
					sap.m.MessageToast.show("Brand Destination Failed");
				},
				success: function (data, status, xhr) {

					// sap.m.MessageToast.show("Hi  Congtz! you succussfully consumed destination from CF!");
					that.brandCount = data.length;
					that.getOwnerComponent().getModel("oProductModel").setProperty("/Brand", data);
					that.getOwnerComponent().getModel("oProductModel").setProperty("/cateWiseBrand",data);

				},
				type: "GET"
			});
		},
		
			hideBusyIndicator : function() {
			BusyIndicator.hide();
		},

		showBusyIndicator : function (iDuration, iDelay) {
			BusyIndicator.show(iDelay);

			if (iDuration && iDuration > 0) {
				if (this._sTimeoutId) {
					clearTimeout(this._sTimeoutId);
					this._sTimeoutId = null;
				}

				this._sTimeoutId = setTimeout(function() {
					this.hideBusyIndicator();
				}.bind(this), iDuration);
			}
		},
		busyIndicator : function(sec) {
			this.showBusyIndicator(sec);
		},
	/*
		onProCateDD:function(oEvent){
			var sSelectedKey = oEvent.getSource().getValue();
			this.getOwnerComponent().getModel("oProductModel").setProperty("/oChangeRow/brandid", " ");
			 this.getOwnerComponent().getModel("oProductModel").setProperty("/oChangeRow/brandname", " ");
			var i=this.onCateDDChanges(sSelectedKey);
				if (i < this.cateCount) {
				var id = this.getOwnerComponent().getModel("oProductModel").getProperty("/Category/" + i + "/categoryid");
				this.getOwnerComponent().getModel("oProductModel").setProperty("/oChangeRow/categoryid", id);
				this.fnCateWiseBrand();
				
			} else {
				
				this.getOwnerComponent().getModel("oProductModel").setProperty("/oChangeRow/categoryid", " ");
			}
			},
				onCateDDChanges: function (sSelectedKey) {
			for (var i = 0; i < this.cateCount; i++) {
				if (sSelectedKey == this.getOwnerComponent().getModel("oProductModel").getProperty("/Category/" + i + "/categoryname")) {
					break;
				}
			}
		return i;
		},
			fnCateWiseBrand:function(){
			
		var cate=this.getOwnerComponent().getModel("oProductModel").getProperty("/oChangeRow/categoryname");
		this.getOwnerComponent().getModel("oProductModel").setProperty("/cateWiseBrand",[]);
		var aCWB=this.getOwnerComponent().getModel("oProductModel").getProperty("/cateWiseBrand");
		for(var i=0;i<this.brandCount;i++)
		{
			if(cate==this.getOwnerComponent().getModel("oProductModel").getProperty("/Brand/"+i+"/categoryname"))
			{
				var oPro=this.getOwnerComponent().getModel("oProductModel").getProperty("/Brand/"+i);
				aCWB.push(oPro);
			}
		}
		this.getOwnerComponent().getModel("oProductModel").setProperty("/cateWiseBrand",	aCWB);
		},*/
		/*	onProBrandDD:function(oEvent){
					var sSelectedKey = oEvent.getSource().getValue();
						for (var i = 0; i < this.brandCount; i++) {
				if (sSelectedKey == this.getOwnerComponent().getModel("oProductModel").getProperty("/Brand/" + i + "/brandname")) {
					break;
				}
			}
			if (i < this.brandCount) {
				var id = this.getOwnerComponent().getModel("oProductModel").getProperty("/Brand/" + i + "/brandid");
				this.getOwnerComponent().getModel("oProductModel").setProperty("/oChangeRow/brandid", id);
			
			} else {
			
				this.getOwnerComponent().getModel("oProductModel").setProperty("/oChangeRow/brandid", " ");
			}
			},*/
				onDataUpdate:function(){
						var that = this;
					var oData = this.getOwnerComponent().getModel("oProductModel").getProperty("/oChangeRow");
						if(oData.productid==""||oData.productname==""||oData.productdescription==""||oData.brandname==""||oData.categoryname==""||oData.unitid==""||oData.unitname==""||oData.unitshort==""||oData.image==""||oData.price==""||oData.stock=="")
			MessageToast.show("Fill all the fields");	
			else
			{
				var sUrl = "/AdminModule/api/product/" + oData.productid;
			$.ajax({
				type: "PUT",
				url: sUrl,
				data: JSON.stringify(oData),
				dataType: "json",
				"headers": {
					"Content-Type": "application/json",
					"x-CSRF-Token": that.token
				},

				success: function (data) {
					MessageToast.show("Data saved successfully");

				},
				error: function (xhr, status) {

					console.log("Error");

				},
				complete: function (xhr, status) {
					that.GETMethod_PROD();
					that.byId("ProdDisplay").setVisible(true);
			that.byId("ProdChange").setVisible(false);
		that.byId("idBtnEdit").setVisible(true);
			that.byId("idBtnSave").setVisible(false);
			that.byId("idBtnCancel").setVisible(false);
				}
			});
			}
		
		}


		
	});

});