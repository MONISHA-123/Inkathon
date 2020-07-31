sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/core/Fragment",
	"../utility/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/Sorter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/UIComponent",
	"sap/viz/ui5/data/FlattenedDataset",
	"sap/m/MessageBox",
	"sap/ui/core/BusyIndicator",
	"sap/ui/core/routing/History"

], function (Controller, JSONModel, MessageToast, Fragment, formatter, Filter, Sorter, FilterOperator, UIComponent, FlattenedDataset,
	MessageBox, BusyIndicator, History) {
	"use strict";

	return Controller.extend("com.ink.Essentiaries.controller.Admin", {
		formatter: formatter,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.inkathon.Grocery.view.Admin
		 */
		onInit: function () {
			var oRouter = this.getRouter();
			oRouter.getRoute("Admin").attachMatched(this._onRouteMatched, this);
			this.busyIndicator(1000);
			this.token = "";
			this.oCateEntity = {
				"categoryid": "",
				"categoryname": "",
				"icon": "",
				"status": ""

			};

			this.oProductEntity = {
				"productid": "",
				"productname": "",
				"productdescription": "",
				"categoryid": "",
				"categoryname": "",
				"brandid": "",
				"brandname": "",
				"unitid": "",
				"unitname": "",
				"unitshort": "",
				"size":"",
				"price": "",
				"offerpercentage":"",
				"offerprice":"",
				"image": "",
				"stock": "",
				"status":""
			};
			this.oBrandEntity = {
				"brandid": "",
				"brandname": "",
				"categoryid": "",
				"categoryname": "",
				"status": ""
			};
			var oUnitEntity = {
				"unitname": "",
				"unitid": "",
				"unitshort": ""
			};
			this.oProModel = this.getOwnerComponent().getModel("oProductModel");
			var oEmptyModel = new JSONModel();
			oEmptyModel.setProperty("/Category", this.oCateEntity);
			oEmptyModel.setProperty("/Product", this.oProductEntity);
			oEmptyModel.setProperty("/Brand", this.oBrandEntity);
			oEmptyModel.setProperty("/Unit", oUnitEntity);
			this.getView().setModel(oEmptyModel, "oEmptyModel");
			/*	var OModel = new JSONModel();
				this.getView().setModel(OModel, "oProductModel");*/

			/*
			this.productCount =this.GETMethod("product","Product");
			console.log(this.prodCount );
			this.brandCount =this.GETMethod("brand","Brand");
			this.categoryCount =this.GETMethod("category","Category");*/
			this.GETMethod_CATE();
			this.GETMethod_PROD();
			this.GETMethod_BRAND();

			var oModel = new JSONModel("model/products.json");
			this.getView().setModel(oModel, "oTableModel");
			var oVizFrame = this.getView().byId("idcolumn");
			var oModel1 = new JSONModel();
			var data = {
				"Sales": [{
					"Year": "2009",
					"Value": ""
				}, {
					"Year": "2010",
					"Value": "1482"
				}, {
					"Year": "2011",
					"Value": "2580"
				}, {
					"Year": "2012",
					"Value": "5168"
				}, {
					"Year": "2013",
					"Value": "762"
				}, {
					"Year": "2014",
					"Value": "18495"
				}]
			};
			oModel1.setData(data);

			var oDataset = new FlattenedDataset({
				dimensions: [{
					name: "Year",
					value: "{Year}"
				}],

				measures: [{
					name: "Sales",
					value: "{Value}"
				}],

				data: {
					path: "/Sales"
				}
			});
			oVizFrame.setDataset(oDataset);
			oVizFrame.setModel(oModel1);
			oVizFrame.setVizType('line');

			oVizFrame.setVizProperties({
				plotArea: {
					colorPalette: d3.scale.category20().range()
				},
				title: {
					text: "Yearly Sales"
				}
			});

			var feedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
					'uid': "valueAxis",
					'type': "Measure",
					'values': ["Sales"]
				}),
				feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
					'uid': "categoryAxis",
					'type': "Dimension",
					'values': ["Year"]
				});
			oVizFrame.addFeed(feedValueAxis);
			oVizFrame.addFeed(feedCategoryAxis);
			// this.byId("BrandTab").setText("Brands " + String.fromCharCode(38) + " Category");

		},
		getRouter: function () {
			return UIComponent.getRouterFor(this);
		},
		onNavBack: function () {
			// UIComponent.getRouterFor(this).navTo("adminDashboard");
			var oHistory, sPreviousHash;

			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				// this.getOwnerComponent().getRouter().navTo("Home");
				this.getRouter().navTo("Home", {}, true);

			}
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

					MessageToast.show("Hi  Congtz! you succussfully consumed destination from CF!");
					that.cateCount = data.length;
					that.getOwnerComponent().getModel("oProductModel").setProperty("/Category", data);

				},
				type: "GET"
			}).always(function (data, status, xhr) {
				that.token = xhr.getResponseHeader("x-CSRF-Token");
				console.log(that.token);
			});
		},
		GETMethod_PROD: function () {
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

					sap.m.MessageToast.show("Hi  Congtz! you succussfully consumed destination from CF!");
					that.prodCount = data.length;
					that.getOwnerComponent().getModel("oProductModel").setProperty("/Product", data);
					that.byId("prodResultCount").setText("Products(" + that.prodCount + ")");
				},
				type: "GET"
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

					sap.m.MessageToast.show("Hi  Congtz! you succussfully consumed destination from CF!");
					that.brandCount = data.length;
					that.getOwnerComponent().getModel("oProductModel").setProperty("/Brand", data);

				},
				type: "GET"
			});
		},

		onPress: function (oEvent) {
			var oTable, oTableModel1, oItem, sPath, oSelectedRow;
			// var oModel = this.getView().getModel("oProductModel");
			var oModel = this.getOwnerComponent().getModel("oProductModel");
			oTable = this.byId("idProductsTable1");
			oTableModel1 = oTable.getModel("oProductModel");
			oItem = oEvent.getSource();
			sPath = oItem.getBindingContextPath();
			oSelectedRow = oTableModel1.getProperty(sPath);

			oModel.setProperty("/oSelectedRow", oSelectedRow);

			this.getRouter().navTo("productDetails", {
				ProductId: oSelectedRow.productid
			});
		},
		for_edit: function (oEvent) {
			oEvent.getSource().getParent().getParent().getCells()[5].getItems()[1].setVisible(true);
			oEvent.getSource().getParent().getParent().getCells()[5].getItems()[0].setVisible(false);
			oEvent.getSource().getParent().getParent().getCells()[4].getItems()[0].setVisible(true);
			oEvent.getSource().getParent().getParent().getCells()[4].getItems()[1].setVisible(false);
			/*	for(var i=0;i<=2;i++)
					oEvent.getSource().getParent().getParent().getCells()[4].getItems()[i].setVisible(true);*/

			for (var i = 1; i <= 3; i++)
				oEvent.getSource().getParent().getParent().getCells()[i].setEditable(true);

		},
		/*	fnChangeProdStatus:function(oEvent){
			var index=oEvent.getParameter("selectedIndex");
			if(index===1)
			this.status=
			},*/
		fnSave: function (oEvent) {
			var that = this;
			var id = oEvent.getSource().getParent().getParent().getCells()[0].getText();
			var sPath = oEvent.getSource().getParent().getParent().getBindingContextPath();
			var oData = this.getView().getModel("oProductModel").getProperty(sPath);
			var sUrl = "/AdminModule/api/product/" + id;
			console.log(sUrl);
			this.fnPutCall(sUrl, oData);
			oEvent.getSource().getParent().getParent().getCells()[4].getItems()[0].setVisible(false);
			oEvent.getSource().getParent().getParent().getCells()[4].getItems()[1].setVisible(true);
			/*	for(var i=0;i<=2;i++)
					oEvent.getSource().getParent().getParent().getCells()[4].getItems()[i].setVisible(false);*/
			oEvent.getSource().getParent().getParent().getCells()[5].getItems()[1].setVisible(false);
			oEvent.getSource().getParent().getParent().getCells()[5].getItems()[0].setVisible(true);
			for (i = 1; i <= 3; i++)
				oEvent.getSource().getParent().getParent().getCells()[i].setEditable(false);

		},
		onNewItem: function (oEvent) {
			var sItem = oEvent.getParameter("item").getText();
			if (sItem === "New Category")
				this.fnOnNewCate();
			else if (sItem === "New Brand")
				this.fnOnNewBrand();
			else if (sItem === "New Product")
				this.fnOnNewProduct();
			else
				this.fnOnNewUnit();

		},
		fnOnNewProduct: function () {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("idNewProduct", "com.ink.Essentiaries.fragments.newProduct", this);
			}
			this.getView().addDependent(this._oDialog);
			this._oDialog.open();

			this.getView().getModel("oEmptyModel").setProperty("/Product", this.oProductEntity);

		},
		fnOnNewCate: function () {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("fragNewCate", "com.ink.Essentiaries.fragments.newItem", this);
			}
			this.getView().addDependent(this._oDialog);
			Fragment.byId("fragNewCate", "newBrand").setVisible(false);
			Fragment.byId("fragNewCate", "newUnit").setVisible(false);
			Fragment.byId("fragNewCate", "newCate").setVisible(true);
			Fragment.byId("fragNewCate", "newItemTitle").setText("Category");
			this._oDialog.open();

			this.getView().getModel("oEmptyModel").setProperty("/Category", this.oCateEntity);
		},
		fnCategoryIDExist: function (id) {
			for (var i = 0; i < this.cateCount; i++) {
				if (id == this.getOwnerComponent().getModel("oProductModel").getProperty("/Category/" + i + "/categoryid"))
					return 1;

			}
			return 0;
		},
		fnCategoryNameExist: function (name) {
			for (var j = 0; j < this.cateCount; j++) {
				if (name.toLowerCase() == (this.getOwnerComponent().getModel("oProductModel").getProperty("/Category/" + j + "/categoryname")).toLowerCase())
					return 1;

			}
			return 0;
		},
		fnOnNewCateSave: function () {
			var that = this;
			var id = this.getView().getModel("oEmptyModel").getProperty("/Category/categoryid");
			if (id != "")
				id = parseInt(id, 10);
			var name = this.getView().getModel("oEmptyModel").getProperty("/Category/categoryname").trim();

			if (id == "" || name == "")
				MessageToast.show("Fill all the required fields");
			else if (id < 1)
				MessageToast.show("Invalid ID");
			else if (this.fnCategoryIDExist(id)) {
				MessageToast.show("ID already exist.");
			} else if (this.fnCategoryNameExist(name)) {
				MessageToast.show("Category already exist.");

			} else {
				this.getView().getModel("oEmptyModel").setProperty("/Category/categoryid", id);
				this.getView().getModel("oEmptyModel").setProperty("/Category/categoryname", name);
				var oData = this.getView().getModel("oEmptyModel").getProperty("/Category");
				var sUrl = "/AdminModule/api/category/";

				$.ajax({
					type: "POST",
					url: sUrl,
					data: JSON.stringify(oData),
					dataType: "json",
					"headers": {
						"Content-Type": "application/json",
						"x-CSRF-Token": that.token
					},

					success: function (data) {
						that._oDialog.close();
						that._oDialog.destroy();
						that._oDialog = null;
						MessageToast.show("Category Created Successfully");

					},
					error: function (xhr, status) {
						that._oDialog.close();
						that._oDialog.destroy();
						that._oDialog = null;
						MessageToast.show("Error");

					},
					complete: function (xhr, status) {
						that.GETMethod_CATE();
					}
				});
			}
		},
		fnOnNewBrand: function () {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("fragNewBrand", "com.ink.Essentiaries.fragments.newItem", this);
			}
			this.getView().addDependent(this._oDialog);
			Fragment.byId("fragNewBrand", "newBrand").setVisible(true);
			Fragment.byId("fragNewBrand", "newCate").setVisible(false);
			Fragment.byId("fragNewBrand", "newUnit").setVisible(false);
			Fragment.byId("fragNewBrand", "newItemTitle").setText("Brand");

			this.getView().getModel("oEmptyModel").setProperty("/Brand", this.oBrandEntity);
			this._oDialog.open();
		},
		fnOnNewUnit: function () {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("fragNewUnit", "com.ink.Essentiaries.fragments.newItem", this);
			}
			this.getView().addDependent(this._oDialog);
			Fragment.byId("fragNewUnit", "newBrand").setVisible(false);
			Fragment.byId("fragNewUnit", "newCate").setVisible(false);
			Fragment.byId("fragNewUnit", "newUnit").setVisible(true);
			Fragment.byId("fragNewUnit", "newItemTitle").setText("Units");
			this._oDialog.open();
		},
		fnOnFragDelCate: function () {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("fragDelCat", "com.ink.Essentiaries.fragments.delete", this);
			}
			this.getView().getModel("oEmptyModel").setProperty("/Category", []);
			this.getView().addDependent(this._oDialog);
			this._oDialog.open();
		},
		onNewBrand_CateDD: function (oEvent) {
			var sSelectedKey = oEvent.getSource().getValue();
			var i = this.onCateDDChanges(sSelectedKey);
			if (i < this.cateCount) {
				var id = this.getOwnerComponent().getModel("oProductModel").getProperty("/Category/" + i + "/categoryid");
				this.getView().getModel("oEmptyModel").setProperty("/Brand/categoryid", id);

			} else {

				this.getView().getModel("oEmptyModel").setProperty("/Brand/categoryid", " ");
			}

		},
		onCateDDChanges: function (sSelectedKey) {
			console.log(this.cateCount);
			for (var i = 0; i < this.cateCount; i++) {
				if (sSelectedKey == this.getOwnerComponent().getModel("oProductModel").getProperty("/Category/" + i + "/categoryname")) {
					break;
				}
			}
			return i;
		},
		onCateDelSelction: function (oEvent) {
			var sSelectedKey = oEvent.getSource().getValue();
			var i = this.onCateDDChanges(sSelectedKey);
			if (i < this.cateCount) {
				var id = this.getOwnerComponent().getModel("oProductModel").getProperty("/Category/" + i + "/categoryid");
				this.getView().getModel("oEmptyModel").setProperty("/Category/categoryid", id);
				Fragment.byId("fragDelCat", "CateDelBtn").setEnabled(true);
			} else {
				Fragment.byId("fragDelCat", "CateDelBtn").setEnabled(false);
				this.getView().getModel("oEmptyModel").setProperty("/Category/categoryid", " ");
			}
		},

		fnCateWiseBrand: function () {

			var cate = this.getView().getModel("oEmptyModel").getProperty("/Product/categoryid");
			this.getView().getModel("oEmptyModel").setProperty("/cateWiseBrand", []);
			var aCWB = this.getView().getModel("oEmptyModel").getProperty("/cateWiseBrand");
			for (var i = 0; i < this.brandCount; i++) {
				if (cate == this.getOwnerComponent().getModel("oProductModel").getProperty("/Brand/" + i + "/categoryid")) {
					var oPro = this.getOwnerComponent().getModel("oProductModel").getProperty("/Brand/" + i);
					aCWB.push(oPro);
				}
			}
			this.getView().getModel("oEmptyModel").setProperty("/cateWiseBrand", aCWB);
		},
		onNewPro_CateDD: function (oEvent) {
			var sSelectedKey = oEvent.getSource().getValue();
			var i = this.onCateDDChanges(sSelectedKey);
			if (i < this.cateCount) {
				var id = this.getOwnerComponent().getModel("oProductModel").getProperty("/Category/" + i + "/categoryid");
				this.getView().getModel("oEmptyModel").setProperty("/Product/categoryid", id);
				this.fnCateWiseBrand();

			} else {

				this.getView().getModel("oEmptyModel").setProperty("/Product/categoryid", " ");
			}
		},
		onNewPro_BrandDD: function (oEvent) {
			var sSelectedKey = oEvent.getSource().getValue();
			for (var i = 0; i < this.brandCount; i++) {
				if (sSelectedKey == this.getOwnerComponent().getModel("oProductModel").getProperty("/Brand/" + i + "/brandname")) {
					break;
				}
			}
			if (i < this.brandCount) {
				var id = this.getOwnerComponent().getModel("oProductModel").getProperty("/Brand/" + i + "/brandid");
				this.getView().getModel("oEmptyModel").setProperty("/Product/brandid", id);

			} else {

				this.getView().getModel("oEmptyModel").setProperty("/Product/brandid", " ");
			}
		},
		fnOnCateDel: function () {
			var that = this;
			var cate = this.getView().getModel("oEmptyModel").getProperty("/Category/categoryname");
			var id = this.getView().getModel("oEmptyModel").getProperty("/Category/categoryid");
			var surl = "/AdminModule/api/category/" + id;
			console.log(surl);
			$.ajax({
				type: "DELETE",
				url: surl,
				dataType: "json",
				"headers": {
					"Content-Type": "application/json",
					"x-CSRF-Token": that.token
				},
				success: function (data) {
					that._oDialog.close();
					that._oDialog.destroy();
					that._oDialog = null;
				},
				error: function (xhr, status) {

					console.log("ERROR");
				},
				complete: function (xhr, status) {
					that.GETMethod_CATE();

				}
			});

		},
		brandidMatch: function (value, key) {
			for (var i = 0; i < this.brandCount; i++) {
				console.log(this.getOwnerComponent().getModel("oProductModel").getProperty("/Brand/" + i + "/" + key));
				if (value == this.getOwnerComponent().getModel("oProductModel").getProperty("/Brand/" + i + "/" + key))
					return 1;

			}
			return 0;
		},
		brandNameMatch: function (value, key) {
			for (var i = 0; i < this.brandCount; i++) {

				if (value.toLowerCase() == (this.getOwnerComponent().getModel("oProductModel").getProperty("/Brand/" + i + "/" + key)).toLowerCase()) {
					var sCategoryName = (this.getView().getModel("oEmptyModel").getProperty("/Brand/categoryname")).toLowerCase();
					if (sCategoryName == (this.getOwnerComponent().getModel("oProductModel").getProperty("/Brand/" + i + "/categoryname")).toLowerCase())
						return 1;
				}
			}
			return 0;
		},
		fnOnNewBrandSave: function () {
			var that = this;
			var id = this.getView().getModel("oEmptyModel").getProperty("/Brand/brandid");
			if (id != "")
				id = parseInt(id, 10);

			var name = (this.getView().getModel("oEmptyModel").getProperty("/Brand/brandname")).trim();
			this.getView().getModel("oEmptyModel").setProperty("/Brand/brandid", id);
			this.getView().getModel("oEmptyModel").setProperty("/Brand/brandname", name);
			var oData = this.getView().getModel("oEmptyModel").getProperty("/Brand");
			console.log(oData);
			if (oData.categoryname.trim() == "" || oData.brandname == "" || oData.brandid == "")
				MessageToast.show("Fill all the required Fields");
			else if (oData.brandid < 1)
				MessageToast.show("Enter a valid ID ");
			else if (this.brandNameMatch(oData.brandname, "brandname")) {
				MessageToast.show("Brand name already exist under chosen category");
			} else if (this.brandidMatch(oData.brandid, "brandid"))
				MessageToast.show("Brand ID already exist");
			else {
				$.ajax({
					type: "POST",
					url: "/AdminModule/api/brand/",
					data: JSON.stringify(oData),
					dataType: "json",
					"headers": {
						"Content-Type": "application/json",
						"x-CSRF-Token": that.token
					},

					success: function (data) {
						MessageToast.show("Data saved successfully");
						that._oDialog.close();
						that._oDialog.destroy();
						that._oDialog = null;

					},
					error: function (xhr, status) {
						that._oDialog.close();
						that._oDialog.destroy();
						that._oDialog = null;
						console.log("Error");
						console.log(xhr);
						console.log(status);
					},
					complete: function (xhr, status) {

						that.GETMethod_BRAND();
						that.getOwnerComponent().getModel("oProductModel").refresh();
					}
				});
			}

		},
		fnProductID: function (id) {
			for (var i = 0; i < this.prodCount; i++) {
				if (id == this.getOwnerComponent().getModel("oProductModel").getProperty("/Product/" + i + "/productid"))
					return 1;
			}
			return 0;
		},
		fnNewProdSave: function () {
			var that = this;
			var oData = this.getView().getModel("oEmptyModel").getProperty("/Product");

			var id = oData.productid;
			if (id != "")
				id = parseInt(id, 10);
			this.getView().getModel("oEmptyModel").setProperty("/Product/productid", id);
			if (oData.productid == "" || oData.productname == "" || oData.productdescription == "" || oData.brandname == "" || oData.categoryname ==
				"" || oData.unitid == "" || oData.unitname == "" || oData.unitshort == "" || oData.image == "" || oData.price == "" || oData.stock ==
				""|| oData.size == "" || oData.offerprice == "" || oData.offerpercentage =="")
				MessageToast.show("Fill all the fields");
			else if (id < 1)
				MessageToast.show("Invalid ID");
			else if (this.fnProductID(id)) {
				MessageToast.show("Product ID already exist");

			} else {
				$.ajax({
					type: "POST",
					url: "/AdminModule/api/product/",
					data: JSON.stringify(oData),
					dataType: "json",
					"headers": {
						"Content-Type": "application/json",
						"x-CSRF-Token": that.token
					},

					success: function (data) {
						that._oDialog.close();
						that._oDialog.destroy();
						that._oDialog = null;

					},
					error: function (xhr, status) {
						that._oDialog.close();
						that._oDialog.destroy();
						that._oDialog = null;
						console.log("Error");
						console.log(xhr);
						console.log(status);
					},
					complete: function (xhr, status) {
						that.GETMethod_PROD();

						that.getOwnerComponent().getModel("oProductModel").refresh();
					}
				});
			}

		},
		/*	for_deleteRow: function (oEvent) {
				var that = this;
				var id = oEvent.getSource().getParent().getParent().getCells()[0].getValue();
				var sUrl = "/AdminModule/api/product/" + id;
				$.ajax({
					type: "DELETE",
					url: sUrl,
					dataType: "json",
					"headers": {
						"Content-Type": "application/json",
						"x-CSRF-Token": that.token
					},
					success: function (data) {
						MessageToast.show("Product Deleted Successfully");
					},
					error: function (xhr, status) {

						console.log("ERROR");
					},
					complete: function (xhr, status) {
						that.GETMethod_PROD();
						that.getOwnerComponent().getModel("oProductModel").refresh();
					}
				});
			},*/
		fnOnCancel: function () {
			this._oDialog.close();
			this._oDialog.destroy();
			this._oDialog = null;
		},
		firstTab: function () {
			var sKey = Fragment.byId("idNewProduct", "idIconTabBar").getSelectedKey();
			if (sKey === "Category") {
				Fragment.byId("idNewProduct", "nextID").setVisible(true);
				Fragment.byId("idNewProduct", "saveID").setVisible(false);
				Fragment.byId("idNewProduct", "prevID").setVisible(false);
			} else if (sKey === "Brand") {
				Fragment.byId("idNewProduct", "nextID").setVisible(true);
				Fragment.byId("idNewProduct", "saveID").setVisible(false);
				Fragment.byId("idNewProduct", "prevID").setVisible(true);
			} else {
				Fragment.byId("idNewProduct", "nextID").setVisible(false);
				Fragment.byId("idNewProduct", "saveID").setVisible(true);
				Fragment.byId("idNewProduct", "prevID").setVisible(true);
			}
		},
		fnOnPrevious: function () {
			var arr = ["Category", "Brand", "Product"];
			var sSelectedKey = Fragment.byId("idNewProduct", "idIconTabBar").getSelectedKey();
			var index = arr.indexOf(sSelectedKey);
			Fragment.byId("idNewProduct", "idIconTabBar").setSelectedKey(arr[index - 1]);
			this.firstTab();
		},
		fnOnNext: function () {
			var arr = ["Category", "Brand", "Product"];
			var sSelectedKey = Fragment.byId("idNewProduct", "idIconTabBar").getSelectedKey();
			var index = arr.indexOf(sSelectedKey);
			Fragment.byId("idNewProduct", "idIconTabBar").setSelectedKey(arr[index + 1]);
			this.firstTab();

		},
		filterDialog: function () {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("fragBrandFilter", "com.ink.Essentiaries.fragments.productFilter", this);
			}
			this.getView().addDependent(this._oDialog);

			this.getView().getModel("oEmptyModel").setProperty("/Product", []);
			this._oDialog.open();
		},
		fnBrandFilter: function () {

			var sSelectedKeyCat = Fragment.byId("fragBrandFilter", "categorySelect").getSelectedKey();
			console.log(sSelectedKeyCat);
			var sSelectedKeyBrand = Fragment.byId("fragBrandFilter", "brandSelect").getSelectedKey();
			console.log(sSelectedKeyBrand);
			var aTemp = [];
			aTemp.push(new Filter("brandname", FilterOperator.Contains, sSelectedKeyBrand));
			aTemp.push(new Filter("categoryname", FilterOperator.Contains, sSelectedKeyCat));
			/*	if (sSelectedKeyCat) {
					aTemp.push(new Filter("categoryname", FilterOperator.Contains, sSelectedKeyCat));
				}
				if (sSelectedKeyCat && sSelectedKeyBrand) {
					aTemp.push(new Filter("brandname", FilterOperator.Contains, sSelectedKeyBrand));
					aTemp.push(new Filter("categoryname", FilterOperator.Contains, sSelectedKeyCat));
				}*/
			var oTable = this.byId("brandtable");
			var oBinding = oTable.getBinding("items");
			oBinding.filter(aTemp);
			/*	var bind=oBinding.filter(aTemp);
				console.log(bind);*/
			this._oDialog.close();
			this._oDialog.destroy();
			this._oDialog = null;
		},
		onRefreshBrandTable: function () {
			this.byId("brandtable").getBinding("items").filter();
			this.byId("categorytable").getBinding("items").filter();

		},
		onSearchID: function (event) {
			var aFilter = [];

			var sQuery = this.getView().byId("input").getValue();
			if (sQuery) {
				aFilter.push(new Filter("productname", FilterOperator.Contains, sQuery));
			}

			// filter binding
			var oList = this.getView().byId("idProductsTable1");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
			var count = oList.getBinding("items").getLength();
			this.byId("prodResultCount").setText("Products(" + count + ")");

		},
		onSearchBrand: function (event) {
			var aFilter = [];

			var sQuery = this.getView().byId("brand").getValue();
			if (sQuery) {
				aFilter.push(new Filter("brandname", FilterOperator.Contains, sQuery));
			}

			// filter binding
			var oList = this.getView().byId("brandtable");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);

		},
		onSearchCategory: function (event) {
			var aFilter = [];

			var sQuery = this.getView().byId("category").getValue();
			if (sQuery) {
				aFilter.push(new Filter("categoryname", FilterOperator.Contains, sQuery));
			}

			// filter binding
			var oList = this.getView().byId("categorytable");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);

		},
		fnBrandDelConfirm: function (oEvent) {
			var that = this;
			var id = oEvent.getSource().getParent().getParent().getCells()[0].getValue();
			var name = oEvent.getSource().getParent().getParent().getCells()[1].getValue();
			MessageBox.confirm("Are you sure you want to delete brand " + name + "(ID:" + id + ") ?", {
				actions: [MessageBox.Action.YES, MessageBox.Action.NO],
				emphasizedAction: MessageBox.Action.OK,
				onClose: function (sAction) {
					if (sAction == "YES") {
						var sUrl = "/AdminModule/api/brand/" + id;
						$.ajax({
							type: "DELETE",
							url: sUrl,
							dataType: "json",
							"headers": {
								"Content-Type": "application/json",
								"x-CSRF-Token": that.token
							},
							success: function (data) {
								MessageToast.show("Brand Deleted Successfully");
							},
							error: function (xhr, status) {

								console.log("ERROR");
							},
							complete: function (xhr, status) {
								that.GETMethod_BRAND();
								that.getOwnerComponent().getModel("oProductModel").refresh();
							}
						});
					}

				}
			});
		},
		fnEditBrandRow: function (oEvent) {
			oEvent.getSource().getParent().getParent().getCells()[4].getItems()[1].setVisible(true);
			oEvent.getSource().getParent().getParent().getCells()[4].getItems()[0].setVisible(false);
			for (var i = 1; i <= 3; i++)
				oEvent.getSource().getParent().getParent().getCells()[i].setEditable(true);

		},
		fnSaveBrandRow: function (oEvent) {

			var id = oEvent.getSource().getParent().getParent().getCells()[0].getValue();
			var sPath = oEvent.getSource().getParent().getParent().getBindingContextPath();
			var oData = this.getView().getModel("oProductModel").getProperty(sPath);
			var sUrl = "/AdminModule/api/brand/" + id;
			this.fnPutCall(sUrl, oData);

			oEvent.getSource().getParent().getParent().getCells()[4].getItems()[1].setVisible(false);
			oEvent.getSource().getParent().getParent().getCells()[4].getItems()[0].setVisible(true);
			for (var i = 1; i <= 3; i++)
				oEvent.getSource().getParent().getParent().getCells()[i].setEditable(false);
		},
		fnPutCall: function (sUrl, oData) {
			var that = this;
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

					MessageToast.show("Action Failed");

				},
				complete: function (xhr, status) {

				}
			});
		},
		fnHandelSort: function () {
			var oTable = this.byId("idProductsTable1");
			var oBinding = oTable.getBinding("items");
			var asort = this.getView().getModel("systemModel").getProperty("/sort");
			var aSort = [];
			var seleted = "price";
			if (asort) {
				MessageToast.show("Ascending");
				aSort.push(new Sorter(seleted, false));
				oBinding.sort(aSort);
				var button = this.getView().byId("for_sort");
				button.setIcon("sap-icon://sort-ascending");
				this.getView().getModel("systemModel").setProperty("/sort", false);
			} else {
				MessageToast.show("Descending");
				aSort.push(new Sorter(seleted, true));
				oBinding.sort(aSort);
				button = this.getView().byId("for_sort");
				button.setIcon("sap-icon://sort-descending");
				this.getView().getModel("systemModel").setProperty("/sort", true);
			}

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
		}

	});

});