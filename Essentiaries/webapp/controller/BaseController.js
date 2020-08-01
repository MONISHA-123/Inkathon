sap.ui.define([
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

], function (Controller, UIComponent, MessageToast, BusyIndicator, JSONModel, Fragment, Filter, FilterOperator, Device, Popup,History) {
	"use strict";
 
  return Controller.extend("com.ink.Essentiaries.controller.BaseController", {
  /*  getRouter: function () {
   
      return UIComponent.getRouterFor(this);
 
    }*/
    	fnTotalCalc: function () {
		var total = 0;
			var oEmptyModel = this.getOwnerComponent().getModel("oProductModel").getProperty("/Cart");
			for (var j = 0; j < oEmptyModel.length; j++){
			total+=this.getOwnerComponent().getModel("oProductModel").getProperty("/Cart/" + j + "/amount");
				
			}
			
			this.getOwnerComponent().getModel("oProductModel").setProperty("/Total", total);
		},
			fnOnAddToCart: function (oEvent) {
		 var oButton=this.byId("cart");
			if (!this._oPopover) {

				Fragment.load({

					name: "com.ink.Essentiaries.fragments.Cart",

					controller: this

				}).then(function (oPopover) {

					this._oPopover = oPopover;

					this.getView().addDependent(this._oPopover);

					this._oPopover.openBy(oButton);

				}.bind(this));

			} else {

				this._oPopover.openBy(oButton);

			}

		}
 
  });
 
});