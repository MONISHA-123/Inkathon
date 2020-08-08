sap.ui.define([
		"com/ink/Essentiaries/controller/BaseController",
	"sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment", "sap/m/MessageToast", "sap/m/MessageBox", "sap/ui/core/routing/History",
	"sap/ui/core/UIComponent"
], function (BaseController,Controller, JSONModel, Fragment, MessageToast, MessageBox, History, UIComponent) {
	"use strict";

	return BaseController.extend("com.ink.Essentiaries.controller.Order", {

		onInit: function () {
			var oRouter = this.getRouter();
			oRouter.getRoute("Order").attachMatched(this._onRouteMatched, this);

			this._wizard = this.byId("ShoppingCartWizard");
			var oEmptyModel = new JSONModel();
			this.getView().setModel(oEmptyModel, "oEmptyModel");
			this.getOwnerComponent().getModel("oProductModel").setProperty("/Address", []);
			this.getOwnerComponent().getModel("oProductModel").setProperty("/Placeorder", {
				"Address": ""
			});
			var oModel = this.getOwnerComponent().getModel("oProductModel");

			this.getView().setModel(oModel, "oProductModel");

		},
		getRouter: function () {
			return UIComponent.getRouterFor(this);
		},
		_onRouteMatched: function (oEvent) {
			// this.GETMethod_ADDRESS();
		},
			GETMethod_ADDRESS: function () {
			var that = this;

			var sUrl = "/AdminModule/api/getaddress";
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
					
					console.log(data);

				},
				type: "GET"
			}).always(function (data, status, xhr) {
				that.token = xhr.getResponseHeader("x-CSRF-Token");
				//console.log(that.token);
			});
		},
		Address: function () {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("address", "com.ink.Essentiaries.fragments.Address", this);
			}
			this.getView().getModel("oEmptyModel").setProperty("/Address", {
				"pincode": "",
				"city": "",
				"houseno":"",
				"state": "",
				"street": ""
			});
			Fragment.byId("address", "newAddress").setVisible(true);
			Fragment.byId("address", "oldAddress").setVisible(false);
			this.getView().addDependent(this._oDialog);
			this._oDialog.open();

		},
	
		fnOnCancel: function () {

			this._oDialog.close();

			this._oDialog.destroy();

			this._oDialog = null;

		},
		
		fnAddressSelectChange: function (oEvent) {
			var sPath = oEvent.getSource().getSelectedContextPaths("oProductModel")[0];
			var oAddress = this.getOwnerComponent().getModel("oProductModel").getProperty(sPath);
			this.getOwnerComponent().getModel("oProductModel").setProperty("/Placeorder/Address", oAddress);
			this.fnSelectedAddress();
		},
		fnSelectedAddress: function () {
			var oAddress = this.getOwnerComponent().getModel("oProductModel").getProperty("/Placeorder/Address");
			if (oAddress === "") {
				this._wizard.invalidateStep(this.byId("Address"));
			} else {
				this._wizard.validateStep(this.byId("Address"));
			}
		},
		/*	fnToPaymentStep: function () {
				this.setDiscardableProperty({
					message: "Are you sure you want to change the payment type ? This will discard your progress.",
					discardStep: this.byId("PaymentTypeStep"),
					modelPath: "/selectedPayment",
					historyPath: "prevPaymentSelect"
				});
			},*/
		fnPaymentMethod: function () {
			var oWizard = this.byId("ShoppingCartWizard");
			var oFirstStep = oWizard.getSteps()[2];

			var selectedKey = this.getView().getModel("oEmptyModel").getProperty("/selectedKey");

			switch (selectedKey) {
			case "Credit Card":
				oWizard.discardProgress(oFirstStep);
				this.byId("PaymentTypeStep").setNextStep(this.getView().byId("CreditCardStep"));

				break;
			case "Debit Card":
				oWizard.discardProgress(oFirstStep);
				this.byId("PaymentTypeStep").setNextStep(this.getView().byId("CreditCardStep"));

				break;
			case "Cash on Delivery":
			default:
				oWizard.discardProgress(oFirstStep);
				this.byId("PaymentTypeStep").setNextStep(this.getView().byId("CashOnDeliveryInfo"));

				break;
			}
		}

	});

});