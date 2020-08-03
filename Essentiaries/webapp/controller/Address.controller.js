sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/core/BusyIndicator",
	"sap/uxap/BlockBase",
	"sap/ui/core/Fragment"
	
], function (Controller, History, UIComponent, JSONModel, MessageToast,BusyIndicator,BlockBase,Fragment) {
	"use strict";

	return Controller.extend("com.ink.Essentiaries.controller.Address", {
	onInit: function () {
				var oEmptyModel = new JSONModel();
			this.getView().setModel(oEmptyModel, "oEmptyModel");
				this.getOwnerComponent().getModel("oProductModel").setProperty("/Address",[]);
				this.getOwnerComponent().getModel("oProductModel").setProperty("/Placeorder",{"Address":""});
		},
			fnAddress: function () {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("address", "com.ink.Essentiaries.fragments.Address", this);
			}
			this.getView().getModel("oEmptyModel").setProperty("/Address",{
			"doornumber":"",
			"street":"",
			"city":"",
			"pincode":"",
			"state":""
			});
				Fragment.byId("address","newAddress").setVisible(true);
			Fragment.byId("address","oldAddress").setVisible(false);
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
					var oAddress=this.getOwnerComponent().getModel("oProductModel").getProperty("/Address");
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
			fnAddressEdit:function(oEvent){
			var sPath=	oEvent.getSource().getBindingContext("oProductModel").getPath();
			var oData=this.getOwnerComponent().getModel("oProductModel").getProperty(sPath);
			this.getView().getModel("oEmptyModel").setProperty("/Address",oData);
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("address", "com.ink.Essentiaries.fragments.Address", this);
			}
			this.getView().addDependent(this._oDialog);
				Fragment.byId("address","newAddress").setVisible(false);
			Fragment.byId("address","oldAddress").setVisible(true);
			this._oDialog.open();
			},
		fnAddressSelectChange:function(oEvent){
		var sPath=oEvent.getSource().getSelectedContextPaths("oProductModel")[0];
		var oAddress=this.getOwnerComponent().getModel("oProductModel").getProperty(sPath);
		this.getOwnerComponent().getModel("oProductModel").setProperty("/Placeorder/Address",oAddress);
		this.fnSelectedAddress();
		}
	});
});