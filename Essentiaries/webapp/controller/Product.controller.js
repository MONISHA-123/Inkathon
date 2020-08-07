sap.ui.define([
"com/ink/Essentiaries/controller/BaseController",
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/core/BusyIndicator",
		"sap/ui/core/Fragment",
		"sap/ui/core/Fragment",
		"sap/ui/model/Filter",
	"sap/ui/model/Sorter",
	"sap/ui/model/FilterOperator"
], function (BaseController,Controller, History, UIComponent, JSONModel, MessageToast,BusyIndicator,Fragment,Filter,Sorter,FilterOperator) {
	"use strict";


	return BaseController.extend("com.ink.Essentiaries.controller.Product", {

		onInit: function () {
				var oRouter = this.getRouter();
			oRouter.getRoute("Product").attachMatched(this._onRouteMatched, this);
				var oEmptyModel = new JSONModel();
			this.getView().setModel(oEmptyModel, "oEmptyModel");
			

		},
		onAfterRendering:function(){
			// this.getView().getModel("oEmptyModel").setProperty("/Filter/Cate",)
		},
			getRouter: function () {
			return UIComponent.getRouterFor(this);
		},
		_onRouteMatched: function (oEvent) {
			
			this.id = oEvent.getParameter("arguments").CategoryId;
		
				this.GETMethod_CATEBYPROD();
					this.GETMethod_BRAND();
		/*	this.GETMethod_PROD();
				this.GETMethod_CATE();
			this.GETMethod_BRAND();*/
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

					sap.m.MessageToast.show("Hi  Congtz! you succussfully consumed destination from CF!");
					that.brandCount = data.length;
					that.getOwnerComponent().getModel("oProductModel").setProperty("/Brand", data);
				//	console.log(data);

				},
				type: "GET"
			});
		},
		GETMethod_CATEBYPROD: function () {
			var that = this;

			var sUrl = "/AdminModule/api/productbycategory/"+this.id;
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
						
					that.getOwnerComponent().getModel("oProductModel").setProperty("/CategoryByProduct", data);
					var cartData=that.getOwnerComponent().getModel("oProductModel").getProperty("/Cart");
				
					console.log(cartData, data);
					for( var i=0; i<that.cateCount;i++){
						for( var j= 0; j<cartData.length;j++){
							if( data[i].productid == cartData[j].productid )
								{
									that.getOwnerComponent().getModel("oProductModel").setProperty("/CategoryByProduct/"+ i +"/quantity", cartData[j].quantity);
									var s=	that.getOwnerComponent().getModel("oProductModel").setProperty("/CategoryByProduct/"+ i +"/quantity", cartData[j].quantity);
									console.log(s);
									
								}
						}
					}

				},
				type: "GET"
			}).always(function (data, status, xhr) {
				that.token = xhr.getResponseHeader("x-CSRF-Token");

			});
		},
		
		
		
		
	fnFilter: function () {
			if (!this._oDialog) {

				this._oDialog = sap.ui.xmlfragment("idFilter", "com.ink.Essentiaries.fragments.Filter", this);

			}

			this.getView().addDependent(this._oDialog);

			this._oDialog.open();

		},
			fnToHome: function () {
			UIComponent.getRouterFor(this).navTo("Home");
		/*	var oHistory, sPreviousHash;

			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("TargetHome", {}, true);

			}*/
		},
		onCateSelectChange:function(oEvent){
	// this.getView().byId('BPGroupSelect').getSelectedKey()
			// var cate = this.getView().getModel("oEmptyModel").getProperty("/Category/categoryname");
				// var cate=Fragment.byId("idFilter", "Cate").getSelectedItem();
				var idpath=oEvent.getSource().getSelectedItem().getBindingContext("oProductModel").sPath;
				this.id1 =this.getOwnerComponent().getModel("oProductModel").getProperty(idpath+"/categoryid");
				console.log(this.id1);
			var cate=oEvent.getSource().getSelectedItem().getKey();
			this.selectedCate=oEvent.getSource().getSelectedItem().getKey();
			var oPro;
			this.getView().getModel("oEmptyModel").setProperty("/cateWiseBrand", []);
			var aCWB = this.getView().getModel("oEmptyModel").getProperty("/cateWiseBrand");
		
			for (var i = 0; i < this.brandCount; i++) {
				if (cate == this.getOwnerComponent().getModel("oProductModel").getProperty("/Brand/" + i + "/categoryname")) {
				oPro = this.getOwnerComponent().getModel("oProductModel").getProperty("/Brand/" + i);
					aCWB.push(oPro);
					
				}
			}
			this.getView().getModel("oEmptyModel").setProperty("/cateWiseBrand", aCWB);
			this.getView().getModel("oEmptyModel").refresh();
			
				var that=this;
				var sUrl = "/AdminModule/api/productbycategory/"+this.id1;
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

				//	MessageToast.show("Succussfully consumed destination from CF!");
					that.cateCount = data.length;
					//console.log(data);
					that.getOwnerComponent().getModel("oProductModel").setProperty("/CategoryByProduct", data);
				
				},
				complete: function (xhr, status) {
						//	that.getOwnerComponent().getModel("oProductModel").refresh();
							that.byId("gridList").getBinding("items").filter();
								var len=that.getOwnerComponent("oProductModel").getProperty("/CategoryByProduct").length;
			console.log(len);
			console.log(that.getOwnerComponent("oProductModel").getProperty("/CategoryByProduct"));
					},
				type: "GET"
			}).always(function (data, status, xhr) {
				that.token = xhr.getResponseHeader("x-CSRF-Token");

			});
			
		
			
		},
			fnOnCancel:function(){
				this._oDialog.close();

			this._oDialog.destroy();

			this._oDialog = null;
		},
		handleSelectionFinish: function(oEvent) {
				var selectedItems = oEvent.getParameter("selectedItems");
					var aTemp = [];
				for(var i=0; i<selectedItems.length; i++)
						{
							aTemp.push(new Filter("brandname", FilterOperator.Contains, selectedItems[i].getText()));
						}
			var oTable = this.byId("gridList");
			var oBinding = oTable.getBinding("items");
			oBinding.filter(aTemp);
			
		},
		fnOnFilter :function(oEvent){
		//	var sPath=oEvent.getSource().getBindingContext("oProductModel").getPath();
		//	var id=this.getOwnerComponent().getModel("oProductModel").getProperty(sPath+"/categoryid");
			//this.selectedCate\
			console.log(this.id1);
			var that = this;

			var sUrl = "/AdminModule/api/productbycategory/"+this.id1;
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
					console.log(data);
					that.getOwnerComponent().getModel("oProductModel").setProperty("/CategoryByProduct", data);

				},
				type: "GET"
			}).always(function (data, status, xhr) {
				that.token = xhr.getResponseHeader("x-CSRF-Token");

			});
		},
		fnCart :function(oEvent){
			MessageToast.show("Product Added To Cart ");
		
		
			var cartId=this.getOwnerComponent().getModel("oProductModel").getProperty("/Cart");
			var Path=oEvent.getSource().getBindingContext("oProductModel").sPath;
			var oData=this.getOwnerComponent().getModel("oProductModel").getProperty(Path);
			
			 for( var i=0 ;i<cartId.length;i++){
					if(cartId[i].productid == oData.productid)
					{
							oEvent.getSource().getParent().getItems()[0].setVisible(false);
							oEvent.getSource().getParent().getItems()[1].setVisible(true);
							var iQuantity= this.getOwnerComponent().getModel("oProductModel").getProperty(Path + "/quantity");
							this.getOwnerComponent().getModel("oProductModel").setProperty("/Cart/"+ i +"/quantity",iQuantity);
								this.onChangeOther(Path);
								return;
					}
			 }
					
							oEvent.getSource().getParent().getItems()[0].setVisible(false);
							oEvent.getSource().getParent().getItems()[1].setVisible(true);
							this.getOwnerComponent().getModel("oProductModel").setProperty(Path+"/quantity",1);
							this.getOwnerComponent().getModel("oProductModel").getProperty("/Cart").unshift(oData);
							var price=this.getOwnerComponent().getModel("oProductModel").getProperty(Path+"/price");
							 this.getOwnerComponent().getModel("oProductModel").setProperty(Path+"/amount",price);
							console.log(this.getOwnerComponent().getModel("oProductModel").getProperty(Path));
							
							this.getOwnerComponent().getModel("oProductModel").refresh();
							this.onChangeOther(Path);

					
			 
		
			
		
		
			
			 //this.fnOnAddToCart();
		}
	

	});

});