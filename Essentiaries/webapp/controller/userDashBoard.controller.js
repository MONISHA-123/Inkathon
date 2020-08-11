sap.ui.define([
	"com/ink/Essentiaries/controller/BaseController",
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

], function (BaseController,Controller, JSONModel, MessageToast, Fragment, formatter, Filter, Sorter, FilterOperator, UIComponent, FlattenedDataset,
	MessageBox, BusyIndicator, History) {
	"use strict";

	return BaseController.extend("com.ink.Essentiaries.controller.userDashBoard", {

		onInit: function () {
			var oRouter = this.getRouter();
			oRouter.getRoute("userDashBoard").attachMatched(this._onRouteMatched, this);
			/*var data=this.getOwnerComponent().getModel("oProductModel").getProperty("/LoginUser");
								var sInitial = (data.fname).charAt(0) + (data.lname).charAt(0);

								this.getView().byId("Avatar").setInitials(sInitial);
								
	*/
			//	this.fnToTrackOrder();
		},
		getRouter: function () {
			return UIComponent.getRouterFor(this);
		},
		_onRouteMatched: function (oEvent) {
			this.GetUserMasterOrder();
		},
		fnToTrackOrder: function () {
			MessageToast.show("Inside Order");
		},
		fnEditInfo: function () {
			this.byId("editProfile").setVisible(false);
			this.byId("saveProfile").setVisible(true);
			this.byId("personalFormFname").setEditable(true);
			this.byId("personalFormLname").setEditable(true);

			this.byId("personalFormTel").setEditable(true);
		},
		fnSaveInfo: function () {
			MessageToast.show("Profile Saved");
			this.byId("editProfile").setVisible(true);
			this.byId("saveProfile").setVisible(false);
			this.byId("personalFormFname").setEditable(false);

			this.byId("personalFormLname").setEditable(false);
			this.byId("personalFormTel").setEditable(false);

			var fname = this.byId("personalFormFname").getValue();
			var lname = this.byId("personalFormLname").getValue();
			var tel = this.byId("personalFormTel").getValue();
			this.byId("Profilename1").setText(fname);
			this.byId("Profilename2").setText(fname);
			this.byId("Profilename3").setText(fname);
			this.byId("telLink").setText(tel);
		},
		fnDelAccount: function () {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("fragDelAcc", "com.ink.Essentiaries.fragments.delete", this);
			}
			this.getView().getModel("oEmptyModel").setProperty("/DelAccount/email", "");
			Fragment.byId("fragDelAcc", "Category").setVisible(false);
			Fragment.byId("fragDelAcc", "delAccount").setVisible(true);
			this.getView().addDependent(this._oDialog);
			this._oDialog.open();
		},
		OnDelAccount: function () {
			var email = this.getView().getModel("oEmptyModel").getProperty("/DelAccount/email");
			var that = this;

			var sUrl = "/AdminModule/api/delete/" + email;
			if (email != "") {
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
					type: "DELETE"
				});
			}

		},
		fnOnCancel: function () {
			this._oDialog.close();
			this._oDialog.destroy();
			this._oDialog = null;
		}
	});

});