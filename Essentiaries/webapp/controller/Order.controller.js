sap.ui.define([
	"sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment", "sap/m/MessageToast", "sap/m/MessageBox", "sap/ui/core/routing/History",
	"sap/ui/core/UIComponent"
], function (Controller, JSONModel, Fragment, MessageToast, MessageBox, History, UIComponent) {
	"use strict";

	return Controller.extend("com.ink.Essentiaries.controller.Order", {

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
			
		
		},
		Address: function () {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("address", "com.ink.Essentiaries.fragments.Address", this);
			}
			this.getView().getModel("oEmptyModel").setProperty("/Address", {
				"doornumber": "",
				"street": "",
				"city": "",
				"pincode": "",
				"state": ""
			});
			Fragment.byId("address", "newAddress").setVisible(true);
			Fragment.byId("address", "oldAddress").setVisible(false);
			this.getView().addDependent(this._oDialog);
			this._oDialog.open();

		},
		fnNewAddressSave: function () {
			var regex_pincode = /^[1-8][0-9]{5}$/;
			var oData = this.getView().getModel("oEmptyModel").getProperty("/Address");
			if (oData.doornumber.trim() == "" || oData.street.trim() == "" || oData.city.trim() == "" || oData.state.trim() == "" || oData.pincode
				.trim() == "") {
				MessageToast.show("Fill all the required fields");
			} else if (!(regex_pincode.test(oData.pincode))) {
				MessageToast.show("Enter a valid pincode");
			} else {
				MessageToast.show("Crct");
				var oAddress = this.getOwnerComponent().getModel("oProductModel").getProperty("/Address");
				oAddress.push(oData);
				this.getOwnerComponent().getModel("oProductModel").refresh();
				this._oDialog.close();

				this._oDialog.destroy();

				this._oDialog = null;
			}
		},
		fnOnCancel: function () {

			this._oDialog.close();

			this._oDialog.destroy();

			this._oDialog = null;

		},
		fnAddressEdit: function (oEvent) {
			var sPath = oEvent.getSource().getBindingContext("oProductModel").getPath();
			var oData = this.getOwnerComponent().getModel("oProductModel").getProperty(sPath);
			this.getView().getModel("oEmptyModel").setProperty("/Address", oData);
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("address", "com.ink.Essentiaries.fragments.Address", this);
			}
			this.getView().addDependent(this._oDialog);
			Fragment.byId("address", "newAddress").setVisible(false);
			Fragment.byId("address", "oldAddress").setVisible(true);
			this._oDialog.open();
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