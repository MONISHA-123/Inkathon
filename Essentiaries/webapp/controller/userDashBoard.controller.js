sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/core/BusyIndicator"
	
], function (Controller, History, UIComponent, JSONModel, MessageToast,BusyIndicator) {
	"use strict";

	return Controller.extend("com.ink.Essentiaries.controller.userDashBoard", {

		
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
			
		
		},
		fnToTrackOrder: function(){
			MessageToast.show("Inside Order");
		},
		fnEditInfo :function(){
			this.byId("editProfile").setVisible(false);
			this.byId("saveProfile").setVisible(true);
			this.byId("personalFormFname").setEditable(true);
			this.byId("personalFormLname").setEditable(true);
		
			this.byId("personalFormTel").setEditable(true);
		},
		fnSaveInfo :function(){
			MessageToast.show("Profile Saved");
			this.byId("editProfile").setVisible(true);
			this.byId("saveProfile").setVisible(false);
			this.byId("personalFormFname").setEditable(false);
			
			this.byId("personalFormLname").setEditable(false);
			this.byId("personalFormTel").setEditable(false);
			
			var fname=this.byId("personalFormFname").getValue();
			var lname=this.byId("personalFormLname").getValue();
			var tel=this.byId("personalFormTel").getValue();
			this.byId("Profilename1").setText(fname);
			this.byId("Profilename2").setText(fname);
			this.byId("Profilename3").setText(fname);
			this.byId("telLink").setText(tel);
		}
	});

});